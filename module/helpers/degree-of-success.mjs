export async function getDOS(roll, defenseValue) {
    // Evaluate the roll first so we can see what we're working with
    await roll.evaluate()

    // Determine if brutal by adding up all the bonuses to see if > 100 or < 0
    const allNumberTerms = roll.terms.filter((term) => term.number != null && term._faces == null)
    var deflectThreshold = 0
    var hitResult = ""
    var critResult = ""
    var messageClass = ""
    for (var i = 0; i < allNumberTerms.length; i++) {
        deflectThreshold += allNumberTerms[i].number
    }

    // ... Unless we have a defense value, in which case the PT isn't the DT
    var pierceThreshold = deflectThreshold
    if (null != defenseValue) {
        pierceThreshold = deflectThreshold - defenseValue
    }
    // console.debug(`Calculated thresholds: DT=${deflectThreshold}, PT=${pierceThreshold}`)

    // We need the die result to determine if we pierced or deflected or missed
    const d100Result = roll.terms.find((term) => term._faces === 100).results[0].result
    if (d100Result <= pierceThreshold) {
        hitResult = 'Pierce'
        messageClass = 'roll-pierce'
    } else if (d100Result <= deflectThreshold) {
        hitResult = 'Deflect'
        messageClass = 'roll-deflect'
    } else {
        hitResult = 'Miss'
        messageClass = 'roll-miss'
    }

    // Determine crit result regardless of attack result
    if (pierceThreshold > 100) {
        critResult = "Brutal hit!"
        messageClass = 'roll-pierce'
    } else if (pierceThreshold <= 0) {
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

    const startingTag = `<p class="${messageClass}">`
    const endingTag = '</p>'
    if (hitResult === "") {
        return `${startingTag}<b>${critResult}</b>${endingTag}`
    } else {
        if (critResult === "") {
            return `${startingTag}${hitResult}${endingTag}`
        } else {
            return `${startingTag}<b>${hitResult} - ${critResult}</b>${endingTag}`
        }
    }
}
