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
  <h2>INSTALL</h2>
    npm install vue-socket.io --save
    
    https://socketio-chatboard-tutorial.herokuapp.com/   
    
  <h2>EMIT</h2>
    !TO GET JOIN THE SERVER
    <p>subscribe</p>
    
  <h2>ON</h2>
  !TO GET NOTIFICATION IF NEW ORDER COMING
  <p>incoming-order</p>
