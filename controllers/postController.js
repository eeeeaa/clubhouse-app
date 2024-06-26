/*
TODO: post can be: create, read, update, delete
create
    -> post can be created by logged in users
        -> need to be logged in to create a post
read 
    -> all posts can be view publicly on the home page
    -> post's author and timestamp are hidden for non-members (except your own)
update
    -> user can edit their own posts -> TODO
delete
    -> user can delete their own posts
    -> admin can also delete other user posts
*/
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { verifyAuth, verifyMember, verifyAdmin } = require("./authController");

const User = require("../models/user");
const Post = require("../models/post");

//-----------PUBLIC ROUTE-------------//

exports.post_list = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({})
    .populate("user")
    .sort({ created_at: 1 })
    .exec();
  res.render("index", {
    title: "Posts",
    post_list: allPosts,
    current_user: req.user,
  });
});

exports.post_detail = [
  verifyAuth,
  asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate("user").exec();

    if (post === null) {
      const err = new Error("Post not found");
      err.status = 404;
      return next(err);
    }

    //hide actions if not your own post and not an admin
    let shouldShowAction = false;
    let shouldShowMemberDetail = false;

    if (req.isAuthenticated()) {
      shouldShowAction =
        post.user._id.toString() === req.user._id.toString() ||
        req.user.is_admin;

      shouldShowMemberDetail =
        post.user._id.toString() === req.user._id.toString() ||
        req.user.is_member;
    }

    res.render("post_detail", {
      title: "Post detail",
      post: post,
      show_action: shouldShowAction,
      show_member_detail: shouldShowMemberDetail,
      current_user: req.user,
    });
  }),
];

//-----------PROTECTED ROUTE-------------//

//CREATE POST - only logged in user/owner can create
exports.post_create_get = [
  verifyAuth,
  asyncHandler(async (req, res, next) => {
    res.render("post_form", { title: "Create post", current_user: req.user });
  }),
];

exports.post_create_post = [
  verifyAuth,
  body("title")
    .isLength({ min: 1 })
    .withMessage("title must not be empty")
    .escape(),
  body("message")
    .isLength({ min: 1 })
    .withMessage("message must not be empty")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const post = new Post({
      title: req.body.title,
      message: req.body.message,
      created_at: Date.now(),
      user: req.user._id,
    });

    if (!errors.isEmpty()) {
      res.render("post_form", {
        title: "Create post",
        current_user: req.user,
        errors: errors.array(),
      });
    } else {
      post.save();
      res.redirect(post.url + "/detail");
    }
  }),
];

//EDIT POST - only owner and admin can edit (TODO)
exports.post_update_get = [
  verifyAdmin,
  asyncHandler(async (req, res, next) => {
    res.send(`NOT Implemented: post update get of ${req.params.id}`);
  }),
];

exports.post_update_post = [
  verifyAdmin,
  asyncHandler(async (req, res, next) => {
    res.send(`NOT Implemented: post update post of ${req.params.id}`);
  }),
];

//DELETE POST - only owner and admin can delete
exports.post_delete_get = [
  verifyAuth,
  asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id, "user").exec();
    if (
      post.user._id.toString() === req.user._id.toString() ||
      req.user.is_admin
    ) {
      next();
    } else {
      return res.render("user_unauthorized", {
        title: "Access Denied",
        message: "You need admin status to access this page",
        current_user: req.user,
      });
    }
  }),
  asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id)
      .populate("user", "username")
      .exec();

    if (post === null) {
      const err = new Error("Post not found");
      err.status = 404;
      return next(err);
    }
    res.render("post_delete", {
      title: "Delete Post",
      post: post,
      current_user: req.user,
    });
  }),
];

exports.post_delete_post = [
  verifyAuth,
  asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id, "user").exec();
    if (
      post.user._id.toString() === req.user._id.toString() ||
      req.user.is_admin
    ) {
      next();
    } else {
      return res.render("user_unauthorized", {
        title: "Access Denied",
        message: "You need admin status to access this page",
        current_user: req.user,
      });
    }
  }),
  asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).exec();

    if (post === null) {
      res.redirect("/post");
    } else {
      await Post.findByIdAndDelete(req.params.id);
      res.redirect("/post");
    }
  }),
];
