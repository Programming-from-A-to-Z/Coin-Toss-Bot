// A2Z F16
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F16

// Bot that replies

// Create an Twitter object to connect to Twitter API
// npm install twit
var Twit = require('twit');

// Pulling all my twitter account info from another file
var config = require('./config.js');
// Making a Twit object for connection to the API
var T = new Twit(config);

// Setting up a user stream
var stream = T.stream('user');

tweeter();

// Once every N milliseconds
setInterval(tweeter, 24 * 60 * 60 * 1000);

// Here is the bot!
function tweeter() {

  var r = Math.random();
  var tweet = 'heads';
  if (r < 0.5) {
    tweet = 'tails';
  }
  // Post that tweet!
  T.post('statuses/update', {
    status: tweet
  }, tweeted);

  // Callback for when the tweet is sent
  function tweeted(err, data, response) {
    if (err) {
      console.log(err);
    } else {
      console.log('Success: ' + data.text);
      //console.log(response);
    }
  };

}



// Now looking for tweet events
// See: https://dev.twitter.com/streaming/userstreams
stream.on('tweet', tweetEvent);

// Here a tweet event is triggered!
function tweetEvent(tweet) {

  // If we wanted to write a file out
  // to look more closely at the data
  // var fs = require('fs');
  // var json = JSON.stringify(tweet,null,2);
  // fs.writeFile("tweet.json", json, output);

  // Who is this in reply to?
  var reply_to = tweet.in_reply_to_screen_name;
  // Who sent the tweet?
  var name = tweet.user.screen_name;
  // What is the text?
  var txt = tweet.text;
  // If we want the conversation thread
  var id = tweet.id_str;

  // Ok, if this was in reply to me
  // Tweets by me show up here too
  if (reply_to === 'a2zitp') {

    var replyText = '@' + name + ' ';
    var r = Math.random();
    if (r < 0.5) {
      replyText += 'heads';
    } else {
      replyText += 'tails';
    }

    // Post that tweet
    T.post('statuses/update', {
      status: replyText,
      in_reply_to_status_id: id
    }, tweeted);

    // Make sure it worked!
    function tweeted(err, reply) {
      if (err) {
        console.log(err.message);
      } else {
        console.log('Tweeted: ' + reply.text);
      }
    }
  }
}
