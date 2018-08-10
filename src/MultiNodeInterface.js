import IOTA from 'iota.lib.js';
//var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
import * as ServerSelection from './ServerSelection';

export async function AUTO_N(N, serversPerFetch = 10,  exclude = []) {
    var selected = [].concat(exclude);
    //var fetchesPerN = [15, 10, 7, 5, 5]
    //var serversPerFetching = fetchesPerN[Math.max(N, fetchesPerN.length) - 1];
    for (var i = 0; i < N; i++) {
        var result = await ServerSelection.getPublicNode(serversPerFetch, selected);
        if(result){
            selected.push(result);
        }
    }
    console.log("AUTO_N Selected: " , selected);
    return selected;
}

const iotaAPICommandNotAvailableHTTPCode = 401; //Unauthorized.
const serverStateCommand = "getNodeInfo";

//const fetchServerCommands = ["findTransactions", "getTrytes", "wereAddressesSpentFrom", "getBalances"];
const fetchServerCommands = [];

const transactionServerCommands = [
    "getTransactionsToApprove"
];
// const transactionServerCommands = [
//     "broadcastTransactions", "storeTransactions", "getTransactionsToApprove"
// ];

//const powServerCommands = ["attachToTangle", "interruptAttachingToTangle"];
const powServerCommands = ["attachToTangle"];

const allCommands = [serverStateCommand]
    .concat(fetchServerCommands)
    .concat(transactionServerCommands)
    .concat(powServerCommands);

async function iotaNodeCapabilityTest(url) {
    var allResults = await Promise.all(allCommands.map(command => {
        return ServerSelection.iotaCapabilityTest(url, command, 2000)
    }));

    var toReturn = {
        host: url
    };

    for (var i = 0; i < allCommands.length; i++) {
        Object.assign(toReturn, allResults[i])
    }
    return toReturn;
}

async function iotaNodesCapabilities(servers) {
    
    var serverCapabilities = await Promise.all(servers.map(server => {
        return iotaNodeCapabilityTest(server)
    }));
    var serverList = {}
    for (var i = 0; i < servers.length; i++) {
        serverList[servers[i]] = serverCapabilities[i];
    };
    return serverList;
}



export async function promisifyAPI(iota, command, ...args) {
    // if(!timestampDelayCheckMap[delayConfig.id]){
    //     timestampDelayCheckMap[delayConfig.id] = -1;
    // }
    ServerSelection.requestsOpen[iota.provider] = true;
    var powOrNotTimeout = command == "attachToTangle" ? 300000 : 30000;
    return new Promise(function (fulfilled, rejected) {
        //var started = Date.now();
        var timeout = setTimeout(function(){
            // var timeDiff = Date.now() - timestampDelayCheckMap[delayConfig.id];
            // if(timestampDelayCheckMap[delayConfig.id] > 0 && timeDiff > delayConfig.waitTime){
            //     clearInterval(timeout);
            //     //debugger;
            //     console.log("Errored TIMOUT", iota.provider,  command, delayConfig)
            //     fulfilled("ERROR");
            // }
            //we returned "ERROR" so we can easily detect it and promise.all still returns.
            //debugger;
            ServerSelection.failedHosts.push(iota.provider);
            fulfilled("ERROR");
            console.error("Got a failed host in API", iota.provider);
        }, powOrNotTimeout)
        var callback = function(error, success){
            clearTimeout(timeout); 
            if(error){
                
                fulfilled("ERROR " + error);
            }else{
                ServerSelection.requestsOpen[iota.provider] = false;
                fulfilled(success);
            }                
        }
        iota.api[command](...args, callback);
    })
}



export class IotaMultiNode {

