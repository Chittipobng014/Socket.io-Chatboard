var sql = {
    getIncompleteOrders: function () {
        var sql = "SELECT o.id, o.status, o.timestamp, o.customername, o.ordertype, o.branchtableid FROM orders o JOIN suborders s ON o.id=s.orderid WHERE s.branchid=$2 AND o.pageid=$1 AND o.status!='done' GROUP BY o.id"
        return sql
    },
    getTables: function () {
        var sql = "SELECT * FROM branchtables"
        return sql
    },
    getTable: function () {
        var sql = "SELECT b.tablename FROM branchtables b JOIN orders o ON b.id = o.branchtableid WHERE o.id=$1"
        return sql
    }
    ,
    getIncompleteSubs: function () {
        var sql = "SELECT s.id, s.productname, s.quantity, s.orderid FROM suborders s WHERE s.branchid=$2 AND s.pageid=$1 AND s.status!='done'"
        return sql
    },
    getNewOrder: function () {
        var sql = "SELECT o.id, o.status, o.timestamp, o.customername, o.ordertype, o.branchtableid FROM orders o JOIN suborders s ON o.id=s.orderid WHERE s.branchid=$2 AND o.pageid=$1 AND o.status!='done' AND o.id=$3 GROUP BY o.id"
        return sql
    },
    getNewSubs: function () {
        var sql = "SELECT s.productname, s.quantity, s.orderid FROM suborders s WHERE s.branchid=$2 AND s.pageid=$1 AND s.status!='done' AND s.orderid=$3"
        return sql
    },
    updateOrderStatus: function () {
        var sql = "UPDATE orders SET status=$4 WHERE pageid=$1 AND branchid=$2 AND id=$3"
        return sql
    },
    updateSubsStatus: function () {
        var sql = "UPDATE orders SET status=$4 WHERE pageid=$1 AND branchid=$2 AND orderid=$3"
        return sql
    }
}

module.exports = sql