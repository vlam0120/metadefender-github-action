# MetaDefender Scan GitHub Action

Scan your source code with MetaDefender Core or MetaDefender Cloud

## Usage

To scan with MetaDefender Cloud, please sign up for an account and get the API key, set this API key in your repo setting: Settings > Secret and Variables, use the secret variable in the action file
```
        - name: Scan with MetaDefender
          uses: vlam0120/metadefender-github-action@v32
          with:
            scan-url: 'https://api.metadefender.com/v4/file'
            scan-path: ${{ github.workspace }}/files-to-scan
            exclude-path: ${{ github.workspace }}/files-to-scan/.git
            log-file: ${{ github.workspace }}/log.txt
            apikey: ${{ secrets.MD_CLOUD_APIKEY }}
            fail-build: 1
            show-blocked-file-only: 0

```

* Required
  * scan-url
    * http://\<ip\>/file or https://api.metadefender.com/v4/file
  * scan-path
    * folder to scan
  * log-file
    * file path to generate scan log file
  * fail-build
    * if one of the files is blocked, the build will be failed
   
* Option
  * apikey
    * MetaDefender Core/Cloud API
  * exclude-path
    * do not scan these files, can specify multiple files/folders, e.g: /home/.git/,/home/test.txt    
  * show-blocked-files-only
    * just show blocked results in the log
    * default: 1

Sample YML file
```
name: Scan with MetaDefender
on: 
  push:
    branches: [main]

jobs:

  pipeline_scan:
      runs-on: ubuntu-latest
      name: pipeline scan

      steps:         
        - name: Checkout source code to scan
          uses: actions/checkout@v3.5.3
          with:
            path: files-to-scan

        - name: Install node v16
          uses: actions/setup-node@v1
          with:
            node-version: 16
            
        - name: Scan with MetaDefender
          uses: vlam0120/metadefender-github-action@v32
          with:
            scan-url: 'https://api.metadefender.com/v4/file'
            scan-path: ${{ github.workspace }}/files-to-scan
            exclude-path: ${{ github.workspace }}/files-to-scan/.git
            log-file: ${{ github.workspace }}/log.txt
            apikey: ${{ secrets.MD_CLOUD_APIKEY }}
            fail-build: 1
            show-blocked-file-only: 0
```
