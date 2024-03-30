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

const User = require("../models/user");
const Post = require("../models/post");

//-----------PUBLIC ROUTE-------------//

//SIGN_UP - sign-up user and add to database
exports.user_signup_get = asyncHandler(async (req, res, next) => {
  res.send("NOT Implemented: user signup get");
});

exports.user_signup_post = asyncHandler(async (req, res, next) => {
  res.send("NOT Implemented: user signup post");
});

//LOG_IN - log-in user
exports.user_login_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT Implemented: user login get`);
});

exports.user_login_post = asyncHandler(async (req, res, next) => {
  res.send("NOT Implemented: user login post");
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
  res.send(`NOT Implemented: user detail user id: ${req.params.id}`);
});

//-----------PROTECTED ROUTE-------------//

//USER_POSTS
exports.user_post_list = asyncHandler(async (req, res, next) => {
  res.send(`NOT Implemented: user posts of user id: ${req.params.id}`);
});

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
