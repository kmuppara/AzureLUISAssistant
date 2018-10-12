/*-----------------------------------------------------------------------------
A simple Language Understanding (LUIS) bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.
var bot = new builder.UniversalBot(connector, function (session, args) {
    session.send('We don\'t have any info on this.\n Kindly provide some other inputs');
});

bot.set('storage', tableStorage);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

// Add a dialog for each intent that the LUIS app recognizes.
// See https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-recognize-intent-luis
//Greeting Intent - To wish the customers who visit the big bazaar assistance. 
bot.dialog('GreetingDialog',
    (session) => {
        session.send('Welcome to big bazaar retail store. \n How may i help you?');
        session.endDialog();
    }
).triggerAction({
    matches: 'Greeting'
})

//Item locator Intent - To locate the items in retail store.
bot.dialog('ItemLocatorDialog',
    (session) => {
        session.send('Toys are available in second floor at third bay.\n Are you looking for any other info?');
        session.endDialog();
    }
).triggerAction({
    matches: 'ItemLocator'
})

//Offers Finder Intent - To find out the offers on the items of retail store.
bot.dialog('OfferFinderDialog',
    (session) => {
        session.send('Ten percent discount on minimum purchase of five hundred rupees.\n Are you looking for any other info?');
        session.endDialog();
    }
).triggerAction({
    matches: 'OfferFinder'
})

//Product Details Intent - To give the details of products in the retail store.
bot.dialog('ProductDetailsDialog',
    (session) => {
        session.send('Below are the list of features of Prestige Cooker.\n1.Auto off facility.\n2.Cooking without flame. \n3.More comfortable and easy to use.\n Are you looking for any other info?');
        session.endDialog();
    }
).triggerAction({
    matches: 'ProductDetails'
})

//Recommendations Intent - To provide suggestions on items in the retail store.
bot.dialog('RecommendationsDialog',
    (session) => {
        session.send('We recommend luxx since it is having good moisturing and cost is low compared to other\'s.\n Are you looking for any other info?');
        session.endDialog();
    }
).triggerAction({
    matches: 'Recommendations'
})

//Trending Items Intent - To list down all the trending items in the retail store.
bot.dialog('TrendingItemsDialog',
    (session) => {
        session.send('Trending items in the shopping inventory are footwear, home appliances and milk products. \n Are you looking for any other info?');
        session.endDialog();
    }
).triggerAction({
    matches: 'TrendingItems'
})

//Yes Intent - To continue the conversation with the customer
bot.dialog('YesDialog',
    (session) => {
        session.send('Please tell me, What would you like to know?');
        session.endDialog();
    }
).triggerAction({
    matches: 'Yes'
})

//None Intent - To end the conversation with the customer.
bot.dialog('NoneDialog',
    (session) => {
        session.send('Thank you visiting big bazaar assitance.\n Have a great day!!!');
        session.endDialog();
    }
).triggerAction({
    matches: 'None'
})
