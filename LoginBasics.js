/*  url: https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537
    GIT: https://github.com/lyndachiwetelu/using-passport-with-sequelize-and-mysql
    Sequelize is a promise-based Node.js ORM. It can be used with PostgreSQL, MySQL, MariaDB, SQLite, and MSSQL. In this tutorial, we will be implementing authentication for users of a web app. And we will use Passport, the popular authentication middleware for Node, together with Sequelize and MySQL to implement user registration and login.

    Getting Started
    Make sure you have the following installed on your machine:

    Node
    MySQL
    For this tutorial, we will be using Node.js together with Express, so we go ahead and start installing what we need.

    Step 1: Generate a package.json File
    Create a directory for your app. Inside this directory, run this from your terminal or command prompt:
*/

npm init

/*  This initializes the npm Dependency Manager. This will present a series of prompts which we'll quickly go through.

    Type the name of your app without spaces and press Enter for 'name'.
    Press Enter for the 'version'.
    For  'description', in this tutorial, we'll type "Using Passport with Sequelize and MySQL" as a description and press Enter. This can be blank too.
    For 'entry point (index.js)', type server.js and press Enter.
    For 'test command', press Enter. 
    For 'git repository', you can enter the git repo where your app resides if you have one or just press Enter to leave this blank.
    For 'Keywords', press Enter.
    For 'author', press Enter or type your name before doing that. 
    For 'license', press Enter. 
    For '(Is this okay )', this shows you what your package.json will look like. Type Yes and press Enter.
*/

/*  Step 2: Install Dependencies
    The major dependencies for this tutorial are:
        Express
        Sequelize
        MySQL
        Passport
        Passport Local Strategy
        Body Parser
        Express Session
        Bcrypt Nodejs
        Express Handlebars for the views

    To install them, from your terminal or command prompt, run the following one after another.
*/
    npm install express --save
    npm install sequelize --save
    npm install mysql --save
    npm install passport --save
    npm install passport-local --save
    npm install body-parser --save
    npm install express-session --save
    npm install bcrypt-nodejs --save
    npm install express-handlebars --save

/*  If you're using Git for this project:
    In your project folder create a .gitignore file.
    Add this line to the .gitignore file.
*/

node_modules 

/*
Step 3: Set Up the App
Now, we create a server file. This will be the main file called when you type the following:

*/

npm start

/*
This runs the app. You can also run the app by typing node server.js.
*/

node server.js

/*
Then, in our project folder, we create a new file and name this file server.js.
Inside the server.js file, we paste the following:
*/
var express = require('express');
var app = express();
 
 
app.get('/', function(req, res) {
 
    res.send('Welcome to Passport with Sequelize');
 
});
 
 
app.listen(5000, function(err) {
 
    if (!err)
        console.log("Site is live");
    else console.log(err)
 
});

/*
The first line assigns the express module to a variable express. We then initialize express and name it a variable: app. 
Then we make app listen on port 5000. You can choose any free port number on your computer. 

Next, we call the app.get() express routing function to respond with "Welcome to Passport with Sequelize" when a GET request is made to "/".
To test on your computer, run this from inside your project folder:
*/

node server.js

/*
If you see the text "Welcome to Passport with Sequelize" when you visit http://localhost:5000/ then congrats! Otherwise, check that you have done everything exactly as it is written above. 
Next, we import some modules we need, like passport, express-session, and body-parser.
After */ var app = express() /* we add the following lines:
*/

var passport   = require('passport')
var session    = require('express-session')
var bodyParser = require('body-parser')

/*
In the first two lines, we import the passport module and the express-session, both of which we need to handle authentication.
Then, we import the body-parser module. This extracts the entire body part of an incoming request and exposes it in a format that is easier to work with. In this case, we will use the JSON format.
To let our app use the body parser, we add these lines some spaces below the import lines:
*/

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
Next, we initialize passport and the express session and passport session and add them both as middleware. We do this by adding these lines some spaces after the bodyParser import line.
*/

// For Passport
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

