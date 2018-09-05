var promise = require('bluebird');
var sql = require('./sql/sqlList')
var options = {
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connection = 'postgres://neetfoopxhpbdt:1e4b5acdc214f0f5732c58b097ef453104d207337cb483852782fc887d0f32fd@ec2-107-20-133-82.compute-1.amazonaws.com:5432/d6b6rk916vau3r?ssl=true';
var db = pgp(connection);

var quries = {
    incompleteOrders: async function (req, res, next) {
        try {
            var pageid = req.body.pageid.toString();;
            var branchid = req.body.branchid.toString();
            let data = {}
            console.log(pageid, branchid);
            let orders = await db.any(sql.getIncompleteOrders, [pageid, branchid]);
            let tables = await db.any(sql.getTables)
            let suborders = await db.any(sql.getIncompleteSubs, [pageid, branchid])
            data.orders = orders
            for (let i = 0; i < orders.length; i++) {                
                let suborder = suborders.filter((data) => {
                    return data.orderid == orders[i].id
                })
                let table = tables.filter((data) => {
                    return data.id == orders[i].branchtableid
                })
                if (table.length > 0) {
                    data.orders[i].table = table[0].tablename
                }
                data.orders[i].suborders = suborder
            }
            res.status(200).json({
                response: data
            })
        } catch (error) {
            return next(error)
        }
    },
    getNewOrder: async function (req, res, next) {
        try {
            var data = {};
            var pageid = req.body.pageid;
            var branchid = req.body.branchid;
            var orderid = req.body.orderid;
            let order = await db.one(sql.getNewOrder, [pageid, branchid, orderid]);
            let table = await db.one(sql.getTable, [orderid])
            let suborders = await db.any(sql.getNewSubs, [pageid, branchid, orderid]);
            data.order = order;
            data.order.table = table.tablename
            data.order.suborders = suborders;
            res.status(200).json({
                response: data
            })
        } catch (error) {
            return next(error)
        }
    },
    updateOrder: async function (req, res, next) {
        try {
            var pageid = req.body.pageid;
            var branchid = req.body.branchid;
            var orderid = req.body.orderid;
            var status = req.body.status;
            let updateorder = await db.none(sql.updateOrderStatus, [pageid, branchid, orderid, status])
            let updatesubs = await db.none(sql.updateSubsStatus, [pageid, branchid, orderid, status])
            res.status(200).json({
                response: 'Update Success'
            })
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = quries