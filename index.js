//OLD contents ARE COMMENTED OUT BELOW

//changes in a single line every method is implemented instead of 
//explicitly declaring those like app.get , app.post etc



const express = require('express');
const app = express(); 

const users  = require("./MOCK_DATA.json")
const fs = require('fs');
const PORT = 8000;

//Middleware of express
app.use(express.urlencoded({ extended: false }));//this middle ware will run first


app.use((req,res,next)=>{
    console.log(`Hello from the middleware`);//refer notes [this middleware ran second]
    
    //if there were any return statements were in  between then it will simply return
    //and will not allow further execution of the code
    //thus the req, res cycle will end here

    req.myUserName = "Deviprasad Singh Samant";
    //in the above code we modified the req, res object
    
    next();


});

app.use((req,res,next)=>{
console.log(req.myUserName);
next();
});

//[finally!!] NOW TO ADD LOGS OF ENQUIRIES means for every request be it get post anthing
// we will log the details 

app.use((req,res,next)=>{
     fs.appendFile("log.txt", `\n Date:${Date.now()} | Method: ${req.method} | Path : ${req.path} \n `
     ,(err,data)=>{
        next();
        /**basically what this 
      will do is when the append method is executed successfully this next
      will be called*/
    })
});


//Routes 

//REST METHOD USED TO RETURN THE JSON FORMAT IN CASE IT IS A SMART DEVICE WHICH CANNOT RENDER HTML PAGES
app.get("/api/users",(req,res)=>{
    return res.json(users);
});


//BELOW METHOD IS FOR BROWSER LIKE CLIENT WHO CAN RENDER HTML DOCS AND THE MAIN REASON BEHIND DOING THIS IS BECAUSE IT IS FAST.
app.get("/users", (req,res)=>{
   const html = `
   <ul>${users.map( (user) => `<li>${user.first_name}</li>`).join("")};
   </ul>`;
   return res.send(html);
});


// TO SEARCH A PARTICULAR PERSON WITH AN ID IT IS DUPLICATED BELOW in joined methods
// app.get('/api/users/:id' ,(req,res)=>{
//     const id = Number(req.params.id);
//     const user = users.find(user => user.id === id);
//     return res.json(user);

// });

app.post('/api/users/', (req,res)=>{
    //create new user
    const body = req.body;
    users.push({ id : users.length+1/**this is done because we are not getting the id from the
     frontend so we are generating these by 
     using the index */ , ...body  }  )
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users) , (err,data) =>{
        return res.json({status: "success", id: users.length});
    });
    
    //To see in terminal
    // console.log(`body`,body);

    
});


//THE BELOW COMMENTED METHODS  CAN BE MERGED BY 


// app.patch('/api/user/:id', (req,res)=>{
//     //update the user with id
//     return res.json({status: "pending"})
// });


// app.delete('/api/user/:id', (req,res)=>{
//     //delete the user with id
//     return res.json({status: "pending"})
// });

// app.get('/api/users/:id' ,(req,res)=>{
//     const id = Number(req.params.id);
//     const user = users.find((user) => user.id ===id);
//     return res.json(user);

// });


//BASICALLY WHAT THIS MEANS IS THAT IF THERE ARE ANY REQUEST ON THESE THE PERFORM THAT SPECIFIED TASK

app.route('/api/users/:id').get((req,res)=>{
    const id = Number(req.params.id);
    const user = users.find(user => user.id ===id);
    return res.json(user);

}).delete((req,res)=>{
    return res.json({status: "pending"})
}).patch((req,res)=>{
    return res.json({status: "pending"})
})

app.listen(PORT,()=>{console.log(`server started at port: ${PORT}`)});
