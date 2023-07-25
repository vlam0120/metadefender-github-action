const { readFileSync, existsSync} = require('fs');
const core = require('@actions/core')
const { exec, execSync, spawn } = require('child_process');
const github = require('@actions/github')

var parameters = {}
/*
scanURL = "https://api.metadefender.com/v4/file"
apikey = ""
folder = "C:\\Exclude\\Test"
logfile = "C:\\Test\\metadefender.log"
failBuild = 1
*/


const scanURL = core.getInput('scan-url', {required: true} );
parameters['-url'] = scanURL

const apikey = core.getInput('apikey', {required: false} );
parameters['-k'] = apikey

const folder = core.getInput('folder', {required: true} );
parameters['-f'] = folder

const logfile = core.getInput('log-file', {required: true} );
parameters['-l'] = logfile

const failBuild = core.getInput('fail-build', {required: true} );

function runScan(scanCommand){  
    var commandOutput = ''
    try {
        commandOutput = execSync(scanCommand)
    } catch (ex){
        commandOutput = ex.stdout.toString()
    }
    return commandOutput
}

async function run(){
    core.info('Running the Pipeline Scan')
    var scanCommand = 'java -jar scanner.jar -url ' + scanURL + ' -f ' + folder + ' -l ' + logfile + ' -k ' + apikey
	core.info(scanCommand)
    
    var scanCommandOutput = ''
    var foundIssue = false
    try {
        scanCommandOutput = await runScan(scanCommand)
        core.info("=== Command run output ===")
        core.info(scanCommandOutput)
        const allFileContents = readFileSync(logfile, 'utf-8')
        core.info("- All file content -\n" + allFileContents)
        var lastLine = ''
        allFileContents.split(/\r?\n/).forEach(line =>  {
            lastLine = line;
        });
        if(lastLine === '' || lastLine.includes("[ERROR]")) foundIssue = true       

    } catch (ex){
        core.info(ex)
        foundIssue = true
    }
    
    if (foundIssue) {
        //Check if it is a pull request
        var github_token = core.getInput('github-token');
        var context = github.context;
        if (context.payload.pull_request == null) {
            core.info('No pull request found.');
        }
        var pull_request_number = context.payload.pull_request.number;

        const octokit = new github.GitHub(github_token);
        const new_comment = octokit.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: pull_request_number,
            body: "Found an issue during the scan. Please check the github action log for more details"
        });

        if(failBuild == 1) {
            core.setFailed("Found an issue during the scan. Please check the above log for more details")   
        } else {
            core.info("Found an issue during the scan. Please check the above log for more details")
        }
    }
}

run()