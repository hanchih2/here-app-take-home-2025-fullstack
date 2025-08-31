var express = require('express'),
    router = express.Router(),
    Log = require('../models/log');

baseRoute = router.route('/')

baseRoute.get( async function(req, res) {
    try {
        let resData = await Log.find()
        res.status(200).json({
            message: 'OK',
            data: resData
        });
    } catch(e) {
        res.status(500).json({ message: "An unexpected error has occurred in processing the request."});
    }
})

module.exports = router;