

var iotapublicnodeselection = require("./dist/IotaPublicNodeSelection.js");
//var iotapublicnodeselection = require("./src/ServerSelection.js");
//var yeah = await iotapublicnodeselection.getGeospreadPublicNodes(5);
iotapublicnodeselection.getPublicNode().then(result => {
    console.log(result);
})
iotapublicnodeselection.getGeospreadPublicNodes(5).then(result => {
    console.log(result);
})
console.log(iotapublicnodeselection);