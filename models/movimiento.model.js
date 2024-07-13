
module.exports = (sequelize, Sequelize) => {
    const Movimiento = sequelize.define("movimiento", {
        descripcion: {
            type: Sequelize.STRING
        },
        movimiento_billetera_origen_id: {
            type: Sequelize.INTEGER
        },
        monto: {
            type: Sequelize.FLOAT
        },
        tipo_transaccion: {
            type: Sequelize.STRING
        },
        movimiento_billetera_destino_id: {
            type: Sequelize.INTEGER
        }
    });
    return Movimiento;
}
