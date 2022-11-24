
function makeSlackAlert(title) {
    const alertObj = {
        content: {
            text: title,
            fields: {}
        },
        appendTitle: function(text) {
            this.content.text += ` ${text}`
            return this
        },
        send: function() {
            const { ENV } = require('../../global');
            const SLACK = SlackNotify(ENV.config.slackWebHook);
            console.log("!!! ALERT:", this.content)
            if (ENV.config.enableSlackAlert) { SLACK.alert(this.content) }
        },
        addInfo: function(info) {
            if (typeof info == "string") {
                this.content.fields["!!!"] = info
            } else {
                this.content.fields = { ...this.content.fields, ...info }
            }
            return this
        },
        setInfo: function(info) {
            if (typeof info == "string") {
                this.content.fields["!!!"] = info
            } else {
                this.content.fields = info
            }
            return this
        }
    }
    return alertObj
}

module.exports = { makeSlackAlert }