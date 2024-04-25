const express = require('express') ; 
const app = express() ; 
const server  = require('http').Server(app) ; 
const io = require('socket.io')(server)


//Express working together with the peer
const {ExpressPeerServer} = require('peer')

//The down creates a peer Server
const peerServer = ExpressPeerServer(server , {
    debug : true
}) ;

//import the version 4 of the uuid framework
const {v4 : uuidv4} = require('uuid') ;

app.set('view engine','ejs') ;


//Resolved Error : Uncaught SyntaxError: Unexpected token '<' (at script.js:1:1)
app.use(express.static('public'))


app.use('/peerjs' , peerServer) ; //This makes the peerServer live

app.get('/' , (req,res) => {
    // res.status(200).send("helllo world") ; 
    //sets the rooId in the url
    res.redirect(`/${uuidv4()}`); 

})


app.get('/:room', (req,res) => {
    // get the roomId from the url and send it to the view
    res.render('room' , {roomId : req.params.room}) ;
})



io.on('connection', (socket)=>{
    socket.on('join-room' , (roomId , userId)=>{
        console.log(`${userId}`+"Joined the room") ;
        socket.join(roomId) ;  
        socket.broadcast.to(roomId).emit("user-connected", userId) ; 
        socket.on('message', message =>{
            console.log(message) ; 
            io.to(roomId).emit('createMessage',message) ; 
        })
    })
})


































































































































server.listen(40000 , ()=>{console.log("Connected to the server!!!")})