/*
We will begin to work on the actual authentication now.
We'll do this in four steps:
    1. Set up Sequelize with MySQL.
    2. Create the user model.
    3. Set up views.
    4. Write a passport strategy.

1. Set Up Sequelize With MySQL
First, we create a Database in MySQL. Give it your preferred name. For the sake of this tutorial, let's create a database named */ sequelize_passport /* in MySQL.
Then we set up configuration to handle DB details. 
First, let's import the dot-env module to handle environment variables.
Run this in your root project folder :
*/

npm install --save dotenv

/*
Then we import it in the main server file, server.js, just below the other imports.
*/

var env = require('dotenv').load();

/*
Next, we create a file in our project folder and name it .env. 
This next step to follow is optional if you're not using Git:
We'll add the .env file to your .gitignore file.
Your .gitignore file should look like this:
*/

node_modules
.env

/*
After this, we add our environment to the .env file by adding this line:
*/

NODE_ENV='development'

/*
Then we create a */ config.json /* file which will be used by Sequelize to manage different environments.
The first thing to do is to create a folder named */ config /* in our project folder. Inside this folder, we create a config.json file. This file should be ignored if you are pushing to a repository. To do this, add the following code to your .gitignore:
*/

config/config.json

/*
Then, we paste the following code in our config.json file.
*/

{
 
    "development": {
 
        "username": "root",
 
        "password": null,
 
        "database": "sequelize_passport",
 
        "host": "127.0.0.1",
 
        "dialect": "mysql"
 
    },
 
    "test": {
 
        "username": "",
 
        "password": null,
 
        "database": "",
 
        "host": "",
 
        "dialect": "mysql"
 
    },
 
    "production": {
 
        "username": "",
 
        "password": null,
 
        "database": "",
 
        "host": "127.0.0.1",
 
        "dialect": "mysql"
 
    }
 
}

/*
Remember to replace the values in the development block above with your database authentication details.
Next, we install sequelize with npm. To do this, run the following command in the project's root folder:
*/

npm install --save sequelize

/*
Now it's time to create the models folder. 
First, we make a directory named app in our project folder.
Inside the app folder, we create a new folder named models and create a new file named index.js in the models folder.
Inside the index.js file, we paste the code below.
*/

"use strict";
 
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {};
 
fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });
 
Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});
 
db.sequelize = sequelize;
db.Sequelize = Sequelize;
 
module.exports = db;

/*
This file is used to import all the models we place in the models folder, and export them. 
To test that all is well, we add this in our server.js file.
*/

//Models
var models = require("./app/models");
 
//Sync Database
models.sequelize.sync().then(function() {
 
    console.log('Nice! Database looks fine')
 
}).catch(function(err) {
 
    console.log(err, "Something went wrong with the Database Update!")
 
});

/*
Here, we are importing the models, and then calling the Sequelize sync function.
Run this to see if all is well:
*/

node server.js

/*
If you get the message "Site is live Nice! Database looks fine", then you have set up Sequelize successfully.
If not, please go carefully over the steps above and try to debug the issue with help.

2. Create the User Model
The next thing we are going to do is create the user model, which is basically the user table. This will contain basic user information.
In our models folder, we create a file and name it user.js. The full path for this file should be app/models/user.js.
Open the user.js file and add the following code:
*/

module.exports = function(sequelize, Sequelize) {
 
    var User = sequelize.define('user', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        firstname: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        lastname: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        username: {
            type: Sequelize.TEXT
        },
 
        about: {
            type: Sequelize.TEXT
        },
 
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
 
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
 
        last_login: {
            type: Sequelize.DATE
        },
 
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        }
 
 
    });
 
    return User;
 
}
/*

Now run:
*/

node server.js

/*
You should see the familiar "Site is live. Nice! Database looks fine." message. This means that our Sequelize models have been synced successfully, and if you check your database you should see a users table with the columns specified present.

3: Set Up Views
First, let's create the view for signup and wire it up.
The first thing to do is import the express handlebars module which we use for views in this tutorial.
Add this line to the main start file, server.js.
*/

var exphbs = require('express-handlebars')

/*
Your import block should look like this at this point.
*/

