export async function getDOS(roll) {
    // Evaluate the roll first so we can see what we're working with
    await roll.evaluate()

    // debug
    console.log(roll.terms)
    console.log(roll.formula)
    console.log(roll.result)
    console.log(roll.total)

    // Find the d100 and get its result
    const d100Result = roll.terms.find((term) => term._faces === 100).results[0].result
    console.log(d100Result)
    const firstDigit = Math.floor(d100Result / 10) % 10 // Extra % 10 so 100 -> 0
    const secondDigit = d100Result % 10
    console.log(`first: ${firstDigit}, second: ${secondDigit}`)

    // todo: determine if brutal by adding up all the bonuses to see if > 100 or < 0

    // Determine if critical
    if (firstDigit === secondDigit) {
        console.log("Roll is critical!")
    }

    return 'nothing yet'
}
