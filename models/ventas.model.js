
module.exports = (sequelize, Sequelize) => {
    const Venta = sequelize.define("venta", {
        venta_moneda_id_fk: {
            type: Sequelize.INTEGER
        },
        valor_venta: {
            type: Sequelize.FLOAT
        },
        monto: {
            type: Sequelize.FLOAT
        },
        venta_billetera_origen_id_fk: {
            type: Sequelize.INTEGER
        },
        metodo_pago: {
            type: Sequelize.STRING
        },
        estado: {
            type: Sequelize.STRING
        }
    });
    return Venta;
}