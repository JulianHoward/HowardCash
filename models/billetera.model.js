
module.exports = (sequelize, Sequelize) => {
    const Billetera = sequelize.define("billetera", {
        billetera_usuario_id: {
            type: Sequelize.INTEGER
        },
        billetera_moneda_id: {
            type: Sequelize.INTEGER
        },
        saldo: {
            type: Sequelize.FLOAT
        },
        codigo_uuid: {
            type: Sequelize.STRING,
            unique: true
        }
    });
    return Billetera;
}
