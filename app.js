const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
// const logUtil = require('./src/utils/log');

// const JDUser = require("./src/jduser/userinfo");
const indexRouter = require('./routes/index');
const testRouter = require("./routes/testRouter");
const adminRouter = require("./routes/adminRoute");

const fs = require("fs");

const app = express();

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/public', express.static(path.join(__dirname, 'public')));

// app.use(logUtil.httpAccessLogger());

app.use(bodyParser.json({ limit: '20mb' }));

app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

app.use(cookieParser());

app.use(cors());

app.use(session({
    secret: 'tianshui',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000,httpOnly:true }
}));


app.get(/\/.*\.html/, function(req, res) {
    console.log(req.path);
    var filePath = path.join(app.get('views'), req.path);
    fs.exists(filePath, function(exists){
        if(!exists){
            res.send(404, "Not Found");
        };
        res.sendFile(filePath);
    });
});

app.use('/index', indexRouter);
app.use('/test',testRouter);
app.use('/admin',adminRouter);

module.exports = app;