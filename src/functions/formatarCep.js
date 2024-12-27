export function formatarCep(e) {
    var cep = e.target
    var cepValue = cep.value.replace(/[^0-9]/g, '')

    if (cepValue.length > 5) {
        cepValue = cepValue.slice(0, 5) + '-' + cepValue.slice(5)
    }
    if (cepValue.length > 9) {
        cepValue = cepValue.slice(0, 9)
    }

    cep.value = cepValue

    return cep
}