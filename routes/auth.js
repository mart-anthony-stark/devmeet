const router = require('express').Router()
const bcrypt = require('bcryptjs')
const {createToken, maxAge} = require('../utils/authentication')
const User = require('../models/User')

// GET ALL USERS
router.get('/', async (req,res)=>{
  const users = await User.find()
  res.send(users)
})

// login authentication
router.post('/signin', async(req,res) => {
  const {email, password} = req.body
  const user = await User.findOne({email})

  if(!user) return res.status(400).json({emailError: 'Account does not exist'})

  const matchPass = await bcrypt.compare(password, user.password)

  if(!matchPass) return res.json({passwordError: 'Your password is incorrect'})
  // Authenticate Successful
  const token = createToken(user._id)
  res.cookie('jwt', token, {httpOnly: true, maxAge})
  res.status(200).send({redirectUrl: '/home'})
})

// Signup route
router.post('/signup', async(req,res) => {
  const {name, email, password} = req.body
  const emailExist = await User.findOne({email})

  if(emailExist) return res.json({emailError: 'That email is already used by another account'})
  const salt = await bcrypt.genSalt(8)
  const encryptedPass = await bcrypt.hash(password, salt)

  const user = new User({
    name,
    email,
    password: encryptedPass
  })

  await user.save()
  // Authenticate signup sccessfull
  const token = createToken(user._id)
  res.cookie('jwt', token, {httpOnly: true, maxAge})
  res.status(200).send({redirectUrl: '/home'})
})


module.exports = router