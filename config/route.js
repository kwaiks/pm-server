const router = require('express').Router();
const monitorScheme = require('../schemes/monitor');

router.post("/monitor",monitorScheme.insertMonitorData);
router.get("/daily/voltage/:lantai",monitorScheme.getVoltageDailyReport);
router.get("/daily/energy/:lantai",monitorScheme.getTotalEnergyDailyReport);
router.post("/report",monitorScheme.getReportByDate);

module.exports = router;