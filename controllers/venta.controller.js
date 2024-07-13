
const db = require("../models");
const { checkRequiredFields, sendError500 } = require("../utils/request.utils");

exports.listVentas = async (req, res) => {
    try {
        const ventas = await db.ventas.findAll();
        res.send(ventas);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.getVenta = async (req, res) => {
    const id = req.params.id;
    try {
        const venta = await db.ventas.findByPk(id);
        if (!venta) {
            res.status(404).send({ message: "Venta no encontrada" });
            return;
        }
        res.send(venta);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.createVenta = async (req, res) => {
    const requiredFields = ["venta_moneda_id_fk", "valor_venta", "monto", "venta_billetera_origen_id_fk"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
        });
        return;
    }
    try {
        const venta = await db.ventas.create(req.body);
        res.send(venta);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.updateVenta = async (req, res) => {
    const id = req.param.id;

    const requiredFields = ["venta_moneda_id_fk", "valor_venta", "monto", "venta_billetera_origen_fk_id"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
        });
        return;
    }

    try {
        const venta = await db.ventas.update(req.body, { where: { id: id } });
        res.send(venta);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.deleteVenta = async (req, res) => {
    const id = req.params.id;
    try {
        const venta = await db.ventas.findByPk(id);
        if (!venta) {
            res.status(404).send({ message: "Venta no encontrada" });
            return;
        }
        await venta.destroy();
        res.send({ message: "Venta eliminada" });
    } catch (error) {
        sendError500(res, error);
    }
}

exports.getVentasPendientes = async (req, res) => {
    try {
        const ventas = await db.ventas.findAll({ where: { estado: "Pendiente" } });
        console.log('Pending sales:', ventas);
        res.status(200).send(ventas);
    } catch (error) {
        console.error('Error fetching pending sales:', error);
        sendError500(res, error);
    }
}

exports.iniciarCompra = async (req, res) => {
    const { id } = req.body;
    const recibo = req.file;

    try {
        const venta = await db.ventas.findByPk(id);
        if (!venta) {
            res.status(404).send({ message: "Venta no encontrada" });
            return;
        }
        if (venta.estado !== "Pendiente") {
            res.status(400).send({ message: "La venta ya fue procesada" });
            return;
        }
        venta.estado = "En validación";
        venta.recibo = recibo.path;
        await venta.save();
        res.send(venta);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.confirmarVenta = async (req, res) => {
    const { id, venta_billetera_destino_fk_id } = req.body;
    try {
        const venta = await db.ventas.findByPk(id);
        if(!venta) {
            res.status(404).send({ message: "Venta no encontrada" });
            return;
        }
        if(venta.estado !== "En validación") {
            res.status(400).send({ message: "La venta no está en estado de validación" });
            return;
        }
        const movimeintoEgreso = await db.movimientos.create({
            descripcion: "Venta de moneda",
            movimiento_billetera_origen_id: venta.venta_billetera_origen_fk_id,
            monto: venta.monto,
            tipo_transaccion: "Egreso",
            movimiento_billetera_destino_id: venta_billetera_destino_fk_id
        });

        const movimientoIngreso = await db.movimientos.create({
            descripcion: "Venta de moneda",
            movimiento_billetera_origen_id: venta.venta_billetera_origen_fk_id,
            monto: venta.monto,
            tipo_transaccion: "Ingreso",
            movimiento_billetera_destino_id: venta_billetera_destino_fk_id
        });
        venta.estado = "Vendida";
        await venta.save();
        res.send({venta, movimeintoEgreso, movimientoIngreso});
    } catch (error) {
        sendError500(res, error);
    }
}
