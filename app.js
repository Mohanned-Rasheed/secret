//jshint esversion:6

import dotenv from "dotenv"
dotenv.config(); 
import epxress from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import encrypt from "mongoose-encryption";



mongoose.connect("mongodb://127.0.0.1:27017/userDB");
const app = epxress();

app.use(epxress.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    
});


userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ["password"]});


const model = mongoose.model("User",userSchema);


app.get("/",function(req,res){

    res.render("home");
})

app.get("/login",function(req,res){

    res.render("login");
})

app.get("/register",function(req,res){

    res.render("register");
})

app.post("/register",function(req,res){
    
    const newUser =  new model({
        email: req.body.username,
        password: req.body.password, 
    });
    
    newUser.save().then(function(){
        res.render("secrets");;})
        .catch(function(err){
        console.log(err);
    });
})

app.post("/login",function(req,res){

    model.findOne({email:req.body.username
    }).then(function(user){
       if (user) {
        if (user.password === req.body.password) {
            res.render("secrets");
        }else{
            res.render("home");
        }
       }else{
        res.render("home");
       }
        
    })
   
})




app.listen(3000, function(){
    console.log("Server connected throw port: 3000");
    
})
