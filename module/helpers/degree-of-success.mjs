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
    if (null == defenseMap) { defenseMap = {} } // avoid undefined exceptions later; we still handle null values properly

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
    if (null != defenseMap.defenseValue) {
        pierceThreshold = deflectThreshold - defenseMap.defenseValue
    }
    // console.debug(`Calculated thresholds: DT=${deflectThreshold}, PT=${pierceThreshold}`)

    // We need the die result to determine if we pierced or deflected or missed
    const d100Result = roll.terms.find((term) => term._faces === 100).results[0].result
    if (d100Result <= pierceThreshold) {
        hitResult = 'pierce'
    } else if (d100Result <= deflectThreshold) {
        // Only possible to hit this if PT != DT, so it's okay to assume defenseValue exists
        hitResult = 'deflect'
    } else {
        hitResult = 'miss'
    }

    // Determine crit result regardless of attack result
    if (pierceThreshold > 100) {
        critResult = "brutal-hit"
    } else if (deflectThreshold <= 0) {
        critResult = "brutal-fumble"
    } else {
        // If not, find the d100 and get its result
        const firstDigit = Math.floor(d100Result / 10) % 10 // Extra % 10 so 100 -> 0
        const secondDigit = d100Result % 10

        // Then determine if regular critical
        if (firstDigit === secondDigit || d100Result === 1) {
            if (d100Result <= pierceThreshold) {
                critResult = "critical-hit"
            } else if (d100Result > deflectThreshold) {
                critResult = "critical-fumble"
            }
        }
    }

    let toReturn = {
        hitResult: hitResult,
        critResult: critResult,
        content: await getDOSContentFromResult(hitResult, critResult, defenseMap.defenseValue)
    }

    return toReturn
}

export async function getDOSContentFromResult(hitResult, critResult, defenseValue) {
    // Little helper function to prepare HTML content from the raw results
    const startingTag = `<p class="roll-${hitResult}">`
    const endingTag = '</p>'
    let prettyHitResult = game.i18n.localize(`ROLLS.results.${hitResult}`)
    if (hitResult === 'deflect' && null != defenseValue) {
        prettyHitResult += ` (${defenseValue})`
    }
    const prettyCritResult = game.i18n.localize(`ROLLS.crits.${critResult}`)

    if (hitResult === "") {
        return `${startingTag}<b>${prettyCritResult}</b>${endingTag}`
    } else {
        if (critResult === "") {
            return `${startingTag}${prettyHitResult}${endingTag}`
        } else {
            return `${startingTag}<b>${prettyHitResult} - ${prettyCritResult}</b>${endingTag}`
        }
    }
}
