import fs from "node:fs"
import path from "node:path"
import { exit } from "node:process"

// Workaround for nodejs 18; starting in 20 we can just use import.meta.dirname directly
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
const __dirname = dirname(fileURLToPath(import.meta.url));

// Control vars from environment
const apiKey = process.env.FOUNDRY_API_KEY
const mode = process.env.FOUNDRY_PUBLISH_MODE
let dryRun = true
if (mode === 'PUBLISH') {
    console.log('PUBLISHING REAL RELEASE')
    dryRun = false
} else {
    console.log('Doing dry run')
}

// Gather information from system.json
const systemJson = fs.readFileSync(path.resolve(__dirname, '../system.json'), { 'encoding': 'utf-8' })
const systemInfo = JSON.parse(systemJson)
let maximumVersion = "" // Do this one separately because it's usually empty
if (null != systemInfo.compatibility.maximum) {
    maximumVersion = systemInfo.compatibility.maximum
}
const ghOrg = 'Mxblah' // And this one separately because it's not guaranteed to be in the system.json either

// Additional pipeline-related validation
if (null != process.env.GH_TAG && process.env.GH_TAG.replace('v', '') != systemInfo.version) {
    console.error(`GITHUB AND MANIFEST VERSION MISMATCH!\nGitHub: ${process.env.GH_TAG.replace('v', '')} | Manifest: ${systemInfo.version}\nNot publishing release; manual intervention required!`)
    exit(1)
}

// Abort if we don't have a key
if (null == apiKey) {
    console.log('No API key provided; exiting')
    exit(0)
}

// Build and send web request
let response = await fetch("https://api.foundryvtt.com/_api/packages/release_version/", {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
    },
    method: "POST",
    body: JSON.stringify({
        "id": systemInfo.id,
        "dry-run": dryRun,
        "release": {
            "version": systemInfo.version,
            "manifest": `https://raw.githubusercontent.com/${ghOrg}/${systemInfo.id}/v${systemInfo.version}/system.json`,
            "notes": `https://github.com/${ghOrg}/${systemInfo.id}/releases/tag/v${systemInfo.version}`,
            "compatibility": {
                "minimum": systemInfo.compatibility.minimum,
                "verified": systemInfo.compatibility.verified,
                "maximum": maximumVersion
            }
        }
    })
})
let responseData = await response.json()

// Print received output
console.log(`Received response status ${responseData.status}`)
if (null != responseData.message) {
    console.log(`Additional information: ${responseData.message}`)
}
if (responseData.status != 'success') {
    console.error('Package release failed; full response object is dumped below')
    console.error(responseData)
    throw new Error("Received non-success response from Foundry API")
}
