// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var LogSchema = new mongoose.Schema({
    attendanceId: {type: String, required: true},
    message: {type: String, required: true},
    date: {type: Date, required: true}
});

// Export the Mongoose model
module.exports = mongoose.model('Log', LogSchema);