const express = require('express')

const app = express() 
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const {v4: uuidV4} = require('uuid')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const PORT = process.env.PORT || 3000 || 500
const {createToken, isSigned, isNotAuth} = require('./utils/authentication')


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())


mongoose.connect(process.env.URI, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(()=>{
      server.listen(PORT, (err) => {
        if(err) console.log(err)
        else console.log(`Server started at port ${PORT}`)
      })
}).catch(e => console.log(e))

// 
app.get('/',isNotAuth, (req,res) => {
  res.render('index')
})
app.get('/home', isSigned, (req,res) => {
  res.send('HOME')
})
app.get('/rooms', (req,res) => {
  res.render('room-home')
})
// route for video chatroom
app.post('/room', (req,res) => {
  const {username, room} = req.body
  res.render('room', {room, username})
})

// authentication routes
app.get('/login', isNotAuth, (req,res) => {
  res.render('signin')
})

app.use('/auth', require('./routes/auth'))

// SETTING UP socket io for chat rooms
io.on('connection', socket => {
  socket.on('join-room', ({room, userId, username}) => {
    console.log({room, userId, username})
    socket.join(room)
    socket.broadcast.to(room).emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.broadcast.to(room).emit('user-disconnected', userId)
    })
  })
})


// page not found
app.use((req,res)=> {
  res.send('404: NOT FOUND')
})