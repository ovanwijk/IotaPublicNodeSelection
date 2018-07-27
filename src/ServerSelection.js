//var geoGraphics = require('./Geographics');
import {countryMap, getDistanceFromLatLonInKm} from './Geographics.js';

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
// import { XMLHttpRequest } from 'xmlhttprequest'; var countryMap =
// geoGraphics.countryMap; var getDistanceFromLatLonInKm =
// geoGraphics.getDistanceFromLatLonInKm;

var latestMilestone = 0;
export function getLatestMilestone() {
    return latestMilestone;
}
var milestoneTolerance = 5;
export function setMilestoneTolerance(tolerance = 5) {
    milestoneTolerance = tolerance;
}

export var serverResultCache = {}
export var latencyTestTimeOut = 3000;

export var failedHosts = [];

var locationCache = null;
// We only need it once, unless you teleport around. Calculate all distences
// once.
async function getLocation() {
    if (!locationCache) {
        locationCache = JSON.parse(await okToFailHTTPRequest("https://ipinfo.io/json", "{'country':null}"));
        locationCache.lat = locationCache
            .loc
            .split(',')[0];
        locationCache.lon = locationCache
            .loc
            .split(',')[1];
        locationCache.distances = {};
        for (var country in countryMap) {
            if (countryMap.hasOwnProperty(country)) {
                locationCache.distances[country] = getDistanceFromLatLonInKm(locationCache.lat, locationCache.lon, countryMap[country].latitude, countryMap[country].longitude)
            }
        }
        locationCache.getDistance = function (countryCode) {
            var distance = this.distances[countryCode];
            if (typeof(distance) === "number") {
                return distance;
            }
            console.log("Unknown country found! : ", countryCode);
            return 99999999;
        }
    }

    return locationCache;
}

/**
  * Gets a public node from public resources.
  * @param {*} serversPerFetch Amounts of servers to request latency from in parrallel, lower is nicer for servers, higher will yield a faster result.
  * @param {*} excludeServers Servers to exclude from selection, this is meant to so you can call it multiple times with a different result.
  */
export async function getPublicNode(serversPerFetch = 15, excludeServers = []) {

    var myLocation = await getLocation();
    //iotanode.host already does a good job at server side caching.
    var servers = JSON.parse(await okToFailHTTPRequest("https://iotanode.host/node_table.json", "[]"));

    servers = servers.filter(a => !excludeServers.concat(failedHosts).includes(a.host))

    //Find the highest mile of each server and normalize the country codes.
    servers.forEach(server => {
        latestMilestone = Math.max(latestMilestone, server.latest_milestone_index);
        if (server.ncountry) {
            server.ncountry = server
                .ncountry
                .toUpperCase();
        }
    })

    // Filter the servers on online status and synchronization. Sometimes milestones
    // lag a bit and therefore we take -5 latest milestones as fine. Also detects if
    // the host is using http or https
    servers = servers.filter(a => (a.online === "1") && a.latest_milestone_index >= latestMilestone - milestoneTolerance && a.latest_sub_milestone_index >= latestMilestone - milestoneTolerance && (typeof location === 'undefined' || a.host.startsWith(location.protocol)));

    // Calculate a general distanceMap for country codes. And put your own country at
    // 0;
    servers.forEach(server => {
        server.distance = myLocation.getDistance(server.ncountry);
    });

    //Sort by distance
    servers = servers.sort((a, b) => a.distance - b.distance);

    var newHost = null;
    var sliceIndex = 0;
    while (sliceIndex < servers.length && newHost == null) {
        //Do 3 requests at a time
        try {
            newHost = await getLowestLatencyServer2(servers.slice(sliceIndex, sliceIndex + (serversPerFetch - 1)).map(s => s.host));
        } catch (e) {
            console.log("No servers found, getting next " + serversPerFetch);
        }
        sliceIndex += serversPerFetch;
    }

    return newHost;
}

