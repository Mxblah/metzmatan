const { HTMLField, NumberField, SchemaField, StringField } = foundry.data.fields

// Main Actor character model, for player characters and NPCs
export class CharacterDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        // Resource & attribute definitions
        return {
            resources: new SchemaField({
                hp: new SchemaField({
                    min: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.hpMin" }),
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 5, label: "ATTRIBUTES.hp" }),
                    max: new NumberField({ required: true, integer: true, min: 0, initial: 5, label: "ATTRIBUTES.hpMax" }),
                    levelBonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.hpLevelBonus" })
                }),
                mp: new SchemaField({
                    min: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.mpMin" }),
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 4, label: "ATTRIBUTES.mp" }),
                    max: new NumberField({ required: true, integer: true, min: 0, initial: 4, label: "ATTRIBUTES.mpMax" })
                }),
                ap: new SchemaField({
                    min: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.apMin" }),
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.ap" }),
                    max: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.apMax" })
                })
            }),
            attributes: new SchemaField({
                level: new NumberField({ required: true, integer: true, min: 1, initial: 1, label: "ATTRIBUTES.level" }),
                body: new NumberField({ required: true, integer: true, min: 0, initial: 20, label: "ATTRIBUTES.body" }),
                mind: new NumberField({ required: true, integer: true, min: 0, initial: 20, label: "ATTRIBUTES.mind" }),
                soul: new NumberField({ required: true, integer: true, min: 0, initial: 20, label: "ATTRIBUTES.soul" }),
                armorBonus: new NumberField({ required: true, integer: true, initial: 0, label: "ATTRIBUTES.armorBonus" }),
                dodgeBonus: new NumberField({ required: true, integer: true, initial: 0, label: "ATTRIBUTES.dodgeBonus" })
            }),
            skills: new SchemaField({
                weaponsMelee: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.weaponsMelee" }),
                    coreAttribs: new StringField({ initial: "body" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" })
                }),
                weaponsRanged: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.weaponsRanged" }),
                    coreAttribs: new StringField({ initial: "body" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" })
                }),
                celestialMagic: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.celestialMagic" }),
                    coreAttribs: new StringField({ initial: "soul" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" })
                }),
                planetaryMagic: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.planetaryMagic" }),
                    coreAttribs: new StringField({ initial: "soul" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" })
                }),
                lucidity: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.lucidity" }),
                    coreAttribs: new StringField({ initial: "soul" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" })
                }),
                occult: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.occult" }),
                    coreAttribs: new StringField({ initial: "soul" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" })
                }),
                athletics: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.athletics" }),
                    coreAttribs: new StringField({ initial: "body" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" })
                }),
                perception: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.perception" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" })
                })
            })
        }
    }
}

// PC-specific extension of the main class, such as biography and the like
export class PlayerCharacterDataModel extends CharacterDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),

            background: new SchemaField({
                biography: new HTMLField({ required: true, blank: true, label: "BACKGROUND.biography" })
            })
        }
    }
}
