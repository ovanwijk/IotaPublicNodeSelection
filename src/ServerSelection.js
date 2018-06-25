 //var geoGraphics = require('./Geographics');
 import {countryMap, getDistanceFromLatLonInKm} from './Geographics.js';
 import  XMLHttpRequest from 'xmlhttprequest';
 //var countryMap = geoGraphics.countryMap;
 //var getDistanceFromLatLonInKm = geoGraphics.getDistanceFromLatLonInKm;

var latestMilestone = 0;

export function getLatestMileStone(){
    return latestMilestone;
}

 /**
  * Gets a public node from public resources.
  * @param {*} serversPerFetch Amounts of servers to request latency from in parrallel, lower is nicer for servers, higher will yield a faster result.
  * @param {*} excludeServers Servers to exclude from selection, this is meant to so you can call it multiple times with a different result.
  */
export async function getPublicNode(serversPerFetch = 15, excludeServers = []) {

    var myLocation = JSON.parse(await okToFailHTTPRequest("https://ipinfo.io/json", "{'country':null}"));
    var servers = JSON.parse(await okToFailHTTPRequest("https://iotanode.host/node_table.json", "[]"));
    myLocation.lat = myLocation.loc.split(',')[0]
    myLocation.lon = myLocation.loc.split(',')[1]
 
    servers = servers.filter(a => !excludeServers.includes(a.host))

    //Find the highest mile of each server and normalize the country codes.
    
    servers.forEach(server => {
        latestMilestone = Math.max(latestMilestone, server.latest_milestone_index);
        if (server.ncountry) {
            server.ncountry = server.ncountry.toUpperCase();
        }
    })

    //Filter the servers on online status and synchronization. Sometimes milestones lag a bit and therefore we take -5
    //latest milestones as fine. Also detects if the host is using http or https
    servers = servers.filter(
        a => (a.online === "1") &&
        a.latest_milestone_index >= latestMilestone - 5 &&
        a.latest_sub_milestone_index >= latestMilestone - 5 &&
        (typeof window === 'undefined' || a.host.startsWith(window.location.protocol)));

    //Calculate a general distanceMap for country codes. And put your own country at 0;
    var distanceMap = {}
    distanceMap[myLocation.country] = 0;
    servers.forEach(server => {
        if (!distanceMap[server.ncountry]) {
            if (countryMap[server.ncountry]) {
                var countryObj = countryMap[server.ncountry];
                distanceMap[server.ncountry] = getDistanceFromLatLonInKm(myLocation.lat, myLocation.lon, countryObj.latitude, countryObj.longitude)
            } else {
                console.log("Unknown country found! : ", server);
                distanceMap[server.ncountry] = 99999999;
            }

        }
        server.distance = distanceMap[server.ncountry];

    });

    //Sort by distance
    servers = servers.sort((a, b) => a.distance - b.distance);

    var newHost = null;
    var sliceIndex = 0;
    while (sliceIndex < servers.length && newHost == null) {
        //Do 3 requests at a time
        try {
            newHost = await getLowestLatencyServer(servers.slice(sliceIndex, sliceIndex + (serversPerFetch - 1)).map(s => s.host));
        } catch (e) {
            console.log("No servers found, getting next " + serversPerFetch);
        }
        sliceIndex += serversPerFetch;
    }
 
    return newHost;
}

export async function getGeospreadPublicNodes(maxCount = 5) {

    var myLocation = JSON.parse(await okToFailHTTPRequest("https://ipinfo.io/json", "{'country':null}"));
    var servers = JSON.parse(await okToFailHTTPRequest("https://iotanode.host/node_table.json", "[]"));
    myLocation.lat = myLocation.loc.split(',')[0]
    myLocation.lon = myLocation.loc.split(',')[1]
    
    //Find the highest mile of each server and normalize the country codes.
    var maxMileStone = null;
    servers.forEach(server => {
        maxMileStone = Math.max(maxMileStone, server.latest_milestone_index);
        if (server.ncountry) {
            server.ncountry = server.ncountry.toUpperCase();
        }
    })


    //Filter the servers on online status and synchronization. Sometimes milestones lag a bit and therefore we take -5
    //latest milestones as fine. Also detects if the host is using http or https
    servers = servers.filter(
        a => (a.online === "1") &&
        a.latest_milestone_index >= maxMileStone - 5 &&
        a.latest_sub_milestone_index >= maxMileStone - 5 &&
        (typeof window === 'undefined' || a.host.startsWith(window.location.protocol)));

    //Calculate a general distanceMap for country codes. And put your own country at 0;
    var distanceMap = {}
    distanceMap[myLocation.country] = 0;
    servers.forEach(server => {
        if (!distanceMap[server.ncountry]) {
            if (countryMap[server.ncountry]) {
                var countryObj = countryMap[server.ncountry];
                distanceMap[server.ncountry] = getDistanceFromLatLonInKm(myLocation.lat, myLocation.lon, countryObj.latitude, countryObj.longitude)
            } else {
                console.log("Unknown country found! : ", server);
                distanceMap[server.ncountry] = 99999999;
            }

        }
        server.distance = distanceMap[server.ncountry];

    });
    servers = servers.sort((a, b) => a.distance - b.distance);



    //Calculate step size so that the first selection is always close and the last very far away.
    //And variable steps in between. Using the Geolocation API will result in more random selections but not implemented.

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
            newHost = await getLowestLatencyServer(servers.slice(sliceIndex, sliceIndex + 2).map(s => s.host));
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

    return await getServerFromList(servers,
        Math.floor(sliceIndex + stepSize),
        maxCount,
        results.concat([newHost]));

}

async function getLowestLatencyServer(servers = []) {
   
    return new Promise(function(fulfilled, rejected) {
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
    var start = Date.now();
    var nodeInfo = JSON.parse(await okToFailHTTPRequest(server, "null",
        JSON.stringify({
            command: 'getNodeInfo'
        })));

    if (!nodeInfo) {
        return 999999;
    } else {
        return Date.now() - start;
    }
}

async function okToFailHTTPRequest(url, defaultReturn, postBody = null) {
    return new Promise(function(fulfilled, rejected) {
        var x = new XMLHttpRequest();
       //console.log(url);
        x.onload = function(e) {
            fulfilled(x.responseText);
        };
        x.onerror = function(e) {
            console.log("Error on " + url, e)
            fulfilled(defaultReturn);
        };
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

// module.exports = {
//     getPublicNode: getPublicNode,
//     getGeospreadPublicNodes: getGeospreadPublicNodes
// }