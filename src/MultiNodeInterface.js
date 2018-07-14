import IOTA from 'iota.lib.js';
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
import * as ServerSelection from './ServerSelection';

export async function AUTO_N(N, exclude = []) {
    var selected = [].concat(exclude);
    //var fetchesPerN = [15, 10, 7, 5, 5]
    //var serversPerFetching = fetchesPerN[Math.max(N, fetchesPerN.length) - 1];
    for (var i = 0; i < N; i++) {
        var result = await ServerSelection.getPublicNode(15, selected);
        if(result){
            selected.push(result);
        }
    }
    return selected;
}

const iotaAPICommandNotAvailableHTTPCode = 401; //Unauthorized.
const serverStateCommand = "getNodeInfo";

const fetchServerCommands = ["findTransactions", "getTrytes", "wereAddressesSpentFrom", "getBalances"];

const transactionServerCommands = [
    "broadcastTransactions", "storeTransactions", "getTransactionsToApprove"
];

const powServerCommands = ["attachToTangle", "interruptAttachingToTangle"];

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
    return new Promise(function (fulfilled, rejected) {
        var callback = function(error, success){           
            if(error){
                rejected(error);
            }else{
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
        this.initialize = this
            .initialize
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

    setHintedServers(fetchServers = [], transactionServers = [], powServers = []) {
        this.fetchServerHints = fetchServers.filter(s => (typeof window === 'undefined' || s.startsWith(window.location.protocol)));
        this.transactionServerHints = transactionServers.filter(s => (typeof window === 'undefined' || s.startsWith(window.location.protocol)));
        this.powServerHints = powServers.filter(s => (typeof window === 'undefined' || s.startsWith(window.location.protocol)));
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
            return this.liveServers(host);
        })).concat(sortedListCopy);

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


    async initialize(N = 5) {
        var timeTest = Date.now();
        if (!this.options.onlyUseHintedServers) {

            var servers = await AUTO_N(N); //Always pick a server from iotanodes.host to determine the highest milestone index.
            console.log("Obtaining auto N took: ", Date.now() - timeTest);
            
            var serverList = await iotaNodesCapabilities(servers);

            Object.assign(this.liveServers, serverList);
        }

        var allHintedServers = this
            .fetchServerHints
            .concat(this.transactionServerHints)
            .concat(this.powServerHints);

        //Just the unique ones we care about.
        
        var hintedServerList = await iotaNodesCapabilities(allHintedServers.filter(function (item, pos) {
            return allHintedServers.indexOf(item) == pos;
        }));

        Object.assign(this.liveServers, hintedServerList);

        this.highestObservedMilestoneIndex = ServerSelection.getLatestMilestone();
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
   

    async sendTrytesPromise(trytes, depth, minWeightMagnitude, options){
        //getTransactionsToApprove transactionServersCount
        console.log("Sending trytes");
        var transactionServers = this.selectTransactionServers(this.transactionServersCount);
        var tipApi = this.getApi(transactionServers[0].host);
        var powServer = this.selectPowServers()[0];
        var powApi = this.getApi(powServer.host);
        //get Tips from single server
        console.log("Executing getTransactionsToApprove");
        var tips = await promisifyAPI(tipApi, "getTransactionsToApprove", depth, undefined);
        //do proof of work just 1 time.
        console.log("Doing POW");
        var attachedTrytes = await promisifyAPI(powApi,
             "attachToTangle", tips.trunkTransaction, tips.branchTransaction,
              minWeightMagnitude, trytes);
        console.log("Doing storeAndBroadcast");
        //Store and broadcost to all transaction servers.
        var me = this;
        return await Promise.all(transactionServers.map(server => {
            return (async () => {       
                return {host:server, result: await promisifyAPI(me.getApi(server.host), 'storeAndBroadcast', attachedTrytes)};
            })();
        }))

    }

    //TODO making it streaming/paging

    async findTransactionsObjectsPromise(searchValues, redundency = 1) {
        var servers = this.selectFetchServers(redundency);
        var me = this;
        return await Promise.all(servers.map(server => {
            return (async () => {       
                return {host:server, result: await promisifyAPI(me.getApi(server.host), 'findTransactionObjects', searchValues)};
            })();
        }))
    }

    async findTransactionsPromise(searchValues, redundency = 1) {
        var servers = this.selectFetchServers(redundency);
        var me = this;
        return await Promise.all(servers.map(server => {            
            return (async () => {
                return {host:server, result: await promisifyAPI(me.getApi(server.host), 'findTransactions', searchValues)}
            })();
        }))
    }

    async getTrytesPromise(hashes, redundency = 1) {
        var servers = this.selectFetchServers(redundency);
        var me = this;
        return await Promise.all(servers.map(server => {            
            return (async () => {
                return {host:server, result: await promisifyAPI(me.getApi(server.host), 'getTrytes', hashes)}
            })();
        }));
    }
    
    async getTrytesFromTransactionServersPromise(hashes, redundency = 1) {
        var servers = this.selectTransactionServers(redundency);
        var me = this;
        return await Promise.all(servers.map(server => {            
            return (async () => {
                return {host:server, result: await promisifyAPI(me.getApi(server.host), 'getTrytes', hashes)}
            })();
        }));
    }

    async wereAddressesSpentFromPromise(addresses, redundency = 1) {
        var servers = this.selectTransactionServers(redundency);
        var me = this;
        return await Promise.all(servers.map(server => {            
            return (async () => {
                return {host:server, result: await promisifyAPI(me.getApi(server.host), 'wereAddressesSpentFrom', addresses)}
            })();
        }));
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