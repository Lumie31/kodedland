const express = require("express");
const Post = require("./models/PostSchema");
const moment = require("moment");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.title = "KodedLand";
  res.locals.moment = moment;
  next();
});

let users = [
  { name: "Henry Dimo", Registered: "LastWeek" },
  { name: "Lumie Olumide", Registered: "2 days ago" },
  { name: "Chibaba Chiscript", Registered: "a day ago" },
  { name: "Bolaji bolaji", Registered: "Today" },
  { name: "Eva Alordiah", Registered: "Never" }
];

router.get("/", (req, res) => {
  Post.find()
    .exec()
    .then(data => {
      // console.log(data);
      res.render("index", {
        pagetitle: "kodeland",
        posts: data,
        isLoggedIn: true,
        user: users[Math.floor(Math.random() * users.length)]
      });
    })
    .catch(err => {
      console.log(err);
      res.send("Error getting Post");
    });
});

router.get("/addpost", (req, res) => {
  res.render("addpost", {
    pagetitle: "Add Post"
  });
});

router.post("/addpost", (req, res) => {
  let title = req.body.title.trim();
  let content = req.body.content.trim();
  let tags = req.body.tags.replace(/[,\s+]/g, " ").split(/\s+/g);
  let author = req.body.author || "Anonymous";
  let imagelink =
    req.body.imagelink ||
    "http://www.arabamerica.com/wp-content/themes/arabamerica/assets/img/thumbnail-default.jpg";
  Post.create({
    title,
    content,
    tags,
    author,
    imagelink
  })
    .then(() => {
      console.log("Post created successfully");
      return res.redirect("/");
    })
    .catch(err => {
      console.log(err);
      return err;
    });
});

router.post("/deletepost/:id", (req, res) => {
  let query = req.params.id;
  Post.remove({ _id: query }, err => {
    if (err) throw err;
    console.log("Removed Successfully");
    return res.redirect("/");
  });
});

// router.put('/updatepost/:id', )
router.get("/updatepost/:id", (req, res) => {
  let id = req.params.id;
  Post.findById(id, (err, data) => {
    if (err) throw err;
    else {
      return res.render("updatePost", {
        pagetitle: "kodeland",
        posts: data,
        isLoggedIn: true,
        user: users[Math.floor(Math.random() * users.length)]
      });
    }
  });
});

router.post("/updatepost/:id", (req, res) => {
  let id = req.params.id;
  Post.findOneAndUpdate(id).then( data => {
    return res.render('updatepost');
  }).catch( (err) => {
    console.log(err);
  })
})

router.post("/searchposts", (req, res) => {
  let search = req.body.search.trim();
  let myquery = Post.where({ title: new RegExp(search, "i") });
  myquery
    .find()
    .then(data => {
      console.log(data)
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
