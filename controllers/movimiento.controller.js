
const db = require("../models");
const { checkRequiredFields, sendError500 } = require("../utils/request.utils");

exports.listMovimientos = async (req, res) => {
    try {
        const movimientos = await db.movimientos.findAll();
        res.send(movimientos);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.getMovimiento = async (req, res) => {
    const id = req.params.id;
    try {
        const movimiento = await db.movimientos.findByPk(id);
        if (!movimiento) {
            res.status(404).send({ message: "Movimiento no encontrado" });
            return;
        }
        res.send(movimiento);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.createMovimiento = async (req, res) => {
    const { descripcion, monto, tipo_transaccion, movimiento_billetera_origen_id, movimiento_billetera_destino_id } = req.body;
    const requiredFields = ["descripcion", "monto", "tipo_transaccion"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
        });
        return;
    }

    try {
        if (tipo_transaccion === 'Transferencia') {
            const beneficiarioIdMatch = descripcion.match(/beneficiario:(\d+)/);
            const usuario_id_fk = beneficiarioIdMatch ? beneficiarioIdMatch[1] : null;
            
            console.log("usuario_id_fk backend:", usuario_id_fk);
            const beneficiario = await db.beneficiarios.findByPk(usuario_id_fk);
            console.log("beneficiario backend check", beneficiario);
            if (!beneficiario) {
                res.status(404).send({ message: "Beneficiario no encontrado" });
                console.log("beneficiario backend check", beneficiario);
                return;
            }
            console.log("billetera destino backend check", movimiento_billetera_destino_id);
            const billeteraDestino = await db.billeteras.findByPk(movimiento_billetera_destino_id);
            if (!billeteraDestino) {
                res.status(404).send({ message: "Billetera destino no encontrada" });
                return;
            }

            const billeteraOrigen = await db.billeteras.findOne({
                where: {
                    id: movimiento_billetera_origen_id,
                }
            });
            if (!billeteraOrigen) {
                res.status(404).send({ message: "Billetera origen no encontrada" });
                return;
            }
    
            if (billeteraOrigen.saldo < parseFloat(monto)) {
                res.status(400).send({ message: "Saldo insuficiente en la billetera de origen" });
                return;
            }
    
            // Realizar la transferencia
            billeteraOrigen.saldo -= parseFloat(monto);
            billeteraDestino.saldo += parseFloat(monto);
    
            await billeteraOrigen.save();
            await billeteraDestino.save();
    
            // Crear movimientos de egreso e ingreso
            const movimientoEgreso = await db.movimientos.create({
                descripcion,
                movimiento_billetera_origen_id: movimiento_billetera_origen_id,
                monto,
                tipo_transaccion: 'Transferencia - Egreso',
                movimiento_billetera_destino_id: billeteraDestino.id,
            });
    
            const movimientoIngreso = await db.movimientos.create({
                descripcion,
                monto,
                tipo_transaccion: 'Transferencia - Ingreso',
                movimiento_billetera_id: billeteraDestino.id,
                referencia_id: movimientoEgreso.id,
            });
    
            res.send({ movimientoEgreso, movimientoIngreso });
        } else {
            // Lógica para depósito y retiro (ya implementada en tu código existente)
            const billetera = await db.billeteras.findByPk(req.body.movimiento_billetera_destino_id);
            if (!billetera) {
                res.status(404).send({ message: "Billetera no encontrada" });
                return;
            }
    
            if (tipo_transaccion === "Ingreso") {
                billetera.saldo += parseFloat(monto);
            } else if (tipo_transaccion === "Egreso") {
                if (billetera.saldo < parseFloat(monto)) {
                    res.status(400).send({ message: "Saldo insuficiente" });
                    return;
                }
                billetera.saldo -= parseFloat(monto);
            } else {
                res.status(400).send({ message: "Tipo de transacción inválido" });
                return;
            }
    
            await billetera.save();
            const movimiento = await db.movimientos.create(req.body);
            res.send(movimiento);
        }
    } catch (error) {
        sendError500(res, error);
    }
};

exports.updateMovimiento = async (req, res) => {
    const id = req.param.id;
    try {
        const movimiento = await db.movimientos.findByPk(id);
        if (!movimiento) {
            res.status(404).send({ message: "Movimiento no encontrado" });
            return;
        }
        if (req.method === "PUT") {
            const requiredFields = ["descripcion", "movimiento_billetera_origen_id", "monto",
                "tipo_transaccion", "movimiento_billetera_destino_id"];
            const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
            if (fieldsWithErrors.length > 0) {
                res.status(400).send({
                    message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
                });
                return;
            }
            await movimiento.update(req.body);
            res.send(movimiento);
        }
    } catch (error) {
        sendError500(res, error);
    }
}

exports.deleteMovimiento = async (req, res) => {
    const id = req.params.id;
    try {
        const movimiento = await db.movimientos.findByPk(id);
        if (!movimiento) {
            res.status(404).send({ message: "Movimiento no encontrado" });
            return;
        }
        await movimiento.destroy();
        res.send({ message: "Movimiento eliminado" });
    } catch (error) {
        sendError500(res, error);
    }
}

exports.getMovimientosByBilleteraId = async (req, res) => {
    try {
        const movimientos = await db.movimientos.findAll({
            where: { movimiento_billetera_origen_id: req.params.billeteraId },
                order: [["createdAt", "DESC"]],
            });
            if(!movimientos) {
                res.status(404).send({ message: "Movimientos no encontrados" });
                return;
            }
            res.send(movimientos);
    } catch (error) {
        sendError500(res, error);
    }
}
