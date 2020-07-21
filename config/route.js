const router = require('express').Router();
const monitorScheme = require('../schemes/monitor');

router.post("/monitor",monitorScheme.insertMonitorData);
router.get("/daily/voltage/:lantai",monitorScheme.getVoltageDailyReport);
router.get("/daily/voltage/:lantai",monitorScheme.getVoltageDailyReport);
router.get("/daily/voltage/:lantai",monitorScheme.getVoltageDailyReport);
router.get("/daily/voltage/:lantai",monitorScheme.getVoltageDailyReport);
router.get("/daily/voltage/:lantai",monitorScheme.getVoltageDailyReport);
router.get("/",function(req,res){
    res.status(200).send('Home');
})

module.exports = router;