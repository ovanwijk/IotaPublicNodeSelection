# IotaPublicNodeSelection


IOTA At times can be quite 'chatty' especially when using libs MAM for streams.
If you are choosing to make a pure web-based IOTA app it can be difficult to pick the optimal server especially if
your target group is the entire world. Latencies between continents are just horrible.

1 MAM message usually takes 2 messages to receive(1: fetch the transactions of the address, 2 fetch the transactions)
A MAM Message stream of 20 messages therefore takes 40 requests, since its a stream they are performed in series, having a 100ms increase in latency means 4 seconds longer load time for the stream!

IotaPublicNodeSelection solves this by doing an IP to country lookup from the browser using: https://ipinfo.io/json (alternatively you could use the Geolocation API but from my experience is that people are reluctant to give access to their location if it is not very obvious why.): do note that there are IP API limit restrictions.
Internally it also stores a Mapping from country to Lat-Long for geographic distance calculations.

The great service from https://iotanode.host provides a list of public IOTA Nodes including their located country. (If you run a node consider adding it there!)
We use the list to calculate the distance between the client and the countries provided.

The list is sorted by distance, but of course distance doesn't mean everything and therefore we take the first 15 (configurable) servers and do {command: getNodeInfo} in parallel, the first server to reply is returned.

It takes in consideration if you are using HTTP or HTTPS or if running in NodeJS it doesnt care.


# Geo diverse multi node selection

Sometimes if we want to be sure an address isn't spend from and we are not sure what server might be used to spend the address from or just for the sake that we don't want to trust a single server the lib also provides a way to select public nodes that are located on different locations on the planet.

For IoT related applications this might not be that usefull but for human facing interfaces this might be neccecary to prevent human error.


# Usuage:

    npm install iotapublicnodeselection --save

    var iotapublicnodeselection = require("iotapublicnodeselection");
    
    iotapublicnodeselection.getPublicNode().then(result => {
        console.log(result);
    });
    iotapublicnodeselection.getGeospreadPublicNodes(5).then(result => {
        console.log(result);
    });

