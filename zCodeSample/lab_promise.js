const { IncCli } = require("../lib/Incognito/IncCli");
const { once } = require('events');

async function main() {
    var cli = new IncCli()
    cli.sync = false
    childProcesses = []
    for (i of [...Array(10).keys()]) {
        childProcesses.push(cli.run("account gen"))
    }
    console.log("length", childProcesses.length)

    for (let i = 0; i < childProcesses.length; i++) {
        var p = childProcesses[i]
        console.log(i)
        var output = ""
        p.stdout.on('data', (data) => {
            // console.log("Data:: ", data)
            console.log("::", JSON.parse(data)["Accounts"][0]["MiningKey"], "::")

            output += data
        });
        p.stderr.on("data", (data) => {
            console.log("Error:: ", data)
        });

        p.stdout.on('end', async function (code) {
            // console.log('output: ' + output);
            console.log(`Exit:: code is: ${code}`);
        });

        // await once(p, "close")
        console.log("::", JSON.parse(output)["Accounts"][0]["MiningKey"], "::")
    }
}

main().then((result) => {

}).catch((err) => {
    console.log("Err:: ", err)
});