    constructor() {
        this.liveServers = {}; //Most raw list of servers.
        this.sortedLiveServers = [];
        this.shouldSort = true;
        this.fetchServers = []; //Sub selection of liveServers
        this.fetchServersCount = 1;
        this.fetchServerHints = [];
        this.transactionServers = []; //Sub selection of liveServers
        this.transactionServersCount = 3;
        this.transactionServerHints = [];
        this.powServers = []; //Sub selection of liveServers
        this.powServerHints = [];
        this.powServersCount = 1;
        this.permaNodes = null; // No support yet.
       
        this.highestObservedMilestoneIndex = 0;
        this.overWriteAttachToTangle = null; //If a function this will be used for proof of work
        this.addAutoN = this
            .addAutoN
            .bind(this);
        this.options = {
            onlyUseHintedServers: false,
            validateHintedServers: true,
            usePowServersAsTransactionServers: true,
            useGeoDiverseTransactionServers: false,
            useFetchServersAsTransactionServers: false,
            transactionServerMustIncludeNHintedServers: 0,
            proofOfWorkCount: 1
        }

        this.serverApiCache = {} //host : IOTA
        
    }

    overrideAttachToTangle(overridingFunction){
        this.overWriteAttachToTangle = overridingFunction;
        Object.keys(this.serverApiCache).forEach(host => {
            if(typeof(this.overWriteAttachToTangle) === "function"){
                this.overWriteAttachToTangle(this.serverApiCache[host]);
            }else{
                this.serverApiCache[host] = new IOTA({
                    provider: host
                });
            }
        })
    }


    /**
     * Initializes N servers, there is no guarentee that there will be.
     * It is better to call this BEFORE adding hintedServers because it results in a
     * more correct latestMilestone.
     * @param {*} N 
     */
    async addAutoN(N = 5, serversPerFetch = 10) {

        var timeTest = Date.now();
        
        
        var servers = await AUTO_N(N, serversPerFetch, Object.keys(this.liveServers).concat(ServerSelection.failedHosts)); //Always pick a server from iotanodes.host to determine the highest milestone index.
        console.log("Obtaining auto N took: ", Date.now() - timeTest);
        servers = servers.filter(a => !this.liveServers[a]);
        var serverList = await iotaNodesCapabilities(servers);
        Object.assign(this.liveServers, serverList);
        this.shouldSort = true;
        this.highestObservedMilestoneIndex = ServerSelection.getLatestMilestone();
    }

    /**
     * Checks if a node is loaded or not.
     * Returns false when never touched the server
     * Will return true if it was succesfully reached OR when it failed.
     * This is to prevent trying again.
     * @param {*} server 
     */
    isNodeLoaded(server){
        return (this.liveServers[server] !== null)
    }



    async setHintedServers(fetchServers = [], transactionServers = [], powServers = []) {
        this.fetchServerHints = fetchServers.filter(s => (typeof location === 'undefined' || s.startsWith(location.protocol)));
        this.transactionServerHints = transactionServers.filter(s => (typeof location === 'undefined' || s.startsWith(location.protocol)));
        this.powServerHints = powServers.filter(s => (typeof location === 'undefined' || s.startsWith(location.protocol)));
        var allHintedServers = this
        .fetchServerHints
        .concat(this.transactionServerHints)
        .concat(this.powServerHints);
        
        //Just the unique ones we care about.
        allHintedServers = allHintedServers.filter(a => !this.liveServers[a]);
        var hintedServerList = await iotaNodesCapabilities(allHintedServers.filter(function (item, pos) {
            return allHintedServers.indexOf(item) == pos;
        }));

        Object.assign(this.liveServers, hintedServerList);
        this.shouldSort = true;
        this.highestObservedMilestoneIndex = ServerSelection.getLatestMilestone();
        
    }

    sortLatencies() {
        if (this.shouldSort) {
            // We only care about nodes that at least replied to getNodeInfo getNodeInfo is
            // also what is used for checking the node status. so if that one fails it is
            // considered 'offline'
            this.sortedLiveServers = Object
                .values(this.liveServers)
                .filter(server => server[serverStateCommand]);
            this
                .sortedLiveServers
                .sort(function (a, b) {
                    return a.latency - b.latency;
                });
            this.shouldSort = false;
        }
    }

