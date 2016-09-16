module.exports = function(messenger, sniffer) {
    messenger.on("connection", (socket) => {
        socket.on("start", (data) => {
            var device = data.device || "wlan0";
            var filter = data.filter || "";
            sniffer.start(device, filter);
        })

        socket.on("stop", (data) => {
            sniffer.stop();
        });

        process.on("exit", () => {
            sniffer.stop();
        })

        sniffer.subscribe((packet) => {
            socket.emit("packet", packet);
        });
    });
}
