
const { checkUserMiddleware } = require('../middlewares/check-user.middleware.js');

module.exports = app => {
    const controller = require('../controllers/beneficiario.controller');
    let router = require('express').Router();

    router.get('/', checkUserMiddleware, controller.listBeneficiarios);
    router.get('/:id', checkUserMiddleware, controller.getBeneficiario);
    router.post('/', checkUserMiddleware, controller.createBeneficiario);
    router.put('/:id', checkUserMiddleware, controller.updateBeneficiario);
    router.patch('/:id', checkUserMiddleware, controller.updateBeneficiario);
    router.delete('/:id', checkUserMiddleware, controller.deleteBeneficiario);

    app.use('/api/beneficiarios', router);
}
