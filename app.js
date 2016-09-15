var app = require("./config/express").app;
var routes = require("./config/routes");
var http = require("./config/express").http;
var messenger = require("socket.io")(http);
var sniffer = require("./jobs/sniffer");
routes(app);

messenger.on("connection", (socket) => {
    socket.on("start", (data) => {
        console.log("starting....");
    })

    socket.on("stop", (data) => {
        console.log("stopping");
    });

    sniffer.subscribe((packet) => {
        socket.emit("packet", packet);
    });
});


http.listen(app.get("PORT"), () => {
    console.log("listening on", app.get("PORT"));
});
