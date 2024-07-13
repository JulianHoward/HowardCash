
module.exports = (sequelize, Sequelize) => {
    const Tarjeta = sequelize.define("tarjeta", {
        tarjeta_usuario_id: {
            type: Sequelize.INTEGER
        },
        numero: {
            type: Sequelize.STRING
        },
        cvv: {
            type: Sequelize.STRING
        },
        fecha_vencimiento: {
            type: Sequelize.STRING
        }
    });
    return Tarjeta;
}