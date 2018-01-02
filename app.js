var Twit = require('twit');
var request = require('request');
const express = require('express');
const app = express();
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var PersonalityTextSummaries = require('personality-text-summary');
var PersonalitySunburstChart = require('personality-sunburst-chart');
var PersonalityTraitInfo = require('personality-trait-info');
const scrapeIt = require("scrape-it");
var pugVars = {
Data:"",
Summary:"",
response:{},
photo: "",
unlikely: [],
realName:"",
consumptionData:[]
}

app.use('/static',express.static('public'));
app.set('view engine', 'pug');



// Twit module which scrapes data from twitter!!!
var T = new Twit({
  consumer_key:         '',
  consumer_secret:      '',
  access_token:         '',
  access_token_secret:  '',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});



/*---------------------- TWITTER DATA---------------------------------------------------------------------- */
// Gives a users 1st 200 tweets, just change the screen_name to get the data for any other user!!!!
T.get('statuses/user_timeline', { count:200,screen_name: "narendramodi" }, function(err, data, response) {
    for(let i=0;i<data.length;i += 1){
        pugVars.Data += data[i].text;
            }
 // pugVars.twitterData += Googledata
 pugVars.photo = data[0].user.profile_image_url_https;
});





/* --------------------------SCRAPED QUORA DATA---------------------------------------------------------*/


//scrapeIt("https://www.quora.com/profile/Rishi-Gautam-22", {
//    textData: ".grid_page p",
//    expandData : "rendered_qtext"
//}).then(page => {
////    console.log(page);
//    pugVars.Data += page.textData;
//});



/*----------------------------END OF SCRAPED QUORA DATA------------------------------------------*/

/*---------------------------------GOOGLE DATA----------------------------*/

//Use the google npm package to scrape links then use scrapeIT on it to get data from the links 

/*-----------------------------------------------------------------------------------*/





/*-----------------IBM Personality Insights API!-----------------------------------------------*/
setTimeout(function(){ 
    var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
    var personality_insights = new PersonalityInsightsV3({
      username: '0e4ce8c9-3f65-4c8e-802c-10c6d85fcb29',
      password: 'p5EAKNRoyLk8',
      version_date: '2017-10-13'
    });

    var params = {
      // text should have all the data to be analyzed
      text: pugVars.Data,
      consumption_preferences: true,
      raw_scores: true,
      headers: {
        'accept-language': 'en',
        'accept': 'application/json'
      }
    };

    personality_insights.profile(params, function(error, response) {
      if (error)
        console.log('Error:', error);
      else
                  // locale is one of {'en', 'es', 'ja', 'ko'}.  version refers to which version of Watson Personality Insights to use, v2 or v3.
          var v3EnglishTextSummaries = new PersonalityTextSummaries({ locale: 'en', version: 'v3' });

          // retrieve the summary for a specified personality profile (json)
          pugVars.response = response;
          var textSummary = v3EnglishTextSummaries.getSummary(response);
          pugVars.Summary += textSummary;
//          console.log('The summary for the provided profile is ' + textSummary);
//          console.log(pugVars.response);

/*------------------------------Trait Information----------------------------*/
        
/*---------------------------------------------------------------------------*/

///*---------------------------Consumption Preferences Response Parsing-----------------------------------------------------------*/
 for(let i=0;i<response.consumption_preferences.length;i+=1){
    for (let j=0;j<response.consumption_preferences[i].consumption_preferences.length; j+=1){
            if(response.consumption_preferences[i].consumption_preferences[j].score === 1){
                console.log(response.consumption_preferences[i].consumption_preferences[j].name);
                pugVars.consumptionData.push(response.consumption_preferences[i].consumption_preferences[j].name);
            }
            else if(response.consumption_preferences[i].consumption_preferences[j].score === 0)
                {
                console.log("Not "+response.consumption_preferences[i].consumption_preferences[j].name);    
                pugVars.unlikely.push("Not "+response.consumption_preferences[i].consumption_preferences[j].name);
                }
        }
 }
 var PersonalityConsumptionPreferences = require('personality-consumption-preferences'); 
// console.log(pugVars.consumptionData);

/*------------------------------------------Behaviours--------------------------------------------------------------------------*/        

        
console.log(response);
        
/*----------------------------------------------------------------------------------------------------------------------------------------*/     
        
        
        
/*---------------Saving Response in JSON-----------------------------------*/
        var jsonfile = require('jsonfile')
 
        var file = 'public/data/data.json'
        var obj = response;

        jsonfile.writeFile(file, obj, function (err) {
          console.error(err) 
        })
        
        
        
        
        
        
/*---------------------SUNBURST CHART---------------------------------------------*/
//          // Create the chart, specifying the css selector that identifies the element to contain the chart
//          // and the version of Watson Personality Insights profile to use, v2 or v3.  Default is v2.
//          var chart = new PersonalitySunburstChart({
//            'selector':'#sunburstChart',
//            'version': 'v3'
//          });
//
//          // Render the sunburst chart for a personality profile (version as specified in creating the chart)
//          // and optionally a profile photo.  The photo will be inserted into the center of the sunburst chart.
//          chart.show(pugVars.response);    
        
    
    
    } 
);
 
},3000);


/*------------------------ROUTES RENDER--------------------------------------------*/


app.get('/',(req,res)=>{
  res.render("index",pugVars);
});


app.get('/data',(req,res)=>{
  res.render("data",pugVars);
});

//Render a Route which directs you to the analyzed data!!!
app.get('/analyze',(req,res)=>{
  res.render("personality",pugVars);
});

//Render a Route which directs you to the consumer preferences!!!
app.get('/consumer',(req,res)=>{
  res.render("consumer",pugVars);
});


//............................................................

app.listen(process.env.PORT || '3000',()=>{
  console.log('The server is running on port 3000');
});


