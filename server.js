const path = require('path');
const https = require('https');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('res'));

app.get('/', function(req, res) {
 res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('paystack.js', function(req, res) {
 let { email, amount } = req.body;
 
 function payWithPaystack(e) {
  e.preventDefault();
 
  let handler = PaystackPop.setup({
   key: 'pk_test_xxxxxxxxxx', // Replace with your public key
   email,
   amount: amount * 100,
  // ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
   // label: "Optional string that replaces customer email"
   onClose: function() {
    alert('Window closed.');
   },
   callback: function(response) {
    let message = 'Payment complete! Reference: ' + response.reference;
    alert(message);
   }
  });
 
  handler.openIframe();
 }
 https.get('', res => {
  let data = [];
  const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
  console.log('Status Code:', res.statusCode);
  console.log('Date in Response header:', headerDate);

  res.on('data', chunk => data.push(chunk));

  res.on('end', () => {
   console.log('Response ended: ');
   const users = JSON.parse(Buffer.concat(data).toString());

   for (user of users) {
    console.log(`Got user with id: ${user.id}, name: ${user.name}`);
   }
  });
 }).on('error', err => {
  console.log('Error: ', err.message);
 });
});

app.listen(port, (err) => {
 if (err) {
  console.error("Error connecting to port " + PORT);
  return;
 }
 console.log(`Listening on port ${port}!`);
});