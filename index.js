var http = require('http');
var fs = require('fs');
var yaml = require('js-yaml');
var slackbot = require('./notify-slack.js');
var dotenv = require('dotenv');

dotenv.config();
const conf = yaml.load(fs.readFileSync('config.yml'));

// Cria um servidor para lidar com webhooks Gitlab
const createServer = require('gitlab-webhook-handler2');
const webhookHandler = createServer({ path: '/webhook', events: conf.gitlab.events});
http.createServer(function (req, res) {
  webhookHandler(req, res, function (err) {
   res.statusCode = 200;
   res.end(conf.system.name)
  })
}).listen(process.env.PORT || 3000);

webhookHandler.on('error', function (err) {
  console.error('Error:', err.message)
});

webhookHandler.on('Merge Request Hook', function (event) {
  slackbot.mergeRequestMessage(event.payload);
});
