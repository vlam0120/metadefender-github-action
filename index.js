const { readFileSync, existsSync} = require('fs');
const core = require('@actions/core')
const { downloadJar, runScan} = require('./pipeline-scan')

// get input params
var parameters = {}

const who_to_greet = core.getInput('who-to-greet', {required: true} );
parameters['who-to-greet'] = who_to_greet

async function run (parameters){
    downloadJar()

    core.info('Running the Pipeline Scan')
    let scanCommandOutput = await runScan('java -jar opswat-0.0.1-SNAPSHOT.jar ' + parameters['who-to-greet'])

    core.info('Pipeline Scan Output')
    core.info(scanCommandOutput)
    core.setFailed(scanCommandOutput)
	core.setOutput("time", "1984");
}

run(parameters)