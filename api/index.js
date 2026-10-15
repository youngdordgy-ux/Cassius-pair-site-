const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
  <html><head><title>CASSIUS PK</title>
  <style>
  body{background:#000;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif}
  .box{background:#111;padding:30px;border-radius:15px;border:1px solid #00ff88;text-align:center}
  input{padding:12px;width:250px;border-radius:8px;border:none;margin:10px 0}
  button{background:#00ff88;padding:12px 20px;border:none;border-radius:8px;font-weight:bold}
  </style></head>
  <body><div class="box">
  <h2>CASSIUS PK</h2>
  <h4>CASSIUS TECH PROS PAIR SITE</h4>
  <form method="POST" action="/pair">
  <input name="number" placeholder="Enter WhatsApp number with country code" required><br>
  <button type="submit">GET PAIR CODE</button>
  </form></div></body></html>
  `);
});

app.post('/pair', async (req, res) => {
  // your pairing logic here
  const num = req.body.number;
  res.send(`<h2 style="color:#00ff88">Pair code requested for ${num} - Add your Baileys logic here</h2><a href="/">Back</a>`);
});

module.exports = app;
