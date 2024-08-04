import { getDOS } from "./helpers/degree-of-success.mjs"

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
                this._prepareWeaponDerivedData()
                break
            case 'spell':
                this._prepareSpellDerivedData()
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

    _prepareWeaponDerivedData() {
        // Generate the weapon formulae based on the item's attributes
        const { attack } = this.system.attributes
        const { damage } = this.system.attributes.attack

        var attackFormula = ''
        if (null != attack.thresholdOverride) {
            attackFormula = `${attack.thresholdOverride} - 1d100`
        } else if (this.parent) {
            // We have an actor parent, so we can use its skills
            attackFormula = `${this.parent.system.skills[`${attack.skill}`].value} - 1d100`
        }
        // (If we have neither a threshold nor a parent, it doesn't make sense to roll anything)
        attack.formula = attackFormula

        var damageFormula = ''
        if (damage.diceSize != "") {
            damageFormula += `${damage.diceNumber}${damage.diceSize}`
        }
        if (damage.diceBonus != "") {
            if (damageFormula != '') {
                damageFormula += damage.diceBonus
            } else {
                damageFormula += ` ${damage.diceBonus}`
            }
        }

        damage.formula = damageFormula
    }

    _prepareSpellDerivedData() {
        // todo, once we get a spell data model going
    }
}
