import { newDamageRoll, renderRollToChat } from "./combat-helpers.mjs"

export function addChatListeners(html) {
    // "Roll damage" handler for Attacks
    html.on("click", "button.roll-damage", _onRollDamage)
}

async function _onRollDamage(event) {
    const target = event.currentTarget
    const data = target.dataset

    // Resolve the roll
    const rollResult = await newDamageRoll(data.parentUuid, data.identifier)
    // console.debug(rollResult)

    // Render the roll
    renderRollToChat(rollResult.chatData, rollResult.rollHTML, null, data)
}