    /**
     *
     * @param {*} N
     * @param {*} commandList
     */
    selectXServers(N, commandList, serverHints = [], minimumIncludedHints = 0, geoDiverse = false) {
        this.sortLatencies();
        var toReturn = [];
        var listToGetFrom = [];
        var includedHints = 0;
        var sortedListCopy = [].concat(this.sortedLiveServers)
            .filter(a => serverHints.indexOf(a.host) === -1);

        var listToIterate = [].concat(serverHints.map(host => {
            return this.liveServers[host];
        })).concat(sortedListCopy);
        
        var toDeny = [].concat(ServerSelection.failedHosts);
        Object.keys(ServerSelection.requestsOpen).forEach(server => {
            if(ServerSelection.requestsOpen[server]){
               
                toDeny.push(server);
            }
        })
        listToIterate = listToIterate.filter(server => toDeny.indexOf(server.host) == -1)
        for (var i = 0; i < listToIterate.length; i++) {
            var isCorrectServer = true;
            commandList.forEach(command => {
                if (!listToIterate[i][command]) {
                    isCorrectServer = false;
                }
            })
            if (isCorrectServer) {
                toReturn.push(listToIterate[i]);
                if (i < serverHints.length) {
                    includedHints++;
                }
            }

            if (toReturn.length == N) {
                break;
            }
        }
        return toReturn;
    }

    /**
     * Selects proof of work servers if available.
     * @param {*} N Amount of servers to select, default 1
     */
    selectPowServers(N = 1, minimumIncludedHints = 0) { //Ideally we want only 1 server
     
        return this.selectXServers(N, powServerCommands, this.powServerHints, 
            Math.min(minimumIncludedHints, this.powServerHints.length), false);
    }

    async findPowServer(){
        for(var i = 0; i < 15; i++){
            var lpowServers = this.selectPowServers();
            if(lpowServers.length > 0){
                break;
            }
            await this.addAutoN(5, 15);
        }
    }

    selectTransactionServers(N = 3, minimumIncludedHints = 1) { //Ideally we want > 1 servers for this.
        if (N > 1) {
            //If more then 1 we want to use geodiverse servers
            return this.selectXServers(N, transactionServerCommands, this.transactionServerHints, 
                Math.min(minimumIncludedHints, this.transactionServerHints.length), true);
        } else {
            //Otherwise just use the fastest one.
            return this.selectXServers(N, transactionServerCommands, this.transactionServerHints, 
                Math.min(minimumIncludedHints, this.transactionServerHints.length), false);
        }
    }

    selectFetchServers(N = 1, minimumIncludedHints = 0) { //Ideally we just want 1 server.
        return this.selectXServers(N, fetchServerCommands, this.fetchServerHints, 
            Math.min(minimumIncludedHints, this.fetchServerHints.length), false);
    }

    async updateServers() {
        var promises = [];
        var allResults = await Promise.all(Object.keys(this.liveServers).map(server => {
            return ServerSelection.iotaCapabilityTest(server.host, serverStateCommand)
        }));
        for (var i = 0; i < allResults.length; i++) {}

        this.shouldSort = true;
    }


    /**
     * Gets an IOTA API
     * @param {*} host 
     */
    getApi(host){
        if(!this.serverApiCache[host]){
            this.serverApiCache[host] = new IOTA({
                provider: host
            });
            if(typeof(this.overWriteAttachToTangle) === "function"){
                this.overWriteAttachToTangle(this.serverApiCache[host]);
            }
        }
        return this.serverApiCache[host];
    }
   

