export function prepareActiveEffectCategories(effects) {
    // General effect categories
    const categories = {
        inactive: {
            type: 'inactive',
            label: game.i18n.localize('EFFECTS.type.inactive'),
            effects: []
        },
        status: {
            type: 'status',
            label: game.i18n.localize('EFFECTS.type.status'),
            effects: []
        },
        passive: {
            type: 'passive',
            label: game.i18n.localize('EFFECTS.type.passive'),
            effects: []
        }
    }

    // Sort those effects!
    for (let effect of effects) {
        if (effect.disabled) { categories.inactive.effects.push(effect) }
        else if (effect.isTemporary) { categories.status.effects.push(effect) }
        else { categories.passive.effects.push(effect) }
    }

    return categories
}

export function onManageActiveEffect(event, owner) {
    event.preventDefault()

    // Gather relevant elements and the effect itself
    const target = event.currentTarget
    const li = target.closest('li')
    const effect = li.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null

    // Create with default template or edit/delete/toggle
    switch (target.dataset.action) {
        case 'create':
            return owner.createEmbeddedDocuments('ActiveEffect', [
                {
                    name: game.i18n.format('DOCUMENT.New', {
                        type: game.i18n.localize('DOCUMENT.ActiveEffect')
                    }),
                    img: 'icons/svg/aura.svg',
                    origin: owner.uuid,
                    'duration.rounds': li.dataset.effectType === 'status' ? 1 : undefined,
                    disabled: li.dataset.effectType === 'inactive'
                }
            ])

        case 'edit':
            return effect.sheet.render(true)

        case 'delete':
            return effect.delete()

        case 'toggle':
            return effect.update({ disabled: !effect.disabled })

        default:
            throw `Invalid action ${target.dataset.action}`
    }
}
