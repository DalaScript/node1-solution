const http = require("http");
const fs = require("fs");

function runServer(req, res) {
    console.log(req.url);
    if(req.method == "GET" && req.url == "/") {
        fs.readFile("index.html", "utf8", (err, data) => {
            if(err) {
                res.write("Server error");
                res.end();
            }else {
                // console.log(`data: ${data}`);
                res.write(data);
                res.end();
            }
            // console.log(`request url: ${req.url}`);
            
        });
    }else if(req.method == "GET" && req.url == "/style.css") {
        fs.readFile("style.css", "utf8", (err, data) => {
            if(err) {
                res.write("Server error");
                res.end();
            }else {
                res.write(data);
                res.end();
            }
        });
    }else if(req.method == "POST" && req.url == "/sayHi") {
        fs.appendFile("hi_log.txt", "Somebody said hi.\n", "utf8", err => {
            if(err) console.log(err);
        });
        res.write("hi back to you!");
        res.end();
    }else if(req.method == "POST" && req.url == "/greeting") {
        let body = "";

        req.on("data", (data) => {
            body += data.toString();
        });

        req.on("end", () => {
            let response = "good morning";

            if(body == "hello") response = "hello there!";
            if(body == "what's up") response = "the sky";

            fs.appendFile("hi_log.txt", `${body}\n`, (err) => {
                if(err) console.error(err);
            });

            res.writeHead(200, { "Content-Type": "text/plain "});
            res.end(response);
        });
    }else if(req.method == "GET" && req.url != "/greeting") {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Error: Not Found");
    }
}

const server = http.createServer(runServer);

server.listen(80);