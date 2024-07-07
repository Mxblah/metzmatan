// General Actor sheet
export class MzMaActorSheet extends ActorSheet {

    // Set up default options to use the custom template
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["metzmatan", "sheet", "actor"],
            template: "systems/metzmatan/templates/actor/actor-sheet.html", // shouldn't be used for anything; dynamically defined below
            width: 600,
            height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }]
        })
    }

    // Use the template for the specific actor type, if applicable
    get template() {
        return `systems/metzmatan/templates/actor/actor-${this.actor.type}-sheet.hbs`
    }

    // Data preparation for sheet use
    getData() {
        // Get base sheet, actor, and system data in a convenient form
        const context = super.getData()
        const actorData = context.data
        context.system = actorData.system
        context.flags = actorData.flags

        // Generate PC and NPC data, items, etc.
        switch (actorData.type) {
            case "pc":
                this._prepareItems(context)
                this._preparePcData(context)
                break;
            case "npc":
                this._prepareItems(context)
                break;
            default:
                break;
        }

        // Add roll data for sheet-based rolls
        context.rollData = context.actor.getRollData()

        return context
    }

    _prepareItems(context) {
        // todo!
        return
    }

    _preparePcData(context) {
        // todo!
        return
    }
}
