// Common class for all system actors
export class MzMaActor extends Actor {
    // Update derived information from stats
    prepareDerivedData() {
        super.prepareDerivedData()

        // Various useful shortcuts
        const { hp, mp } = this.system.resources
        const { level, body, mind, soul } = this.system.attributes
        const { skills } = this.system

        // Resources //
        // Clamp and handle HP based on formula
        hp.levelBonus = Math.clamp(hp.levelBonus, Math.floor(level / 4) + 1, (Math.floor(level / 4) + 1) * 6)
        hp.max = Math.floor(body / 5 + hp.levelBonus)
        hp.min = -hp.max
        hp.value =  Math.clamp(hp.value, hp.min, hp.max)

        // Clamp and handle MP based on formula
        mp.max = Math.floor((mind + soul) / 5 - 4)
        mp.value = Math.clamp(mp.value, mp.min, mp.max)

        // Handle DB based on formula
        this.system.attributes.dodgeBonus = Math.floor(body / 5 - 4) + this.system.attributes.dodgeBonusBonus

        // Skills //
        for (let [key, skill] of Object.entries(skills)) {
            // Determine the maximum value of the core attributes that influence this skill
            var attribArray = []
            skill.coreAttribs.split(",").forEach(attrib => {
                var attribValue = eval(`${attrib}`) / 5
                attribArray.push(attribValue)
            })
            var attribBonus = Math.max(...attribArray)

            // Then add the base threshold to the ranks and bonus to get the full value
            skill.value = Math.floor(attribBonus + skill.ranks + skill.bonus)
        }
    }

    // Apply data for use in rolls
    getRollData() {
        const data = super.getRollData()

        switch (this.type) {
            case "pc":
                this._getPcRollData(data)
                break;
            case "npc":
                this._getNpcRollData(data)
                break;
            default:
                break;
        }

        // Shared data preparation //
        // All characters have the core attributes, so copy them to the top level for roll usage
        if (data.attributes) {
            for (let [k, v] of Object.entries(data.attributes)) {
                data[k] = foundry.utils.deepClone(v)
            }
        }

        return data
    }

    _getPcRollData() {
        // todo!
        return
    }

    _getNpcRollData() {
        // todo!
        return
    }
}
