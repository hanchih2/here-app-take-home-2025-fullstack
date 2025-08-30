// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var AttendanceSchema = new mongoose.Schema({
    uin: { type: String, required: true},
    classId: { type: String, required: true},
    date: { type: Date, required:true },
    takenBy: { type: String, required: true}
});

// Export the Mongoose model
module.exports = mongoose.model('Attendance', AttendanceSchema);