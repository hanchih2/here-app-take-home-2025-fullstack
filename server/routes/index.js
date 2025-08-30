const attendanceRoute = require('./attendance.js');

module.exports = function (app) {
    app.use('/attendance', attendanceRoute);
};