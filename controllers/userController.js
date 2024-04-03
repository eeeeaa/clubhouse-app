/*
TODO: user can be: create, read, update, delete
create 
    -> user can sign up
read
    -> user can login
    -> user can view their own user detail
    -> need membership to view other user detail
update
    -> user can change their own first and last name -> TODO
    -> user can join the club and update their member status
    -> user can apply for admin position and update their member status
delete
    -> user can delete their own account -> TODO
*/
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { getHash } = require("../utils/passwordUtils");
const passport = require("passport");
const { verifyMember, verifyAdmin, verifyAuth } = require("./authController");

const User = require("../models/user");
const Post = require("../models/post");

const statusList = ["Guest", "Member", "Admin"];

require("dotenv").config();

//-----------PUBLIC ROUTE-------------//

//SIGN_UP - sign-up user and add to database
exports.user_signup_get = asyncHandler(async (req, res, next) => {
  res.render("user_signup", {
    title: "Sign up",
    status_list: statusList,
    current_user: req.user,
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
        status_list: statusList,
        errors: err.array(),
        current_user: req.user,
      });
    } else {
      user.save();
      res.redirect(user.url + "/detail");
    }
  }),
];

//LOG_IN - log-in user
exports.user_login_get = asyncHandler(async (req, res, next) => {
  res.render("user_login", { title: "Login", current_user: req.user });
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
        current_user: req.user,
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
    current_user: req.user,
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
exports.user_detail = [
  verifyAuth,
  (req, res, next) => {
    if (req.params.id === req.user._id.toString() || req.user.is_member) {
      next();
    } else {
      return res.render("user_unauthorized", {
        title: "Access Denied",
        message: "You need member status or above to access this page",
        current_user: req.user,
      });
    }
  },
  asyncHandler(async (req, res, next) => {
    const [user, allPosts] = await Promise.all([
      User.findById(req.params.id).exec(),
      Post.find({ user: req.params.id }).sort({ created_at: 1 }).exec(),
    ]);
    if (user == null) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    //hide actions if not your own detail and not an admin
    let shouldShowAction = false;

    if (req.isAuthenticated()) {
      shouldShowAction =
        req.params.id === req.user._id.toString() || req.user.is_admin;
    }

    res.render("user_detail", {
      title: "Account detail",
      user: user,
      post_list: allPosts,
      show_action: shouldShowAction,
      current_user: req.user,
    });
  }),
];

//-----------PROTECTED ROUTE-------------//

//USER_UPDATE - only owner and admin can edit (TODO)
exports.user_update_get = [
  verifyAdmin,
  asyncHandler(async (req, res, next) => {
    res.send(`NOT Implemented: user update get user id: ${req.params.id}`);
  }),
];

exports.user_update_post = [
  verifyAdmin,
  asyncHandler(async (req, res, next) => {
    res.send(`NOT Implemented: user update post user id: ${req.params.id}`);
  }),
];

//USER_DELETE - only owner and admin can delete (TODO)
exports.user_delete_get = [
  verifyAdmin,
  asyncHandler(async (req, res, next) => {
    res.send(`NOT Implemented: user delete get user id: ${req.params.id}`);
  }),
];

exports.user_delete_post = [
  verifyAdmin,
  asyncHandler(async (req, res, next) => {
    res.send(`NOT Implemented: user delete post user id: ${req.params.id}`);
  }),
];

//APPLY FOR MEMBERSHIP
exports.user_change_role_get = [
  verifyAuth,
  asyncHandler(async (req, res, next) => {
    const applyList = statusList.filter(
      (value) => value !== req.user.member_status
    );

    res.render("user_change_role", {
      title: "Change Status",
      status_list: applyList,
      current_user: req.user,
    });
  }),
];

exports.user_change_role_post = [
  verifyAuth,
  body("passcode")
    .custom((value, { req }) => {
      switch (req.body.member_status) {
        case "Guest": {
          return true;
        }
        case "Member": {
          return value === process.env.MEMBER_PASSCODE;
        }
        case "Admin": {
          return value === process.env.ADMIN_PASSCODE;
        }
        default: {
          return false;
        }
      }
    })
    .withMessage("Wrong passcode!")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const update = {
      member_status: req.body.member_status,
    };

    if (!errors.isEmpty()) {
      const applyList = statusList.filter(
        (value) => value !== req.user.member_status
      );

      res.render("user_change_role", {
        title: "Change Status",
        status_list: applyList,
        current_user: req.user,
        errors: errors.array(),
      });
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id.toString(),
        update,
        {}
      );
      res.redirect(updatedUser.url + "/detail");
    }
  }),
];
