const express = require('express');
const jwt = require('jsonwebtoken');
var cookieSession  = require('cookie-session');
var port = 3000;

var app = express();
app.use(cookieSession({
    name :'session',
    keys:['private-key']
}))
app.get('/',(req, res)=>{
    res.send('Inside the get request')
})

app.post('/',verifyToken,(req, res)=>{
    jwt.verify(req.token , 'private_key' ,(err,authData)=>{
        if(err){
            res.send("error")
        }
        else{
            res.cookie('private_key' , req.token,{
                expire :new Date() + 9999
            })
            res.send(authData)
        }
    })
  }
)


app.post('/login',(req, res)=>{
    const user ={
        username : "foo",
        email:'foo@gmail.com',
        id: 1
    };
    jwt.sign({user : user },'private_key',(err, token)=>{
        if(err){
            console.log(err)
        }else{
            res.send(token)
        }
    })

})

app.post('/logout' ,(req, res)=>{
    res.clearCookie('private_key')
    res.send('you are logged out')
})

function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader )
    if(typeof bearerHeader !=='undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
        }else{
            res.send('error');
        }
    
}

app.listen(port,(req, res)=>{
    console.log(`The port is running at the port:${port}`)})