import { parseBonus } from "./effects.mjs"

export async function getDOS(roll, defenseMap) {
    // Evaluate the roll first so we can see what we're working with
    await roll.evaluate()
    // console.debug(roll)

    // Variable init
    var deflectThreshold = 0
    var hitResult = ""
    var critResult = ""
    var messageClass = ""
    var thresholdToParse = ''

    // Determine if brutal and calculate the threshold by adding up all the bonuses to see if > 100 or < 0
    const allNonDieTerms = roll.terms.filter((term) => term._faces == null)
    for (var i = 0; i < allNonDieTerms.length; i++) {
        if (null != allNonDieTerms[i].operator) {
            thresholdToParse += `${allNonDieTerms[i].operator} `
        } else {
            thresholdToParse += `${allNonDieTerms[i].number} `
        }
    }
    deflectThreshold = parseBonus(null, thresholdToParse)

    // Set PT to DT, unless we have a secondary defense value, in which case subtract it
    var pierceThreshold = deflectThreshold
    if (null != defenseMap && null != defenseMap.defenseValue) {
        pierceThreshold = deflectThreshold - defenseMap.defenseValue
    }
    // console.debug(`Calculated thresholds: DT=${deflectThreshold}, PT=${pierceThreshold}`)

    // We need the die result to determine if we pierced or deflected or missed
    const d100Result = roll.terms.find((term) => term._faces === 100).results[0].result
    if (d100Result <= pierceThreshold) {
        hitResult = 'Pierce'
        messageClass = 'roll-pierce'
    } else if (d100Result <= deflectThreshold) {
        // Only possible to hit this if PT != DT, so it's okay to assume defenseValue exists
        hitResult = `Deflect (${defenseMap.defenseValue})`
        messageClass = 'roll-deflect'
    } else {
        hitResult = 'Miss'
        messageClass = 'roll-miss'
    }

    // Determine crit result regardless of attack result
    if (pierceThreshold > 100) {
        critResult = "Brutal hit!"
        messageClass = 'roll-pierce'
    } else if (deflectThreshold <= 0) {
        critResult = "Brutal fumble!"
        messageClass = 'roll-miss'
    } else {
        // If not, find the d100 and get its result
        const firstDigit = Math.floor(d100Result / 10) % 10 // Extra % 10 so 100 -> 0
        const secondDigit = d100Result % 10

        // Then determine if regular critical
        if (firstDigit === secondDigit || d100Result === 1) {
            if (d100Result <= pierceThreshold) {
                critResult = "Critical hit!"
                messageClass = 'roll-pierce'
            } else if (d100Result > deflectThreshold) {
                critResult = "Fumble!"
                messageClass = 'roll-miss'
            }
        }
    }

    let toReturn = {
        hitResult: hitResult.toLowerCase().split(' ')[0],
        critResult: critResult.toLowerCase().replace('!', '').replace(' ', '-'),
        content: ''
    }
    const startingTag = `<p class="${messageClass}">`
    const endingTag = '</p>'
    if (hitResult === "") {
        toReturn.content = `${startingTag}<b>${critResult}</b>${endingTag}`
    } else {
        if (critResult === "") {
            toReturn.content = `${startingTag}${hitResult}${endingTag}`
        } else {
            toReturn.content = `${startingTag}<b>${hitResult} - ${critResult}</b>${endingTag}`
        }
    }
    return toReturn
}
