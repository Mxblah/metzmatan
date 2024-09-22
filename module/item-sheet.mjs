import { onManageActiveEffect, prepareActiveEffectCategories } from "./helpers/effects.mjs"
import { toggleArmorActiveState } from "./helpers/combat-helpers.mjs"

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
    async getData() {
        const context = super.getData()
        const itemData = context.data

        // Get roll data for use on the sheet, and some other useful bits for easier access
        context.rollData = this.item.getRollData()
        context.system = itemData.system
        context.flags = itemData.flags
        context.effects = prepareActiveEffectCategories(this.item.effects)

        // Enrich HTML for buttons and such
        context.enrichedDescription = await TextEditor.enrichHTML(
            this.item.system.description, {
                secrets: this.document.isOwner, // Only show secrets if we are an owner
                rollData: context.rollData, // For inline rolls
                relativeTo: this.item, // UUID helper
                async: true
            }
        )
        // And do it again for the ability description, if it has one
        if (['mutation', 'spell'].includes(this.item.type))
        context.enrichedAbilityDescription = await TextEditor.enrichHTML(
            this.item.system.ability.description, {
                secrets: this.document.isOwner, // Only show secrets if we are an owner
                rollData: context.rollData, // For inline rolls
                relativeTo: this.item, // UUID helper
                async: true
            }
        )

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

        // Toggleables
        html.on('click', '.toggleable', this._onToggle.bind(this))

        // There's nothing to really roll directly from the Item card, so no rollable handlers here
    }

    async _onToggle(event) {
        event.preventDefault()

        const target = event.currentTarget
        const data = target.dataset
        let actor = null
        if (null != this.item.parent) {
            actor = this.item.parent
        }

        // Pass the relevant data to the appropriate handler
        switch (data.action) {
            case 'armorActive':
                // It's okay for actor to be null; that'll just toggle the item normally
                toggleArmorActiveState(actor, this.item)
                break
            default:
                // No recognized action defined, so do nothing
                break
        }
    }
}
