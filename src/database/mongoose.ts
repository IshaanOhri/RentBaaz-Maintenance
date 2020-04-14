const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
}, (error: any, client: any): void => {
    if(error){
        return console.log(error);
    }

    return console.log('Connection successful.');
})

export{};