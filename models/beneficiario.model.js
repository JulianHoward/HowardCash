
module.exports = (sequelize, Sequelize) => {
    const Beneficiario = sequelize.define("beneficiario", {
        usuario_id_fk: {
            type: Sequelize.INTEGER
        },
        nombre_referencia: {
            type: Sequelize.STRING
        },
        codigo_billetera_fk: {
            type: Sequelize.INTEGER
        }
    });
    return Beneficiario;
}
