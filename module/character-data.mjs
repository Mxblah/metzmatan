const { HTMLField, NumberField, SchemaField, StringField } = foundry.data.fields

// Main Actor character model, for player characters and NPCs
export class CharacterDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        // Resource, attribute, and skill definitions
        return {
            resources: new SchemaField({
                hp: new SchemaField({
                    min: new NumberField({ required: true, integer: true, initial: -5, label: "ATTRIBUTES.hpMin" }),
                    value: new NumberField({ required: true, integer: true, initial: 5, label: "ATTRIBUTES.hp" }),
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
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                weaponsRanged: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.weaponsRanged" }),
                    coreAttribs: new StringField({ initial: "body" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                celestialMagic: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.celestialMagic" }),
                    coreAttribs: new StringField({ initial: "soul" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                planetaryMagic: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.planetaryMagic" }),
                    coreAttribs: new StringField({ initial: "soul" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                lucidity: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.lucidity" }),
                    coreAttribs: new StringField({ initial: "soul" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                occult: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.occult" }),
                    coreAttribs: new StringField({ initial: "soul" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                acrobatics: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.acrobatics" }),
                    coreAttribs: new StringField({ initial: "body" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                athletics: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.athletics" }),
                    coreAttribs: new StringField({ initial: "body" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                charm: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.charm" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                crafting: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.crafting" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                deception: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.deception" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                disguise: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.disguise" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                electronics: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.electronics" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                engineering: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.engineering" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                history: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.history" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                insight: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.insight" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                intimidation: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.intimidation" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                lifeSciences: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.lifeSciences" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                mechanics: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.mechanics" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                medicine: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.medicine" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                navigation: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.navigation" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                perception: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.perception" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                piloting: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.piloting" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                physicalSciences: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.physicalSciences" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                social: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.social" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                stealth: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.stealth" }),
                    coreAttribs: new StringField({ initial: "body" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                swim: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.swim" }),
                    coreAttribs: new StringField({ initial: "body" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                survival: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.survival" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                thievery: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.thievery" }),
                    coreAttribs: new StringField({ initial: "body" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
                }),
                tracking: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.tracking" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.bonus" })
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
