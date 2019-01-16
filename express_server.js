var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"


};

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
//  Above code intentionally placed above the below one

app.get("/urls/:id", (req, res) => {
  let templateVars = { urls: urlDatabase, shortURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
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

function generateRandomString() {
    return Math.random().toString(36).substring(6)


  }

