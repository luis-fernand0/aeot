export function revealPass(inputPass) {
    const element = document.querySelectorAll(`.eye-icon`)

    for (let i = 0; i < element.length; i++) {
        const btn = element[i];
        btn.classList.toggle('hidden')
    }

    const input = document.querySelectorAll(`.${inputPass}`)
    for (let i = 0; i < input.length; i++) {
        const element = input[i];
        if (element.type === 'password') {
            element.type = 'text'
        } else {
            element.type = 'password'
        }

    }
}