    async sendTrytesPromise( trytes, depth, minWeightMagnitude, options){
        //getTransactionsToApprove transactionServersCount
        console.log("Sending trytes");
        var transactionServers = this.selectTransactionServers(this.transactionServersCount);
        //var tipApi = this.getApi(transactionServers[0].host);
        var powServers = this.selectPowServers(3);
        //var powApi = this.getApi(powServer.host);
        //get Tips from single server
        var me = this;
        console.log("Executing getTransactionsToApprove");
        //For tips we just race.
       
        // var tips = await Promise.race(transactionServers.map(server => {
        //     return (async () => {       
        //         return await promisifyAPI(me.getApi(server.host), 'getTransactionsToApprove', depth, undefined);
        //     })();
        // }))

        var tips = await this.getTransactionToApprovePromise(depth);
        //var tips = await promisifyAPI(tipApi, "getTransactionsToApprove", depth, undefined);
        //do proof of work just 1 time.
        console.log("Doing POW");
      
        var attachedTrytes = await Promise.race(powServers.map(server => {
            return (async () => {  
                return await promisifyAPI(me.getApi(server.host), 
                    "attachToTangle", tips.combinedResult.trunkTransaction, tips.combinedResult.branchTransaction,
                     minWeightMagnitude, trytes);    
                //return await promisifyAPI(me.getApi(server.host), 'getTransactionsToApprove', depth, undefined);
            })();
        }))
        //var attachedTrytes =
        console.log("Doing storeAndBroadcast");
        //Store and broadcost to all transaction servers.

        //obtainNewTransaction servers as some might still be busy with POW.
        transactionServers = this.selectTransactionServers(this.transactionServersCount);
        
        //we race and let the rest of the servers just do its job.
        
        return await Promise.race(transactionServers.map(server => {
            return (async () => {       
                return {host:server, result: await promisifyAPI(me.getApi(server.host),  'storeAndBroadcast', attachedTrytes)};
            })();
        }))

    }


    async getTransactionToApprovePromise(depth, reference = undefined, timeOut = 30000) {
        return new Promise(function (fulfilled, rejected) {
            var servers = this.selectTransactionServers(this.transactionServersCount);

            var me = this;
            var firstSuccesFullResult = null;
            //var t = Date.now();
            var totalResults = [];
            var intervals = [];

            var timer = setTimeout(() => {
                intervals.forEach(interval =>{
                    clearInterval(interval);
                });
                debugger;
                rejected("Complete timeout");
            }, timeOut)
            var resultFunction = function(){
                if(totalResults.length == servers.length){
                    intervals.forEach(interval =>{
                        clearInterval(interval);
                    })
                    var buffer = {}
                    totalResults.forEach(result => {
                        //ERRORError: Request Error: Invalid depth input
                        if(!(typeof(result.result) === "string" && result.result.startsWith("ERROR"))){
                            
                            buffer.trunkTransaction =  result.result.trunkTransaction;
                            buffer.branchTransaction =  result.result.branchTransaction;
                            
                        }
                    });
                    debugger;
                    var combinedResult = {
                        combinedResult:  buffer,         
                        raw: totalResults
                    }
                    clearTimeout(timer);
                    fulfilled(combinedResult);
                }
            }

            servers.forEach((server, index ) => {
           
                    var finished = false;
                    intervals.push(setInterval(()=>{                   
                        if(!finished && firstSuccesFullResult && Date.now() - firstSuccesFullResult > 2000){
                            finished = true;
                            console.warn("Lagging timeout of ", server);
                            totalResults.push({host:server, result: "ERROR"});
                            resultFunction();
                        }
                    }), 250);
                        promisifyAPI(me.getApi(server.host), 'getTransactionsToApprove',  depth, reference).then(result => {
                        finished = true;
                        if(!(typeof(result) === "string" && result.startsWith("ERROR"))){
                            if(result.length > 0){
                                firstSuccesFullResult = Date.now();
                            }
                        }else{
                            console.error("getTransactionsToApprove ERROR", result)
                        }
                        totalResults.push({host:server, result: result});
                        resultFunction();
                    })
            })
       
    }.bind(this));


        //     var tips = await Promise.race(transactionServers.map(server => {
        //         return (async () => {       
        //             return await promisifyAPI(me.getApi(server.host), 'getTransactionsToApprove', depth, undefined);
        //         })();
        //     }))
        // });
    }

