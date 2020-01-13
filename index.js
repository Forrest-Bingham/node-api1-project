// implement your API here
const express = require('express');
const Users = require('./data/db');

const server = express();

server.use(express.json());

//Get to "/"

server.get("/", function(req,res){
    res.send({project: "API1"})
})

//POST request

server.post('/api/users', (req,res) =>{
    const userData = req.body;
if (userData.name && userData.bio)
{
    if(typeof userData.name == "string" && typeof userData.bio == "string")
    {
    Users.insert(userData)
    .then( users => {
        console.log(users);
        res.status(201).json(users);
    })
    .catch( error => {
        console.log(error);
        res.status(500).json({errorMessage: "There was an error while saving the user to the database."})
    })
}
} else {
    res.status(400).json({
        errorMessage: "Please provide name and bio for the user."
    })
}
})

//Get Request! 

server.get('/api/users', (req,res)=>{
    Users.find()
    .then( users => {
        res.status(200).json(users);
    })
    .catch( error => {
        console.log(error);
        res.status(500).json({errorMessage: "The users information could not be retrieved."})
    })
})

//Get Request by ID

server.get('/api/users/:id', (req,res)=>{
    const id = req.params.id;
 
    Users.findById(id)

    .then( user => {
        if(user)
        {
        res.status(200).json(user);
        }
        else{
            res.status(404).json({
                errorMessage: "the user with the specified ID does not exist."
            })
        }
    })
    .catch( error => {
        console.log(error);
        res.status(500).json({errorMessage: "The user information could not be retrieved."})
    })
    
    
})

// DELETE request 

server.delete('/api/users/:id', (req,res)=>{
    const id = req.params.id;
    

    Users.remove(id)
    .then(deleted => {
        if(deleted){
             res.status(200).json(deleted);
        }
        else {
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        }
    })
    .catch( error => {
        console.log(error);
        res.status(500).json({
            errorMessage: "The user could not be deleted."
        })
    })
    
})

// PUT Request 

server.put('/api/users/:id', (req,res)=>{
    const id = req.params.id;
    const userData = req.body;

    Users.update(id, userData)
    .then( user => {
        if(user) //If Id is found
        {
        if(typeof userData.name == "string" && userData.name && userData.bio && typeof userData.bio == "string"){ //If name and bio are updating
            res.status(200).json(user);
        }
        else {
            res.status(400).json({
                errorMessage: "Please provide name and bio for the user"
            })
        }
    } else {
        res.status(404).json({
            errorMEssage: "The user with the specified ID does not exist"
        })
    }
    })
    .catch( error =>{
        console.log(error);
        res.status(500).json({
            errorMessage: "The user information could not be modified."
        })
    })
})

const port = 5000;
server.listen(port, ()=> console.log(`\n API listening on Port: ${port}`))

