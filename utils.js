#!/usr/bin/env node

const { exec, execSync, spawn } = require('child_process');
const core = require('@actions/core');

exports.download = function (url) { 
    core.info('Downloading ' + url)
    try {
        var downloadCmd = 'curl -L ' + url + ' > scanner.zip';
        var getDownloadOutput = execSync(downloadCmd).toString()
        core.info('Download successfully')
        core.info(getDownloadOutput)
    }
    catch(error){
        core.info(`Status Code: ${error.status} with '${error.message}'`);
    }

    try {
        core.info(commandOutput)
        var extractedFile = 'unzip scanner.zip'
        const getUnzipOutput = execSync(extractedFile).toString();
        core.info('Unzipped')      
        core.info(commandOutput)
    }
    catch(error){
        console.log(`Status Code: ${error.status} with '${error.message}'`);
        core.info("scanner.zip could not be unzipped.")
    }
};

exports.runScan = function(scanCommand){  
    var commandOutput = ''
    try {
        commandOutput = execSync(scanCommand)
    } catch (ex){
        commandOutput = ex.stdout.toString()
    }
    return commandOutput
}

exports.buildScanCommand = function(parameters){
    var scanCommand = 'java -jar scanner.jar '
    Object.entries(parameters).forEach(([key, value], index) => {
        if (value != '') {
            if ( key == "f" || key == 'l' || key == 'e'){
                scanCommand += " -"+key+" '"+value+"'"
            }
            else {
            scanCommand += " -"+key+" "+value
            }
        }
    })
    core.info(scanCommand)
    return scanCommand
}