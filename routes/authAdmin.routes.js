
const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");

module.exports = app => {
    const controller = require("../controllers/authAdmin.controller.js");
    let router = require("express").Router();

    router.post("/login-admin", controller.generateAdminToken);
    router.post("/register-admin", controller.registerAdmin);
    router.get("/me", checkUserMiddleware, controller.meAdmin);

    app.use("/api/", router);
}
