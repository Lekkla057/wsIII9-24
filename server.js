var express = require('express');
var pgp = require('pg-promise')();
// var db = pgp(process.env.DATABASE_URL);
var db = pgp('postgres://quxstzwnixkzml:c424aa6bac17fee1536ed4d7a61df67a66170995a252aed36c491ecd68444427@ec2-107-20-249-48.compute-1.amazonaws.com:5432/d5tcre0n3cjia1?ssl=true');
var app = express();
var bodyParser = require('body-parser');//บังคับ
var moment = require('moment');
app.use(bodyParser.json());//บังคับ
app.use(bodyParser.urlencoded({ extended: true })); //บังคับ




// app.use(express.static('static'));
app.set('view engine','ejs');
app.get('/', function(req, res) {
    res.render('pages/index');
});
app.get('/about', function(req, res) {
    var name = 'Lekkla Wilailak'
    var hobbies = ['music','movie','programing']
    var bdate = '18/08/59';
    res.render('pages/about',{fullname : name,hobbies : hobbies,Birthday : bdate});
});

// Display all products
app.get('/products/:pid', function(req, res) {
var pid = req.params.pid;
var time = moment().format();
   
    
var sql = 'select* from products where id ='+pid+'order by id ASC';
db.any(sql)
.then(function(data){
    console.log('DATA:'+data);
    res.render('pages/product_edit',{product: data[0],time: time})
    
})
.catch(function(error){
    console.log('ERROR:'+error);
})

});





//Display all products
app.get('/products', function(req, res) {
    var id = req.param('id');
    var sql='select* from products order by id ASC';
        if(id){
            sql += ' where id ='+id+'order by id ASC';
        }
   db.any(sql)
    .then(function(data){
        console.log('DATA:'+data);
        res.render('pages/products',{products: data})
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
    })

});









// Display all user
app.get('/users/:id', function(req, res) {
    var id=req.param('id');
    var time = moment().format();
    var sql = 'select * from users';
    if(id){
        sql+=' where id ='+id;
    }
    db.any(sql)
    .then(function(data){
    console.log('DATA:'+data);
    res.render('pages/user_edit',{users : data,time:time})

    })
    .catch(function(error){
        console.log('ERROR:'+error)
    })});
    // Display all user
    app.get('/users', function (req, res) {
        db.any('select * from users', )
            .then(function (data) {
                console.log('DATA' + data);
                res.render('pages/users', { users: data })
    
            })
            .catch(function (error) {
                console.log('ERROR:' + error);
            })
    
});

//add users
app.get('/user_add', function(req, res) {
    var time = moment().format();
        res.render('pages/user_add',{time: time})
        
    });
app.post('/users/user_add', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var sql = `INSERT INTO users 
    VALUES ( '${id}', '${email}','${password}')`;
    //db.none
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users')
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })

        
});
//delete user
app.get('/user_delete/:pid',function (req, res) {
    var id = req.params.pid;
    var sql = 'DELETE FROM users';
    if (id){
            sql += ' where id ='+ id;
    }
    db.any(sql)
        .then(function(data){
            console.log('DATA:'+data);
            res.render('pages/users',{products : data});
            
        })
        .catch(function(data){
                console.log('ERROR:'+console.error);
                
    })
 });

//update product
app.post('/products/update',function (req, res) {
var id =req.body.id;
var title =req.body.title;
var price =req.body.price;
var time =req.body.time;
var sql=`update products set title='${title}',price='${price}',time='${time}' where id='${id}'`;
// res.send(sql)
//db.none
db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })
})

//update user
app.post('/users/update',function (req, res) {
    var id =req.body.id;
    var email =req.body.email;
    var password =req.body.password;
    var time =req.body.time;
    var sql=`update users set email='${email}',password='${password}',created_at='${time}' where id='${id}'`;
    // res.send(sql)
    //db.none
    db.any(sql)
            .then(function (data) {
                console.log('DATA:' + data);
                res.redirect('/products')
            })
    
            .catch(function (error) {
                console.log('ERROR:' + error);
            })
    })
    
//delete product
app.get('/product_delete/:pid',function (req, res) {
    var id = req.params.pid;
    var sql = 'DELETE FROM products';
    if (id){
            sql += ' where id ='+ id;
    }
    db.any(sql)
        .then(function(data){
            console.log('DATA:'+data);
            res.render('pages/products',{products : data});
            
        })
        .catch(function(data){
                console.log('ERROR:'+console.error);
                
    })
 });


//add Product
app.get('/add', function(req, res) {
    var time = moment().format();
        res.render('pages/product_add',{time: time})
        
    });
app.post('/products/insert', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var time = req.body.time
    var price = req.body.price;
    var sql = `INSERT INTO products 
    VALUES ( '${title}', '${price}','${time}')`;
    //db.none
    

    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })

        
});
//report product
app.get('/report_products', function(req, res){

    var sql = 'select * from products order by price DESC limit 10';
   
    db.any(sql)
    .then(function(data){
    console.log('DATA:'+data);
    res.render('pages/report_products',{products : data})

    })
    .catch(function(error){
        console.log('ERROR:'+error)
    })



});


// console.log('app is running at http://localhost:8080');
// app.listen(8080);
var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
});

