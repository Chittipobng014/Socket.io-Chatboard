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
            const pageid = req.body.pageid.toString();;
            const branchid = req.body.branchid.toString();
            const orders = await db.any(sql.getIncompleteOrders, [pageid, branchid]);
            const tables = await db.any(sql.getTables)
            const suborders = await db.any(sql.getIncompleteSubs, [pageid, branchid])
            const ordersData = orders.map(order => {
                const suborderData = suborders.filter((suborder) => suborder.orderid == order.id)
                const tableData = tables.filter((table) => table.id == order.branchtableid)
                if (tableData.length > 0) {
                    const table = tableData[0].tablename
                    return { ...order, suborderData, table }
                }
                return { ...order, suborderData }
            })
            res.status(200).json({
                response: { orders: ordersData }
            })
        } catch (error) {
            return next(error)
        }
    },
    getNewOrder: async function (req, res, next) {
        try {
            const pageid = req.body.pageid.toString();
            const branchid = req.body.branchid.toString();
            const orderid = req.body.orderid.toString();
            const order = await db.one(sql.getNewOrder, [pageid, branchid, orderid]);
            const table = []
            const suborders = await db.any(sql.getNewSubs, [pageid, branchid, orderid]);
            if (table.length > 0) {
                const data = { order, suborders }
                res.status(200).json({ response: data })
            }
            const data = { order: { order, suborders, table } }
            res.status(200).json({ response: data })
        } catch (error) {
            return next(error)
        }
    },
    updateOrder: async function (req, res, next) {
        try {
            const pageid = req.body.pageid;
            const branchid = req.body.branchid;
            const orderid = req.body.orderid;
            const status = req.body.status;
            const updateorder = await db.none(sql.updateOrderStatus, [pageid, branchid, orderid, status])
            const updatesubs = await db.none(sql.updateSubsStatus, [pageid, branchid, orderid, status])
            res.status(200).json({
                response: 'Update Success'
            })
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = quries