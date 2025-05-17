export function formatLitro(e) {
        let input = e.target
        let inputValue = input.value.replace(/[^0-9,]/g, '')

        if (inputValue.length > 7) {
            inputValue = inputValue.slice(0, 7)
        }

        return input.value = inputValue
    }