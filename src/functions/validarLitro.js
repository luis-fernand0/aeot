export function validarLitro(e) {
        let input = e.target

        let testeRegex = /^(\d{1,3}(\,\d{1,3}|))$/

        return testeRegex.test(input.value)
    }