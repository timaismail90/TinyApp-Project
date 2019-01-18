var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var cookieParser = require("cookie-parser");
app.use(cookieParser());



var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "user3RandomID":{
    id: "user3RandomID",
    email: "user3@example.com",
    password: "password3",

  }

}


app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, userId: req.cookies.userId};
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
//  Above code intentionally placed above the below one

app.get("/urls/:id", (req, res) => {
  let templateVars = { urls: urlDatabase, longURL:urlDatabase[req.params.id], shortURL: req.params.id};
  res.render("urls_show", templateVars,);
});


app.post("/urls", (req, res) => {
  var shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`/urls/${shortURL}`)       // Respond with 'Ok' (we will replace this)
});


// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL =urlDatabase[shortURL];
    res.redirect(longURL);

});

app.post("/urls/:shortURL/delete", (req, res) => {
  let id = req.params.shortURL;
  delete urlDatabase[id];
  res.redirect("/urls");
});




app.post("/urls/:shortURL/", (req, res) => {
  let id = req.params.shortURL;
  urlDatabase[id] = req.body.longURL;
  res.redirect("/urls/")

});



  // let username = req.body.username
  // console.log(username)
  // res.cookie("username", username); commented code from yesterday
  // res.redirect("/urls")



app.post('/logout', (req, res) => {
  res.clearCookie('userId');
  res.status(302).redirect('/urls');
});



app.get('/register', (req, res) => {
  res.render("registration")

});

app.post('/register', (req, res) => {
  let name = req.body.Name;
  let email = req.body.email;
  let password = req.body.password;
  let randomId = generateRandomString();
  if (!email || password ==="") {
      console.log('form incomplete')
      res.status(400).send("Fill in the Form");
    }
  for(key in users)
    if(email===users[key].email)
        res.status(400).send("email already exists")

      console.log('looks good');
            users[randomId] = {
              email: email,
              password: password,
              id : randomId,
            }
            res.cookie["userId"] = randomId;
            res.redirect('/urls');



      });


app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  let name = req.body.email;
  let email = req.body.email;
  let password = req.body.password;
  for (key in users){
    if(email === users[key].email && password === users[key].password) {
      res.cookie('userId', key);
      res.redirect("/urls");
    };
  } if (email != users[key].email && password !== users[key].password) {
    return res.status(403).send("incorrect email or password")
  };
});








  function generateRandomString() {
    return Math.random().toString(36).substring(6)


  }