    //TODO making it streaming/paging

    async findTransactionsObjectsPromise( searchValues, redundency = 3, timeOut = 30000) {
        /**
         * This is a special implementation that does delayed racinig.
         * If it one of the servers returns a good result (>0 transactions) then other servers
         * will have to respond withing 2 seconds for their result to be included. Otherwise the
         * first is returned.
         * 
         * This is to filter out servers that hang on pending connections.
         */
        return new Promise(function (fulfilled, rejected) {
           
            var servers = this.selectFetchServers(redundency);
            var me = this;
            var firstSuccesFullResult = null;
            //var t = Date.now();
            var totalResults = [];
            var intervals = [];

            var timer = setTimeout(() => {
                intervals.forEach(interval =>{
                    clearInterval(interval);
                });
                rejected("Complete timeout");
            }, timeOut)
            var resultFunction = function(){
                if(totalResults.length == servers.length){
                    intervals.forEach(interval =>{
                        clearInterval(interval);
                    })
                    var buffer = {}
                    totalResults.forEach(result => {
                    
                        if(!(typeof(result.result) === "string" && result.result.startsWith("ERROR"))){
                            result.result.forEach(transaction => {
                                
                                buffer[transaction.hash] = transaction;
                            })
                        }
                    })
                    var combinedResult = {
                        combinedTransactions:  Object.values(buffer),         
                        raw: totalResults
                    }
                    clearTimeout(timer);
                    fulfilled(combinedResult);
                }
            }

            servers.forEach((server, index ) => {
           
                    var finished = false;
                    intervals.push(setInterval(()=>{                   
                        if(!finished && firstSuccesFullResult && Date.now() - firstSuccesFullResult > 2000){
                            finished = true;
                            console.warn("Lagging timeout of ", server);
                            totalResults.push({host:server, result: "ERROR"});
                            resultFunction();
                        }
                    }), 250);
                        promisifyAPI(me.getApi(server.host), 'findTransactionObjects', searchValues).then(result => {
                        finished = true;
                        if(!(typeof(result) === "string" && result.startsWith("ERROR"))){
                            if(result.length > 0){
                                firstSuccesFullResult = Date.now();
                            }
                        }
                        totalResults.push({host:server, result: result});
                        resultFunction();
                    })
            })
       
    }.bind(this));
    }

    // async findTransactionsPromise(searchValues, redundency = 3) {
    //     var servers = this.selectFetchServers(redundency);
    //     var me = this;
    //     var result = await Promise.all(servers.map(server => {            
    //         return (async () => {
    //             return {host:server, result: await promisifyAPI(me.getApi(server.host), 'findTransactions', searchValues)}
    //         })();
    //     }));
    //     return result;
    // }

    // async getTrytesPromise(hashes, redundency = 1) {
    //     var servers = this.selectFetchServers(redundency);
    //     var me = this;
    //     var result = await Promise.all(servers.map(server => {            
    //         return (async () => {
    //             return {host:server, result: await promisifyAPI(me.getApi(server.host), 'getTrytes', hashes)}
    //         })();
    //     }));
    //     var buffer = {}
    //     result.forEach(result => {
    //         if(!result.startsWith("ERROR")){
    //             result.result.forEach(transaction => {
                    
    //                 buffer[transaction.hash] = transaction;
    //             })
    //         }
    //     })

    //     //combine results
    //     var combinedResult = {
    //         combinedTransactions:  Object.values(buffer),         
    //         raw: result
    //     }
        



    //     return 
    // }
    
