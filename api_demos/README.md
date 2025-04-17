# API demos

## Installing prereqs
```
npm install -g nodemon
npm install
```

## Running the server
```
npx nodemon run server.js
```

## Customer to Deliverer order communication
`/order`: sends an order (ingredients and id) in the body
`/order/accept`: used by deliverer to accept an order
`/orders/pending`: used by deliverer to poll pending orders
`/order/status/:id`: used by customer to track order status

## Future stuff
Currently testing on `localhost:3000`, will be ported over to vercel or some other free hosting platform which will allow for a designated URL to talk to rather than having to run the site and the server locally
