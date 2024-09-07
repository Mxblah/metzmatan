import { MzMaActorSheet } from "./module/actor-sheet.mjs"
import { MzMaItemSheet } from "./module/item-sheet.mjs"
import { MzMaActor } from "./module/actor.mjs"
import { MzMaItem } from "./module/item.mjs"
import { PlayerCharacterDataModel, MonsterDataModel } from "./module/character-data.mjs"
import { ActiveFeatureDataModel, ArmorDataModel, FeatureDataModel, ItemDataModel, WeaponDataModel } from "./module/item-data.mjs"

// Foundry initialization
Hooks.once("init", () => {
    console.log("Initializing the Metzmatan's Mark game system")

    // Set up data types
    CONFIG.Actor.dataModels = {
        pc: PlayerCharacterDataModel,
        npc: PlayerCharacterDataModel, // For now, NPCs are the same as PCs. Later, that might change.
        monster: MonsterDataModel
    }
    CONFIG.Item.dataModels = {
        armor: ArmorDataModel,
        weapon: WeaponDataModel,
        gear: ItemDataModel,
        spell: ActiveFeatureDataModel,
        trait: FeatureDataModel,
        mutation: ActiveFeatureDataModel
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
        "systems/metzmatan/templates/actor/parts/actor-skills.hbs",
        "systems/metzmatan/templates/actor/parts/actor-spells.hbs",
        "systems/metzmatan/templates/actor/parts/actor-actions.hbs",

        // Item sheet partials
        "systems/metzmatan/templates/item/parts/item-header.hbs",
        "systems/metzmatan/templates/item/parts/item-feature-header.hbs",
        "systems/metzmatan/templates/item/parts/item-feature-ability.hbs",
        "systems/metzmatan/templates/item/parts/item-active-attack.hbs",
        "systems/metzmatan/templates/item/parts/item-armor-attributes.hbs",

        // Generic partials
        "systems/metzmatan/templates/generic/parts/description.hbs",
        "systems/metzmatan/templates/generic/parts/effects.hbs"
    ])
})
