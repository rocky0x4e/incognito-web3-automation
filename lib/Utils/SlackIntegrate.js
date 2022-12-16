const axios = require("axios");
const config = require("./../../config.json");
const GenAction = require("./GenAction");
const json = require("./../../mochawesome-report/mochawesome.json");

let divider = {
    "type": "divider"
}

const run = async() => {
    await GenAction.sleep(10000)
    let blocks = await summaryBlock(json)

    let response = await callApi('#web3_automation_report', 'mocha', config.botSlackAuthen, blocks)
    console.log({ response });
}

const summaryBlock = async(report) => {
    let blocks = []

    let titleBlock = await initTitleBlock()
    let infoBlock = await initInfoBlock(report)
    let detailBlock = await initDetailBlock(report)
    let linkBlock = await initLinkBlock(report)

    blocks.push(titleBlock)
    blocks.push(divider)
    blocks.push(infoBlock)
    blocks.push(divider)
    blocks.push(detailBlock.summaryBlock)
    blocks.push(divider)
    blocks.push(detailBlock.detailBlock)
    blocks.push(divider)
    blocks.push(linkBlock)
        // return blocks

    return [{
        "color": "#276b12",
        blocks
    }]
}

const callApi = async(channel, username, authorization, attachments) => {
    let body = {
        "channel": channel,
        "username": username,
        "attachments": attachments
    }

    let request = {
        url: 'https://slack.com/api/chat.postMessage',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + authorization
        },
        validateStatus: function(status) { return status },
        data: body,
    }
    let response = await axios(request)
    return response.data
};

const initTitleBlock = async() => {
    return {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": `*INCOGNITO_WEB3_AUTOMATION*`
        }
    }
};

const initInfoBlock = async(report) => {
    let startTime = new Date(report.stats.start)
    startTime.setHours(startTime.getHours() + 7);
    startTime = startTime.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    let duration = new Date(report.stats.duration).toISOString().slice(11, 19);

    let info = `*StartTime :*  ${startTime}\n`
    info += `*Duration :* ${duration}\n`
    info += `*Environment :* ${config.testbed.toUpperCase()}`


    return infoBlock = {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": info
        }
    }
};

const initLinkBlock = async() => {
    return linkBlock = {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": `*Link* : ${process.env.JOB_URL}/${process.env.BUILD_NUMBER}/HTML_20Report`
        }
    }
};

const initDetailBlock = async(report) => {

    let totalPassCount = 0;
    let totalFailCount = 0;
    let totalSkipCount = 0;

    let detail = '*Detail:*\n\n'

    for (const classItem of report.results[0].suites) {
        let passCount = 0;
        let failCount = 0;
        let skipCount = 0;
        for (const testcaseItem of classItem.suites) {
            if (testcaseItem.failures.length == 0 && testcaseItem.pending.length == 0 && testcaseItem.skipped.length == 0) {
                passCount++;
                totalPassCount++
            } else if (testcaseItem.passes.length == 0 && testcaseItem.failures.length == 0) {
                skipCount++
                totalSkipCount++
            } else {
                failCount++
                totalFailCount++
            }
        }

        totalCount = passCount + failCount
        let passPercent = Math.round(passCount / totalCount * 100)
        let testClass = (classItem.file).replaceAll("/TestCases/", "")
        testClass = testClass.charAt(0).toUpperCase() + testClass.slice(1);
        if (passPercent == 100) {
            detail += `:white_check_mark: ${testClass} : ${passCount}/${totalCount} Passed \n`
        } else {
            detail += `:x: ${testClass} : ${passCount}/${totalCount} Passed \n`
        }
    }

    let detailBlock = {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": detail
        }
    }

    let total = totalPassCount + totalFailCount + totalSkipCount
    let summaryBlock = {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": `*Result:*\n\n:white_check_mark: ${totalPassCount}/${total} (${Math.round(totalPassCount / total * 100)}%) Passed\n:x: ${totalFailCount}/${total} (${Math.round(totalFailCount / total * 100)}%) Failed\n:warning: ${totalSkipCount}/${total} (${Math.round(totalSkipCount / total * 100)}%) Skipped`
        }
    }

    return {
        detailBlock,
        summaryBlock
    }
};

module.exports = {
    summaryBlock,
    callApi
};

run()