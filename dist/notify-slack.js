'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _slackbots = require('slackbots');

var _slackbots2 = _interopRequireDefault(_slackbots);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var conf = _jsYaml2.default.load(_fs2.default.readFileSync('config.yml'));

module.exports = {
    mergeRequestMessage: function mergeRequestMessage(event) {
        var titleMessage = 'Heeey, <!here> tem *Merge Request* novo para aprovar no projeto *' + event.repository.description + '*, confira no link abaixo: :point_down: :alisson-gamer: :bbb-bruna: :regoni-potato: :gun: :thaisbelta:';
        var slackParams = {
            icon_emoji: conf.slack.bot.icon,
            attachments: [{
                color: conf.slack.clrMerge,
                title: event.object_attributes.title,
                title_link: event.object_attributes.url,
                fields: [{
                    title: "Branch de origem",
                    value: event.object_attributes.source_branch,
                    short: true
                }, {
                    title: "Branch de destino",
                    value: event.object_attributes.target_branch,
                    short: true
                }],
                footer: 'Autor: ' + event.user.name
            }]
        };
        sendChannelMessage(titleMessage, slackParams);
    },

    mergeRequestUpdateMessage: function mergeRequestUpdateMessage(MRList) {
        var titleMessage = "Xiiii! Foi identificado alguns problemas com os seguintes MR's";
        var slackParams = {
            icon_emoji: conf.slack.bot.icon,
            attachments: [{
                color: conf.slack.clrWarning,
                title: 'Resolva os conflitos ou problemas no pipeline antes de seguir :)',
                fields: MRList.map(function (mr) {
                    return { 'value': mr };
                })
            }]
        };
        sendChannelMessage(titleMessage, slackParams);
    }
};

console.log('TOKEN', process.env.TOKEN_BOT_SLACK);

var bot = new _slackbots2.default({
    name: conf.slack.bot.name,
    token: process.env.TOKEN_BOT_SLACK
});

function sendChannelMessage(message, params) {
    bot.postMessageToChannel(conf.slack.mr_channel, message, params);
}