const { HTMLField, NumberField, SchemaField, StringField, BooleanField } = foundry.data.fields

class ItemDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new HTMLField({ required: true, blank: true, label: "ITEMS.description" })
        }
    }
}

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
                slot: new StringField({ required: true, initial: "clothing", label: "ITEMS.armor.slot" }),
                armorBonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.armorBonus" }),
                damageResistance: new StringField({ blank: true, initial: "", label: "ATTRIBUTES.damageResistance" }),
                hardness: new StringField({ blank: true, initial: "", label: "ATTRIBUTES.hardness" }),
                effects: new StringField({ blank: true, initial: "", label: "ITEMS.effects" })
            })
        }
    }
}

export class WeaponDataModel extends ItemDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),

            attributes: new SchemaField({
                hands: new NumberField({ integer: true, min: 0, max: 2, initial: 1, label: "ITEMS.weapon.hands" }),
                attack: new SchemaField({
                    skill: new StringField({ initial: "weaponsMelee", label: "ITEMS.weapon.skill" }),
                    range: new StringField({ initial: "Melee", label: "ITEMS.weapon.range" }),
                    target: new StringField({ initial: "1 creature", label: "ITEMS.weapon.target" }),
                    effects: new StringField({ blank: true, initial: "", label: "ITEMS.effects" }),
                    damage: new SchemaField({
                        diceNumber: new NumberField({ integer: true, min: 0, initial: 1 }), // should be 0 if diceSize is blank
                        diceSize: new StringField({ blank: true, initial: "" }), // leave blank for no dice (in which case the bonus will be the damage)
                        diceBonus: new StringField({ blank: true, initial: "" }), // leave blank for no bonus (most weapons have no bonus)
                        formula: new StringField({ blank: true }) // prepared as derived data
                    })
                })
            })
        }
    }
}
