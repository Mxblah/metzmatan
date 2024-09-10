import { getAllActiveArmorItems } from "./combat-helpers.mjs";

// General multipurpose function to apply damage to an actor
export async function applyDamage(actor, damage, type, hitResult) {
    // console.debug([actor, damage, type, hitResult])

    switch (hitResult) {
        case 'pierce':
            applyDamageToHP(actor, damage, type)
            break;
        case 'deflect':
            applyDamageToArmor(actor, damage, type)
            return
        default:
            ui.notifications.error(`Unsupported hit result ${hitResult} - cannot apply damage`)
            return
    }
}

async function applyDamageToHP(actor, damage, type) {
    // Variable init
    const { hp } = actor.system.resources
    let newHpValue = hp.value

    // Handle damage adjustments
    damage = await _adjustDamage(actor, damage, type)

    // Override for massive damage rules
    if (damage >= hp.max) {
        // todo: make this a localized chat message or something instead, but for now at least it's not opaque what's happening
        ui.notifications.info(`${actor.name} was killed instantly by massive damage!`)
        newHpValue = hp.min
    } else {
        newHpValue = hp.value - damage
    }

    // Actually apply the damage (use the update() method to ensure the token refreshes)
    actor.update({"system.resources.hp.value": newHpValue})

    // Handle statuses on different HP thresholds
    // todo: later, handle Wounded, which changes these thresholds
    if (newHpValue <= hp.min) {
        // The character has died. Ouch.
        _killCharacter(actor)
    } else if (newHpValue <= 0) {
        // The character is dying. Oof.
        _knockOutCharacter(actor)
    }
}

async function applyDamageToArmor(actor, damage, type) {
    // Get the active armor items, sorted by priority
    let activeArmorItems = await getAllActiveArmorItems(actor)

    // Apply damage to each armor item in turn, stopping when we run out of damage or armor
    for (let armor of activeArmorItems) {
        // Damage is re-adjusted for each armor layer
        damage = await _adjustDamage(armor, damage, type)

        // Get current AP of item
        const { ap } = armor.system.resources
        let newApValue = ap.value

        // Calculate and apply damage
        if (damage <= ap.value) {
            newApValue = ap.value - damage
            damage = 0
        } else {
            damage -= ap.value
            newApValue = 0
            // todo: make this a localized chat message or something later
            ui.notifications.info(`${actor.name}'s ${armor.name} broke!`)
        }
        armor.update({"system.resources.ap.value": newApValue})

        // If we're out of damage, update the token and we're done. Otherwise, keep looping
        if (damage <= 0) {
            actor.update({})
            break
        }
    }

    // If we made it here, it means we're out of armor items but still have remaining damage
    // Therefore, apply whatever's left over to HP (the token will update from the HP damage)
    applyDamageToHP(actor, damage, type)
}

// Adjusts damage based on DR, Hardness, Weakness, etc. Works on Actors or (armor) Items
async function _adjustDamage(target, damage, type) {
    // todo!
    return damage
}

async function _killCharacter(actor) {
    // For now, just apply the "dead" status in the GUI, if it isn't already there
    if (!actor.statuses.has('dead')) {
        actor.toggleStatusEffect('dead')
    }
}

async function _knockOutCharacter(actor) {
    // Apply the "unconscious" status in the GUI, if it isn't already there
    if (!actor.statuses.has('unconscious')) {
        actor.toggleStatusEffect('unconscious')
    }

    // Add the Dying effect
    // Todo: make this a real Dying effect later, but for now just co-opt one that already exists
    if (!actor.statuses.has('degen')) {
        actor.toggleStatusEffect('degen')
    }
}
