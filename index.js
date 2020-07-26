const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const port = 8088;
const route = require('./config/route');

app.use(express.static('public'))
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));
app.use(route);

http.listen(port,()=>{
    console.log('Server start at: ' + port);
})