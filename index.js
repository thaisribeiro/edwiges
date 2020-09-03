import http from 'http';
import fs from 'fs';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import slackbot from './notify-slack.js';

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
}).listen(conf.system.port || 8080);

webhookHandler.on('error', function (err) {
  console.error('Error:', err.message)
});

webhookHandler.on('Merge Request Hook', function (event) {
  slackbot.mergeRequestMessage(event.payload);
});