export async function getGeospreadPublicNodes(maxCount = 5, excludeServers = []) {

    var myLocation = await getLocation();
    var servers = JSON.parse(await okToFailHTTPRequest("https://iotanode.host/node_table.json", "[]"));

    servers = servers.filter(a => !excludeServers.concat(failedHosts).includes(a.host))

    //Find the highest mile of each server and normalize the country codes.
    servers.forEach(server => {
        latestMilestone = Math.max(latestMilestone, server.latest_milestone_index);
        if (server.ncountry) {
            server.ncountry = server
                .ncountry
                .toUpperCase();
        }
    });

    // Filter the servers on online status and synchronization. Sometimes milestones
    // lag a bit and therefore we take -5 latest milestones as fine. Also detects if
    // the host is using http or https
    servers = servers.filter(a => (a.online === "1") && a.latest_milestone_index >= latestMilestone - milestoneTolerance && a.latest_sub_milestone_index >= latestMilestone - milestoneTolerance && (typeof location === 'undefined' || a.host.startsWith(location.protocol)));

    // Calculate a general distanceMap for country codes. And put your own country at
    // 0;
    servers.forEach(server => {
        server.distance = myLocation.getDistance(server.ncountry);
    });

    servers = servers.sort((a, b) => a.distance - b.distance);

    // Calculate step size so that the first selection is always close and the last
    // very far away. And variable steps in between. Using the Geolocation API will
    // result in more random selections but not implemented.
    var selectedServers = getServerFromList(servers, 0, maxCount, []);

    return selectedServers;
}

async function getServerFromList(servers, currentIndex, maxCount, results = []) {
    if (results.length >= maxCount || currentIndex >= servers.length) {
        return results;
    }
    var newHost = null;

    var sliceIndex = currentIndex;
    while (sliceIndex < servers.length && newHost == null) {
        //Do 3 requests at a time
        try {
            newHost = await getLowestLatencyServer2(servers.slice(sliceIndex, sliceIndex + 2).map(s => s.host));
        } catch (e) {
            console.log("No servers found, getting next 3");
        }
        sliceIndex += 3;
    }

    if (newHost == null) {
        return []; //No servers found at all.
    }
    //Jump some distance on the world for new servers.
    var stepSize = (servers.length - sliceIndex) / (maxCount - results.length);

    return await getServerFromList(servers, Math.floor(sliceIndex + stepSize), maxCount, results.concat([newHost]));

}

async function getLowestLatencyServer2(servers = []) {
    var latencies = await Promise.all(servers.map(server => {
        return getNodeLatency(server);
    }));
    var lowestLatency = 9999999;
    var lowestLatencyServer = "";
    for (var i = 0; i < servers.length; i++) {
        if (latencies[i] < lowestLatency) {
            lowestLatency = latencies[i];
            lowestLatencyServer = servers[i]
        }
    }
    //console.log("Selected " + lowestLatencyServer + "with latency" + lowestLatency)
    return lowestLatencyServer;
}

async function getLowestLatencyServer(servers = []) {
    return new Promise(function (fulfilled, rejected) {
        var totalRequests = servers.length;
        var returned = false;
        for (let i = 0; i < servers.length; i++) {
            getNodeLatency(servers[i]).then(latency => {
                totalRequests -= 1;

                if (!returned && latency != 999999) {
                    returned = true;
                    fulfilled(servers[i]);
                }
                if (!returned && totalRequests == 0) {
                    rejected("No valid servers");
                }
            })
        }
    })
}

async function getNodeLatency(server) {
    //If latency was tested before just return the result;
    if (serverResultCache[server] && serverResultCache[server].success) {
        return serverResultCache[server].latency;
    }
    var nodeInfo = JSON.parse(await okToFailHTTPRequest(server, "null", JSON.stringify({command: 'getNodeInfo'}), latencyTestTimeOut));
    if (!serverResultCache[server].success) {
        console.log(server + " failed, ignoring it.");
        failedHosts.push(server);
        return 999999;
    } else {
        return serverResultCache[server].latency;
    }
}

