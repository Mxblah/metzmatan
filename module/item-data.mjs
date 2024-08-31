const { HTMLField, NumberField, SchemaField, StringField, BooleanField } = foundry.data.fields

// Works for generic Gear
export class ItemDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new HTMLField({ required: true, blank: true, initial: "", label: "ITEMS.description" }),
            effects: new StringField({ blank: true, initial: "", label: "ITEMS.effects" })
        }
    }
}

// Works for Traits
export class FeatureDataModel extends ItemDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),

            magicClass: new StringField({ blank: true, initial: "Planetary", label: "ATTRIBUTES.magicClass" }),
            realm: new StringField({ blank: true, initial: "Core", label: "ATTRIBUTES.realm" }),
            prerequisites: new StringField({ blank: true, initial: "", label: "DOCUMENT.prerequisites" })
        }
    }
}

// Works for both Spells and Mutations
export class ActiveFeatureDataModel extends FeatureDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),

            ability: new SchemaField({
                type: new StringField({ required: true, initial: "Active", label: "ATTRIBUTES.abilities.type" }),
                actions: new StringField({ required: true, initial: "1 Main", label: "ATTRIBUTES.abilities.actions" }),
                duration: new StringField({ required: true, initial: "Instant", label: "ATTRIBUTES.abilities.duration" }),
                range: new StringField({ required: true, initial: "Self", label: "ATTRIBUTES.abilities.range" }),
                target: new StringField({ required: true, initial: "Self", label: "ATTRIBUTES.abilities.target" }),
                mp: new StringField({ required: true, initial: "0", label: "ATTRIBUTES.abilities.mp" }),
                cooldown: new StringField({ required: true, initial: "Instant", label: "ATTRIBUTES.abilities.cooldown" }),
                description: new HTMLField({ required: true, blank: true, initial: "", label: "ITEMS.description" })
            }),
            attack: new SchemaField({
                formula: new StringField({ blank: true }), // prepared as derived data
                thresholdOverride: new NumberField({ initial: null, nullable: true, label: "ITEMS.weapon.threshold" }), // instead of skill, can specify threshold directly
                skill: new StringField({ initial: "celestialMagic", label: "ITEMS.weapon.skill" }),
                skillLabel: new StringField({ blank: true }), // prepared as derived data
            }),
            damage: new SchemaField({
                formula: new StringField({ blank: true }), // prepared as derived data
                diceFormula: new StringField({ blank: true, initial: "" }), // leave blank for no dice (in which case the bonus will be the damage). ex: "d6", "d12"
                parsedDiceBonus: new StringField({ blank: true, initial: "" }), // leave blank for no bonus (most weapons have no bonus). ex: "1", "-2", "@system.attributes.body / 5"
                type: new StringField({ initial: "fire", label: "ITEMS.weapon.damageType" })
            })
        }
    }
}

// Armor gets its own bespoke class
export class ArmorDataModel extends ItemDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),

            resources: new SchemaField({
                ap: new SchemaField({
                    min: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.apMin" }),
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.ap" }),
                    max: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.apMax" })
                })
            }),
            attributes: new SchemaField({
                isActive: new BooleanField({ initial: false, label: "ITEMS.armor.isActive" }),
                isBroken: new BooleanField({ initial: false, label: "ITEMS.armor.isBroken" }),
                slot: new StringField({ required: true, initial: "clothing", label: "ITEMS.armor.slot" }),
                armorBonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.armorBonus" }),
                damageResistance: new StringField({ blank: true, initial: "", label: "ATTRIBUTES.damageResistance" }),
                hardness: new StringField({ blank: true, initial: "", label: "ATTRIBUTES.hardness" }),
            })
        }
    }
}

// So do weapons
export class WeaponDataModel extends ItemDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),

            attributes: new SchemaField({
                hands: new NumberField({ integer: true, min: 0, max: 2, initial: 1, label: "ITEMS.weapon.hands" }),
            }),
            attack: new SchemaField({
                formula: new StringField({ blank: true }), // prepared as derived data
                thresholdOverride: new NumberField({ initial: null, nullable: true, label: "ITEMS.weapon.threshold" }), // instead of skill, can specify threshold directly
                skill: new StringField({ initial: "weaponsMelee", label: "ITEMS.weapon.skill" }),
                skillLabel: new StringField({ blank: true }), // prepared as derived data
                range: new StringField({ initial: "Melee", label: "ITEMS.weapon.range" }),
                target: new StringField({ initial: "1 creature", label: "ITEMS.weapon.target" }),
            }),
            damage: new SchemaField({
                formula: new StringField({ blank: true }), // prepared as derived data
                diceFormula: new StringField({ blank: true, initial: "" }), // leave blank for no dice (in which case the bonus will be the damage). ex: "d6", "d12"
                parsedDiceBonus: new StringField({ blank: true, initial: "" }), // leave blank for no bonus (most weapons have no bonus). ex: "1", "-2", "@system.attributes.body / 5"
                type: new StringField({ initial: "slashing", label: "ITEMS.weapon.damageType" })
            })
        }
    }
}
