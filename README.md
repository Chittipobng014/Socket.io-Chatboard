# Test API

<h1>POST</h1>
  <h2>TO GET INCOMPLETE ORDERS</h2>
    • /api/orders
      body: {
        pageid: pageid,
        branchid: branchid
      }
      
  <h2>TO GET NEW ORDER</h2>
    • /api/neworder
      body: {
        pageid: pageid,
        branchid: branchid,
        orderid: orderid
      }
      
  <h2>TO UPDATE ORDER STATUS</h2>    
    • /api/updatestatus
      body: {
        pageid: pageid,
        branchid: branchid,
        orderid: orderid
      }

<h1>SOCKET</h1>
 
