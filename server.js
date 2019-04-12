var cheerio = require("cheerio");
var axios = require("axios");

axios.get("https://old.reddit.com/r/webdev/").then(function(response){
    var $ = cheerio.load(response.data);

    var results = [];

    $("p.title").each(function(i, element){
        var title = $(element).text();

        results.push({
            title: title
        });
    });

    console.log(results);
});