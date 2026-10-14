const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const pino = require('pino');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// === FRONTEND WEBSITE ===
app.get('/', (req, res) => {
res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CASSIUS TECH PROS - Pair Site</title>
<style>
body{background:#0a0a0a;color:white;font-family:Arial;text-align:center;padding:20px}
.box{background:#1a1a1a;padding:25px;border-radius:15px;max-width:400px;margin:20px auto;border:1px solid #333}
input{width:90%;padding:15px;border-radius:10px;border:none;margin:10px 0;font-size:16px}
button{width:95%;padding:15px;background:#00ff88;color:black;font-weight:bold;border:none;border-radius:10px;font-size:18px;cursor:pointer}
h1{color:#00ff88}
.code{font-size:32px;letter-spacing:5px;background:black;padding:15px;border-radius:10px;margin:15px 0;color:#00ff88;font-weight:bold}
</style>
</head>
<body>
<h1>CASSIUS-PK</h1>
<h3>CASSIUS TECH PROS PAIR SITE</h3>
<div class="box">
<p>Enter Your WhatsApp Number with Country Code</p>
<p style="font-size:12px;color:gray">e.g 27821234567 (no + or spaces)</p>
<input id="num" placeholder="27821234567">
<button onclick="getCode()">GET PAIRING CODE</button>
<div id="result"></div>
<p id="msg" style="color:gray;margin-top:15px"></p>
</div>
<script>
async function getCode(){
let number = document.getElementById('num').value;
if(!number){alert('Enter number');return}
document.getElementById('result').innerHTML='Generating... Please wait 15 seconds...';
document.getElementById('msg').innerText='';
try{
let res = await fetch('/code?number='+number);
let data = await res.json();
if(data.code){
document.getElementById('result').innerHTML='<div class="code">'+data.code+'</div><p>Copy this code and go to WhatsApp > Linked Devices > Link with phone number</p>';
}else{
document.getElementById('result').innerHTML='Error: '+(data.error||'Failed');
}
}catch(e){
document.getElementById('result').innerHTML='Server Error - Try again';
}
}
</script>
<p style="margin-top:30px">Powered by <b>CASSIUS TECH PROS</b><br>youngdordgy-ux</p>
</body>
</html>
`);
});

// === BACKEND PAIRING LOGIC ===
app.get('/code', async (req, res) => {
let num = req.query.number;
if(!num){return res.json({error:'No number'})}
num = num.replace(/[^0-9]/g,'');
let dir = './auth_'+num;
if(fs.existsSync(dir)){fs.rmSync(dir,{recursive:true,force:true})}
try{
const { state, saveCreds } = await useMultiFileAuthState(dir);
let sock = makeWASocket({
auth: {creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'}))},
printQRInTerminal: false,
logger: pino({level:'silent'}),
browser: ['CASSIUS-PK','Chrome','1.0']
});
sock.ev.on('creds.update', saveCreds);
if(!sock.authState.creds.registered){
let code = await sock.requestPairingCode(num);
console.log('Code for '+num+': '+code);
res.json({code: code});
setTimeout(()=>{try{fs.rmSync(dir,{recursive:true,force:true})}catch{};try{sock.ws.close()}catch{}},30000);
}else{
res.json({error:'Already registered'});
}
}catch(e){
console.log(e);
res.json({error:e.message});
}
});

app.listen(PORT, ()=>console.log('CASSIUS Pair Site running on '+PORT));
module.exports = app;
