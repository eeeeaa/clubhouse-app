/*
TODO: post can be: create, read, update, delete
create
    -> post can be created by logged in users
        -> need to be logged in to create a post
read 
    -> all posts can be view publicly on the home page
    -> post's author and timestamp are hidden for non-members
update
    -> user can edit their own posts
delete
    -> user can delete their own posts
    -> admin can also delete other user posts
*/
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const User = require("../models/user");
const Post = require("../models/post");

//-----------PUBLIC ROUTE-------------//

exports.post_list = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({})
    .populate("user")
    .sort({ created_at: 1 })
    .exec();
  const isMember = req.user === undefined ? false : req.user.is_member;
  res.render("index", {
    title: "Posts",
    post_list: allPosts,
    is_member: isMember,
    user: req.user,
  });
});

exports.post_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT Implemented: show post detail, id${req.params.id}`);
});

//-----------PROTECTED ROUTE-------------//

//CREATE POST
exports.post_create_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT Implemented: post create get by user id: ${req.params.id}`);
});

exports.post_create_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT Implemented: post create post by user id: ${req.params.id}`);
});

//EDIT POST
exports.post_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT Implemented: post update get by user id: ${req.params.id}`);
});

exports.post_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT Implemented: post update post by user id: ${req.params.id}`);
});

//DELETE POST
exports.post_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT Implemented: post delete get by user id: ${req.params.id}`);
});

exports.post_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT Implemented: post delete post by user id: ${req.params.id}`);
});
