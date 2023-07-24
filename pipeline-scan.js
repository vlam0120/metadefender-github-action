#!/usr/bin/env node

const { exec, execSync, spawn } = require('child_process');
const core = require('@actions/core');

exports.downloadJar = function () { 
    core.info('Downloading scan.jar')
    try {
        var downloadJar = `curl -sSO https://metascansuppliers.s3.us-west-2.amazonaws.com/opswat-0.0.1-SNAPSHOT.jar`;
        var getDownloadOutput = execSync(downloadJar).toString()
        core.info('scan.jar downloaded')
        
    }
    catch(error){
        core.info(`Status Code: ${error.status} with '${error.message}'`);
        
    }
};


exports.runScan = function(scanCommand){  
    let commandOutput = ''
    try {
        commandOutput = execSync(scanCommand)
    } catch (ex){
        commandOutput = ex.stdout.toString()
    }
    return commandOutput
}
