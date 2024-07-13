const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos de usuarios y tokens para usuarios
db.usuarios = require("./usuario.model.js")(sequelize, Sequelize);
db.usuarioAuths = require("./usuarioAuth.model.js")(sequelize, Sequelize);

// Relaciones para usuarios y tokens de usuarios
db.usuarios.hasMany(db.usuarioAuths, { as: "tokens", foreignKey: "usuario_id" });
db.usuarioAuths.belongsTo(db.usuarios, { foreignKey: "usuario_id", as: "usuario" });

// Modelos de admins y tokens para admins
db.admins = require("./admin.model.js")(sequelize, Sequelize);
db.adminAuths = require("./adminAuth.model.js")(sequelize, Sequelize);

// Relaciones para admins y tokens de admins
db.admins.hasMany(db.adminAuths, { as: "tokens", foreignKey: "admin_id" });
db.adminAuths.belongsTo(db.admins, { foreignKey: "admin_id", as: "admin" });

// Modelo de monedas
db.monedas = require("./moneda.model.js")(sequelize, Sequelize);

// Modelo de billeteras
db.billeteras = require("./billetera.model.js")(sequelize, Sequelize);
db.usuarios.hasMany(db.billeteras, { as: "billeteras", foreignKey: "billetera_usuario_id" });
db.billeteras.belongsTo(db.usuarios, { foreignKey: "billetera_usuario_id", as: "usuario" });

db.monedas.hasMany(db.billeteras, { as: "billeteras", foreignKey: "billetera_moneda_id" });
db.billeteras.belongsTo(db.monedas, { foreignKey: "billetera_moneda_id", as: "moneda" });

// Modelo tarjeta
db.tarjetas = require("./tarjeta.model.js")(sequelize, Sequelize);
db.usuarios.hasMany(db.tarjetas, { as: "tarjetas", foreignKey: "tarjeta_usuario_id" });
db.tarjetas.belongsTo(db.usuarios, { foreignKey: "tarjeta_usuario_id", as: "usuario" });

// Modelo movimientos
db.movimientos = require("./movimiento.model.js")(sequelize, Sequelize);
db.billeteras.hasMany(db.movimientos, { as: "movimientos_origen", foreignKey: "movimiento_billetera_origen_id" });
db.movimientos.belongsTo(db.billeteras, { foreignKey: "movimiento_billetera_origen_id", as: "billetera_origen" });

db.billeteras.hasMany(db.movimientos, { as: "movimientos_destino", foreignKey: "movimiento_billetera_destino_id" });
db.movimientos.belongsTo(db.billeteras, { foreignKey: "movimiento_billetera_destino_id", as: "billetera_destino" });

// Modelo cuentas bancarias
db.cuentasBancarias = require("./cuentaBancaria.model.js")(sequelize, Sequelize);
db.usuarios.hasMany(db.cuentasBancarias, { as: "cuentasBancarias", foreignKey: "usuario_id_fk" });
db.cuentasBancarias.belongsTo(db.usuarios, { foreignKey: "usuario_id_fk", as: "usuario" });

db.monedas.hasMany(db.cuentasBancarias, { as: "cuentasBancarias", foreignKey: "moneda_id_fk" });
db.cuentasBancarias.belongsTo(db.monedas, { foreignKey: "moneda_id_fk", as: "moneda" });

// Modelo beneficiarios
db.beneficiarios = require("./beneficiario.model.js")(sequelize, Sequelize);
db.usuarios.hasMany(db.beneficiarios, { as: "beneficiarios", foreignKey: "usuario_id_fk" });
db.beneficiarios.belongsTo(db.usuarios, { foreignKey: "usuario_id_fk", as: "usuario" });

db.billeteras.hasMany(db.beneficiarios, { as: "beneficiarios", foreignKey: "codigo_billetera_fk", sourceKey: "id" });
db.beneficiarios.belongsTo(db.billeteras, { foreignKey: "codigo_billetera_fk", targetKey: "id", as: "billetera" });

// Modelo de ventas
db.ventas = require("./ventas.model.js")(sequelize, Sequelize);
db.monedas.hasMany(db.ventas, { as: "venta", foreignKey: "venta_moneda_id_fk" });
db.ventas.belongsTo(db.monedas, { foreignKey: "venta_moneda_id_fk", as: "moneda" });

db.billeteras.hasMany(db.ventas, { as: "venta", foreignKey: "venta_billetera_origen_id_fk" });
db.ventas.belongsTo(db.billeteras, { foreignKey: "venta_billetera_origen_id_fk", as: "billetera" });

module.exports = db;
