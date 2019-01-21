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
app.use(bodyParser.urlencoded({extended: true}));




// var urlDatabase = {
//   "b2xVn2": {
//     "userId": "<<someUserId>>",
//     "longURL": "http://www.google.com"
//   }
// }

var urlDatabase = {
  "b2xVn2": {
    "userID": "userRandomID",
    "longURL":"http://www.lighthouselabs.ca"
  }
};
 console.log(urlDatabase);


const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple",10)
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  },
  "user3RandomID":{
    id: "user3RandomID",
    email: "user3@example.com",
    password: bcrypt.hashSync("password3", 10)

  }

}


app.get("/urls", (req, res) => {
  console.log("/urls",users[req.session.userId], req.session.userId, users)
  let templateVars = { urls: urlDatabase, user:users[req.session.userId]};
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {

  let templateVars = { urls: urlDatabase, user:users[req.session.userId]};

  if(!req.session.userId){
     res.render("urls_new", templateVars);
  }
  // // else{
  //   res.render("urls_new");

  // }
});
//  Above code intentionally placed above the below one

app.get("/urls/:id", (req, res) => {
  let templateVars = { urls: urlDatabase, longURL:urlDatabase[req.params.id], shortURL: req.params.id};
  res.render("urls_show", templateVars,);
});

app.post("urls/:id", (req, res)=>{
  var shortURL = req.params.id
  let templateVars = { urls: urlDatabase, user:users[req.session.userId]};
  let longURL = req.body.longURL;
  for(shortURL in urlDatabase) {
    longURL = urlDatabase[shortURL].longURL;

  }res.redirect("/urls", templateVars)
})

app.post("/urls", (req, res) => {
  var shortURL = generateRandomString()
  urlDatabase[shortURL] = {
    longURL : req.body.longURL
  }
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
  let userId = req.session.userId;

  for(shortURL in urlDatabase) {

    if(userId === urlDatabase[shortURL].userID) {
      delete urlDatabase[id];
    }
  }

  res.redirect("/urls");
})

//     if(randomId = urlDatabase[key][userID]{
//       delete urlDatabase[id]{
//         else {
//           res.redirect("/urls");
//           {
//     // delete urlDatabase[id];
//     // res.redirect("/urls");
//   }
//     }
//       }
//       }
//   }
// }



app.post("/urls/:shortURL/", (req, res) => {
  let id = req.params.shortURL;
  urlDatabase[id] = req.body.longURL;
  res.redirect("/urls/");
});



  // let username = req.body.username
  // console.log(username)
  // res.cookie("username", username); commented code from yesterday
  // res.redirect("/urls")



app.post('/logout', (req, res) => {
  req.session.userId = null
  res.status(302).redirect('/urls');
});



app.get('/register', (req, res) => {
  res.render("registration")

});

app.post('/register', (req, res) => {
  let name = req.body.Name;
  let email = req.body.email;
  let password = req.body.password;
  let hashedPassword = bcrypt.hashSync(password, 10);
  let randomId = generateRandomString();

  if (!email || password ==="") {
    console.log('form incomplete')
    res.status(400).send("Fill in the Form");
  }

  for(key in users) {
    if(email === users[key].email) {
      res.status(400).send("email already exists")
    }

    console.log('looks good');
    users[randomId] = {
      email: email,
      password: hashedPassword,
      id : randomId
    }

    req.session.userId = randomId;
    // urlDatabase[userID] ={};
    res.redirect('/urls');
  }
});


app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  let name = req.body.email;
  let email = req.body.email;
  let password = req.body.password;
  for (key in users){
    if(email === users[key].email && bcrypt.compareSync(password, users[key].password)){
      req.session.userId = key;
      res.redirect("/urls");
    } else  if (email !== users[key].email && bcrypt.compareSync(password, users[key].password)) {
    return res.status(403).send("incorrect email or password")
  }
}

});






  function generateRandomString() {
    return Math.random().toString(36).substring(6)


  }

function urlsForUser(id){
  var userDatabase =[]
  for(shortkey in urlDatabase){
    if(userId === urlDatabase[shortkey].userId){
      let data = urlDatabase[shortkey];
      data['shortURL'] = shortkey
      userDatabase.push(data);
      console.log(userDatabase)
    }
  }
  return userDatabase;
}

// for(key in users) {
//     if(email === users[key].email) {
//       res.status(400).send("email already exists")
//     }

// var userData = urlsForUser(generateRandomString)



// function findURLS(userId) {
//  var filterDatabase = []
//  for (var shortkey in urlDataBase) {                               //itterating through each object (2)
//    if(userId === urlDataBase[shortkey].userId) {
//      let data = urlDataBase[shortkey];                      //var data is the object containing longurl and userid
//      data['shortURL']= shortkey                      // add the key shorturl to data and = the (keys) we iterate through
//      filterDatabase.push(data)                                   //make this an array caled filterdatabase
//      console.log(filterDatabase)
//    }
//  }
//  return filterDatabase;
// }