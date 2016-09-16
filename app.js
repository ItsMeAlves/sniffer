var app = require("./config/express").app;
var routes = require("./config/routes");
var http = require("./config/express").http;
var messenger = require("socket.io")(http);
var sniffer = require("./jobs/sniffer");
var stringHelper = require("./config/string");
var messengerManager = require("./jobs/messengerManager");

routes(app);
messengerManager(messenger, sniffer);

http.listen(app.get("PORT"), () => {
    console.log("listening on", app.get("PORT"));
});
