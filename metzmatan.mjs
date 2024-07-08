import { MzMaActorSheet } from "./module/actor-sheet.mjs"
import { MzMaActor } from "./module/actor.mjs"
import { CharacterDataModel, PlayerCharacterDataModel } from "./module/character.mjs"
import { ArmorDataModel, WeaponDataModel } from "./module/item-data.mjs"

// Foundry initialization
Hooks.once("init", () => {
    // Set up data types
    CONFIG.Actor.dataModels = {
        pc: PlayerCharacterDataModel,
        npc: CharacterDataModel
    }
    CONFIG.Item.dataModels = {
        armor: ArmorDataModel,
        weapon: WeaponDataModel
    }

    // Define Document types
    CONFIG.Actor.documentClass = MzMaActor

    // Register sheet classes
    Actors.unregisterSheet("core", ActorSheet)
    Actors.registerSheet("metzmatan", MzMaActorSheet, {
        makeDefault: true,
        label: "DOCUMENT.actorLabel"
    })

    // Set up trackables
    CONFIG.Actor.trackableAttributes = {
        pc: {
            bar: ["resources.hp", "resources.mp", "resources.ap"],
            value: ["attributes.body", "attributes.mind", "attributes.soul", "attributes.armorBonus", "attributes.dodgeBonus"]
        },
        npc: {
            bar: ["resources.hp", "resources.mp", "resources.ap"],
            value: ["attributes.body", "attributes.mind", "attributes.soul", "attributes.armorBonus", "attributes.dodgeBonus"]
        }
    }

    // Preload handlebars templates
    loadTemplates([
        // Actor sheet partials
        "systems/metzmatan/templates/actor/parts/actor-character-header.hbs",
        "systems/metzmatan/templates/actor/parts/actor-features.hbs",
        "systems/metzmatan/templates/actor/parts/actor-items.hbs",
        "systems/metzmatan/templates/actor/parts/actor-misc-sheet.hbs",
        "systems/metzmatan/templates/actor/parts/actor-skills.hbs",
        "systems/metzmatan/templates/actor/parts/actor-spells.hbs"
    ])
})
