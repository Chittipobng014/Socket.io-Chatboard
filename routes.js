var router = require('express').Router();
var db = require('./api/quries');
var path = require('path');

router.post('/getorders', db.incompleteOrders)
router.post('/getneworder', db.getNewOrder)
router.post('/updatestatus', db.updateOrder)


router.get('/chat', function (req, res) {
    res.sendfile(path.resolve(__dirname, './static/index.html'));
});


module.exports = router