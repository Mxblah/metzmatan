export async function getDOS(roll) {
    // Evaluate the roll first so we can see what we're working with
    roll.evaluate()

    // debug
    console.log(roll.terms)
    console.log(roll.formula)
    console.log(roll.result)
    console.log(roll.total)

    // Find the d100 and get its result
    const d100Object = roll.terms.find((term) => term._faces === 100)
    console.log(d100Object)
    const d100Result = d100Object.results[0].result
    console.log(d100Result)

    return 'nothing yet'
}