    // async getTrytesFromTransactionServersPromise(hashes, redundency = 1) {
    //     var servers = this.selectTransactionServers(redundency);
    //     var me = this;
    //     return await Promise.all(servers.map(server => {            
    //         return (async () => {
    //             return {host:server, result: await promisifyAPI(me.getApi(server.host), 'getTrytes', hashes)}
    //         })();
    //     }));
    // }


    async wereAddressesSpentFromPromise2( addresses, redundency = 1, timeOut = 30000) {
        return new Promise(function (fulfilled, rejected) {
           
            var servers = this.selectFetchServers(redundency);
            var me = this;
            var firstSuccesFullResult = null;
            //var t = Date.now();
            var totalResults = [];
            var intervals = [];

            var timer = setTimeout(() => {
                intervals.forEach(interval =>{
                    clearInterval(interval);
                });
                rejected("Complete timeout");
            }, timeOut)
            var resultFunction = function(){
                if(totalResults.length == servers.length){
                    intervals.forEach(interval =>{
                        clearInterval(interval);
                    })
                    var buffer = new Array(addresses.length);
                    for(var i = 0; i< addresses.length; i++){
                        totalResults.forEach(result => {           
                            if(!(typeof(result.result) === "string" && result.result.startsWith("ERROR"))){
                                
                                buffer[i] = buffer[i] ? true : result.result[i]; 
                                
                            }
                        })
                    }

                    //combine results
                    var combinedResult = {
                        combinedResult:  buffer,         
                        raw: totalResults
                    }
                    clearTimeout(timer);
                    fulfilled(combinedResult);
                }
            }

            servers.forEach((server, index ) => {
           
                    var finished = false;
                    intervals.push(setInterval(()=>{                   
                        if(!finished && firstSuccesFullResult && Date.now() - firstSuccesFullResult > 2000){
                            finished = true;
                            console.warn("Lagging timeout of ", server);
                            totalResults.push({host:server, result: "ERROR"});
                            resultFunction();
                        }
                    }), 250);
                        promisifyAPI(me.getApi(server.host), 'wereAddressesSpentFrom', addresses).then(result => {
                        finished = true;
                        if(!(typeof(result) === "string" && result.startsWith("ERROR"))){
                            if(result.length > 0){
                                firstSuccesFullResult = Date.now();
                            }
                        }
                        totalResults.push({host:server, result: result});
                        resultFunction();
                    })
            })
       
    }.bind(this));
         
    }



    async wereAddressesSpentFromPromise( addresses, redundency = 1) {
        return this.wereAddressesSpentFromPromise2(addresses, redundency);
        var servers = this.selectTransactionServers(redundency);
        var me = this;
        
        var result = await Promise.all(servers.map(server => {            
            return (async () => {
                return {host:server, result: await promisifyAPI(me.getApi(server.host), 'wereAddressesSpentFrom', addresses)}
            })();
        }));
        var buffer = new Array(addresses.length);
        for(var i = 0; i< addresses.length; i++){
            result.forEach(result => {           
                if(!(typeof(result.result) === "string" && result.result.startsWith("ERROR"))){
                    
                    buffer[i] = buffer[i] ? true : result.result[i]; 
                    
                }
            })
        }

        //combine results
        var combinedResult = {
            combinedResult:  buffer,         
            raw: result
        }
        
        //combinedResult.combinedTransactions = Object.values(buffer);       
        return combinedResult;
         
    }

