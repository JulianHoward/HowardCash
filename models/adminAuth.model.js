
module.exports = (sequelize, Sequelize) => {
    const AdminAuth = sequelize.define("adminauth", {
        admin_id: {
            type: Sequelize.INTEGER
        },
        token: {
            type: Sequelize.STRING
        },
    })
    return AdminAuth;
}
