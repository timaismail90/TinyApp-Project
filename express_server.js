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

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username:req.cookies["username"] };
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
  res.redirect("/urls")
} )




app.post("/urls/:shortURL/", (req, res) => {
  let id = req.params.shortURL;
  urlDatabase[id] = req.body.longURL;
  res.redirect("/urls/")

})

app.post("/login", (req, res) => {
  let username = req.body.username
  // console.log(username)
  res.cookie("username", username);
  res.redirect("/urls")
})



app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.status(302).redirect('/urls');
});










function generateRandomString() {
    return Math.random().toString(36).substring(6)


  }