var express = require('express')
var app = express()
var passport = require('passport')
var session = require('express-session')
var bodyParser = require('body-parser')
var env = require('dotenv').load()
var exphbs = require('express-handlebars')
/*

Next, we add the following lines in our server.js file.
*/

//For Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');
/*

Now, in our app folder, we create three folders named views, controllers, and routes.
In the views folder, we create a file named signup.hbs and paste the code below in it.
*/

<!DOCTYPE html>
<html>
 
<head>
    <title></title>
</head>
 
<body>
    <form id="signup" name="signup" method="post" action="/signup">
        <label for="email">Email Address</label>
        <input class="text" name="email" type="email" />
        <label for="firstname">Firstname</label>
        <input name="firstname" type="text" />
        <label for="lastname">Lastname</label>
        <input name="lastname" type="text" />
        <label for="password">Password</label>
        <input name="password" type="password" />
        <input class="btn" type="submit" value="Sign Up" />
    </form>
 
</body>
 
</html>
/*

Then in our controllers folder, we create a new file and name it authcontroller.js.
In this file, we paste the following controller for the signup route which we will create in a moment.
*/

var exports = module.exports = {}
 
exports.signup = function(req, res) {
    res.render('signup');
}
/*

Next, we create a route for signup. In the routes folder, we create a new file named auth.js and then, in this file, we import the auth controller and define the signup route.
*/

var authController = require('../controllers/authcontroller.js');
 
module.exports = function(app) {
    app.get('/signup', authController.signup);
}
/*

Now, we'll import this route in our server.js and pass app as an argument.
In server, after the models import, add these lines:
*/

//Routes
var authRoute = require('./app/routes/auth.js')(app);

/*
Run this: 
*/

node server.js

/*
Now, visit http://localhost:5000/signup and you will see the signup form.
Let's repeat the steps for the sign-in form. As before, we'll create a file named signin.hbs in our views folder and paste the following HTML code in it:
*/

<!DOCTYPE html>
<html>
 
<head>
    <title></title>
</head>
 
<body>
    <form id="signin" name="signin" method="post" action="signin">
        <label for="email">Email Address</label>
        <input class="text" name="email" type="text" />
        <label for="password">Password</label>
        <input name="password" type="password" />
        <input class="btn" type="submit" value="Sign In" />
    </form>
 
</body>
 
</html>

/*
Then, add a controller for the sign-in in app/controllers/authcontroller.js.
*/

exports.signin = function(req, res) {
 
    res.render('signin');
 
}

/*
Then in app/routes/auth.js, we add a route for sign-in like this:
*/

app.get('/signin', authController.signin);

/*

Now when you run:

*/

node server.js

/* 
and visit http://localhost:5000/signin/, you should see the sign-in form.
The final and major step is writing our passport strategies.

4. Write a Passport Strategy
In app/config, we create a new folder named passport.
Then in our new folder app/config/passport, we create a new file and name it passport.js. This file will contain our passport strategies.
In passport.js, we will use the user model and passport.
First, we import bcrypt which we need to secure passwords.
*/

var bCrypt = require('bcrypt-nodejs');

/*
Then, we add a module.exports block like this:
*/

module.exports = function(passport, user) {
 
}

/*
Inside this block, we initialize the passport-local strategy, and the user model, which will be passed as an argument. Here's how we do this:
*/

module.exports = function(passport, user) {
    var User = user;
    var LocalStrategy = require('passport-local').Strategy;
}

/*
Then we define our custom strategy with our instance of the LocalStrategy like this:
*/

passport.use('local-signup', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
));

/*
Now we have declared what request (req) fields our usernameField and passwordField (passport variables) are. 
The last variable passReqToCallback allows us to pass the entire request to the callback, which is particularly useful for signing up.
After the last comma, we add this callback function.
*/

function(req, email, password, done) {
 
}

/*
In this function, we will handle storing a user's details.
First, we add our hashed password generating function inside the callback function.
*/

var generateHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

/*
Then, using the Sequelize user model we initialized earlier as User, we check to see if the user already exists, and if not we add them.
*/