    async getBalancesFromPromise2(addresses, redundency = 1, timeOut = 30000) {
        return new Promise(function (fulfilled, rejected) {
           
            var servers = this.selectFetchServers(redundency);
            var me = this;
            var firstSuccesFullResult = null;
            //var t = Date.now();
            var totalResults = [];
            var intervals = [];

            var timer = setTimeout(() => {
                intervals.forEach(interval =>{
                    clearInterval(interval);
                });
                rejected("Complete timeout");
            }, timeOut)
            var resultFunction = function(){
                if(totalResults.length == servers.length){
                    intervals.forEach(interval =>{
                        clearInterval(interval);
                    })
                    clearTimeout(timer);
                    var buffer = new Array(addresses.length);
                    for(var i = 0; i< addresses.length; i++){
                        totalResults.forEach(result => {           
                            if(!(typeof(result.result) === "string" && result.result.startsWith("ERROR"))){
                                
                                buffer[i] = Math.max(buffer[i] ? buffer[i] : 0, Number(result.result.balances[i])); 
                                
                            }
                        })
                    }

                    //combine results
                    var combinedResult = {
                        combinedResult:  buffer,         
                        raw: totalResults
                    }
                   
                    fulfilled(combinedResult);
                }
            }

            servers.forEach((server, index ) => {
           
                    var finished = false;
                    intervals.push(setInterval(()=>{                   
                        if(!finished && firstSuccesFullResult && Date.now() - firstSuccesFullResult > 2000){
                            finished = true;
                            console.warn("Lagging timeout of getBalances ", server);
                            
                            totalResults.push({host:server, result: "ERROR"});
                            resultFunction();
                        }
                    }), 250);
                        promisifyAPI(me.getApi(server.host), 'getBalances', addresses, 100).then(result => {
                        finished = true;
                        if(!(typeof(result) === "string" && result.startsWith("ERROR"))){
                            
                            if(result.balances.length > 0){
                              
                                firstSuccesFullResult = Date.now();
                            }
                        }
                        totalResults.push({host:server, result: result});
                        resultFunction();
                    })
            })
       
    }.bind(this));
         
    }


    async getBalancesFromPromise(addresses, redundency = 1) {
        return  this.getBalancesFromPromise2(addresses, redundency);
        // var servers = this.selectTransactionServers(redundency);
        // var me = this;
     
        // var result = await Promise.all(servers.map(server => {            
        //     return (async () => {
        //         return {host:server, result: await promisifyAPI(me.getApi(server.host), 'getBalances', addresses, 100)}
        //     })();
        // }));

        
        // var buffer = new Array(addresses.length);
        // for(var i = 0; i< addresses.length; i++){
        //     result.forEach(result => {           
        //         if(!(typeof(result.result) === "string" && result.result.startsWith("ERROR"))){
                    
        //             buffer[i] = Math.max(buffer[i] ? buffer[i] : 0, Number(result.result.balances[i])); 
                    
        //         }
        //     })
        // }

        // //combine results
        // var combinedResult = {
        //     combinedResult:  buffer,         
        //     raw: result
        // }
        
        // //combinedResult.combinedTransactions = Object.values(buffer);       
        // return combinedResult;
         
    }




   


//TODO make IOTA APi Compatible
/*

    //IOTA Api functions
    getTips(callback) {
        callback(error, success);
        // do stuff here
    }

    getTransactionsObjects(hashes, callback) {}

    findTransactionObjects(searchValues, callback) {}

    getLatestInclusion(hashes, callback) {}

    storeAndBroadcast(trytes, callback) {}

    getNewAddress(seed, options, callback) {}

    getInputs(seed, options, callback) {}

    prepareTransfers(seed, transfersArray, options, callback) {}

    sendTrytes(trytes, depth, minWeightMagnitude, callback) {}

    sendTransfer(seed, depth, minWeightMagnitude, transfers, options, callback) {}

    promoteTransaction(transaction, depth, minWeightMagnitude, transfers, params, callback) {}

    replayBundle(transaction, depth, minWeightMagnitude, callback) {}

    broadcastBundle(transaction, callback) {}

    getBundle(transaction, callback) {}

    getTransfers(seed, options, callback) {}

    getAccountData(seed, options, callback) {}

    async isPromotable(tail) {}

    isReattachable(inputAddress, callback) {}

    //-----------------
*/
}


