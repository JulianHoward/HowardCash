
module.exports = (sequelize, Sequelize) => {
    const CuentaBancaria = sequelize.define("cuentaBancaria", {
        usuario_id_fk: {
            type: Sequelize.INTEGER
        },
        numero_cuenta: {
            type: Sequelize.STRING
        },
        nombre_titular: {
            type: Sequelize.STRING
        },
        documento_identidad: {
            type: Sequelize.STRING
        },
        banco: {
            type: Sequelize.STRING
        },
        moneda_id_fk: {
            type: Sequelize.INTEGER
        }
    });
    return CuentaBancaria;
}
