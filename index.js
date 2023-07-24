const { readFileSync, existsSync} = require('fs');
const core = require('@actions/core')
const { downloadJar, runScan} = require('./pipeline-scan')

// get input params
var parameters = {}

const scanURL = core.getInput('scan-url', {required: true} );
parameters['scan-url'] = scanURL

const apikey = core.getInput('apikey', {required: false} );
parameters['apikey'] = apikey

const folder = core.getInput('folder', {required: true} );
parameters['folder'] = folder

const logfile = core.getInput('logfile', {required: true} );
parameters['logfile'] = logfile


async function run (parameters){
    downloadJar()

    core.info('Running the Pipeline Scan')
	core.info('Scan command ' + 'java -jar opswat-0.0.1-SNAPSHOT.jar -url ' + scanURL + ' -f ' + folder + ' -l ' + logfile + ' -k ' + apikey)
    let scanCommandOutput = await runScan('java -jar opswat-0.0.1-SNAPSHOT.jar -url ' + scanURL + ' -f ' + folder + ' -l ' + logfile + ' -k ' + apikey)

    core.info('Pipeline Scan Output')
    core.info(scanCommandOutput)
    core.setFailed(scanCommandOutput)
	core.setOutput("time", "1984");
}

run(parameters)