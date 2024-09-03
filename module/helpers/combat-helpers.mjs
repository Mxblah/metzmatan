export async function getTargetDefense(rollData, defense) {
    // First, get all targeted tokens
    const allTargetData = game.user.targets
    var targetedDocuments = []
    for (let entry of allTargetData.values()) {
        targetedDocuments.push(entry.document)
    }
    // console.debug(targetedDocuments)

    // If we have too many or too few, abort and just return the original value
    if (targetedDocuments.length != 1) {
        console.log(`Found ${targetedDocuments.length} targets; unable to apply defenses to roll`)
        return null
    }

    // Otherwise, get the applicable defense
    var defenseKey = ''
    switch (defense) {
        case 'armor':
            defenseKey = 'armorBonus'
            break;
        default:
            defenseKey = defense // other defenses are named the same as their key
            break;
    }
    // console.debug(`Searching for DB and ${defenseKey} on target using actor set:`)
    // console.debug(targetedDocuments[0].actor)
    const dodgeValue = Number(targetedDocuments[0].actor.system.attributes['dodgeBonus'])
    const defenseValue = Number(targetedDocuments[0].actor.system.attributes[defenseKey])
    // console.debug(`Found defense values ${dodgeValue} and ${defenseValue} on target`)

    // Return the defenses separately for threshold use
    return {
        dodgeValue: dodgeValue,
        defenseValue: defenseValue
    }
}
