
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  next()
};

//Members authorizations routing middleware {{{

exports.hasAuthentication = {
    hasAuthorization : function (req, res, next) {
      /*if (req.article.user.id != req.user.id) {
        return res.redirect('/articles/'+req.article.id)
      }
      next()*/
      return true;
    }
}

// }}}
// vim: set fdm=marker et fenc=utf-8 ff=unix sts=0 sw=2 ts=2 : 
