import { onManageActiveEffect, parseBonus, prepareActiveEffectCategories } from "./helpers/effects.mjs"
import { getDOS } from "./helpers/degree-of-success.mjs"
import { getTargetDefense, renderRollToChat } from "./helpers/combat-helpers.mjs"

// General Actor sheet
export class MzMaActorSheet extends ActorSheet {

    // Set up default options to use the custom template
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["metzmatan", "sheet", "actor"],
            template: "systems/metzmatan/templates/actor/actor-sheet.html", // shouldn't be used for anything; dynamically defined below
            width: 800,
            height: 800,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: 'initial' }]
        })
    }

    // Use the template for the specific actor type, if applicable
    get template() {
        return `systems/metzmatan/templates/actor/actor-${this.actor.type}-sheet.hbs`
    }

    // Data preparation for sheet use
    async getData() {
        // Get base sheet, actor, and system data in a convenient form
        const context = super.getData()
        const actorData = context.data
        context.system = actorData.system
        context.flags = actorData.flags
        context.flags.parentUuid = this.actor.uuid

        // Generate PC and NPC data, items, etc.
        switch (actorData.type) {
            case "pc":
                this._prepareItems(context)
                this._preparePcData(context)
                break;
            case "npc":
                this._prepareItems(context)
                this._prepareNpcData(context)
                break;
            case "monster":
                this._prepareMonsterData(context)
                break;
            default:
                break;
        }

        // Add roll data for sheet-based rolls
        context.rollData = context.actor.getRollData()

        // Handle active effects
        context.effects = prepareActiveEffectCategories(this.actor.allApplicableEffects())

        // Localization for skills
        for (let [key, skill] of Object.entries(context.system.skills)) {
            skill.label = game.i18n.localize(`SKILLS.${key}`)
        }

        // All actors get a description to enrich, though they're used slightly differently
        context.enrichedDescription = await TextEditor.enrichHTML(
            this.actor.system.description, {
                secrets: this.document.isOwner, // Only show secrets if we are an owner
                rollData: context.rollData, // For inline rolls
                relativeTo: this.actor, // UUID helper
                async: true
            }
        )

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
            const owner = row.dataset.parentId === this.actor.id || row.dataset.parentId == null ? this.actor : this.actor.items.get(row.dataset.parentId)
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
        context.items = {
            armor: {
                type: 'armor',
                label: game.i18n.localize('TYPES.Item.armor'),
                items: armor
            },
            weapons: {
                type: 'weapon',
                hasAttackRollables: true,
                label: game.i18n.localize('TYPES.Item.weapon'),
                items: weapons
            },
            gear: {
                type: 'gear',
                label: game.i18n.localize('TYPES.Item.gear'),
                items: gear
            }
        }
        context.features = {
            traits: {
                type: 'trait',
                label: game.i18n.localize('TYPES.Item.trait'),
                items: traits
            },
            mutations: {
                type: 'mutation',
                label: game.i18n.localize('TYPES.Item.mutation'),
                items: mutations
            }
        }
        context.spells = {
            spells: {
                type: 'spell',
                hasAttackRollables: true,
                label: game.i18n.localize('TYPES.Item.spell'),
                items: spells
            }
        }
    }

    async _preparePcData(context) {
        // todo! nothing yet!

        return context
    }

    async _prepareNpcData(context) {
        // For now, NPCs are just PCs. Later, this may change
        this._preparePcData(context)

        return context
    }

    async _prepareMonsterData(context) {
        // Attribute flags to enable direct edit access on the sheet (otherwise is handled via formula)
        context.flags.hasEditableMaxHP = true
        context.flags.hasEditableMaxMP = true
        context.flags.hasEditableSpeed = true
        context.flags.hasEditableDB = true

        // Declare all the container types
        const primary = []
        const secondary = []
        const passive = []
        const spells = []
        const misc = []

        // Sort all the stuff into containers based on type
        for (let item of context.items) {
            item.img = item.img || DEFAULT_TOKEN

            switch (item.type) {
                case 'weapon':
                    primary.push(item)
                    break;
                case 'armor':
                    passive.push(item)
                    break;
                case 'trait':
                    passive.push(item)
                    break;
                case 'mutation':
                    // No-action mutations are always secondary / triggered effects. Otherwise, they're primary
                    if (item.system.ability.actions === "") {
                        secondary.push(item)
                    } else {
                        primary.push(item)
                    }
                    break;
                case 'spell':
                    spells.push(item)
                    break;
                default:
                    // Maybe it's stuff the monster is carrying for some reason?
                    misc.push(item)
                    break;
            }
        }

        // Put the containers into the context and return
        context.actions = {
            primary: {
                type: 'weapon',
                hasAttackRollables: true,
                label: game.i18n.localize('DOCUMENT.primary'),
                items: primary
            },
            secondary: {
                type: 'mutation',
                hasAttackRollables: true,
                label: game.i18n.localize('DOCUMENT.secondary'),
                items: secondary
            },
            passive: {
                type: 'trait',
                label: game.i18n.localize('DOCUMENT.passive'),
                items: passive
            },
            spells: {
                type: 'spell',
                label: game.i18n.localize('TYPES.Item.spell'),
                items: spells
            }
        }

        return context
    }

    // Create a new Foundry-item for the actor
    async _onItemCreate(event) {
        event.preventDefault()

        // Gather data / defaults needed to do the create
        const target = event.currentTarget
        const type = target.dataset.type
        const data = foundry.utils.duplicate(target.dataset)
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
            var parsedRollData = data.roll
            if (data.rollType === 'damage' && null != data.damageFormula && null != data.damageBonus) {
                // Damage roll, so construct the roll from the dice and bonus, instead of the roll directly
                const processedBonus = parseBonus(this.actor, data.damageBonus)
                parsedRollData = `${data.damageFormula} + ${processedBonus}`
            } else {
                // Normal roll; just check for the system parse and process normally
                if (data.removeSystem === 'true') {
                    // This is sort of dumb, but the explanation is that we use @system. when parsing bonuses and for dynamic AEs, but Rolls automatically add the system. for attribute keys
                    // So we just remove it here, if it's present
                    parsedRollData = data.roll.replace(/@system\./, '@')
                }
            }

            // For attacks, check to see if we're targeting anything and subtract the appropriate defense if applicable
            var defenseMap = {}
            if (data.rollType === 'attack' && null != data.defense) {
                defenseMap = await getTargetDefense(data.defense)
                // console.debug(defenseMap)

                // Apply the dodge defense directly, since it affects the DT
                // (But check the other defense separately (later) for the PT in getDOS)
                if (null != defenseMap) {
                    parsedRollData += `- ${defenseMap.dodgeValue}`
                }
            }

            // Get the text and roll info
            let label = data.label ? `${data.label}` : ''
            let roll = new Roll(parsedRollData, this.actor.getRollData())

            // Append target name to label if applicable
            if (null != defenseMap && null != defenseMap.targetName) {
                label = label === '' ? `Target: ${defenseMap.targetName}` : `${label} (Target: ${defenseMap.targetName})`
            }

            // Evaluate the roll and retrieve degree of success (for d100-based rolls), which will go into the chat message. This also evaluates the roll.
            var dosResult = {}
            if (parsedRollData.match(/d100/)) {
                if (null != defenseMap && null != defenseMap.defenseValue) {
                    // We have a target defense, so we need to calculate the PT and such
                    dosResult = await getDOS(roll, defenseMap)
                } else {
                    // We don't, so just check for crits
                    dosResult = await getDOS(roll)
                }
            }

            // Generate the ChatMessageData object and the roll's HTML, but don't send it to chat just yet
            var chatData = await roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label,
                rollMode: game.settings.get('core', 'rollMode')
            },
            {
                create: false
            })
            var rollHTML = await roll.render()

            // Instead, send it to the helper function that puts it nicely together
            renderRollToChat(chatData, rollHTML, dosResult, data)
            return roll
        }
    }
}
