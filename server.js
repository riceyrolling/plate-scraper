var express = require('express');
var app = express();
var fs = require("fs");

const vic = require('./states/vic.js');
const wa = require('./states/wa.js');

app.get('/search', function (req, res) {
    
    switch (req.query.state) {
        case "vic":
            vic.lookupPlate(req.query.plate).then(details => {
                res.end(JSON.stringify(details))
            })
            break;
            case "wa":
                wa.lookupPlate(req.query.plate).then(details => {
                    res.end(JSON.stringify(details))
                })
                break;
        default:
            res.end("Invalid state")
    }
})

var server = app.listen(8083, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

process.on('SIGINT', function () {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    process.exit(0);
});