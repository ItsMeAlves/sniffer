var Cap = require("cap").Cap;
var decoders = require("cap").decoders;
PROTOCOL = decoders.PROTOCOL;
var cap = new Cap();
var bufferSize = 2 * 1024 * 1024;
var buffer = new Buffer(3000);
var manufacturerApiUrl = "http://api.macvendors.com/";
var listeners = [];

String.prototype.padLeft = function(pad) {
	return pad.substring(0, pad.length - this.length) + this;
}
String.prototype.padRight = function(pad) {
	return this + pad.substring(0, pad.length - this.length);
}


cap.on("packet", (numBytes) => {
	var arrayForm = Array.from(buffer.slice(0, numBytes));
	var packetData = arrayForm.map((v) => {
		return v.toString(16).padLeft("00");
	});

	var destMAC = packetData.slice(0, 6).join(":");
	var srcMAC = packetData.slice(6, 12).join(":");
	var type = packetData.slice(12, 14).join("");

	switch(type.toUpperCase()) {
		case "0800":
			console.log("seems like IP");
			var versionAndLength = packetData.slice(14, 15).join("");
			console.log(versionAndLength);
			break;
		case "0806":
			console.log("seems like ARP");
			break;
		case "86DD":
			console.log("seems like IPV6");
			break;
		default:
			console.log("i don't know");
	}

	var ret = decoders.Ethernet(buffer);
	ret = decoders.IPV4(buffer, ret.offset);
	console.log(destMAC);
	console.log(srcMAC);
	console.log(type);
	console.log(ret.info);

    listeners.forEach((listener) => listener({
        destMAC, srcMAC, type
    }));

	cap.close();
});

module.exports = {
    start(device, filter) {
        return cap.open(device, filter, bufferSize, buffer); //linktype
    },
    stop() {
        cap.close();
    },
    subscribe(listener) {
        listeners.push(listener);
    }
}
