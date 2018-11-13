const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser');


const {Pool,Client} = require('pg');



const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'UserRegistration',
    password: '123',
    port: 5432,
  });





const port = 3000;
//Static File Read//
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:false}));

app.set('view engine','hbs');


app.listen(port,()=>{
    console.log(`Server started Listening to port ${port}`);
});


//Registration Get
app.get('/',(req,res)=>{
    res.render('index.hbs');
})

//Registration Save
app.post('/register',(req,res)=>{

        pool.connect()
        .then((sucess)=>{
                const query = {
                    text: 'INSERT INTO User_Tbl(name, email,password) VALUES($1, $2, $3)',
                    values: [req.body.name, req.body.email,req.body.psw],
                  };

                  pool
                  .query(query)
                  .then((success)=>{           
                      res.locals.message = "You Have Sucessfully Inserted";               
                      res.render('index.hbs');
                 })
                 .catch((err)=>{
                    if(err){    
                        console.log(err);         
                        res.locals.message = "Server Is Busy Now! Please Try Again After while"; 
                        res.render('index.hbs');

                    }
                });

        })
        .catch((err)=>{
            if(err){   
                console.log(err);          
                res.locals.message = "Server Is Busy Now! Please Try Again After while"; 
                res.render('index.hbs');
            }
        });

});


//Registration Update Get
app.get('/update/:id',(req,res)=>{
    pool.connect()
    .then((sucess)=>{
            const query = {
                text: 'SELECT * FROM User_Tbl where id = $1',  
                values:[req.params.id]              
              };

              pool
              .query(query)
              .then((row)=>{       
                  res.locals.item = row.rows[0];  
                  console.log(res.locals.item); 
                  res.render('update.hbs');
             })
             .catch((err)=>{
                if(err){       
                    console.log(err);  
                    res.locals.item = "";    
                    res.locals.message = "Server Is Busy Now! Please Try Again After while"; 
                    res.render('update.hbs');

                }
            });

    })
    .catch((err)=>{
        if(err){             
            res.locals.message = "Server Is Busy Now! Please Try Again After while"; 
            console.log(err);
            res.render('update.hbs');
        }
    });

});


//Registration Update Post
app.post('/update',(req,res)=>{
    pool.connect()
    .then((sucess)=>{
        console.log(req.body.id + ' '+ req.body.name);
            const query = {
                text: 'Update User_Tbl SET password = $2 , name=$3,email=$4 where id = $1',  
                values:[req.body.id,req.body.psw,req.body.name,req.body.email],          
              };

              pool
              .query(query)
              .then((success)=>{     
                    
                  res.locals.message = "Sucessfully Updated";
                  res.render('update.hbs');
             })
             .catch((err)=>{
                if(err){       
                    console.log(err);  
                    res.locals.item = "";    
                    res.locals.message = "Server Is Busy Now! Please Try Again After while"; 
                    res.render('update.hbs');

                }
            });

    })
    .catch((err)=>{
        if(err){             
            res.locals.message = "Server Is Busy Now! Please Try Again After while"; 
            console.log(err);
            res.render('update.hbs');
        }
    });
})


//Registration View
app.get('/view',(req,res)=>{
    pool.connect()
        .then((sucess)=>{
                const query = {
                    text: 'SELECT * FROM User_Tbl',                
                  };

                  pool
                  .query(query)
                  .then((row)=>{   
                       
                      res.locals.items = row.rows; 
                      res.render('view.hbs');
                 })
                 .catch((err)=>{
                    if(err){       
                        console.log(err);      
                        res.locals.message = "Server Is Busy Now! Please Try Again After while"; 
                        res.render('view.hbs');

                    }
                });

        })
        .catch((err)=>{
            if(err){             
                res.locals.message = "Server Is Busy Now! Please Try Again After while"; 
                console.log(err);
                res.render('view.hbs');
            }
        });
})