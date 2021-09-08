const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const {addUser,removeUser,getUser,getRoom}=require('./utils/users.js')

const app=express()
const server=http.createServer(app)
const io=socketio(server)
const port=process.env.PORT||3000

app.use(express.static(path.join(__dirname,'./../public')))


io.on('connection',(socket)=>{
    console.log('new connection');
    
    socket.on('join',({name,room},callback)=>{

        const user=addUser({id:socket.id,name,room})
 
        if(user.error)
        return callback(user.error)

        socket.join(room)

        socket.emit('message',{message:"hi! welcome",createdAt:new Date().getTime()})
        socket.to(room).broadcast.emit('message',{message:`${name} joined`,createdAt:new Date().getTime()})

        io.to(room).emit('activeUsers',{
            room,
            users:getRoom(room)
        })

        socket.on('sendMessage',(msg,callback)=>{
            io.to(room).emit('message',msg)
            callback()
        })
        
        socket.on('sendLocation',(msg,callback)=>{
            io.to(room).emit('location',msg)
            callback()
        })

        socket.on('disconnect',()=>{
            const user=removeUser(socket.id)
            io.to(room).emit('activeUsers',{
                room,
                users:getRoom(room)
            })
            io.to(room).emit('message',{message:`${name} disconnected`,createdAt:new Date().getTime()})
        })
    })


})

app.get('/',(req,res)=>{
    res.send(index)
})

server.listen(port,()=>console.log(port))