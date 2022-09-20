import express from "express";
 import cors from "cors";

import mongoose from 'mongoose'
const App = express();
App.use(express.json());
App.use(cors());

const Port = process.env.PORT || 3000;

const UserBae = []
const UserSchema = new mongoose.Schema({
    FirstName: {type:String},
    LastName: {type:String},
    email: {type: String, require: true},
    password: {type:String , require: true},

    subjec: Array,
    Age: { type: Number, min: 18, max: 65 },
    isMarried:{type:Boolean, default: false},

    createOn: { type: Date, default: Date.now },
  });
const UserModel = mongoose.model('User', UserSchema);






App.post('/signup',(req , res)=>{
  
    let body = req.body ;

    if(!body.FirstName 
        || !body.LastName 
        || !body.email 
        || !body.password
        ){
             res.status(400).send(
                `require missing field please requst example :
             {
                FirstName : "jon" ,
                LastName :  "Sing",
                email :  "jonsin@gmail.com",
                password : "12345"  
             }
             `)
             return ;
        }
          /// email  phala rigster hai
           let isFound = false;
           for(let i = 0; i<UserBae.length; i++){
             if(UserBae[i].email === body.email.toLowerCase()){
              isFound = true;
                break; 
            }
}
if(isFound){   //this email already exist
    res.status(400).send({
        message: `email ${body.email} already exist `
    })
    return; 
}

let NewUser  = UserModel( {
    
    FirstName : body.FirstName,
    LastName : body.LastName,
    email : body.email.toLowerCase(),
    password : body.password
}  )  

NewUser.save((err, result)=>{
    if(!err){
        // mean data is saved 
        console.log("data saved ", result)
         res.status(201).send({message :"user is created "})
    }else{
        console.log( "db error:  ", err)
        res.status(500).send({message :"internal server err"})
    }
})
})


App.post('/Login', (res, req)=>{
    
    if(
           !body.email 
        ||  !body.password
        ){
             req.status(400).send(`
             require missing field please requst example :
             {
                 
                email :  "jonsin@gmail.com",
                password : "12345"
            
                
             }
             `)
             return ;
        }

        let isFound = false

        for(let i = 0; i<UserBae.length; i++){
            if(UserBae[i].email === body.email){
                 isFound = true
                if(UserBae[i].password === body.password){    // correct password 
                    res.status(200).send({
                        FirstName: UserBae[i].FirstName,
                        LastName : UserBae[i].LastName,
                        email : UserBae[i].email,
                        message : "Login is successful"
                    }) 
                    return
                }else{       // password incorrect
                    res.status(401).send({
                        message : 'incorrect password'
                    })
                    return 
                }
            }
            
        }
        if(!isFound){
            res.status(404).send({
                message : "user is not found"
            })

        }
})
App.listen(Port,()=>{
    console.log(`your server is working ${Port}`)
})


let  dburl = "mongodb+srv://1234:1234@cluster0.lokswzh.mongodb.net/sociakediaBase?retryWrites=true&w=majority"
mongoose.connect(dburl)
//connection 

mongoose.connection.on("connected", function(){
    console.log("mongodb is connected");

});
// 2 dissconnected 
mongoose.connection.on('disconnected', function(){
    console.log("your database is disconnected ");
    process.exit(1)
});

mongoose.connection.on("error", function(err){
    console.log("your data conection error please your connection ", err  );
    process.exit(1)
})
// this function will return just before closeing

process.on('SIGINT', function(){
    console.log("App is terminting ")
    mongoose.connection.close(function(){
        console.log("mongoose defult connection close")
        process.exit(0)
    })
})


