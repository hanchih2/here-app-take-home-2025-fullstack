const attendance = require('../models/attendance');

var express = require('express'),
    router = express.Router(),
    Attendance = require('../models/attendance');

baseRoute = router.route('/')

baseRoute.post(validNewAttendanceData, async function (req, res) {
    try{
        const attendance = new Attendance({
            uin: req.body.uin,
            classId: req.body.classId,
            date: req.body.date,
            takenBy: req.body.takenBy
        })
        const newAttendance = await attendance.save();
        res.status(201).json({
            message: 'attendance taken',
            data: newAttendance
        });
    } catch(e) {
        res.status(500).json({ message: "An unexpected error has occurred in processing the request."});
    }
});

async function validNewAttendanceData(req, res, next){
    var valid = true
    if(req.body.uin == null || req.body.uin == ''){
        valid = false
    }
    if(req.body.classId == null || req.body.classId == ''){
        valid = false
    }
    if(req.body.date == null){
        valid = false
    }
    if(req.body.takenBy == null || req.body.takenBy == ''){
        valid = false
    }
    if (!valid) {
        return res.status(400).json({message: 'task.name and task.deadline required.'});
    }
    next();
}

module.exports = router;