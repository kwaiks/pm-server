const db = require('../config/dbConnection');

const insertControl = (req,res) => {
    const device = req.body.device;
    const lantai = req.body.lantai;
    const status = req.body.status;

    db.query('INSERT INTO control_logs (device,lantai,status) VALUES(?,?,?)',[device,lantai,status],(err,result)=>{
        if(err){
            throw err;
        }
        res.send(200);
    });
}