const express = require("express");
const bodyParser = require("body-parser");
let router = express.Router();
const UserModel = require("../models/userSchema");
const TokenModel = require("../models/token");
const sendEmail = require("../mailer/sendEmail");
const crypto = require("crypto");
const path = require("path");
const cookieSession = require("cookie-session");
const session = require("express-session");

router.use(bodyParser.json());
router.use(express.static(path.join(__dirname + "./pub")));
router.use(
  session({
    secret: process.env.JWTPRIVATEKEY,
    saveUninitialized: true,
    resave: true,
  })
);
var sess;

router.route("/admin-login").post(async (req, res) => {
  const { username, password } = req.body;
  let user = await UserModel.findOne({ username: username });
  if (user) {
    if (password === user.password) {
      if (user.role === "Admin") {
        let name = user.username;
        let uid = user._id;
        let role = user.role;
        let area = user.area;
        let email = user.email;
        let password = user.password;
        let fullname = user.fullname;
        let picture = user.picture;

        req.session.area = area;
        req.session.username = name;
        req.session.uid = uid;
        req.session.role = role;
        req.session.fullname = fullname;
        req.session.email = email;
        req.session.password = password;
        req.session.picture = picture;
        res.send({ user: user });
        console.log(user);
      } else {
        console.log("You are not an admin" + user.role);
        res.send("not admin");
      }
    } else {
      console.log("Wrong pass");
      res.send("password");
    }
  } else {
    console.log("wala");
    res.send("exists");
  }
});

router.route("/login").post(async (req, res) => {
  const { username, password } = req.body;
  let user = await UserModel.findOne({ username: username });
  if (user) {
    if (password === user.password) {
      if (user.verified) {
        let name = user.username;
        let uid = user._id;
        let role = user.role;
        let area = user.area;
        let email = user.email;
        let password = user.password;
        let fullname = user.fullname;
        let picture = user.picture;

        req.session.area = area;
        req.session.username = name;
        req.session.uid = uid;
        req.session.role = role;
        req.session.fullname = fullname;
        req.session.email = email;
        req.session.password = password;
        req.session.picture = picture;
        res.send({ user: user });
      } else {
        console.log("email not verified");
        res.send("email");
      }
    } else {
      console.log("wrong password");
      res.send("password");
    }
  } else {
    // try email
    let user = await UserModel.findOne({ email: username });
    if (user) {
      if (password === user.password) {
        if (user.verified) {
          let name = user.username;
          let uid = user._id;
          let role = user.role;
          let area = user.area;
          let email = user.email;
          let password = user.password;
          let fullname = user.fullname;
          let picture = user.picture;

          req.session.area = area;
          req.session.username = name;
          req.session.uid = uid;
          req.session.role = role;
          req.session.fullname = fullname;
          req.session.email = email;
          req.session.password = password;
          req.session.picture = picture;
          res.send({ user: user });
        } else {
          console.log("email not verified");
          res.send("email");
        }
      } else {
        console.log("wrong password");
        res.send("password");
      }
    } else {
      console.log("wala talaga");
      res.send("exists");
    }
  }
});

router.route("/read").get((req, res, next) => {
  UserModel.find((error, data) => {
    if (error) {
      console.log("error fetching data");
    } else {
      res.json(data);
    }
  });
});

router.route("/add").post(async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      console.log("email already exist");
      return res.send("email");
    } else {
      let user_username = await UserModel.findOne({
        username: req.body.username,
      });
      if (user_username) {
        res.send("username");
      } else {
        user = await new UserModel({
          fullname: req.body.fullname,
          username: req.body.username,
          email: req.body.email,
          role: req.body.role,
          area: req.body.area,
          password: req.body.password,
        }).save();

        let token = await new TokenModel({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const message = `${process.env.BASE_URL}/manage-user/verify/${user.id}/${token.token}`;
        await sendEmail(user.email, "Verify Email", message);
        res.send("success");
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/verify/:id/:token", async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Invalid link");

    const token = await TokenModel.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    await UserModel.findByIdAndUpdate(user._id, { verified: true });
    await TokenModel.findByIdAndRemove(token._id);
    const path = require("path");
    res.sendFile(path.join(__dirname, "./pub/success.html"));
    console.log("verified");
  } catch (error) {
    res.status(400).send("An error occured");
    console.log(error);
  }
});

router.route("/delete/:id").delete((req, res) => {
  UserModel.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log("deleted");
      res.send("deleted");
    }
  });
});

router.route("/update/:id").put(async (req, res, next) => {
  let user = await UserModel.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: req.body }
  );

  if (user) {
    let name = req.body.username;
    let role = req.body.role;
    let area = req.body.area;

    req.session.area = area;
    req.session.username = name;
    req.session.role = role;
    req.session.save();
    console.log("updated info");
    res.send("edited");
  } else {
    console.log("error");
  }
  // UserModel.findByIdAndUpdate(
  //   req.params.id,
  //   {
  //     $set: req.body,
  //   },
  //   (error, data) => {
  //     if (error) {
  //       res.send("failed");
  //     } else {
  //       let name = user.username;
  //       let uid = user._id;
  //       let role = user.role;
  //       let area = user.area;

  //       req.session.area = area;
  //       req.session.username = name;
  //       req.session.uid = uid;
  //       req.session.role = role;
  //       res.send("success");
  //     }
  //   }
  // );
});

router.route("/change-profile/:id").put(async (req, res, next) => {
  let profile = await UserModel.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  if (profile) {
    let newDP = req.body.picture;
    req.session.picture = newDP;
    req.session.save();
    console.log("updated", newDP);
  } else {
    console.log("error");
  }
});

router.route("/get-info").get((req, res) => {
  res.send({
    username: req.session.username,
    role: req.session.role,
    area: req.session.area,
    id: req.session.uid,
    email: req.session.email,
    password: req.session.password,
    fullname: req.session.fullname,
    picture: req.session.picture,
  });
});

module.exports = router;
