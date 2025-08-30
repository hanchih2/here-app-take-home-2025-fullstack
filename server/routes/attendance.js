const attendance = require('../models/attendance');

var express = require('express'),
    router = express.Router(),
    Attendance = require('../models/attendance');

baseRoute = router.route('/')

baseRoute.post(validNewAttendanceData, async function (req, res) {
    try{
        let id = req.body.id
        if (id != null || id != "") {
            // find attendance by Id
            const oldAttendance = await Attendance.findById(id)
            oldAttendance.uin = req.body.uin
            oldAttendance.classId = req.body.classId
            oldAttendance.date = req.body.date
            oldAttendance.takenBy = req.body.takenBy
            await oldAttendance.save()
            res.status(200).json({
                message: 'attendance updated',
                data: oldAttendance
            })
        } else {
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
        }
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
        return res.status(400).json({message: 'invalid param'});
    }
    next();
}

module.exports = router;