var express = require("express");
var app = express();
var http = require("http").Server(app);

app.set("view engine", "ejs");
app.set("PORT", process.env.PORT || 3000);
app.use(express.static("./views/assets"));

module.exports = {
    app,
    http
}
