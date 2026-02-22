const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { success, error } = require("../functions");
const app = express();
const config = require("../config");
let members = [
  { id: 1, name: "PHP" },
  { id: 2, name: "JavaScript" },
  { id: 3, name: "Java" },
];
let MembersRouter = express.Router();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Access-Control-Allow-Origin
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
// ("Création d'une API REST (En utilisant express");
// Récupère tous les membres
MembersRouter.route("/").get((req, res) => {
  res.json(success(members));
});
// Récupère un membre avec son ID
MembersRouter.route("/:id").get((req, res) => {
  let index = getIndex(req.params.id);
  if (typeof index == "string") {
    res.json(error(index));
  } else {
    res.json(success(members[index]));
  }
});
// Create a new member
MembersRouter.route("/").post((req, res) => {
  if (req.body.name) {
    let sameName = false;
    for (let i = 0; i < members.length; i++) {
      if (members[i].name == req.body.name) {
        sameName = true;
        break;
      }
    }
    if (sameName) {
      res.json(error("name already taken"));
    } else {
      let member = {
        id: createID(),
        name: req.body.name,
      };
      members.push(member);
      res.json(success(member));
    }
  } else {
    res.json(error("no name value"));
  }
});
// Modifie un membre avec ID
MembersRouter.route("/:id").put((req, res) => {
  let index = getIndex(req.params.id);
  if (typeof index == "string") {
    res.json(error(index));
  } else {
    let same = false;
    for (let i = 0; i < members.length; i++) {
      if (req.body.name == members[i].name && req.params.id != members[i].id) {
        same = true;
        break;
      }
    }
    if (same) {
      res.json(error("same name"));
    } else {
      members[index].name = req.body.name;
      res.json(success(true));
    }
  }
});
// Supprime un membre avec ID
MembersRouter.route("/:id").delete((req, res) => {
  let index = getIndex(req.params.id);
  if (typeof index == "string") {
    res.json(error(index));
  } else {
    members.splice(index, 1);
    res.json(success(members));
  }
});
app.use(config.routeApi + "members", MembersRouter);
app.listen(config.port, () => console.log("Started on port " + config.port));
function getIndex(id) {
  for (let i = 0; i < members.length; i++) {
    if (members[i].id == id) return i;
  }
  return "wrong id";
}
function createID() {
  return members[members.length - 1].id + 1;
}