User.findOne({
    where: {
        email: email
    }
}).then(function(user) {
    if (user)
    {
        return done(null, false, {
            message: 'That email is already taken'
        });
 
    } else
 
    {
        var userPassword = generateHash(password);
        var data =
            {
                email: email,
                password: userPassword,
                firstname: req.body.firstname,
                lastname: req.body.lastname
            };
 
        User.create(data).then(function(newUser, created) {
            if (!newUser) {
                return done(null, false);
            }
            if (newUser) {
                return done(null, newUser);
            }
        });
    }
});

/*
User.create() is a Sequelize method for adding new entries to the database. Notice that the values in the data object are gotten from the req.body object which contains the input from our signup form. 
Your passport.js should look like this:
*/

//load bcrypt
var bCrypt = require('bcrypt-nodejs');
 
module.exports = function(passport, user) {
    var User = user;
    var LocalStrategy = require('passport-local').Strategy;
 
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
 
        function(req, email, password, done) {
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
 
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (user)
                {
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
                } else
                {
                    var userPassword = generateHash(password);
                    var data =
                        {
                            email: email,
                            password: userPassword,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname
                        };
 
                    User.create(data).then(function(newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }
 
                        if (newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));
}

/*
Now we will import the strategy in server.js.

To do this, we add these lines below the routes import in server.js.
*/

//load passport strategies
require('./app/config/passport/passport.js')(passport, models.user);

/*
Your server.js should look like this at this time:
*/

var express = require('express')
var app = express()
var passport = require('passport')
var session = require('express-session')
var bodyParser = require('body-parser')
var env = require('dotenv').load()
var exphbs = require('express-handlebars')
 
//For BodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
 
// For Passport
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
 
//For Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');
 
app.get('/', function(req, res) {
    res.send('Welcome to Passport with Sequelize');
});
 
//Models
var models = require("./app/models");
 
//Routes
var authRoute = require('./app/routes/auth.js')(app);
 
//load passport strategies
require('./app/config/passport/passport.js')(passport, models.user);
 
//Sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
 
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
 
});
 
 
app.listen(5000, function(err) {
    if (!err)
        console.log("Site is live");
    else console.log(err)
 
});

/*
Now we will actually apply the strategy to our /signup route.
Here's how we do that:
First, we go to app/routes/auth.js, and add a route for posting to signup like this.
*/

app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup'
    }
));

/*
Since we need passport, we need to pass it to this method. We can import passport in this script or pass it from server.js. Let's do the latter.
Modify the function exported in this file app/routes/auth.js to have passport as a parameter. The code in app/routes/auth.js should look like this after your modification.
*/

var authController = require('../controllers/authcontroller.js');
 
module.exports = function(app, passport) {
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);
    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/dashboard',
            failureRedirect: '/signup'
        }
    ));
}

/*
Then in server.js, we modify the routes import and add passport as an argument like this:
*/

var authRoute = require('./app/routes/auth.js')(app,passport);

/*
Now, go to the signup URL http://localhost:5000/signup/ and try to sign up.
When you try to sign up, you will get an error "Failed to serialize user into session". This is because passport has to save a user ID in the session, and it uses this to manage retrieving the user details when needed.
To solve this, we are going to implement both the serialize and deserialize functions of passport in our app/config/passport/passport.js file.
First we the add the serialize function. In this function, we will be saving the user id to the session.
To do this, we add the following lines below the initialization of the local strategy.
*/

//serialize
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

/*
Next, we implement the deserialize function. Add the function just below the serialize function.
*/

// deserialize user 
passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
        if (user) {
            done(null, user.get());
        } else {
            done(user.errors, null);
        }
    });
});

/*
In the deserialize function above, we use the Sequelize findById promise to get the user, and if successful, an instance of the Sequelize model is returned. To get the User object from this instance, we use the Sequelize getter function like this: user.get().
Now run again:
*/

node server.js

