import { MzMaActor } from "./module/actor.mjs"
import { CharacterDataModel, PlayerCharacterDataModel } from "./module/character.mjs"

// Foundry initialization
Hooks.once("init", () => {
    // Set up data types
    CONFIG.Actor.dataModels = {
        PC: PlayerCharacterDataModel,
        NPC: CharacterDataModel
    }

    // Define Document types
    CONFIG.Actor.documentClass = MzMaActor

    // Set up trackables
    CONFIG.Actor.trackableAttributes = {
        PC: {
            bar: ["resources.hp", "resources.mp", "resources.ap"],
            value: ["attributes.body", "attributes.mind", "attributes.soul", "attributes.armorBonus", "attributes.dodgeBonus"]
        },
        NPC: {
            bar: ["resources.hp", "resources.mp", "resources.ap"],
            value: ["attributes.body", "attributes.mind", "attributes.soul", "attributes.armorBonus", "attributes.dodgeBonus"]
        }
    }
})
