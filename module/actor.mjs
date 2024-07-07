// Common class for all system actors
export class MzMaActor extends Actor {
    // Update derived information from stats
    prepareDerivedData() {
        super.prepareDerivedData()

        // Various useful shortcuts
        const { hp, mp } = this.system.resources
        const { level, body, mind, soul } = this.system.attributes

        // Resources //
        // Clamp and handle HP based on formula
        hp.max = Math.floor(body / 5 + hp.levelBonus)
        hp.value = Math.clamp(hp.value, hp.min, hp.max)
        hp.levelBonus = Math.clamp(hp.levelBonus, Math.floor(level / 4) + 1, (Math.floor(level / 4) + 1) * 6)

        // Clamp and handle MP based on formula
        mp.max = Math.floor((mind + soul) / 5 - 4)
        mp.value = Math.clamp(mp.value, mp.min, mp.max)

        // Handle DB based on formula
        this.system.attributes.dodgeBonus = Math.floor(body / 5 - 4)
    }

    // Apply data for use in rolls
    getRollData() {
        const data = super.getRollData()

        switch (this.type) {
            case "PC":
                this._getPCRollData(data)
                break;
            case "NPC":
                this._getNPCRollData(data)
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

    _getPCRollData() {
        // todo!
        return
    }

    _getNPCRollData() {
        // todo!
        return
    }
}
