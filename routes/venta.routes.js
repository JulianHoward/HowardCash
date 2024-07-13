
const { checkUserMiddleware } = require('../middlewares/check-user.middleware.js');

module.exports = app => {
    const controller = require('../controllers/venta.controller');
    let router = require('express').Router();

    router.get('/', checkUserMiddleware, controller.listVentas);
    //router.get('/:id', checkUserMiddleware, controller.getVenta);
    router.post('/', checkUserMiddleware, controller.createVenta);
    router.put('/:id', checkUserMiddleware, controller.updateVenta);
    router.patch('/:id', checkUserMiddleware, controller.updateVenta);
    router.delete('/:id', checkUserMiddleware, controller.deleteVenta);
    router.get('/pendientes', checkUserMiddleware, controller.getVentasPendientes);

    app.use('/api/ventas', router);
}
