const { readFileSync, existsSync} = require('fs');
const core = require('@actions/core')
const { exec, execSync, spawn } = require('child_process');
const github = require('@actions/github')
const pipeline = require('./pipeline-scan')

var parameters = {}

const scanURL = core.getInput('scan-url', {required: true} );
parameters['u'] = scanURL

const apikey = core.getInput('apikey', {required: false} );
parameters['k'] = apikey

const scanPath = core.getInput('scan-path', {required: true} );
parameters['f'] = scanPath

const logfile = core.getInput('log-file', {required: true} );
parameters['l'] = logfile

const showBlockedFileOnly = core.getInput('show-blocked-file-only', {required: false} );
parameters['b'] = showBlockedFileOnly

const excludedPath = core.getInput('exclude-path', {required: false} );
parameters['e'] = excludedPath

const rule = core.getInput('rule', {required: false} );
parameters['r'] = rule

const privateScan = core.getInput('private-scan', {required: false} );
parameters['p'] = privateScan

const timeout = core.getInput('timeout', {required: false} );
parameters['t'] = timeout

const failBuild = core.getInput('fail-build', {required: true} );

async function run(){
    core.info('Running the workflow Scan')
	
	//Download MetaDefender scanner
    pipeline.download('https://github.com/vlam0120/metadefender-github-action/releases/download/v26/scanner.zip')
    
    var scanCommand = pipeline.buildScanCommand(parameters)
    var scanCommandOutput = ''
    var foundIssue = false
    try {
        scanCommandOutput = await pipeline.runScan(scanCommand)
        
		core.info("=== Command run output ===")
        core.info(scanCommandOutput)
		
		//Check the last line to see if there is any issues found
        const allFileContents = readFileSync(logfile, 'utf-8')
        var lastLine = ''
        allFileContents.split(/\r?\n/).forEach(line =>  {
            lastLine = line;
        });
		
		
        if(lastLine === '' || lastLine.includes("[ERROR]")) foundIssue = true       

    } catch (ex){
        core.error(ex)
        foundIssue = true
    }
    
    if (foundIssue) {
        
		//Check if it is a pull request and have GitHub token to write comment
        var github_token = core.getInput('github-token');
		if (github_token ! = '') {
			var context = github.context;
			if (context.payload.pull_request != null) {
				var pull_request_number = context.payload.pull_request.number;

				const octokit = github.getOctokit(github_token);
				const new_comment = octokit.rest.issues.createComment({
					owner: context.repo.owner,
					repo: context.repo.repo,
					issue_number: pull_request_number,
					body: "Found an issue during the scan. Please check the github action log for more details"
				});
			}
		}

        if(failBuild == 1) {
            core.setFailed("Found an issue during the scan. Please check the above log for more details")   
        } else {
            core.info("Found an issue during the scan. Please check the above log for more details")
        }
    }
}

run()