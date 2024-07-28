export async function getDOS(roll) {
    // Evaluate the roll first so we can see what we're working with
    await roll.evaluate()

    // Determine if brutal by adding up all the bonuses to see if > 100 or < 0
    const allNumberTerms = roll.terms.filter((term) => term.number != null && term._faces == null)
    var sum = 0
    var result = ""
    for (var i = 0; i < allNumberTerms.length; i++) {
        sum += allNumberTerms[i].number
    }

    if (sum > 100) {
        result = "Brutal hit!"
    } else if (sum <= 0) {
        result = "Brutal fumble!"
    } else {
        // If not, find the d100 and get its result
        const d100Result = roll.terms.find((term) => term._faces === 100).results[0].result
        const firstDigit = Math.floor(d100Result / 10) % 10 // Extra % 10 so 100 -> 0
        const secondDigit = d100Result % 10

        // Then determine if regular critical
        if (firstDigit === secondDigit) {
            if (d100Result <= sum) {
                result = "Critical hit!"
            } else {
                result = "Fumble!"
            }
        }
    }

    return result
}
