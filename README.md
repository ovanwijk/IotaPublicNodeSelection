# IotaPublicNodeSelection


IOTA At times can be quite 'chatty' especially when using libs like MAM for streams.
If you are choosing to make a pure web-based IOTA app it can be difficult to pick the optimal server especially if your target group is the entire world. Latency between continents are just horrible.

Communicating with IOTA usually takes 2 messages to receive(1: fetch the Transaction id's, 2 fetch the transactions)
A MAM Message stream of 20 messages therefore takes 40 requests, since its a stream they are performed in series, having a 100ms increase in latency means 4 seconds longer load time for the stream!

IotaPublicNodeSelection solves this by doing an IP to country lookup from the browser using: https://ipinfo.io/json (alternatively you could use the Geo-location API but from my experience is that people are reluctant to give access to their location if it is not very obvious why.): *do note that there are IP API limit restrictions.*
Internally it also stores a Mapping from country to Lat-Long for geographic distance calculations.

The great service from https://iotanode.host provides a list of public IOTA Nodes including their located country. (If you run a node consider adding it there!)
We use the list to calculate the distance between the client and the countries provided.

The list is sorted by distance, but of course distance doesn't mean everything and therefore we take the first 15 (configurable) servers and do {command: getNodeInfo} in parallel, the first server to reply is returned.

It takes in consideration if you are using HTTP/ HTTPS or Node.


# Geo diverse multi node selection

Sometimes if we want to be sure an address isn't spend from and we are not sure what server might be used to spend the address from. Or just for the sake that we don't want to trust a single server. Or that we want to broadcast a transaction to varies tangle entry points around the globe.

The lib provides a way to select public nodes that are located on different locations on the planet.

For IoT related applications this might not be that useful but for human facing interfaces this might be necessary to prevent human error.

## Building

    npm run-script build

Building produces two files one for nodejs and one for web.


## Installation:

    npm install iotapublicnodeselection --save

## Usage:

    var iotapublicnodeselection = require("iotapublicnodeselection");
    
    iotapublicnodeselection.getPublicNode().then(result => {
        console.log(result);
    });
    iotapublicnodeselection.getGeospreadPublicNodes(5).then(result => {
        console.log(result);
    });

