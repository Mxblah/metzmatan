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
}
