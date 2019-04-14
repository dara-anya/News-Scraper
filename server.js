// Dependencies
var express = require("express");
var mongojs = require("mongojs")
var cheerio = require("cheerio");
var axios = require("axios");


// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"]

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error){
    console.log("Database Error:", error);
});

// Main route
app.get("/", function(req, res){
    res.send("Hello World");
});

app.get("/all", function(req, res){
    db.scrapedData.find({}, function(err, found){
        if(err){
            console.log(err);
        }
        else{
            res.json(found);
        }
    });
});
app.get("/scrape", function(req, res){
    axios.get("https://www.npr.org/sections/news/").then(function(response){
        var $ = cheerio.load(response.data);

        var results = [];

        $("h2.title").each(function(i, element){
            var title = $(element).text();
            var link = $(element).children().attr("href");

            if (title && link){
                db.scrapedData.save({
                    title: title,
                    link: link
                },
                function(error, saved){
                    if (error){
                        console.log(error);
                    }
                    else{
                        console.log(saved);
                    }
                });
            }
            results.push({
                title: title,
                link: link
            });
        });

        $("p.teaser").each(function(i, element){
            var summary = $(element).text();
            if (summary){
                db.scrapedData.save({
                    summary: summary
                },
                function(error, saved){
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log(saved);
                    }
                });
            }
            results.push({
                summary: summary
            });
        })

        console.log(results);
    });

    res.send("Scrape complete");
});


app.listen(3000, function(){
    console.log("App running on 3000")
})