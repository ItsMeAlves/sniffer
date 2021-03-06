var Cap = require("cap").Cap;
var parser = require("./parser");
var bufferSize = 2 * 1024 * 1024;
var buffer = new Buffer(4000);
var manufacturerApiUrl = "http://api.macvendors.com/";
var listeners = [];

module.exports = {
    cap: null,
    start(device, filter) {
        cap = new Cap();

        cap.on("packet", (numBytes) => {
        	var arrayForm = Array.from(buffer.slice(0, numBytes));
        	var packetData = arrayForm.map((v) => {
        		return v.toString(16).padLeft("00");
        	});

            var linkLayer = parser.linkLayer(packetData);
            var networkLayer = parser.networkLayer(packetData.slice(14),
                linkLayer.type);
            var transportLayer = parser.transportLayer(packetData.slice(14 + networkLayer.end),
                networkLayer.protocol || networkLayer.nextHeader);

            listeners.forEach((listener) => {
                listener({
                    linkLayer, networkLayer, transportLayer
                });
            });
        });

        return cap.open(device, filter, bufferSize, buffer); //linktype
    },
    stop() {
        cap.close();
        cap = null;
    },
    subscribe(listener) {
        listeners.push(listener);
    }
}
