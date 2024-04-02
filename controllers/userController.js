/*
TODO: user can be: create, read, update, delete
create 
    -> user can sign up
read
    -> user can login
    -> user can view their own and other user detail
        -> show username, first name, last name
        -> need membership to view other user detail
update
    -> user can change first and last name
    -> user can join the club and update their member status
    -> user can apply for admin position and update their member status
delete
    -> user can delete their account
*/
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { getHash } = require("../utils/passwordUtils");
const passport = require("passport");

const User = require("../models/user");
const Post = require("../models/post");

//-----------PUBLIC ROUTE-------------//

//SIGN_UP - sign-up user and add to database
exports.user_signup_get = asyncHandler(async (req, res, next) => {
  res.render("user_signup", {
    title: "Sign up",
    status_list: ["Guest", "Member", "Admin"],
    user: req.user,
  });
});

exports.user_signup_post = [
  body("first_name").trim().escape(),
  body("last_name").trim().escape(),
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("username must not be empty")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("password must not be empty")
    .escape(),
  body("password_confirm")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("password does not match"),
  asyncHandler(async (req, res, next) => {
    console.log(req.body.password_confirm);
    const err = validationResult(req);
    const hash = await getHash(req.body.password);
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: hash,
      member_status: req.body.member_status,
    });

    if (!err.isEmpty()) {
      res.render("user_signup", {
        title: "Sign up",
        status_list: ["Guest", "Member", "Admin"],
        errors: err.array(),
        user: req.user,
      });
    } else {
      user.save();
      res.redirect(user.url + "/detail");
    }
  }),
];

//LOG_IN - log-in user
exports.user_login_get = asyncHandler(async (req, res, next) => {
  res.render("user_login", { title: "Login", user: req.user });
});

exports.user_login_post = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("username must not be empty")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("password must not be empty")
    .escape(),
  (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      res.render("user_login", {
        title: "Login",
        user: req.user,
        errors: err.array(),
      });
    } else {
      next();
    }
  },
  passport.authenticate("local", {
    failureRedirect: "/user/login-failure",
    successRedirect: "/post",
  }),
];

exports.user_login_failure = asyncHandler(async (req, res, next) => {
  res.render("user_loginfailed", {
    title: "Login failed",
    message: "wrong username or password",
    user: req.user,
  });
});

//LOG_OUT
exports.user_logout = asyncHandler(async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/post");
  });
});

//USER_DETAIL - view user detail
exports.user_detail = asyncHandler(async (req, res, next) => {
  const [user, allPosts] = await Promise.all([
    User.findById(req.params.id).exec(),
    Post.find({ user: req.params.id }).sort({ created_at: 1 }).exec(),
  ]);
  if (user == null) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }
  res.render("user_detail", {
    title: "Account detail",
    user: user,
    post_list: allPosts,
  });
});

//-----------PROTECTED ROUTE-------------//

//USER_UPDATE
exports.user_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT Implemented: user update get user id: ${req.params.id}`);
});

exports.user_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT Implemented: user update post user id: ${req.params.id}`);
});

//USER_DELETE
exports.user_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT Implemented: user delete get user id: ${req.params.id}`);
});

exports.user_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT Implemented: user delete post user id: ${req.params.id}`);
});

//APPLY FOR MEMBERSHIP
exports.user_change_role_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT Implemented: user change role get user id: ${req.params.id}`);
});

exports.user_change_role_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT Implemented: user change role post user id: ${req.params.id}`);
});
