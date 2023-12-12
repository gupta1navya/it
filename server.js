const http = require("http");
const url = require("url");
const fs = require("fs");
const qs = require("querystring");
const mysql = require('mysql');
const port = 3000;

function sendFile(res, file) {
    const filePath = `./${file}`;
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("404 Not Found");
                return;
            } else {
                const ext = file.split('.')[1];
                let contentType;
                if (ext === 'html') contentType = "text/html";
                else if (ext === 'css') contentType = "text/css";
                else if (ext === 'js') contentType = "application/javascript";
                else contentType = 'text/plain';
                res.writeHead(200, { "Content-Type": contentType });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
}

const connector = mysql.createConnection({
    host: "localhost",
    password: "",
    user: "root",
});

connector.connect((err) => {
    if (err) {
        console.log('error');
        return;
    }
    connector.query('use entries');

    const server = http.createServer((req, res) => {
        const pathname = url.parse(req.url).pathname;
        const query = url.parse(req.url, true).query;

        if (req.method === "GET") {
            if (pathname === '/') {
                sendFile(res, '/login.html');
            } else if (pathname === '/login') {
                const { email, password } = query;
                connector.query(`select * from users where email = '${email}' and passowrd = '${password}';`, (err, data) => {
                    if (err) {
                        console.log(err);
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.end("Internal Server Error");
                    } else {
                        if (data.length !== 0) {
                            res.writeHead(302, { location: '/404.html' });
                            res.end();
                        } else {
                            res.writeHead(500, {"Content-Type": "text/plain"});
                            res.end("Please Sign up or login with the correct credentials");
                        }
                    }
                });
            } 
            //
            else if (pathname === '/register') {
                let body = '';
                req.on('data', (chunk) => body += chunk).on('end', () => {
                    const {name, email, password} = qs.parse(body);
                    connector.query(`INSERT INTO users (email, passowrd) VALUES ('${email}', '${password}');`, (err, data) => {
                        if (err) {
                            console.log(err);
                            res.writeHead(500, { "Content-Type": "text/plain" });
                            res.end("Internal Server Error");
                        } else {
                            res.writeHead(302, { location: '/404.html' });
                            res.end();
                        }
                    });
                });
            } 
            //
            else if (pathname.includes('.')) {
                sendFile(res, pathname);
            } else {
                res.end();
            }
        }

        else if(req.method === "POST") {
            if (pathname === '/register') {
                let body = '';
                req.on('data', (chunk) => body += chunk).on('end', () => {
                    const {name, email, password} = qs.parse(body);
                    connector.query(`INSERT INTO users (email, passowrd) VALUES ('${email}', '${password}');`, (err, data) => {
                        if (err) {
                            console.log(err);
                            res.writeHead(500, { "Content-Type": "text/plain" });
                            res.end("Internal Server Error");
                        } else {
                            res.writeHead(302, { location: '/' });
                            res.end();
                        }
                    });
                });
            } else if (pathname.includes('.')) {
                sendFile(res, pathname);
            } else {
                res.end();
            }
        }

    })
    server.listen(port, () => {
        console.log(`http://localhost:${port}`);
    }   );
});