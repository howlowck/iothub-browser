!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n(require("create-hmac"),require("mqtt"),require("debug")):"function"==typeof define&&define.amd?define(["create-hmac","mqtt","debug"],n):e.iothubBrowser=n(e.createHmac,e.mqtt,e.debug)}(this,function(e,n,t){e=e&&e.hasOwnProperty("default")?e.default:e;var o=function(e){return Math.ceil(Date.now()/1e3+60*e)},r=function(e){return"SharedAccessSignature "+["sr","sig","se","skn"].map(function(n){return e[n]?n+"="+e[n]:null},"").filter(function(e){return e}).join("&")},c=function(n,t,o,r){var c=encodeURIComponent(n),i={_key:o,sr:c,se:r,sig:function(n,t,o){var r=n+"\n"+o,c=e("sha256",new Buffer(t,"base64"));c.update(r);var i=c.digest("base64");return encodeURIComponent(i)}(c,o,r)};return t&&(i.skn=t),i},i=function(e){return e.split(";").reduce(function(e,n,t){var o=n.search("="),r=n.slice(0,o),c=n.slice(o+1);return e[r]=c,e},{})},s=(t=t&&t.hasOwnProperty("default")?t.default:t)("device");return function(e,t){var u=o(60),a=i(e),d=a.HostName,f=a.DeviceId,l=c(d+"/devices/"+f,null,a.SharedAccessKey,u),m=r(l),p=n.connect("wss://"+d+":443/$iothub/websocket?iothub-no-client-cert=true",{clean:!1,clientId:f,keepalive:180,password:m,protocolId:"MQTT",protocolVersion:4,reconnectPeriod:1e3,rejectUnauthorized:!0,connectTimeout:3e4,reschedulePings:!0,username:d+"/"+f+"/api-version=2017-06-30"});return p.on("connect",function(){s("emitter connected!")}),p.on("offline",function(){s("emitter offline")}),p.on("close",function(){s("emitter closed!")}),p.on("message",t),p.on("packetsend",function(){s("trying to send pocket..")}),p.subscribe("devices/"+f+"/messages/devicebound/#",{qos:0}),{publish:function(e,n){void 0===n&&(n={});var t=Object.keys(n).map(function(e){return encodeURIComponent(e)+"="+encodeURIComponent(n[e])}).join("&");p.publish("devices/"+f+"/messages/events/"+t,e,{qos:1,retain:!1})},close:p.end.bind(p)}}});
//# sourceMappingURL=connectDevice.umd.js.map