/*
And attempt to sign up. Hurray if you got the "Cannot GET /dashboard"! It means our authentication was successful. Remember we redirected to /dashboard in our passport.authenticate method in routes/auth.js.
Now let's go ahead and add that route. Then, add a middleware to make sure the page can only be accessed when a user is logged into the session.
In our app/views folder, we create a new file named dashboard.hbs and add the following HTML code in it.
*/

<!DOCTYPE html>
<html>
 
<head>
    <title>Passport with Sequelize</title>
</head>
 
<body>
    <h2>Dashboard</h2>
    <h5>Hurray! you are logged in.</h5>
</body>
 
</html>

/*
In routes/auth.js, we add this line inside the module.exports block:
*/

app.get('/dashboard',authController.dashboard);

/*
Next, we go to app/controllers/authController.js and add the dashboard controller.
*/

exports.dashboard = function(req, res) {
    res.render('dashboard');
}

/*
Your AuthController.js should look like this:
*/

var exports = module.exports = {}
 
exports.signup = function(req, res) {
    res.render('signup');
}
 
exports.signin = function(req, res) {
    res.render('signin');
}
 
exports.dashboard = function(req, res) {
    res.render('dashboard');
}

/*
Now, run the app again, and try to sign up with a different email address from the one you used earlier. You'll be appropriately redirected to the /dashboard route. 
But /dashboard isn't a protected route, which means even if a user is not logged in, they can see it. We don't want this, so we'll add a /logout route to log the user out, and then protect the route and test what we have done.
Let's do this:
In routes/auth.js we add this line:
*/

app.get('/logout',authController.logout);

/*
Then we add the controller in app/controllers/authController.js.
*/

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
}

/*
Now run the app again and sign up with a different email address.
After that, visit http://localhost:5000/logout to log the user out. Now visit http://localhost:5000/dashboard.
You'll notice that it is quite accessible. Let's add a custom middleware to protect that route.
To do this, we open app/routes/auth.js and add this function in the module.exports block, below all the other lines of code.
*/

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/signin');
}

/*
Then we modify the dashboard route handler to look like this:
*/

app.get('/dashboard',isLoggedIn, authController.dashboard);

/*
Now when you run the app again and try to visit the dashboard page and you are not logged in, you should be redirected to the sign-in page.
Whew! It is time to implement the final part: the sign-in. 
First, we'll add a new local strategy for sign-in in app/config/passport/passport.js. 
*/

//LOCAL SIGNIN
passport.use('local-signin', new LocalStrategy(
    {
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
 
    function(req, email, password, done) {
        var User = user;
        var isValidPassword = function(userpass, password) {
            return bCrypt.compareSync(password, userpass);
        }
 
        User.findOne({
            where: {
                email: email
            }
        }).then(function(user) {
            if (!user) {
                return done(null, false, {
                    message: 'Email does not exist'
                });
            }
 
            if (!isValidPassword(user.password, password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
 
            var userinfo = user.get();
            return done(null, userinfo);
 
        }).catch(function(err) {
            console.log("Error:", err);
            return done(null, false, {
                message: 'Something went wrong with your Signin'
            });
        });
    }
));

/*
In this strategy, the isValidPassword function compares the password entered with the bCrypt comparison method since we stored our password with bcrypt.
If details are correct, our user will be signed in.
Now go to routes/auth.js and add the route for posting to /signin.
*/

app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/signin'
    }
)); 

/*
Your routes/auth.js should look like this when you're done.
*/

var authController = require('../controllers/authcontroller.js');
 
module.exports = function(app, passport) {
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);
    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/dashboard',
            failureRedirect: '/signup'
        }
    ));
 
    app.get('/dashboard', isLoggedIn, authController.dashboard);
    app.get('/logout', authController.logout);
    app.post('/signin', passport.authenticate('local-signin', {
            successRedirect: '/dashboard',
            failureRedirect: '/signin'
        }
    ));
 
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/signin');
    }
}

/*
Now run the app and try to sign in. You should be able to sign in with any of the details you used while signing up, and you'll be directed to http://localhost:5000/dashboard/.
Congratulations if you made it to the end of this tutorial! We have successfully used Sequelize and Passport with a MySQL database.
The full code for this tutorial can be found on GitHub.