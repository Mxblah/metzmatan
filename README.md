# metzmatan

Official Metzmatan's Mark system for Foundry VTT.

## System Usage and Reference

Useful reading if you plan on implementing macros or modules for this system. Also useful if you plan on contributing to this repo.

### Dynamic Active Effects

This system implements dynamic Active Effects for Items and Actors by extending Effect value parsing outside of core Foundry's Active Effects handler. This allows you to use actor data and math for effect values instead of only static numbers. Most AE handling code lives in `module/helpers/effects.mjs`.

Currently, dynamic Active Effects are supported on Actor skills and Dodge Bonus, with Weapon damage bonus also supporting the same format (though not through the Active Effect handler). Further support will be added as the system develops.

In order to make use of dynamic Active Effects, first ensure that the targeted Attribute Key for the effect is one that is parsed and not a direct key. The attribute key must include `parsed` in its name for this to be true (it will usually be called `parsedBonus`). Check the data models for more information, or search the module for any code calling `parseBonus()` to be extra sure. If you are only adding a static Active Effect, use an attribute key with `direct` in its name instead (usually `directBonus`).

Once you have identified a key that supports this parsing, ensure that all effect values adhere to the following format: `@<attribute.key.separated.by.dots> <mathematical operator> <ordinary number>`. You may include the `system` root element for attribute keys or not; either format is supported. `system.attributes.level` is just as valid as `attributes.level`.

You may add as many attribute references, operators, or numbers as desired, as long as the string starts with `@` and can be split on spaces into a sane expression. Expressions are always evaluated in a strict left-to-right order, ignoring mathematical order of operations. The final calculated result will be passed through the `Math.floor()` function at the end to round down, but all intermediates are unrounded. If the bonus does not work, check the browser console for a warning that will explain what part of the parsing failed.

Be careful when referencing attribute keys that are prepared as derived data (for instance, `system.skills.<skill name>.value`). Depending on the order of derived data preparation, certain values may not be populated when they are referenced by other values. In general, try to reference static data when possible, as this is not easily fixable in the current implementation.

Examples:

* `@system.attributes.level * 2`
* `@attributes.soul / 5`
* `@-20` (Though this is likely better off as a static Active Effect)
* `@system.resources.hp.max + system.attributes.body`
* `@skills.perception.value / 5 / 2` (Though depending on targeted attribute key, the skill value may not be populated and thus may return `null` (0))

If multiple dynamic Active Effects apply to the same parsed attribute key, they will always be added together. If you want your dynamic Active Effect to be subtracted, make it negative. Any other operator is unsupported.
