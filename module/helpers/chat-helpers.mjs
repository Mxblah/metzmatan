import { getSelectedToken, newDamageRoll, renderRollToChat } from "./combat-helpers.mjs"
import { applyDamage } from "./damage.mjs"

export function addChatListeners(html) {
    // "Roll damage" handler for Attacks
    html.on("click", "button.roll-damage", _onRollDamage)

    // "Apply damage" handler for Damage
    html.on("click", "button.apply-damage", _onApplyDamage)
}

async function _onRollDamage(event) {
    const target = event.currentTarget
    const data = target.dataset

    // Resolve the roll
    const rollResult = await newDamageRoll(data.parentUuid, data.identifier, data.critResult)
    // console.debug(rollResult)

    // Render the roll
    const dosResult = {
        hitResult: data.hitResult,
        critResult: data.critResult
    }
    renderRollToChat(rollResult.chatData, rollResult.rollHTML, dosResult, data)
}

async function _onApplyDamage(event) {
    const target = event.currentTarget
    const data = target.dataset

    // We're applying damage, so get the currently selected token to apply it to
    const actor = await getSelectedToken()

    // Then, apply the damage
    if (null != actor) {
        applyDamage(actor, data.totalDamage, data.damageType, data.hitResult)
    }
}
