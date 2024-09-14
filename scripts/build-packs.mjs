import fs from "node:fs"
import path from "node:path"
import { compilePack } from "@foundryvtt/foundryvtt-cli"

// Get pack folders
const packFolders = fs.readdirSync('packs', { withFileTypes: true }).filter(item => item.isDirectory())

// Process each one
for (let i = 0; i < packFolders.length; i++) {
    const folder = packFolders[i]
    console.log(`Processing ${folder.name}`)
    const packSource = path.join('packs', folder.name, '_source')
    const packDest = path.join('packs', folder.name)
    await compilePack(packSource, packDest, { recursive: true, log: true })
}
