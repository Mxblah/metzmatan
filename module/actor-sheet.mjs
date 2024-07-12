import { prepareActiveEffectCategories } from "./helpers/effects.mjs"
import { getDOS } from "./helpers/degree-of-success.mjs"

// General Actor sheet
export class MzMaActorSheet extends ActorSheet {

    // Set up default options to use the custom template
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["metzmatan", "sheet", "actor"],
            template: "systems/metzmatan/templates/actor/actor-sheet.html", // shouldn't be used for anything; dynamically defined below
            width: 800,
            height: 800,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }]
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

        // Organize owned items (Foundry-items) into various containers
        this._prepareItems(context)

        // Handle active effects
        context.effects = prepareActiveEffectCategories(this.actor.allApplicableEffects())

        // Localization for skills
        for (let [key, skill] of Object.entries(context.system.skills)) {
            skill.label = game.i18n.localize(`SKILLS.${key}`)
        }

        return context
    }

    // Controls interactive sheet elements and rollables
    activateListeners(html) {
        super.activateListeners(html)

        // "Edit item" event - before edit check for viewing purposes
        html.on('click', '.item-edit', (event) => {
            const li = $(event.currentTarget).parents('.item')
            const item = this.actor.items.get(li.data('itemId'))
            item.sheet.render(true)
        })

        // Editable only from here on down //
        if (!this.isEditable) { return }

        // "Add item" event
        html.on('click', '.item-create', this._onItemCreate.bind(this))

        // "Delete item" event
        html.on('click', '.item-delete', event =>{
            const itemElement = $(event.currentTarget).parents('.item')
            const item = this.actor.items.get(itemElement.data('itemId'))
            item.delete()
            itemElement.slideUp(200, () => this.render(false))
        })

        // "Edit active effect" event
        html.on('click', '.effect-control', event =>{
            const row = event.currentTarget.closest('li')
            const owner = row.dataset.parentId === this.actor.id ? this.actor : this.actor.items.get(row.dataset.parentId)
            onManageActiveEffect(event, owner)
        })

        // Rollables
        html.on('click', '.rollable', this._onRoll.bind(this))

        // Draggables (i.e. macros)
        if (this.actor.isOwner) {
            let handler = (event) => this._onDragStart(event)
            html.find('li.item').each((i, li) => {
                if (li.classList.contains('inventory-header')) { return }
                li.setAttribute('draggable', true)
                li.addEventListener('dragstart', handler, false)
            })
        }
    }

    _prepareItems(context) {
        // Declare all the container types
        const armor = []
        const weapons = []
        const gear = []
        const traits = []
        const mutations = []
        const spells = []

        // Sort all the stuff into containers based on type
        for (let item of context.items) {
            item.img = item.img || DEFAULT_TOKEN

            // If only I didn't want these to be plural I could just assign via type directly without a switch
            switch (item.type) {
                case 'armor':
                    armor.push(item)
                    break;
                case 'weapon':
                    weapons.push(item)
                    break;
                case 'gear':
                    gear.push(item)
                    break;
                case 'trait':
                    traits.push(item)
                    break;
                case 'mutation':
                    mutations.push(item)
                    break;
                case 'spell':
                    spells.push(item)
                    break;
                default:
                    // shouldn't be possible, but let's just assume it's Gear and be done with it
                    gear.push(item)
                    break;
            }
        }

        // Put the containers into the context and return
        context.armor = armor
        context.weapons = weapons
        context.gear = gear
        context.traits = traits
        context.mutations = mutations
        context.spells = spells
    }

    _preparePcData(context) {
        // todo!
        return
    }

    // Create a new Foundry-item for the actor
    async _onItemCreate(event) {
        event.preventDefault()

        // Gather data / defaults needed to do the create
        const target = event.currentTarget
        const type = target.dataset.type
        const data = duplicate(target.dataset)
        const name = `New ${type.capitalize()}`
        const itemData = {
            name: name,
            type: type,
            data: data
        }

        // Type is already in the top level, so we don't need it twice
        delete itemData.data['type']

        // Make that item(s)
        return await this.actor.createEmbeddedDocuments('Item', [itemData])
    }

    async _onRoll(event) {
        event.preventDefault()

        const target = event.currentTarget
        const data = target.dataset

        // Foundry-item rollables
        if(data.rollType && data.rollType == 'item') {
            const itemId = target.closest('.item').dataset.itemId
            const item = this.actor.items.get(itemId)
            if (item) { return item.roll() }
        }

        // Direct formula rollables
        if (data.roll) {
            // Get the text and roll info
            let label = data.label ? `${data.label}` : ''
            let roll = new Roll(data.roll, this.actor.getRollData())

            // Evaluate the roll and retrieve degree of success, which will go into the chat message. This also evaluates the roll.
            const content = await getDOS(roll)

            // Roll those dice (to chat)
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label,
                content: content,
                rollMode: game.settings.get('core', 'rollMode')
            })
            return roll
        }
    }
}
