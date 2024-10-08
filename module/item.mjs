import { getDOS } from "./helpers/degree-of-success.mjs"
import { parseBonus } from "./helpers/effects.mjs"

// Common class for all system Foundry-Items
export class MzMaItem extends Item {
    // Not much to do here, but for weapons we can prepare the damage formula
    prepareDerivedData() {
        super.prepareDerivedData()

        switch (this.type) {
            case 'armor':
                this._prepareArmorDerivedData()
                break
            case 'weapon':
                this._prepareAttackDerivedData()
                break
            case 'mutation':
                this._prepareAttackDerivedData()
                break
            case 'spell':
                this._prepareSpellDerivedData()
                this._prepareAttackDerivedData()
                break
            default:
                break
        }
    }

    // Apply data for use in rolls
    getRollData() {
        // Automatically adds 'this.system' and thus all the regular attributes
        const rollData = { ...super.getRollData() }

        if (!this.actor) {
            // If there's no parent, we're done already
        } else {
            // Otherwise, add the actor data so we can reference it as needed
            rollData.actor = this.actor.getRollData()
        }
        return rollData
    }

    // Called from various actor or item sheets, so defined here for reusability
    async roll() {
        // Declare chat data
        const speaker = ChatMessage.getSpeaker({ actor: this.actor })
        const rollMode = game.settings.get('core', 'rollMode')
        const label = item.name

        if (!this.system.attack.formula) {
            // If there's no formula, assume we should just spit out the description
            ChatMessage.create({
                speaker: speaker,
                rollMode: rollMode,
                flavor: label,
                content: this.system.description
            })
        } else {
            // We've got a formula, so make an attack
            const rollData = this.getRollData()
            const roll = new Roll(rollData.attack.formula, rollData)

            // Evaluate for degree of success and put it in the label if relevant
            const dosResult = await getDOS(roll)
            var flavor = label
            if (dosResult != "") {
                flavor += `: ${dosResult}`
            }

            // Roll those dice (to chat)
            roll.toMessage({
                speaker: speaker,
                rollMode: rollMode,
                flavor: flavor
            })
            return roll
        }
    }

    _prepareArmorDerivedData() {
        const { ap } = this.system.resources
        const { attributes } = this.system

        // Clamp AP to the max/min value
        ap.value = Math.clamp(ap.value, ap.min, ap.max)

        // Determine if armor is broken
        if (ap.value <= 0) {
            attributes.isBroken = true
        } else {
            attributes.isBroken = false
        }
    }

    // Shared between all item types that have attacks (weapons, mutations, and spells)
    _prepareAttackDerivedData() {
        const { attack, damage } = this.system

        // Get the skill friendly name for display purposes
        if (null != attack.thresholdOverride) {
            // Doesn't matter if there's a threshold overriding it
            attack.skillLabel = game.i18n.localize('PLACEHOLDERS.overridden')
        } else {
            attack.skillLabel = game.i18n.localize(`SKILLS.${attack.skill}`)
        }

        // And defense friendly name
        // todo: store this enum somewhere more sensible later
        if (['body', 'mind', 'soul', 'armor'].includes(attack.defense)) {
            attack.defenseLabel = game.i18n.localize(`ATTRIBUTES.${attack.defense}`)
        } else {
            attack.defenseLabel = game.i18n.localize(`PLACEHOLDERS.invalid`)
        }

        // Generate the attack formula based on the item's (and owner's) attributes
        var attackFormula = '(No parent actor)'
        if (null != attack.thresholdOverride && 0 != attack.thresholdOverride) {
            attackFormula = `${attack.thresholdOverride} - 1d100`
        } else if (this.parent) {
            // We have an actor parent, so we can use its skills
            // I would use parseBonus, or just reference this.parent directly, but as skill values are derived data, we often get null back when querying them here
            // Yes, this limitation is incredibly annoying, so instead we just pass a parseable string on to the actor to deal with
            attackFormula = `@skills.${attack.skill}.value - 1d100`
        }
        // (If we have neither a threshold nor a parent, it doesn't make sense to roll anything)
        attack.formula = attackFormula

        // Damage too
        var damageFormula = ''
        if (damage.diceFormula != "") {
            damageFormula += damage.diceFormula
        }
        if (damage.parsedDiceBonus != "") {
            // Similarly to attacks above, I'd love to parse this here, but we can't rely on actor data being consistently derived from an item
            if (damageFormula != '') {
                damageFormula += ` + ${damage.parsedDiceBonus}`
            } else {
                damageFormula += ` ${damage.parsedDiceBonus}`
            }
        }
        damage.formula = damageFormula
    }

    _prepareSpellDerivedData() {
        // todo, once we get a spell data model going
    }
}