async function okToFailHTTPRequest(url, defaultReturn, postBody = null, timeOut = 30000) {
    return new Promise(function (fulfilled, rejected) {
        var x = new XMLHttpRequest();
       
        //console.log(url);
        var timetest = 999999;
        var latency = 999999;
        var timeoutId;
        x.timeout = timeOut;
        x.onreadystatechange = function () {
            // More accurate latency. Due to queing many concurrent requests by the browser
            // it can take some time before the connection opens.
            if (x.readyState == 1 && timetest == 999999) {

                timetest = Date.now();
                timeoutId = setTimeout(() => {
                    serverResultCache[url] = {
                        latency: timeOut,
                        success: false,
                        statusCode: 504,
                        url: url,
                        response: "Timeout"
                    }
                    console.log("Timeout setTimoeout on " + url);
                    x.abort();
                    fulfilled(defaultReturn);
                }, timeOut);
            }
            if (x.readyState == 2 && latency == 999999) {
                latency = Date.now() - timetest;
            };
        }

        // x.ontimeout = function (e) {
        //     serverResultCache[url] = {
        //         latency: timeOut,
        //         success: false,
        //         statusCode: 504,
        //         url: url,
        //         response: e
        //     }
        //     console.log("Timeout on " + url, e);
        //     fulfilled(defaultReturn);
        // };
        x.onload = function (e) {
            clearTimeout(timeoutId);
            serverResultCache[url] = {
                latency: latency,
                success: true,
                statusCode: x.status,
                url: url,
                response: x.responseText
            }
            fulfilled(x.responseText);
        };
        x.onerror = function (e) {
            clearTimeout(timeoutId);
            serverResultCache[url] = {
                latency: latency,
                success: false,
                statusCode: x.status,
                url: url,
                response: e
            }
            console.log("Error on " + url, e);
            fulfilled(defaultReturn);
        };
        //x.onabort = x.onerror;
        if (postBody) {
            x.open("POST", url, true);
            x.setRequestHeader('Content-Type', 'application/json');
            x.setRequestHeader("X-IOTA-API-Version", "1");
            x.send(postBody);
        } else {
            x.open("GET", url, true);
            x.send();
        }

    });

}

export async function iotaCapabilityTest(url, command, timeOut = 3000) {
    return new Promise(function (fulfilled, rejected) {
        var x = new XMLHttpRequest();
        //console.log(timeOut);
        x.timeout = timeOut;
        var timetest = 999999;
        var latency = 999999;
        var timeoutId;
        x.onreadystatechange = function () {
            // More accurate latency. Due to queing many concurrent requests by the browser
            // it can take some time before the connection opens.
            if (x.readyState == 1 && timetest == 999999) {
                timetest = Date.now();
                timeoutId = setTimeout(() => {
                    var result = {};
                    result['lastestCommand'] = timetest;
                    result['latency'] = 999999;
                    result[command] = false;
                    console.log("Timeout setTimoeout on " + url, command);
                    x.abort();
                    fulfilled(result);
                    
                }, timeOut);
            }
            if (x.readyState == 2 && latency == 999999) {

                latency = Date.now() - timetest;
            };
        }

        x.onload = function (e) {
            clearTimeout(timeoutId);
            var response = x.response;
            var result = {};
            result['lastestCommand'] = timetest;
            if (x.status == 400 || x.status == 200) { // Is invalid parameters, 401 = Unauthorized=disabled
                if (command == "getNodeInfo") {
                    result[command] = true;
                    result['latency'] = latency;
                    Object.assign(result, JSON.parse(x.responseText));
                    fulfilled(result);
                } else {
                    result[command] = true;
                    fulfilled(result);
                }
            } else {
                result[command] = false;
                fulfilled(result);
            };
        };

        // x.ontimeout = function (e) {
        //     var result = {};
        //     result['lastestCommand'] = timetest;
        //     result['latency'] = 999999;
        //     result[command] = false;
        //     fulfilled(result);
        // };
        x.onerror = function (e) {
            clearTimeout(timeoutId);
            var result = {};
            result['lastestCommand'] = timetest;
            result['latency'] = 999999;
            result[command] = false;
            console.log("Error on " + url, e);
            fulfilled(result);
        };
        x.open("POST", url, true);
        x.setRequestHeader('Content-Type', 'application/json');
        x.setRequestHeader("X-IOTA-API-Version", "1");
        x.send(JSON.stringify({"command": command}));

    });

}