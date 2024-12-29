export function checkPass(inputPass, inputConfirmPass, span) {
    const pass = document.getElementById(inputPass)
    const confirmPass = document.getElementById(inputConfirmPass)
    const alertPass = document.querySelectorAll(`.${span}`)

    if (pass.value != confirmPass.value) {
        pass.classList.add('alert-pass')
        confirmPass.classList.add('alert-pass')

        for (let i = 0; i < alertPass.length; i++) {
            const element = alertPass[i];
            element.classList.remove('hidden-span-alert')
        }

        return false
    }

    if (pass.value.length === 0 || confirmPass.value.length === 0) {
        pass.classList.add('alert-pass')
        confirmPass.classList.add('alert-pass')

        for (let i = 0; i < alertPass.length; i++) {
            const element = alertPass[i];
            element.classList.remove('hidden-span-alert')
        }

        return false
    }

    pass.classList.remove('alert-pass')
    confirmPass.classList.remove('alert-pass')
    for (let i = 0; i < alertPass.length; i++) {
        const element = alertPass[i];
        element.classList.add('hidden-span-alert')
    }

    return true
}