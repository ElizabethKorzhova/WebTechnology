const HOST = "127.0.0.1"
const PORT = 5676
const getIP = require('ipware')().get_ip;
const fs = require('fs');

function add(x, y) {
    return x + y;
}

const http = require('http');
const JsonRPC = require('simple-jsonrpc-js');

http.createServer(function (request, response) {
    let buffer = '';
    const jrpc = new JsonRPC();

    request.on('data', function (data) {
        buffer += data;
    });

    request.on('end', function () {
        jrpc.messageHandler(buffer).catch(err => err);
    });
    if (request.method === "OPTIONS") {
        jrpc.toStream = function (_msg) {
            response.writeHead(200,
                {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                }
            );
            response.end(_msg);
        };
    } else if (request.method === "POST") {
        jrpc.dispatch('add', ['x', 'y'], add);
        console.log(getIP(request));
        fs.writeFileSync('ip.txt', getIP(request).clientIp);
        jrpc.toStream = function (_msg) {
            response.writeHead(200, {
                "Access-Control-Allow-Origin": "*",
            });
            response.end(_msg);
        };
    }

}).listen(PORT, HOST, () => {
    console.log(`Server started at http://${HOST}:${PORT}`);
});