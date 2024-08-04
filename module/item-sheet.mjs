import { onManageActiveEffect, prepareActiveEffectCategories } from "./helpers/effects.mjs"

// General Item class sheet
export class MzMaItemSheet extends ItemSheet {
    // Default options for the custom template
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["metzmatan", "sheet", "item"],
            template: "systems/metzmatan/templates/item/item-sheet.html", // shouldn't be used for anything; dynamically defined below
            width: 600,
            height: 480,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        })
    }

    // Use the template for the specific item type, if applicable
    get template() {
        return `systems/metzmatan/templates/item/item-${this.item.type}-sheet.hbs`
    }

    // Prepare data for item sheet use
    getData() {
        const context = super.getData()
        const itemData = context.data

        // Get roll data for use on the sheet, and some other useful bits for easier access
        context.rollData = this.item.getRollData()
        context.system = itemData.system
        context.flags = itemData.flags
        context.effects = prepareActiveEffectCategories(this.item.effects)

        return context
    }

    // Handle rollables and such
    activateListeners(html) {
        super.activateListeners(html)

        // Editable only from here on down //
        if (!this.isEditable) { return }

        // Manage an active effect
        html.on('click', '.effect-control', (event) =>
            onManageActiveEffect(event, this.item)
        )

        // There's nothing to really roll directly from the Item card, so no rollable handlers here
    }
}
