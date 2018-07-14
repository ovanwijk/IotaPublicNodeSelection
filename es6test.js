
import * as iotapublicnodeselection from './src/ServerSelection';



var AUTO3 = async function(){
   
    var selected = [];
    selected.push(await iotapublicnodeselection.getPublicNode(5, selected));
    selected.push(await iotapublicnodeselection.getPublicNode(5, selected));
    selected.push(await iotapublicnodeselection.getPublicNode(5, selected));
    return selected;
}
AUTO3().then(result => {
    console.log("AUTO3", result);
})

iotapublicnodeselection.getPublicNode().then(result => {
    console.log("AUTO1", result);
})
iotapublicnodeselection.getGeospreadPublicNodes(5).then(result => {
    console.log("getGeospreadPublicNodes", result);
})
console.log(iotapublicnodeselection);