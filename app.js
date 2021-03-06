const express = require('express');
const path = require('path')
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

const goals = require('./routes/goals');
const users = require('./routes/users');

// Passport config 
require('./config/passport')(passport);

const db = require('./config/database')
// To get rid of warning - use Map global promise
mongoose.Promise = global.Promise;

// Connecting to db
mongoose.connect( db.mongoURI,{
    })
 .then(()=>{console.log('MongoDB Connected')})
 .catch(err =>{console.log(err)})

// Handlebars middleware 
app.engine('handlebars', exphbs(
    {
        defaultLayout: 'main',
        // layoutsDir: __dirname + '/views/layouts/',
        // partialsDir: __dirname + '/views/partials/'
    }
));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Body-parser middleware to accept form data
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Static folder of path-middleware
app.use(express.static(path.join(__dirname, 'public')));

// middleware for method override, put and delete.
app.use(methodOverride('_method'));


// Express-Session middleware

var config = require('./secretekey');
var key = config.secretekey;
if(!key){
    key="default_encryption_key";
}
app.use(session({
    secret:key,  
      // hide this session key while posting to github.
    resave:true,
    saveUninitialized:true,
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variable
app.use((req,res,next)=>{
    res.locals.success_msg= req.flash('success_msg');
    res.locals.error_msg= req.flash('error_msg');
    res.locals.error= req.flash('error');
    res.locals.user = req.user || null,
    next();
});


//  Index Route-Homepage 
app.get('/', (req, res) => {
    const title = "welcome!";
    res.render('index', {
        title: title,
    });
})

// About Route
app.get('/about', (req, res) => {
    res.render("about");
})

app.use('/goals',goals)
app.use('/users',users)


const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`app is running at port ${port}`);
});

// use VS-studio-code-IDE. (ALT+SHIFT+F) for indentation and formating like a pro-coder.

