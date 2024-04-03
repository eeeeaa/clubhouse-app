//verify that user is logged in
exports.verifyAuth = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/user/login");
  return next();
};

//verify that user is logged in and is a member or above
exports.verifyMember = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/user/login");
  if (!req.user.is_member) {
    return res.render("user_unauthorized", {
      title: "Access Denied",
      message: "You need member status or above to access this page",
      current_user: req.user,
    });
  }
  return next();
};

//verify that user is logged in and is an admin
exports.verifyAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/user/login");
  if (!req.user.is_admin) {
    return res.render("user_unauthorized", {
      title: "Access Denied",
      message: "You need admin status to access this page",
      current_user: req.user,
    });
  }
  return next();
};
