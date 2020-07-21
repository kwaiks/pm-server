const db = require('../config/dbConnection');

const insertMonitorData = (req,res) => {
    const voltage = req.body.voltage;
    const current = Number(req.body.current);
    const activePower = Number(req.body.activePower);
    const reactivePower = Number(req.body.reactivePower);
    const apparentPower = Number(req.body.apparentPower);
    const powerFactor = Number(req.body.powerFactor);
    const frequency = Number(req.body.frequency);
    const totalEnergy = Number(req.body.totalEnergy);
    const energyBill = Number(req.body.energyBill);
    const lantai = req.body.lantai;

    db.query('INSERT INTO monitor_logs (voltage,current,active_power,reactive_power,apparent_power,power_factor,frequency,total_energy,energy_bill,lantai) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[voltage,current,activePower,reactivePower,apparentPower,powerFactor,frequency,totalEnergy,energyBill,lantai],(err,result)=>{
        if(err){
            throw err;
        }
        res.status(200).send('Sent');
    });
}

const getVoltageDailyReport = (req,res)=>{
    const lantai = req.params.lantai;
    db.query(`SELECT voltage,created_on from monitor_logs WHERE DATE(created_on) = current_date AND lantai = $1`,[lantai],(err,results)=>{ //
        if(err){
            throw err;
        }
        res.status(200).send(results.rows);
    });
}

const getCurrentDailyReport = (req,res)=>{
    const lantai = req.params.lantai;
    db.query('SELECT current,created_on from monitor_logs WHERE created_on = current_date() AND lantai = ?',[lantai],(err,results)=>{
        if(err){
            throw err;
        }
        res.status(200).send(results);
    });
}

const getActivePowerDailyReport = (req,res)=>{
    const lantai = req.params.lantai;
    db.query('SELECT active_power,created_on from monitor_logs WHERE created_on = current_date() AND lantai = ?',[lantai],(err,results)=>{
        if(err){
            throw err;
        }
        res.status(200).send(results);
    });
}

const getReactivePowerDailyReport = (req,res)=>{
    const lantai = req.params.lantai;
    db.query('SELECT reactive_power,created_on from monitor_logs WHERE created_on = current_date() AND lantai = ?',[lantai],(err,results)=>{
        if(err){
            throw err;
        }
        res.status(200).send(results);
    });
}

const getApparentPowerDailyReport = (req,res)=>{
    const lantai = req.params.lantai;
    db.query('SELECT apparent_power,created_on from monitor_logs WHERE created_on = current_date() AND lantai = ?',[lantai],(err,results)=>{
        if(err){
            throw err;
        }
        res.status(200).send(results);
    });
}

const getPowerFactorDailyReport = (req,res)=>{
    const lantai = req.params.lantai;
    db.query('SELECT power_factor,created_on from monitor_logs WHERE created_on = current_date() AND lantai = ?',[lantai],(err,results)=>{
        if(err){
            throw err;
        }
        res.status(200).send(results);
    });
}

const getTotalEnergyDailyReport = (req,res)=>{
    const lantai = req.params.lantai;
    db.query('SELECT voltage,created_on from monitor_logs WHERE created_on = current_date() AND lantai = ?',[lantai],(err,results)=>{
        if(err){
            throw err;
        }
        res.status(200).send(results);
    });
}


module.exports ={
    insertMonitorData,
    getVoltageDailyReport,
    getCurrentDailyReport,
    getActivePowerDailyReport,
    getReactivePowerDailyReport,
    getApparentPowerDailyReport,
    getPowerFactorDailyReport,
    getTotalEnergyDailyReport,
}