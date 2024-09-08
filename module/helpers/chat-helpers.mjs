export function addChatListeners(html) {
    // "Roll damage" handler for Attacks
    html.on("click", "button.roll-damage", _onRollDamage)
}

function _onRollDamage(event) {
    const target = event.currentTarget
    const data = target.dataset

    // todo
    console.log('Not implemented yet!')
}
