
const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");

module.exports = app => {
    const controller = require("../controllers/authUser.controller.js");
    let router = require("express").Router();

    router.post("/login-user", controller.generateUserToken);
    router.post("/register-user", controller.registerUser);
    router.get("/meUser", checkUserMiddleware, controller.meUser);

    app.use("/api/", router);
}
