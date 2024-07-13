
module.exports = app => {
    require("./user.routes")(app);
    require("./authAdmin.routes")(app);
    require("./authUser.routes")(app);
    require("./admin.routes")(app);
    require("./moneda.routes")(app);
    require("./tarjeta.routes")(app);
    require("./movimiento.routes")(app);
    require("./billetera.routes")(app);
    require("./cuentaBancaria.routes")(app);
    require("./beneficiario.routes")(app);
    require("./venta.routes")(app);
}
