var http = require('http');

http.createServer((request,response)=>{
	response.write("Hello World, This is my Node.js server");
	response.end();
})
.listen(10000,()=>console.log('server started at port 10000'));


// // Another Method /////

// const projectName = "Node.js-Hello-World";
// const http = require("http");

// //create a hostname and port number
// const hostName = "127.0.0.1";
// const port = 10000;

// //create server
// const server = http.createServer((request, result) => {
//   result.statusCode = 200;
//   result.setHeader("Content-Type", "text/plain");
//   result.end("Hello World, this is my Node.js server");
// });

// //set server to listen
// server.listen(port, hostName, () => {
//   console.log(`Server running at http://${hostName}:${port}/`);
// });
