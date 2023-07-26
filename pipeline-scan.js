#!/usr/bin/env node

const { exec, execSync, spawn } = require('child_process');
const core = require('@actions/core');

exports.download = function (url) { 
    core.info('Downloading ' + url)
    try {
        var downloadCmd = 'curl -o download.zip -sSO ' + url ;
        var getDownloadOutput = execSync(downloadCmd).toString()
        core.info('Download successfully')
        core.info(getDownloadOutput)
    }
    catch(e){
        core.info(`Status Code: ${error.status} with '${error.message}'`);
    }

    try {
        var extractedFile = 'unzip -o download.zip'
        const getUnzipOutput = execSync(unzipJar).toString();
        core.info('pipeline_scan.jar unzipped')
    }
    catch(e){
        console.log(`Status Code: ${error.status} with '${error.message}'`);
        core.info("Pipeline-scan-LATEST.zip could not be unzipped.")
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

exports.buildScanCommand = function(){
    var scanCommand = 'java -jar scanner.jar '
    Object.entries(parameters).forEach(([key, value], index) => {
        if ( key == "f" || key == 'l' || key == 'e'){
            scanCommand += " -"+key+" '"+value+"'"
        }
        else {
        scanCommand += " -"+key+" "+value
        }
    })
    core.info(scanCommand)
    return scanCommand
}