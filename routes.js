const router = require('express').Router();
const db = require('./api/quries');
const path = require('path');

router.post('/orders', db.incompleteOrders)
router.post('/neworder', db.getNewOrder)
router.post('/updatestatus', db.updateOrder)
router.post('/testorder', db.getOrders)


router.get('/chat', (req, res) => {
    res.sendfile(path.resolve(__dirname, './static/index.html'));
});


module.exports = router