const db = require('../config/dbConnection');

const insertMonitorData = (req,res) => {
    const voltage = Number(req.body.voltage);
    const current = Number(req.body.ampere);
    const activePower = Number(req.body.activePower);
    const reactivePower = Number(req.body.reactivePower);
    const apparentPower = Number(req.body.apparentPower);
    const powerFactor = Number(req.body.powerFactor);
    const frequency = Number(req.body.frequency);
    const totalEnergy = Number(req.body.activeEnergy);
    const reactiveEnergy = Number(req.body.reactiveEnergy);
    const lantai = req.body.lantai;

    db.query('INSERT INTO monitor_logs (voltage,current,active_power,reactive_power,apparent_power,power_factor,frequency,active_energy,reactive_energy,lantai) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[voltage,current,activePower,reactivePower,apparentPower,powerFactor,frequency,totalEnergy,reactiveEnergy,lantai],(err,result)=>{
        if(err){
            console.log(err)
            return res.status(500).send(err)
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
    db.query('SELECT current,created_on from monitor_logs WHERE created_on = current_date AND lantai = ?',[lantai],(err,results)=>{
        if(err){
            throw err;
        }
        res.status(200).send(results);
    });
}

const getActivePowerDailyReport = (req,res)=>{
    const lantai = req.params.lantai;
    db.query('SELECT active_power,created_on from monitor_logs WHERE created_on = current_date AND lantai = ?',[lantai],(err,results)=>{
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
    db.query(`SELECT total_energy,created_on from monitor_logs WHERE DATE(created_on) = current_date AND lantai = $1`,[lantai],(err,results)=>{ //
        if(err){
            throw err;
        }
        res.status(200).send(results.rows);
    });
}

const getReportByDate = (req,res) => {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    db.query(`SELECT * FROM monitor_logs WHERE DATE(created_on) >= $1 AND DATE(created_on) <= $2`,[startDate,endDate],(err,results)=>{
        if(err){
            console.log(err);
            res.status(400).send('error');
        }
        res.status(200).send(results.rows);
    })
}

const getMin = (req,res) => {
    const device = req.body.device;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const query = `WITH 
        lantai_var as (VAlUES('${device}')),
        start_date as (VALUES(TO_DATE('${startDate}','YYYY-MM-DD'))),
        end_date as (VALUES(TO_DATE('${endDate}','YYYY-MM-DD')))
        SELECT
            json_build_object('min',json_build_object('current', json_build_object('data', c.current, 'date', c.created_on),
                'voltage', json_build_object('data', v.voltage, 'date', v.created_on),
                'frequency', json_build_object('data', f.frequency, 'date', f.created_on),
                'activePower', json_build_object('data', av.active_power, 'date', av.created_on),
                'apparentPower', json_build_object('data', ap.apparent_power, 'date', ap.created_on),
                'reactivePower', json_build_object('data', rp.reactive_power, 'date', rp.created_on),
                'powerFactor', json_build_object('data', pf.power_factor, 'date', pf.created_on)
            )) as result
        from (
            SELECT lantai,current,created_on from monitor_logs
            where current=(select min(current) from monitor_logs 
            where lantai=(table lantai_var)) and 
            DATE(created_on)>=(table start_date) and DATE(created_on)<=(table end_date)
            order by created_on DESC
            LIMIT 1
        ) as c
        left join (
            SELECT lantai, voltage ,created_on from monitor_logs
            where voltage=(select min(voltage) from monitor_logs 
            where lantai=(table lantai_var)) and 
            DATE(created_on)>=(table start_date) and DATE(created_on)<=(table end_date)
            order by created_on DESC
            LIMIT 1
        ) v on v.lantai = c.lantai
        left join (
            SELECT lantai, frequency ,created_on from monitor_logs
            where frequency=(select min(frequency) from monitor_logs 
            where lantai=(table lantai_var)) and 
            DATE(created_on)>=(table start_date) and DATE(created_on)<=(table end_date)
            order by created_on DESC
            LIMIT 1
        ) f on f.lantai = c.lantai
        left join (
            SELECT lantai, active_power ,created_on from monitor_logs
            where active_power=(select min(active_power) from monitor_logs 
            where lantai=(table lantai_var)) and 
            DATE(created_on)>=(table start_date) and DATE(created_on)<=(table end_date)
            order by created_on DESC
            LIMIT 1
        ) av on av.lantai = c.lantai
        left join (
            SELECT lantai, apparent_power ,created_on from monitor_logs
            where apparent_power=(select min(apparent_power) from monitor_logs 
            where lantai=(table lantai_var)) and 
            DATE(created_on)>=(table start_date) and DATE(created_on)<=(table end_date)
            order by created_on DESC
            LIMIT 1
        ) ap on ap.lantai = c.lantai
        left join (
            SELECT lantai, reactive_power ,created_on from monitor_logs
            where reactive_power=(select min(reactive_power) from monitor_logs 
            where lantai=(table lantai_var)) and 
            DATE(created_on)>=(table start_date) and DATE(created_on)<=(table end_date)
            order by created_on DESC
            LIMIT 1
        ) rp on rp.lantai = c.lantai
        left join (
            SELECT lantai, power_factor ,created_on from monitor_logs
            where power_factor=(select min(power_factor) from monitor_logs 
            where lantai=(table lantai_var)) and 
            DATE(created_on)>=(table start_date) and DATE(created_on)<=(table end_date)
            order by created_on DESC
            LIMIT 1
        ) pf on pf.lantai = c.lantai`;

    db.query(query,(err,result)=>{
         if(err){
            console.log(err);
            return res.status(400).send('error');
        }
        if(result.rows.length === 0){
            return res.status(202).send('no data');
        }
        return res.status(200).send(result.rows[0].result);
    })
}

const getMax = (req,res) => {
    const device = req.body.device;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const query = `WITH 
        lantai_var as (VAlUES('${device}')),
        start_date as (VALUES(TO_DATE('${startDate}','YYYY-MM-DD'))),
        end_date as (VALUES(TO_DATE('${endDate}','YYYY-MM-DD')))
        SELECT
            json_build_object('max',json_build_object('current', json_build_object('data', c.current, 'date', c.created_on),
                'voltage', json_build_object('data', v.voltage, 'date', v.created_on),
                'frequency', json_build_object('data', f.frequency, 'date', f.created_on),
                'activePower', json_build_object('data', av.active_power, 'date', av.created_on),
                'apparentPower', json_build_object('data', ap.apparent_power, 'date', ap.created_on),
                'reactivePower', json_build_object('data', rp.reactive_power, 'date', rp.created_on),
                'powerFactor', json_build_object('data', pf.power_factor, 'date', pf.created_on)
            )) as result
        from (
            SELECT lantai,current,created_on from monitor_logs
            where current=(select max(current) from monitor_logs 
            where lantai=(table lantai_var)) and 
            DATE(created_on)>=(table start_date) and DATE(created_on)<=(table end_date)
            order by created_on DESC
            LIMIT 1
        ) as c
        left join (
            SELECT lantai, voltage ,created_on from monitor_logs
            where voltage=(select max(voltage) from monitor_logs 
            where lantai=(table lantai_var)) and 
            DATE(created_on)>=(table start_date) and DATE(created_on)<=(table end_date)
            order by created_on DESC
            LIMIT 1
        ) v on v.lantai = c.lantai
        left join (
            SELECT lantai, frequency ,created_on from monitor_logs
            where frequency=(select max(frequency) from monitor_logs 
            where lantai=(table lantai_var)) and 
            DATE(created_on)>=(table start_date) and DATE(created_on)<=(table end_date)
            order by created_on DESC
            LIMIT 1
        ) f on f.lantai = c.lantai
        left join (
            SELECT lantai, active_power ,created_on from monitor_logs
            where active_power=(select max(active_power) from monitor_logs 
            where lantai=(table lantai_var)) and 
            DATE(created_on)>=(table start_date) and DATE(created_on)<=(table end_date)
            order by created_on DESC
            LIMIT 1
        ) av on av.lantai = c.lantai
        left join (
            SELECT lantai, apparent_power ,created_on from monitor_logs
            where apparent_power=(select max(apparent_power) from monitor_logs 
            where lantai=(table lantai_var)) and 
            DATE(created_on)>=(table start_date) and DATE(created_on)<=(table end_date)
            order by created_on DESC
            LIMIT 1
        ) ap on ap.lantai = c.lantai
        left join (
            SELECT lantai, reactive_power ,created_on from monitor_logs
            where reactive_power=(select max(reactive_power) from monitor_logs 
            where lantai=(table lantai_var)) and 
            DATE(created_on)>=(table start_date) and DATE(created_on)<=(table end_date)
            order by created_on DESC
            LIMIT 1
        ) rp on rp.lantai = c.lantai
        left join (
            SELECT lantai, power_factor ,created_on from monitor_logs
            where power_factor=(select max(power_factor) from monitor_logs 
            where lantai=(table lantai_var)) and 
            DATE(created_on)>=(table start_date) and DATE(created_on)<=(table end_date)
            order by created_on DESC
            LIMIT 1
        ) pf on pf.lantai = c.lantai`;

    db.query(query,(err,result)=>{
         if(err){
            console.log(err);
            return res.status(400).send('error');
        }
        if(result.rows.length === 0){
            return res.status(202).send('no data')
        }
        res.status(200).send(result.rows[0].result);
    })
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
    getReportByDate,
    getMin,
    getMax,
}