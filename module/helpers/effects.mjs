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

export function parseBonus(document, bonusString) {
    // Parses a bonus string against the passed-in document and returns an integer bonus instead
    if (bonusString === "" || null == bonusString) {
        // Short-circuit; nothing to do
        return 0
    }
    var calculatedBonus = 0
    const bonusArray = bonusString.split("@")

    // Parse each individual term
    for (let term of bonusArray) {
        if (term === "" || null == term) { continue }
        // console.debug(`Parsing '${term}'`)

        var lastToken = 0
        var lastOperator = null
        for (let token of term.split(" ")) {
            if (token === "" || null == token) { continue }
            // console.debug(`Parsing '${token}'`)
            var currentToken = null
            var currentOperator = null

            if (['+','-','/','*'].includes(token)) {
                // Token is an operator
                // console.debug(`${token} is an operator`)
                currentOperator = token
            } else if (token.match(/^-?\d+$/g)) {
                // Token is a number
                // console.debug(`${token} is a number`)
                currentToken = Number(token)
            } else {
                // Otherwise, token is assumed to be a property reference, so get it from the document
                // console.debug(`${token} is a reference`)
                if (! token.match(/^system\./)) {
                    token = `system.${token}`
                    // console.debug(`Expanded token to ${token}`)
                }
                currentToken = _getNestedProperty(document, token.split("."))
                if (currentToken == undefined) {
                    const message = `Found unparseable reference string when attempting to parse bonus string: '${bonusString}'\nInvalid key string '${token}'\nThis bonus will not be applied.`
                    ui.notifications.warn(message)
                    console.warn(message)
                    return 0
                }
            }

            // If we have a last token and a last operator and a current token, do some math to combine
            if (null != lastOperator && null != currentToken) {
                // console.debug(`Operating: ${lastToken} ${lastOperator} ${currentToken}`)
                switch (lastOperator) {
                    case "*":
                        lastToken = lastToken * currentToken
                        break
                    case "/":
                        lastToken = lastToken / currentToken
                        break
                    case "+":
                        lastToken = lastToken + currentToken
                        break
                    case "-":
                        lastToken = lastToken - currentToken
                        break
                }
                lastOperator = null
            } else if (null != currentOperator) {
                // We have a current operator, but not enough numbers to use it, so store it for later
                // console.debug(`Storing ${currentOperator} for later`)
                lastOperator = currentOperator
            } else {
                // We must have a current token, but not enough operators or numbers to use it, so store it for later
                // console.debug(`Storing ${currentToken} for later`)
                lastToken = currentToken
            }
        }

        // After that, we should have a final lastToken that has had all the math done to it
        // console.debug(`Incrementing by ${lastToken} (${Math.floor(lastToken)})`)
        if (typeof lastToken != 'number') {
            // Final sanity check
            const message = `Returned non-numerical value when attempting to parse bonus string: '${bonusString}'\nThis bonus will not be applied.`
            ui.notifications.warn(message)
            console.warn(message)
            return 0
        }
        calculatedBonus += Math.floor(lastToken)
    }

    // console.debug(`Final calculated bonus: ${calculatedBonus}`)
    return calculatedBonus
}

// Recursive helper function to get nested properties of an object
function _getNestedProperty(document, propertyArray) {
    // console.debug(`Searching ${document} for ${propertyArray[0]}`)
    if (document == undefined || document == null) {
        // Sanity check
        return undefined
    }

    // Get the current property, then either return if that's the last one or continue to the next if it isn't
    if (propertyArray.length <= 1) {
        // console.debug(`Found ${document[propertyArray[0]]}`)
        return document[propertyArray[0]]
    } else {
        return _getNestedProperty(document[propertyArray[0]], propertyArray.slice(1))
    }
}
