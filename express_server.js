var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
app.set("view engine", "ejs");
var cookieSession = require('cookie-session');


app.use(cookieSession({
    name: 'session',
    keys: ['vV4AgRVL4kzHs1JL'],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));




// var urlDatabase = {
//   "b2xVn2": {
//     "userId": "<<someUserId>>",
//     "longURL": "http://www.google.com"
//   }
// }

var urlDatabase = {
    "b2xVn2": {
        "longURL": "http://www.lighthouselabs.ca",
        "userID": "userRandomID"
    }
};
// console.log(urlDatabase);

// user Database found below:


const users = {
    "userRandomID": {
        id: "userRandomID",
        email: "user@example.com",
        password: bcrypt.hashSync("purple", 10)
    },
    "user2RandomID": {
        id: "user2RandomID",
        email: "user2@example.com",
        password: bcrypt.hashSync("dishwasher-funk", 10)
    },
    "user3RandomID": {
        id: "user3RandomID",
        email: "user3@example.com",
        password: bcrypt.hashSync("password3", 10)

    }

}


// function that finds urls for a given user:

function urlsForUser(id) {
    var userDatabase = {}
    for (shortkey in urlDatabase) {
        if (id === urlDatabase[shortkey].userID) {
            userDatabase[shortkey] = urlDatabase[shortkey].longURL
        }
    }
    return userDatabase;
}
function checkUser (email, password){
    for ( var userID in users){
        console.log(users[userID], "checking")
     if (email === users[userID].email && bcrypt.compareSync(password, users[userID].password)) {
        return users[userID] 
    }  
 }
 return null
}
// Function that generates a random id:

function generateRandomString() {
    return Math.random().toString(36).substring(6)
}


// GET ('/') route:
app.get("/", (req, res) => {
    req.session.userId ? res.redirect("/urls") : res.redirect("/login");
});

// GET ("/urls")
app.get("/urls", (req, res) => {

    if (!req.session.userId) {
        res.redirect("/login")
    } else {
        
    let userData = urlsForUser(req.session.userId)
    let templateVars = {
        userDatabase: userData,
        user: users[req.session.userId]
    };
    res.render("urls_index", templateVars);
}
});


//GET ("/urls/new")


app.get("/urls/new", (req, res) => {

    let templateVars = { user: users[req.session.userId] };

    if (!req.session.userId) { // user is not logged in 
        res.redirect("/login");
    } else {
        res.render("urls_new", templateVars);
    };
});


app.post("/urls", (req, res) => {
    var userId = req.session.userId;
    var shortURL = generateRandomString();
    urlDatabase[shortURL] = {
        longURL: req.body.longURL,
        userID: userId,
    }
    res.redirect(`/urls/${shortURL}`) // Respond with 'Ok' (we will replace this)
});

// GET ("/u/:shortURL"):

app.get("/u/:shortURL", (req, res) => {
    let shortURL = req.params.shortURL;
    if (!urlDatabase[shorturl]) {
        res.send("URL not Found")
    }
    let longURL = urlDatabase[shortURL].longURL;
    if (longURL == undefined) {
        res.redirect("/urls");
    } else {
        res.redirect(longURL);
    }
});


//GET ("/urls/:id")

app.get("/urls/:id", (req, res) => {
    let templateVars = {
        urls: urlDatabase,
        shortURL: req.params.id,
        user: users[req.params.userId]
    };
    var shortURL = req.params.id;
    if (!urlDatabase[shortURL]) {
        res.send("URL not Found")
    } else if (req.session.userId === urlDatabase[shortURL].userID) {
        res.render("urls_show", templateVars);
    } else {
        res.send("cannot access URL");
    };

});

// POST ("/ UPDATE")


app.post("/urls/:shorturl/update", (req, res) => {
    const { shorturl } = req.params;
    urlDatabase[shorturl] = req.body.longurl;
    res.redirect("/urls");
});


//POST("/urls/;/Delete")

app.post("/urls/:shorturl/delete", (req, res) => {
    var shortURL = req.params.shorturl;
    console.log(shortURL)
    if (req.session.userId === urlDatabase[shortURL].userID) {
        delete urlDatabase[shortURL];
        res.redirect("/urls")
    } else {
        res.redirect('/login')
        // res.send("Access Denied");
    }
});




app.post("urls/:id", (req, res) => {
    var shortURL = req.params.id;
    let longURL = req.body.longURL;
    longURL = urlDatabase[shortURL].longURL;
    res.redirect("/urls")
})

//GET ("/login")


app.get("/login", (req, res) => {
    if (!req.session.userId) {
        res.render("login");
    } else {
        res.redirect("/urls");
    }
});



//POST/lOGIN

app.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;  
    let existingUser = checkUser(email, password)
        console.log(existingUser, email,password)
    if (existingUser){ 
        req.session.userId = existingUser.id;
        res.redirect("/urls");
    } else {
         res.status(403).send("incorrect email or password")
        }

});

//POST /LOGOUT


app.post('/logout', (req, res) => {
    req.session.userId = null
    res.status(302).redirect('/urls');
});

//GET / REGISTER


app.get('/register', (req, res) => {
    console.log(req.session.userId)
    if (!req.session.userId) {
        res.render("registration");
    } else {
        res.redirect("/urls")
    }

});


// POST / REGISTER


app.post('/register', (req, res) => {
    let name = req.body.Name;
    let email = req.body.email;
    let password = req.body.password;
    let hashedPassword = bcrypt.hashSync(password, 10);
    let randomId = generateRandomString();

    if (!email || !password) {
        res.status(400).send("Fill in the Form");
    }else if (checkUser(email, password)) {
        res.status(400).send("email already exists")
    }else{
        

        users[randomId] = {
            email: email,
            password: hashedPassword,
            id: randomId
        }
        console.log(users, randomId, "checking register")
    
        res.redirect('/urls');
    }
    
});




app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});




