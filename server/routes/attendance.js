var express = require('express'),
    router = express.Router(),
    Attendance = require('../models/attendance'),
    Log = require('../services/log');

baseRoute = router.route('/')

baseRoute.get(async function (req, res) {
    try {
        let resData = await Attendance.find()
        res.status(200).json({
            message: 'OK',
            data: resData
        });
    } catch {
        res.status(500).json({ message: "An unexpected error has occurred in processing the request."});
    }
})

baseRoute.post(validNewAttendanceData, async function (req, res) {
    try{
        let id = req.body.id
        if (id != null && id != undefined && id != "") {
            // find attendance by Id
            const oldAttendance = await Attendance.findById(id)
            let message = "update "
            if(oldAttendance.uin != req.body.uin) {
                oldAttendance.uin = req.body.uin
                message += "uin=" + req.body.uin + " "
            }
            if(oldAttendance.classId != req.body.classId) {
                oldAttendance.classId = req.body.classId
                message += "classId=" + req.body.classId + " "
            }
            if(oldAttendance.date != req.body.date) {
                oldAttendance.date = req.body.date
                message += "date=" + req.body.date + " "
            }
            if(oldAttendance.takenBy != req.body.takenBy) {
                oldAttendance.takenBy = req.body.takenBy
                message += "takenBy" + req.body.takenBy + " "
            }
            await oldAttendance.save()

            // log
            await Log(id, message)
            
            res.status(200).json({
                message: 'attendance updated',
                data: oldAttendance
            })
        } else {
            console.log("add new attendance")
            const attendance = new Attendance({
                uin: req.body.uin,
                classId: req.body.classId,
                date: req.body.date,
                takenBy: req.body.takenBy
            })
            const newAttendance = await attendance.save();

            // log
            let message = "create uin=" + req.body.uin + " classId=" + req.body.classId + " date=" + req.body.date + " takenBy=" + req.body.takenBy
            await Log(newAttendance.id, message)

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