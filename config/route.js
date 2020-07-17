const router = require('express').Router();
const monitorScheme = require('../schemes/monitor');

router.post("/monitor",monitorScheme.insertMonitorData);
router.get("/voltage/:lantai",monitorScheme.getVoltageDailyReport);

module.exports = router;