var app = require("./config/express").app;
var routes = require("./config/routes");
var http = require("./config/express").http;
var messenger = require("socket.io")(http);
var sniffer = require("./jobs/sniffer");
routes(app);

messenger.on("connection", (socket) => {
    socket.on("start", (data) => {
        var device = "wlan0";
        var filter = "";
        sniffer.start(device, filter);
    })

    socket.on("stop", (data) => {
        // sniffer.stop();
        console.log("stop");
    });

    sniffer.subscribe((packet) => {
        socket.emit("packet", packet);
    });
});


http.listen(app.get("PORT"), () => {
    console.log("listening on", app.get("PORT"));
});
