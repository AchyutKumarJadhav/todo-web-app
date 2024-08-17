var express = require('express');
var mongoClient = require("mongodb").MongoClient;
var cors = require("cors");

var app = express();
app.use(cors());
app.use(express.urlencoded({
    extended : true
}));
app.use(express.json());

var conStr = "mongodb://127.0.0.1:27017";

app.get("/users",(req,res)=>{
    mongoClient.connect(conStr).then(clientObject=>{
        var database = clientObject.db("tododb");
        database.collection("users").find({}).toArray().then(documents=>{
            res.send(documents);
            res.end();
        });
    });
});

app.post("/register-user",(req,res)=>{
    var user = {
        UserId: req.body.UserId,
        UserName: req.body.UserName,
        Password: req.body.Password,
        Email: req.body.Email, 
        Mobile: req.body.Mobile
    };
    mongoClient.connect(conStr).then(clientObject=>{
        var database = clientObject.db("tododb");
        database.collection("users").insertOne(user).then(()=>{
            console.log(" New user Added");
             // res.redirect("/users");
        });
    });
})

app.get("/appointments/:userid",(req,res)=>{
    mongoClient.connect(conStr).then(clientObject=>{
        var database = clientObject.db("tododb");
        database.collection("appointments").find({UserId:req.params.userid}).toArray().then(documents=>{
            res.send(documents);
            res.end();
        });
    });
});

app.get("/get-byid/:id",(req,res)=>{
    mongoClient.connect(conStr).then(clientObject=>{
        var database = clientObject.db("tododb");
        database.collection("appointments").find({Id:parseInt(req.params.id)}).toArray().then(documents=>{
            res.send(documents);
            res.end();
        });
    });
})

app.post('/add-task',(req,res)=>{
    var task = {      
        Id: parseInt(req.body.Id),
        Title: req.body.Title,
        Date: new Date(req.body.Date),
        Description: req.body.Description,
        UserId: req.body.UserId
      }
    mongoClient.connect(conStr).then(clientObject=>{
        var database = clientObject.db("tododb");
        database.collection("appointments").insertOne(task).then(()=>{
            console.log("Task Added");
            res.end();
        });
    });
});

app.put("/edit-task/:id", (req,res)=>{
    var id = parseInt(req.params.id);

    mongoClient.connect(conStr).then(clientObject=>{
        var database = clientObject.db("tododb");
        database.collection("appointments").updateOne({Id:id},{$set:{Id:parseInt(req.body.Id), Title: req.body.Title, Date: new Date(req.body.Date), Description : req.body.Description, UserId : req.body.UserId}}).then(()=>{
            console.log("Task Updated");
            res.end();
        });                                 
    });
});

app.delete('/delete-task/:id', (req,res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect(conStr).then(clientObject=>{
        var database = clientObject.db("tododb");
        database.collection("appointments").deleteOne({Id:id}).then(()=>{
            console.log("Task deleted");
            res.end();
        });
    });
});

app.listen(4000, ()=>{
    console.log("Server Started at 4000 port number");
});