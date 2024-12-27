export function formatarEmail(e) {
    let email = e.target
    email.value = email.value.toLowerCase() 

    return email
}