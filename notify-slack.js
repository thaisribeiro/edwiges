'use strict';

var fs = require('fs');
var yaml = require('js-yaml');
var SlackBot = require('slackbots');
var dotenv = require('dotenv');

dotenv.config();
const conf = yaml.load(fs.readFileSync('config.yml'));

module.exports = {
    mergeRequestMessage: function mergeRequestMessage (event) {
        const titleMessage = 'Heeey, <!here> tem *Merge Request* novo para aprovar no projeto *' + event.repository.description + '*, confira no link abaixo: :point_down: :alisson-gamer: :bbb-bruna: :regoni-potato: :gun: :thaisbelta:';
        let slackParams = { 
            icon_emoji: conf.slack.bot.icon,     
            attachments: [{
                color: conf.slack.clrMerge,
                title: event.object_attributes.title,
                title_link: event.object_attributes.url,
                fields: [
                {
                    title: "Branch de origem",
                    value: event.object_attributes.source_branch,
                    short: true
                },
                {
                    title: "Branch de destino",
                    value: event.object_attributes.target_branch,
                    short: true          
                }],
                footer: 'Autor:' + event.user.name
            }]
        };
        sendChannelMessage(titleMessage, slackParams);
    },

    
    mergeRequestUpdateMessage: function(MRList) {
        let titleMessage = "Xiiii! Foi identificado alguns problemas com os seguintes MR's";
        let slackParams = {
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

var bot = new SlackBot({
    name: conf.slack.bot.name,
    token:  process.env.TOKEN_BOT_SLACK
});

function sendChannelMessage(message, params) {
    bot.postMessageToChannel('comunicacao-gitlab-integracao', message, params);
}
