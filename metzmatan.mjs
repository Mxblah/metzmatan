import { MzMaActorSheet } from "./module/actor-sheet.mjs"
import { MzMaItemSheet } from "./module/item-sheet.mjs"
import { MzMaActor } from "./module/actor.mjs"
import { MzMaItem } from "./module/item.mjs"
import { CharacterDataModel, PlayerCharacterDataModel } from "./module/character-data.mjs"
import { ArmorDataModel, TraitDataModel, WeaponDataModel } from "./module/item-data.mjs"

// Foundry initialization
Hooks.once("init", () => {
    // Set up data types
    CONFIG.Actor.dataModels = {
        pc: PlayerCharacterDataModel,
        npc: CharacterDataModel
    }
    CONFIG.Item.dataModels = {
        armor: ArmorDataModel,
        weapon: WeaponDataModel,
        trait: TraitDataModel
    }

    // Define Document types
    CONFIG.Actor.documentClass = MzMaActor
    CONFIG.Item.documentClass = MzMaItem

    // Register sheet classes
    Actors.unregisterSheet("core", ActorSheet)
    Actors.registerSheet("metzmatan", MzMaActorSheet, {
        makeDefault: true,
        label: "DOCUMENT.actorLabel"
    })
    Items.unregisterSheet("core", ItemSheet)
    Items.registerSheet("metzmatan", MzMaItemSheet, {
        makeDefault: true,
        label: "DOCUMENT.itemLabel"
    })

    // Use modern AE transfer behavior (not copied to actor, but applies directly from within the item)
    CONFIG.ActiveEffect.legacyTransferral = false

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
        "systems/metzmatan/templates/actor/parts/actor-spells.hbs",

        // Item sheet partials
        "systems/metzmatan/templates/item/parts/item-header.hbs",
        "systems/metzmatan/templates/item/parts/item-feature-header.hbs",
        "systems/metzmatan/templates/item/parts/item-description.hbs",
        "systems/metzmatan/templates/item/parts/item-armor-attributes.hbs",

        // Generic partials
        "systems/metzmatan/templates/generic/parts/effects.hbs"
    ])
})
