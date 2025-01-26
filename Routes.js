const { Router } = require("express");
const UserController = require("./src/controllers/UserController");
const LeadSourceController = require("./src/controllers/LeadSourceController");
const StateController = require("./src/controllers/StateController");
const BrandmasterController = require("./src/controllers/BrandmasterController");
const CategorymasterController = require("./src/controllers/CategorymasterController");
const { route } = require("express/lib/application");
const router = Router();
const jwt = require("jsonwebtoken");

//User Routes

router.post("/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      console.log("err==========>", err);
      res.sendStatus(403);
    } else {
      res.json({
        message: "post created",
        authData,
      });
    }
  });
});

router.post("/login", (req, res) => {
  const user = {
    id: 1,
    username: "vivek",
    email: "vivek84505@gmail.com",
  };

  jwt.sign({ user }, "secretkey", { expiresIn: "30s" }, (err, token) => {
    res.json({
      token,
    });
  });
});

// FORMAT OF TOKEN
// Authorization:Bearer <access_token>

//verifyToken

function verifyToken(req, res, next) {
  //Get Auth header Value
  const bearerHeader = req.headers["authorization"];
  //check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    //Split at the space
    const bearer = bearerHeader.split(" ");
    //Get token from array

    const bearerToken = bearer[1];
    //set the token
    req.token = bearerToken;
    next();
  } else {
    //Forbidden
    returnObj = {
      message: "Forbidden",
      status: "403",
    };

    res.status(403).json(returnObj);

    // res.sendStatus(403);
  }
}

// User Routes
router.post("/getusers", UserController.getusers);
router.post("/adduser", UserController.addUser);
router.post("/updateuser", UserController.updateUser);
router.post("/deleteuser", UserController.deleteuser);

//Lead Source Routes
router.post("/getleadsourceall", LeadSourceController.getleadsourceall);
router.post("/addleadsource", LeadSourceController.addleadsource);
router.post("/updateleadsource", LeadSourceController.updateleadsource);
router.post("/deleteleadsource", LeadSourceController.deleteleadsource);

//State Routes
router.post("/getstate", StateController.getstate);
router.post("/addstate", StateController.addstate);

//Brandmaster Routes
router.post("/brandmastergetAll", BrandmasterController.brandmasterGetAll);
router.post("/brandmasterAdd", BrandmasterController.brandmasterAdd);
router.post("/brandmasterUpdate", BrandmasterController.brandmasterUpdate);

//Categorymaster Routes
router.post(
  "/categorymastergetAll",
  CategorymasterController.categorymastergetAll
);
router.post("/categorymasterAdd", CategorymasterController.categorymasterAdd);
router.post(
  "/categorymasterUpdate",
  CategorymasterController.categorymasterUpdate
);

module.exports = router;
