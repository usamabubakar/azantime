const express = require("express");
const path = require("path");
const hbs = require("hbs")
const app = express();
const bodyParser = require('body-parser');
const request = require("request");
app.use(bodyParser.urlencoded({ extended: false }));
const port=process.env.PORT || 8000;
let temp_path = path.join(__dirname, "../template", "views");
const static_path = path.join(__dirname, "../template/picsandcss");
app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", temp_path);

app.get("/", (req, res) => {
    res.render("search");
});
app.post("/", (req, res) => {
    const city = req.body.city;
    const country = req.body.country;
    console.log(city);
    var d= new Date();
    var month=d.getMonth()+1;
    var year=d.getFullYear();
    console.log(year);
    console.log(month);
    request(`https://api.aladhan.com/v1/calendarByCity?city=${city}&country=${country}&method=2&month=${month}&year=${year}`, (err, resp) => {
        if (err) {
            res.status(404).render("404", {
                err: "Server Error"

            });
        }
        else {
            const a = JSON.parse(resp.body);
            // console.log(a);
            if (a.code == "400") {
                res.status(404).render("404", {
                    err: "city or country invalid"
                });
            }
            else {
                // console.log(a.data[0].timings.Fajr);
                console.log(a.data[0].meta.longitude);
                console.log(a.data[0].meta.latitude);
                console.log(a.data[0].date.hijri.month.ar);
                console.log(a.data[0].length);
             
                res.render("azanhome", {
                    date:a.data[0].date.readable,
                    fajr:a.data[0].timings.Fajr.split(" ")[0],
                    sunr:a.data[0].timings.Sunrise.split(" ")[0],
                    duhar:a.data[0].timings.Dhuhr.split(" ")[0],
                    asar:a.data[0].timings.Asr.split(" ")[0],
                    suns:a.data[0].timings.Sunset.split(" ")[0],
                    maghrib:a.data[0].timings.Maghrib.split(" ")[0],
                    isha:a.data[0].timings.Isha.split(" ")[0],
                    imsk:a.data[0].timings.Imsak.split(" ")[0],
                    mid:a.data[0].timings.Midnight.split(" ")[0],
                    hijri:a.data[0].date.hijri.month.ar,
                    lati:a.data[0].meta.latitude,
                    long:a.data[0].meta.longitude,
                    city1:city,
                    country1:country,
                    lenth:a.data[0].length
                });
            }
        }
    });
   

    

})

app.listen(port, () => {
    console.log(`${Port}`);
})