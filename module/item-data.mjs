const { HTMLField, NumberField, SchemaField, StringField, BooleanField } = foundry.data.fields

class ItemDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new HTMLField({ required: true, blank: true, initial: "", label: "ITEMS.description" }),
            effects: new StringField({ blank: true, initial: "", label: "ITEMS.effects" })
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
                isBroken: new BooleanField({ initial: false, label: "ITEMS.armor.isBroken" }),
                slot: new StringField({ required: true, initial: "clothing", label: "ITEMS.armor.slot" }),
                armorBonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.armorBonus" }),
                damageResistance: new StringField({ blank: true, initial: "", label: "ATTRIBUTES.damageResistance" }),
                hardness: new StringField({ blank: true, initial: "", label: "ATTRIBUTES.hardness" }),
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
                    formula: new StringField({ blank: true }), // prepared as derived data
                    thresholdOverride: new NumberField({ initial: null, nullable: true, label: "ITEMS.weapon.threshold" }), // instead of skill, can specify threshold directly
                    skill: new StringField({ initial: "weaponsMelee", label: "ITEMS.weapon.skill" }),
                    range: new StringField({ initial: "Melee", label: "ITEMS.weapon.range" }),
                    target: new StringField({ initial: "1 creature", label: "ITEMS.weapon.target" }),
                    damage: new SchemaField({
                        diceNumber: new NumberField({ integer: true, min: 0, initial: 1 }), // should be 0 if diceSize is blank
                        diceSize: new StringField({ blank: true, initial: "" }), // leave blank for no dice (in which case the bonus will be the damage). ex: "d6", "d12"
                        diceBonus: new StringField({ blank: true, initial: "" }), // leave blank for no bonus (most weapons have no bonus). ex: "+1", "-2"
                        formula: new StringField({ blank: true }) // prepared as derived data
                    })
                })
            })
        }
    }
}
