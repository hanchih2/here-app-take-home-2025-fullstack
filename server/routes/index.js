const attendanceRoute = require('./attendance.js'),
        logRoute = require('./log.js');


module.exports = function (app) {
    app.use('/attendance', attendanceRoute);
    app.use('/logs', logRoute);
};