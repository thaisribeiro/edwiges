'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _notifySlack = require('./notify-slack.js');

var _notifySlack2 = _interopRequireDefault(_notifySlack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conf = _jsYaml2.default.load(_fs2.default.readFileSync('config.yml'));

// Cria um servidor para lidar com webhooks Gitlab
var createServer = require('gitlab-webhook-handler2');
var webhookHandler = createServer({ path: '/webhook', events: conf.gitlab.events });
_http2.default.createServer(function (req, res) {
  webhookHandler(req, res, function (err) {
    res.statusCode = 200;
    res.end(conf.system.name);
  });
}).listen(conf.system.port || 8080);

webhookHandler.on('error', function (err) {
  console.error('Error:', err.message);
});

webhookHandler.on('Merge Request Hook', function (event) {
  _notifySlack2.default.mergeRequestMessage(event.payload);
});