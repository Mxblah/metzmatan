const { HTMLField, NumberField, SchemaField, StringField } = foundry.data.fields

// Main Actor character model, for player characters and NPCs
class CharacterDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        // Resource, attribute, and skill definitions
        return {
            description: new HTMLField({ required: true, blank: true, label: "DOCUMENT.description" }),
            resources: new SchemaField({
                hp: new SchemaField({
                    min: new NumberField({ required: true, integer: true, initial: -5, label: "ATTRIBUTES.hpMin" }),
                    value: new NumberField({ required: true, integer: true, initial: 5, label: "ATTRIBUTES.hp" }),
                    max: new NumberField({ required: true, integer: true, min: 0, initial: 5, label: "ATTRIBUTES.hpMax" }),
                    levelBonus: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.hpLevelBonus" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                mp: new SchemaField({
                    min: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.mpMin" }),
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 4, label: "ATTRIBUTES.mp" }),
                    max: new NumberField({ required: true, integer: true, min: 0, initial: 4, label: "ATTRIBUTES.mpMax" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                ap: new SchemaField({
                    min: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.apMin" }),
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.ap" }),
                    max: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.apMax" })
                })
            }),
            attributes: new SchemaField({
                level: new NumberField({ required: true, integer: true, min: 1, initial: 1, label: "ATTRIBUTES.level" }),
                xp: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "ATTRIBUTES.xp" }),
                body: new NumberField({ required: true, integer: true, min: 0, initial: 20, label: "ATTRIBUTES.body" }),
                mind: new NumberField({ required: true, integer: true, min: 0, initial: 20, label: "ATTRIBUTES.mind" }),
                soul: new NumberField({ required: true, integer: true, min: 0, initial: 20, label: "ATTRIBUTES.soul" }),
                size: new NumberField({ required: true, integer: false, min: 0, initial: 1, label: "ATTRIBUTES.size" }),
                speed: new NumberField({ required: true, integer: true, min: 0, initial: 25, label: "ATTRIBUTES.speed" }),
                speedBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                speedParsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" }),
                armorBonus: new NumberField({ required: true, integer: true, initial: 0, label: "ATTRIBUTES.armorBonus" }),
                dodgeBonus: new NumberField({ required: true, integer: true, initial: 0, label: "ATTRIBUTES.dodgeBonus" }),
                // There *is* a better name for this attribute, but I find this funny.
                dodgeBonusBonus: new NumberField({ required: true, integer: true, initial: 0, label: "ATTRIBUTES.dodgeBonusBonus" }),
                dodgeBonusParsedBonus: new StringField({ required: true, initial: "", label: "ATTRIBUTES.dodgeBonusBonus" })
            }),
            skills: new SchemaField({
                weaponsMelee: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.weaponsMelee" }),
                    coreAttribs: new StringField({ initial: "body" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                weaponsRanged: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.weaponsRanged" }),
                    coreAttribs: new StringField({ initial: "body" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                celestialMagic: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.celestialMagic" }),
                    coreAttribs: new StringField({ initial: "soul" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                planetaryMagic: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.planetaryMagic" }),
                    coreAttribs: new StringField({ initial: "soul" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                lucidity: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.lucidity" }),
                    coreAttribs: new StringField({ initial: "soul" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                occult: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.occult" }),
                    coreAttribs: new StringField({ initial: "soul" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                acrobatics: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.acrobatics" }),
                    coreAttribs: new StringField({ initial: "body" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                athletics: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.athletics" }),
                    coreAttribs: new StringField({ initial: "body" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                charm: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.charm" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                crafting: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.crafting" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                deception: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.deception" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                disguise: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.disguise" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                electronics: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.electronics" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                engineering: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.engineering" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                history: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.history" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                insight: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.insight" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                intimidation: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.intimidation" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                lifeSciences: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.lifeSciences" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                mechanics: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.mechanics" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                medicine: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.medicine" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                navigation: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.navigation" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                perception: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.perception" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                piloting: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.piloting" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                physicalSciences: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.physicalSciences" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                social: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.social" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                stealth: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.stealth" }),
                    coreAttribs: new StringField({ initial: "body" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                swim: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.swim" }),
                    coreAttribs: new StringField({ initial: "body" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                survival: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.survival" }),
                    coreAttribs: new StringField({ initial: "body,mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                thievery: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.thievery" }),
                    coreAttribs: new StringField({ initial: "body" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
                }),
                tracking: new SchemaField({
                    value: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.tracking" }),
                    coreAttribs: new StringField({ initial: "mind" }),
                    ranks: new NumberField({ required: true, integer: true, min: 0, initial: 0, label: "SKILLS.ranks" }),
                    directBonus: new NumberField({ required: true, integer: true, initial: 0, label: "SKILLS.bonus" }),
                    parsedBonus: new StringField({ required: true, initial: "", label: "SKILLS.parsedBonus" })
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
                // todo: nothing here yet, but maybe soon!
            })
        }
    }
}

// Monsters need some extra stuff that PCs don't
export class MonsterDataModel extends CharacterDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema()

            // todo: except they don't yet. maybe soon!
        }
    }
}
