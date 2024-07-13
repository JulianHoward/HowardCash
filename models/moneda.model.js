
module.exports = (sequelize, Sequelize) => {
    const Moneda = sequelize.define("moneda", {
        nombre: {
            type: Sequelize.STRING
        },
        simbolo: {
            type: Sequelize.STRING
        },
        valor_usd: {
            type: Sequelize.FLOAT
        }
    });
    return Moneda;
}
