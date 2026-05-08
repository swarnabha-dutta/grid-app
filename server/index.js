import express from "express";
import http from "http";
import {Server} from "socket.io";
import cors from 'cors';




const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*",
    },
});


const ROWS = 20;
const COLS = 20;

let grid = Array.from({length:ROWS},()=>
        Array.from({length:COLS}, ()=> null)
);


io.on("connection" , (socket)=>{
    console.log("User Connected : ", socket.id);

    //  Send full grid to new user
    socket.emit("init-grid" , grid);
    //  Handle cell claim
    socket.on("claim-cell",({row,col,user})=>{

        if(grid[row][col] === null){
            grid[row][col] = user;
            // Broadcast update to ALL users
            io.emit("cell-updated" , {row,col,user})
        }else{
            // Optional: send reject message
            socket.emit("cell-rejected" ,{row,col});
        }
    });

    socket.on("disconnect",()=>{
        console.log("User Disconnected : ", socket.id);
    });
});

server.listen(3000 , ()=>{
    console.log("Server is running on port 3000");
})
