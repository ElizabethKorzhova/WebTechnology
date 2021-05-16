const http = require('http');
const fs = require('fs');
const getIP = require('ipware')().get_ip;

const HOST = '127.0.0.1';
const PORT = 5613;

const server = http.createServer((req, res) => {
    const IP = getIP(req).clientIp;
    fs.writeFileSync("ip.txt", IP);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(IP);
});

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
});