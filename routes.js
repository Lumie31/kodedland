// Require needed modules and models...
const express = require("express");
const moment = require("moment");
const Post = require("./models/PostSchema");
const User = require("./models/UserSchema");

const router = express.Router();

// Middleware that defines default characteristic
router.use((req, res, next) => {
  res.locals.title = "KodedLand";
  res.locals.moment = moment;
  next();
});

let isLoggedIn = false;
let user = {};

// Get request to home-route that calls the find() method and finds and displays all posts in the client home
router.get("/", (req, res) => {
  Post.find()
    .exec()
    .then(data => {
      // console.log(data);
      res.render("index", {
        pagetitle: "kodeland",
        posts: data,
        isLoggedIn,
        user,
      });
    })
    .catch( err => {
      console.log(err);
      res.send("Error getting Post");
    });
});

// Get request that renders the addpost page 
router.get("/addpost", (req, res) => {
  res.render("addpost", {
    pagetitle: "Add Post"
  });
});

// Post request that sends created post to home-route
router.post('/addpost', (req, res) => {
  let post = {
    title: req.body.title.trim(),
    content: req.body.content.trim(),
    tags: req.body.tags.replace(/[,\s+]/g, " ").split(/\s+/g),
    author: req.body.author || "Anonymous",
    imagelink:
    req.body.imagelink ||
    "http://www.arabamerica.com/wp-content/themes/arabamerica/assets/img/thumbnail-default.jpg",  
  }
  Post.create(post).then( () => {
    return res.redirect('/');
  }).catch( (err) => {
    return err;
  })
})

router.post('/login', (req, res) => {
  let username = req.body.user.trim();
  let password = req.body.pass.trim();
  console.log(password)
  // let userquery = User.where({username})
  User.findOne({username}).then( (person) => {
    if (!person) {
      return res.redirect('/');
    }
    if (person.password === password) {
    console.log(person);
    user = person;
    isLoggedIn = true;
    return res.redirect('/');
    } else {
      return res.redirect('/')
    }
  }).catch((err) => {
    return err;
  })
})


router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  // console.log(req.body);
  let person = {
    firstname : req.body.firstname.trim(),
    username : req.body.username.trim(),
    lastname : req.body.lastname.trim(),
    password : req.body.password.trim(),
    password2 : req.body.password2.trim(),
    emailaddress : req.body.emailaddress.trim(),
    phonenumber : req.body.phonenumber.trim(),
  }
  User.create(person).then( (savedUser) => {
    console.log("Saved to Database!")
    isLoggedIn = true;
    user = savedUser;
    res.redirect('/');
  }).catch( (err) => {
    return err;
  })
  })

//WORKING!!!
router.post("/deletepost/:id", (req, res) => {
  let id = req.params.id;
  Post.remove({ _id: id }, err => {
    if (err) throw err;
    console.log("Removed Successfully");
    return res.redirect("/");
  });
});


router.get('/logout', (req, res) => {
  isLoggedIn = false;
  user = {}
  res.redirect('/');
})

router.get("/updatepost/:id", (req, res) => {
  let id = req.params.id;
  Post.findById(id, (err, data) => {
    if (err) throw err;
    else {
      // return res.render("updatePost", {})
      return res.render("updatePost", {
        // pagetitle: "kodeland",
        posts: data,
        // isLoggedIn: true,
        // user: users[Math.floor(Math.random() * users.length)]
      });
    }
  });
});


//WORKING!!!
router.post("/updatepost/:id", (req, res) => {
  let id = req.params.id;
  let title = req.body.title.trim();
  let content = req.body.content.trim();
  let tags = req.body.tags.replace(/[,\s+]/g, " ").split(/\s+/g);
  let imagelink =
    req.body.imagelink.trim() ||
    "http://www.arabamerica.com/wp-content/themes/arabamerica/assets/img/thumbnail-default.jpg";
  Post.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        title,
        content,
        tags,
        imagelink
      }
    },
    { new: true },
    (err, data) => {
      if(err) {
        console.log(err);
        return ;
      }
      return res.redirect("/");
    }
  );
});

router.post("/searchposts", (req, res) => {
  let search = req.body.search.trim();
  let myquery = Post.where({ title: new RegExp(search, "i") });
  myquery
    .find()
    .then(data => {
      console.log(data);
      return res.render("searchposts", {
        pagetitle: "Search Results",
        posts: data,
        isLoggedIn: true,
        user: users[Math.floor(Math.random() * users.length)]
      });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
