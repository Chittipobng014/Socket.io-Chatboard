const promise = require('bluebird');
const sql = require('./sql/sqlList')
const options = {
    promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connection = 'postgres://neetfoopxhpbdt:1e4b5acdc214f0f5732c58b097ef453104d207337cb483852782fc887d0f32fd@ec2-107-20-133-82.compute-1.amazonaws.com:5432/d6b6rk916vau3r?ssl=true';
const db = pgp(connection);

module.exports = quries = {
    incompleteOrders: async (req, res, next) => {
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
                    return { ...order, suborders: suborderData, table }
                }
                return { ...order, suborders: suborderData }
            })
            res.status(200).json({
                response: { orders: ordersData }
            })
        } catch (error) {
            return next(error)
        }
    },
    getNewOrder: async (req, res, next) => {
        try {
            const pageid = req.body.pageid.toString();
            const branchid = req.body.branchid.toString();
            const orderid = req.body.orderid.toString();
            const order = await db.any(sql.getNewOrder, [pageid, branchid, orderid]);
            console.log(order);
            //const table = await db.one(sql.getTable, [orderid]);
            const tables = await db.any(sql.getTables)
            const suborders = await db.any(sql.getNewSubs, [pageid, branchid, orderid]);
            const tableData = tables.filter((table) => table.id == order.branchtableid)
            if (tableData.length > 0) {
                const table = tableData[0].tablename
                const data = { ...order, suborders, table }
                res.status(200).json({ response: { order: data } })
            }
            const data = { ...order, suborders }
            res.status(200).json({ response: { order: data } })
        } catch (error) {
            return next(error)
        }
    },
    updateOrder: async (req, res, next) => {
        try {
            const pageid = req.body.pageid.toString();
            const orderid = req.body.orderid.toString();
            const status = req.body.status.toString();
            //const updateorder = await db.none(sql.updateOrderStatus, [pageid, branchid, orderid, status])            
            const updateorder = await db.none(sql.updateOrderStatus, [pageid, orderid, status])
            const updatesubs = await db.none(sql.updateSubsStatus, [pageid, orderid, status])
            res.status(200).json({
                response: 'Update Success'
            })
        } catch (error) {
            return next(error)
        }
    },
    getOrders: async (req, res, next) => {
        try {
            const orders = await db.any(sql.orders);
            res.status(200).json({
                response: orders
            })
        } catch (error) {
            return next(error)
        }
    }
};
