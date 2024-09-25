# Ongoing Todo List

## Current roadmap

### 0.2.0 hopefuls

- [X] Update release workflow to include a static manifest URL for that specific version
- [ ] Update release workflow to trigger on push to main and create the tag + do the full release automatically by parsing system.json
- [X] Use Foundry Package Release API for releases
- [X] Generate the rulebook PDF automatically, or at least automatically add it to the release download
- [ ] Use IDs instead of direct data to handle attack/damage
- [ ] Damage type handling with [type] syntax
- [ ] Untyped and unknown damage types
- [ ] Attack description to chat for attacks
- [ ] Description to chat for Items (inc. spells, etc.)
- [X] armor isActive toggle from the actor Items section
- [X] armor automatically enforces only one active item per slot
- [X] "Refill all armor" button
- [ ] Spell MP cost when cast
- [ ] Spell scaling with MP spent (choose MP to use)
- [.] Inline rollables for spells, mutations, etc.
- [ ] Hardness, weakness, etc. for armor and innately
- [ ] Recovery checks for Dying
- [ ] Add custom status effects to CONFIG.statusEffects
- [ ] Improve the Build / release process for compendia (reduce churn, auto-clean, standardize / remove unneeded fields?)
- [ ] More compendium entries
- [ ] Update Foundry description and README with more info on the system

### 0.3.0 hopefuls

- [ ] Automatic release notes build to handle changelog, readme, etc. versioning and such automatically
- [ ] organize item lists on sheet into grids for consistency
- [ ] Sort items in lists on sheet (alphabetically?)
- [ ] crits actually do things besides have extra text
- [ ] secondary attacks cannot crit
- [ ] Speed types, senses
- [ ] Rest buttons
- [ ] Mutation sheet attack tab toggle?
- [ ] Enums and dropdowns for validated fields?
- [ ] Status integration for status attacks (via AEs)
- [ ] Ongoing damage integration
- [ ] Better inline rollables (integrate with targeting system, allow attribute references)
- [ ] Monster categories on sheets

### 0.4.0 hopefuls

- [ ] "Energy" damage type resolution

## Completed versions

### 0.1.0

- [X] (all the stuff I did before starting this list)
- [X] weapon sheet
- [X] weapon rollables
- [X] floor rollables in a sensible way
- [X] spells to actor sheet
- [X] spell rollables
- [X] mutation rollables (should be free with spells)
- [X] character biography on sheet
- [X] monster sheets / automation
- [X] monster stats decoupled from prepared data
- [X] HP level bonus and other hidden keys on sheets
- [X] size and speed on character sheets
- [X] AB goes away when armor is broken or not active
- [X] target-based combat threshold automation
- [X] localize damage type / label for roll results
- [X] Target name in targeted rolls
- [X] Initiative
- [X] Add total armor to attack chat html for clarity
- [X] (bonus) a really basic compendium pack
- [X] (bonus) roll damage buttons in chat cards
- [X] (bonus) apply damage buttons in chat cards
- [X] decide on a license(s)
- [X] Release workflow
