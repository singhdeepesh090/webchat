const http=require("http");
const express=require("express");

const app=express();
const server=http.createServer(app);
const port=process.env.PORT || 3000;

app.use(express.static(__dirname+'/public'));



app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
})

const io=require("socket.io")(server);
var users={};

io.on("connection", (socket)=>{
    socket.on("new-user-joined",(username)=>{
        users[socket.id]=username;
        socket.broadcast.emit('user-connected',username);
        // console.log(users)
        io.emit("user-list",users);
    });

    socket.on("disconnect",()=>{
        socket.broadcast.emit('user-disconnected', user=users[socket.id]);
        delete users[socket.id];
        io.emit("user-list",users);
        
});

socket.on('message',(data)=>{
    socket.broadcast.emit("message",{
        user: data.user,
        msg: data.msg, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12: true,
        }).toLowerCase()
    
    
    
    
    })
 });

})
server.listen( port,()=>{
    console.log("Server is Started at"+port)
})


