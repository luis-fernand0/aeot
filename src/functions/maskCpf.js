export function maskCpf(e) {
    var cpf = e.target
    var cpfValue = cpf.value.replace(/[^0-9]/g, '')

    if (cpfValue.length > 3) {
        cpfValue = cpfValue.slice(0, 3) + '.' + cpfValue.slice(3);
    }
    if (cpfValue.length > 7) {
        cpfValue = cpfValue.slice(0, 7) + '.' + cpfValue.slice(7);
    }
    if (cpfValue.length > 11) {
        cpfValue = cpfValue.slice(0, 11) + '-' + cpfValue.slice(11);
    }
    if (cpfValue.length > 14) {
        cpfValue = cpfValue.slice(0, 14)
    }
    cpf.value = cpfValue

    return cpf
}