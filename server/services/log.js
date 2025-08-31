var express = require('express'),
    Log = require('../models/log');

module.exports = async function (attendanceId, message) {
    console.log("[INFO] attendance id: " + attendanceId + ", message: " + message)
    try {
        let newLog = new Log({
            attendanceId: attendanceId,
            message: message,
            date: Date.now()
        })
        await newLog.save()
    } catch(e) {
        console.log("Error occurred when logging")
    }
}