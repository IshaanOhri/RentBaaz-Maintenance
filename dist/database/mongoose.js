"use strict";
var mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, function (error, client) {
    if (error) {
        return console.log(error);
    }
    return console.log('Connection successful.');
});
//# sourceMappingURL=mongoose.js.map