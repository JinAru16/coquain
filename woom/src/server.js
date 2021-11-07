import http from "http";
import SocketIo from "socket.io";
import express from "express";
import { WebSocketServer } from "ws";


const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_,res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const httpServer = http.createServer(app);//이건 http 서버를 만든것
const ioServer = SocketIo(httpServer);
ioServer.on("connection", socket => {
    console.log(socket);
});


httpServer.listen(3000, handleListen);// 2개의 프로토콜이 3000번 포트를 공유