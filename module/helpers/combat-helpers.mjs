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
        defenseValue: defenseValue,
        targetName: targetedDocuments[0].actor.name
    }
}

export async function renderRollToChat(chatData, rollHTML, dosResult, clickData) {
    // Debug
    // console.debug('Rendering new roll with the following objects:')
    // console.debug(chatData)
    // console.debug(rollHTML)
    // console.debug(dosResult)
    // console.debug(clickData)

    // Start by putting the roll into the content field as a base
    if (clickData.rollType === 'damage' && null != clickData.damageType && clickData.damageType != "") {
        // Add damage type to roll HTML if this is a damage roll
        chatData.content = await addDamageTypeToRoll(rollHTML, clickData.damageType)
    } else {
        // Normal roll
        chatData.content = rollHTML
    }

    // Add degree of success if applicable
    if (dosResult.content != "") {
        chatData.content += dosResult.content
    }

    // Add damage roll buttons if this is an attack roll
    if (clickData.rollType === 'attack') {
        chatData.content = await addRollDamageButtonsToRoll(chatData.content, dosResult, clickData)
    }

    // Finally, create the chat message
    ChatMessage.create(chatData)
}

async function addDamageTypeToRoll(rollHTML, damageType) {
    // Parse the HTML into a JS object
    let rollObject = new DOMParser().parseFromString(rollHTML, 'text/html')
    // console.debug(rollObject)

    // Localize the damage type and add its associated HTML construct
    let damageHTML = `<p class="damage-roll damage-${damageType} align-center"><i class="${game.i18n.localize(`DAMAGE.types.${damageType}.icon`)}"></i> ${game.i18n.localize(`DAMAGE.types.${damageType}.name`)}</p>`
    let resultHTML = rollObject.getElementsByClassName('dice-result')
    resultHTML[0].insertAdjacentHTML('afterbegin', damageHTML)

    // Return the modified object
    // console.debug(rollObject.body.innerHTML)
    return rollObject.body.innerHTML
}

async function addRollDamageButtonsToRoll(rollHTML, dosResult, data) {
    // Parse the HTML into a JS object
    let rollObject = new DOMParser().parseFromString(rollHTML, 'text/html')
    // console.debug(rollObject)

    // Construct the damage button, including its formula data (in the ID) and hit result classes
    let damageButton = `<button class="roll-damage" type="button" data-hit-result="${dosResult.hitResult}" data-crit-result="${dosResult.critResult}" data-identifier="${data.identifier}"><i class="fas fa-dice-d10"></i> ${game.i18n.localize('ITEMS.weapon.rollDamage')}</button>`
    rollObject.body.insertAdjacentHTML('beforeend', damageButton)

    // Return the modified object
    // console.debug(rollObject.body.innerHTML)
    return rollObject.body.innerHTML
}
