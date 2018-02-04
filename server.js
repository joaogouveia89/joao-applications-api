// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var configs    = require('./apps/config');
mongoose.set('debug', true);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

//MONIHEALTH ENDPOINTS


router.get('/monihealth/login', (req,res)=>{
    mongoose.connect(configs.monihealth.db.mlab_url, function(err) {
        if (err) throw err;
        var emailReq = req.param('email');
        var passwordReq = req.param('password');
        var User = require('./apps/monihealth/models/user.js');
    
        User.findOne({
            email: emailReq
        }, function(err, user){
            if(err){ 
                res.send('error');
            }
            mongoose.disconnect();
            if(user.password === passwordReq){
                res.json({loginStatus: 200, message:'success', token: 'monihealthtoken'});
            }else{
                res.json({loginStatus: 403, message: 'unauthorized'});
            }            
        });
    });
});

router.get('/monihealth/mock', (req, res)=>{
    mongoose.connect(configs.monihealth.db.mlab_url, function(err) {
        if (err) throw err;
        var User = require('./apps/monihealth/models/user.js');
        /**
         * WARNING!!!
         * I am aware that the ideal would be to save the encrypted password, but deicidi did not encrypt in this example for simplicity,
         * although I know that in an application in production this password must be saved encrypted
         */ 
        var user = new User({
            name: "Joao Gouveia",
            email: "j.lucas.gouveia@gmail.com",
            password: "123456",
            age: 29,
            phone: "33532211"
        });
        user.save(function(err){
            if(err)
                res.send(err);
            mongoose.disconnect();
            res.json({messsage: 'user created'});
        });
    });
    
});
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
