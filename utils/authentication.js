const jwt = require('jsonwebtoken')

const maxAge = 3*24*60*60

module.exports = {
  createToken: (id) => {
    return jwt.sign({id}, 'secret', {expiresIn: maxAge})
  },
  isSigned: (req,res,next)=> {
    if(req.cookies.jwt){
      jwt.verify(req.cookies.jwt, 'secret', (err, decodedToken)=> {
        if(err) res.redirect('/login')
        else next()
      })
    }else{
      res.redirect('/login')
    }
  }
}