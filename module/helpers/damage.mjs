// General multipurpose function to apply damage to an actor
export async function applyDamage(actor, damage, type, hitResult) {
    // console.debug([actor, damage, type, hitResult])

    switch (hitResult) {
        case 'pierce':
            // This one is pretty straightforward: just subtract from HP
            // todo: handle type and Hardness, Weakness, DR, etc.
            const { hp } = actor.system.resources
            let newHpValue = hp.value

            // Override for massive damage rules
            if (damage >= hp.max) {
                // todo: make this a chat message or something instead, but for now at least it's not opaque what's happening
                ui.notifications.info(`${actor.name} was killed instantly by massive damage!`)
                newHpValue = hp.min
            } else {
                newHpValue = hp.value - damage
            }

            // Apply damage (use the update() method to ensure the token refreshes)
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
            break;
        case 'deflect':
            ui.notifications.info('Deflect damage is not yet supported. Check back soon!')
            return
        default:
            ui.notifications.error(`Unsupported hit result ${hitResult} - cannot apply damage`)
            return
    }
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
    if (!actor.statuses.has('degenerating')) {
        actor.toggleStatusEffect('degenerating')
    }
}
