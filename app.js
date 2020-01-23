const request = require('request');
const express = require('express')
const bodyparser = require('body-parser');
const fs = require('fs');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');


// var options = {
//     method: 'GET',
//     url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-charts',
//     qs: {
//         comparisons: '%5EGDAXI%2C%5EFCHI',
//         region: 'US',
//         lang: 'en',
//         symbol: 'HYDR.ME',
//         interval: '5m',
//         range: '1d'
//     },
//     headers: {
//         'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
//         'x-rapidapi-key': 'c1ae93eb66mshe22c2e33ba9d6a4p15b017jsnea478f1e6a0a'
//     }
// };
// request(options, function (error, response, body) {
//     if (error) throw new Error(error);
//     console.log(body);
// });

// let rawdata = fs.readFileSync('temp.json');
// let student = JSON.parse(rawdata);
// console.log(student['chart']['result']);

const app = express();

app.set('view engine','ejs');
app.use(expressLayouts);
app.set('views','views');

app.use(bodyparser.urlencoded({extended:true}));
app.use("/",express.static(path.join(__dirname,'public')));


app.get('/',(req,res,next)=>{
    res.render('page/home',{pageTitle:"Kay Iron Works Jorian | Home"});
});

app.post('/getchartdata',(req,res,next)=>{
    let rawdata = fs.readFileSync('temp.json');
    let student = JSON.parse(rawdata);
    //console.log(student['chart']['result'][0]['timestamp']);
    var timearr = convertts_to_time(student['chart']['result'][0]['timestamp']);
    //console.log(timearr);
    var valarr = convert_to_fixed(student['chart']['result'][0]['indicators']['quote'][0]["open"]);
    //res.send( {'x-axis':timearr,'y-axis':student['chart']['result'][0]['indicators']['quote'][0]["open"]});
    res.send( {'x-axis':timearr,'y-axis':valarr});
});

app.post('/getliveSymdata',(req,res,next)=>{
    console.log(req.body);
    //res.send({});
    var options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-charts',
        qs: {
            region: 'US',
            lang: 'en',
            symbol: req.body.sym,
            interval: '5m',
            range: '1d'
        },
        headers: {
            'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
            'x-rapidapi-key': 'c1ae93eb66mshe22c2e33ba9d6a4p15b017jsnea478f1e6a0a'
        }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        //console.log(body);
        let student = JSON.parse(body);
        var timearr = convertts_to_time(student['chart']['result'][0]['timestamp']);
        console.log("live sym data");
        var valarr = convert_to_fixed(student['chart']['result'][0]['indicators']['quote'][0]["open"]);
        res.send( {'x-axis':timearr,'y-axis':valarr});
    });
});

app.post('/getlivedata',(req,res,next)=>{
    var options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-charts',
        qs: {
            region: 'US',
            lang: 'en',
            symbol: '%5EGSPC',
            interval: '5m',
            range: '1d'
        },
        headers: {
            'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
            'x-rapidapi-key': 'c1ae93eb66mshe22c2e33ba9d6a4p15b017jsnea478f1e6a0a'
        }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        //console.log(body);
        let student = JSON.parse(body);
        var timearr = convertts_to_time(student['chart']['result'][0]['timestamp']);
        console.log("live data");
        var valarr = convert_to_fixed(student['chart']['result'][0]['indicators']['quote'][0]["open"]);
        res.send( {'x-axis':timearr,'y-axis':valarr});
    });
});

function test(){
    var options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-charts',
        qs: {
            region: 'US',
            lang: 'en',
            symbol: '%5EGSPC',
            interval: '5m',
            range: '1d'
        },
        headers: {
            'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
            'x-rapidapi-key': 'c1ae93eb66mshe22c2e33ba9d6a4p15b017jsnea478f1e6a0a'
        }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);

    });
}


function convert_to_fixed(arr){
    var res = [];
    for(var i = 0; i<arr.length; i ++ ){
       
        var val = parseFloat(arr[i].toFixed(2));
        res.push(val);
    }
    return res;
}
function convertts_to_time(tsarr){
    var res = [];
    for(var i = 0; i<tsarr.length; i ++ ){
       
    var ts = tsarr[i];

    // convert unix timestamp to milliseconds
    var ts_ms = ts * 1000;

    // initialize new Date object
    var date_ob = new Date(ts_ms);

    // year as 4 digits (YYYY)
    var year = date_ob.getFullYear();

    // month as 2 digits (MM)
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // date as 2 digits (DD)
    var date = ("0" + date_ob.getDate()).slice(-2);

    // hours as 2 digits (hh)
    var hours = ("0" + date_ob.getHours()).slice(-2);

    // minutes as 2 digits (mm)
    var minutes = ("0" + date_ob.getMinutes()).slice(-2);

    // seconds as 2 digits (ss)
    var seconds = ("0" + date_ob.getSeconds()).slice(-2);

    // date as YYYY-MM-DD format
    //console.log("Date as YYYY-MM-DD Format: " + year + "-" + month + "-" + date);
    //console.log("Time as hh:mm Format: " + hours + ":" + minutes);
        res.push(hours + ":" + minutes);
    }
    //console.log(res);
    return res;
}

const server = app.listen(3000);