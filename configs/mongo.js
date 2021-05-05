const mongoose = require("mongoose")
let mongoUri 

if (process.env.NODE_ENV == `testing`) {
    mongoUri = process.env.mongoUriTest
} else {
    mongoUri = process.env.mongoUri
}

const mongoConfig = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
};

mongoose.connect(mongoUri, mongoConfig)
.then(() => {
    console.log("db connected")
})
.catch(err => {
    console.log("db disconnected")
})