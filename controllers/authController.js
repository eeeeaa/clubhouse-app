/*
Guest 
-> can write/edit/delete their own post
-> can view their own and other's account detail
Member
-> all above
-> can see author, date of posts
Admin
-> all above
-> can edit/delete all posts of others
-> can edit/delete other's account detail
*/

exports.verifyAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/user/login");
  }
};

exports.verifyMember = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.params.id === req.user._id.toString()) {
      //can view/edit your own stuff
      next();
    } else {
      if (req.user.is_member) {
        next();
      } else {
        res.redirect("/user/login");
      }
    }
  } else {
    res.redirect("/user/login");
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.params.id === req.user._id.toString()) {
      //can view/edit your own stuff
      next();
    } else {
      if (req.user.is_admin) {
        next();
      } else {
        res.redirect("/user/login");
      }
    }
  } else {
    res.redirect("/user/login");
  }
};
