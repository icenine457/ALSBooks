var navPoints = [
  {
    navItem: "login",
    navClass: "",
    displayText: "Login",
    requiresLogin: false
  },
  {
    navItem: "logout",
    navClass: "",
    displayText: "Logout",
    requiresLogin: true
  },
  {
    navItem: "members",
    navClass: "",
    displayText: "Members",
    requiresLogin: true
  },
  {
    navItem: "publications",
    navClass: "",
    displayText: "Publications",
    requiresLogin: false
  },
  {
    navItem: "webSearch",
    navClass: "",
    displayText: "Web Search",
    requiresLogin: true
  },
  {
    navItem: "signup",
    navClass: "",
    displayText: "Create Account",
    requiresLogin: true
  }
]

db.navigation.remove();

navPoints.forEach(function(navPoint) {
  db.navigation.insert(navPoint);
});



