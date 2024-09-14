import fs from "node:fs"
import path from "node:path"
import { extractPack } from "@foundryvtt/foundryvtt-cli"

// Get pack folders
const packFolders = fs.readdirSync('packs', { withFileTypes: true })

// Process each one
for (let i = 0; i < packFolders.length; i++) {
    const folder = packFolders[i]
    console.log(`Processing ${folder.name}`)
    const packSource = path.join('packs', folder.name, '_source')
    const packDB = path.join('packs', folder.name)
    await extractPack(packDB, packSource, { log: true })
}
