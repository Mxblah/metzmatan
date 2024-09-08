import { parseBonus } from "./effects.mjs"

export async function getTargetDefense(defense) {
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

export async function getSelectedToken() {
    // First, get all selected tokens
    const allSelectedTokens = canvas.tokens.controlled
    var selectedDocuments = []
    for (let entry of allSelectedTokens.values()) {
        selectedDocuments.push(entry.document)
    }

    // If we don't have exactly one, it's unknown what we should return, so just say that
    if (selectedDocuments.length != 1) {
        ui.notifications.warn(`Found ${selectedDocuments.length} selected tokens; please select exactly one token.`)
        return null
    }

    // Now we know we have exactly one, so return it
    return selectedDocuments[0].actor
}

export async function newDamageRoll(actorUUID, itemID) {
    // Get the data we need to work with
    // console.debug(actorUUID)
    // console.debug(itemID)
    const actor = await fromUuid(actorUUID)
    const item = await actor.items.get(itemID)

    // Find the damage formula and resolve it
    const processedBonus = parseBonus(actor, item.system.damage.parsedDiceBonus)
    const parsedRollData = `${item.system.damage.diceFormula} + ${processedBonus}`
    const roll = new Roll(parsedRollData, actor.getRollData())

    // Generate the ChatMessageData object and the roll's HTML, but don't send it to chat just yet; instead, return the data for further processing
    const chatData = await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        flavor: item.name,
        rollMode: game.settings.get('core', 'rollMode')
    },
    {
        create: false
    })
    const rollHTML = await roll.render()

    return {
        chatData: chatData,
        rollHTML: rollHTML
    }
}

export async function renderRollToChat(chatData, rollHTML, dosResult, data) {
    // console.debug('Rendering new roll with the following objects:')
    // console.debug([chatData, rollHTML, dosResult, data])

    // Start by putting the roll into the content field as a base
    if (data.rollType === 'damage' && null != data.damageType && data.damageType != "") {
        // Add damage type to roll HTML if this is a damage roll
        chatData.content = await addDamageTypeToRoll(rollHTML, data.damageType)
    } else {
        // Normal roll
        chatData.content = rollHTML
    }

    // Add degree of success if applicable
    if (null != dosResult && null != dosResult.content && dosResult.content != "") {
        chatData.content += dosResult.content
    }

    // Add damage roll buttons if this is an attack roll
    if (data.rollType === 'attack') {
        chatData.content = await addRollDamageButtonsToRoll(chatData.content, dosResult, data)
    }
    // Or damage apply buttons if this is a damage roll
    if (data.rollType === 'damage') {
        chatData.content = await addApplyDamageButtonsToRoll(chatData.content, dosResult, data)
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
    let damageButton = `<button class="roll-damage" type="button" data-roll-type="damage" data-hit-result="${dosResult.hitResult}" data-crit-result="${dosResult.critResult}" data-parent-uuid="${data.parentUuid}" data-identifier="${data.identifier}" data-damage-formula="${data.damageFormula}" data-damage-bonus="${data.damageBonus}" data-damage-type="${data.damageType}"><i class="fas fa-dice-d10"></i> ${game.i18n.localize('ITEMS.weapon.rollDamage')}</button>`
    rollObject.body.insertAdjacentHTML('beforeend', damageButton)

    // Return the modified object
    // console.debug(rollObject.body.innerHTML)
    return rollObject.body.innerHTML
}

async function addApplyDamageButtonsToRoll(rollHTML, dosResult, data) {
    // Parse the HTML into a JS object and get the total damage to apply
    let rollObject = new DOMParser().parseFromString(rollHTML, 'text/html')
    // console.debug(rollObject)
    const diceTotal = rollObject.getElementsByClassName('dice-total')[0]
    const totalDamage = Number(diceTotal.innerText)
    // console.debug(totalDamage)

    // We do actually need a dosResult for the buttons to render properly, so let's just empty-string it out if we don't have one
    if (null == dosResult) {
        dosResult = {
            hitResult: '',
            critResult: ''
        }
    }

    // Construct the damage apply button, including its formula data (in the ID) and hit result classes
    let buttons = ''
    for (let result of ['pierce', 'deflect']) {
        let hitMarker = ''
        if (dosResult.hitResult === result) {
            // Indicates what the user "should" click, but they are still allowed to hit the other button if they want
            hitMarker = ' <i class="text-darkred fas fa-bullseye-arrow"></i>'
        }

        buttons += `<button class="apply-damage" type="button" data-hit-result="${result}" data-crit-result="${dosResult.critResult}" data-total-damage="${totalDamage}" data-damage-type="${data.damageType}"><i class="fas fa-dice-d10"></i> ${game.i18n.localize(`ROLLS.results.${result}`)}${hitMarker}</button>`
    }
    rollObject.body.insertAdjacentHTML('beforeend', `<div class="flexrow apply-damage-container">${buttons}</div>`)

    // Return the modified object
    // console.debug(rollObject.body.innerHTML)
    return rollObject.body.innerHTML
}
