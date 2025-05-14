export function formatLitro(e) {
        let input = e.target
        let inputValue = input.value.replace(/[^0-9]/g, '')

        if (inputValue.length > 1) {
            inputValue = inputValue.slice(0, 1) + '.' + inputValue.slice(1);
        }
        if (inputValue.length > 4) {
            inputValue = input.value.replace(/[^0-9]/g, '')
            inputValue = inputValue.slice(0, 2) + '.' + inputValue.slice(2);
        }
        if (inputValue.length > 5) {
            inputValue = input.value.replace(/[^0-9]/g, '')
            inputValue = inputValue.slice(0, 3) + '.' + inputValue.slice(3);
        }

        if (inputValue.length > 6) {
            inputValue = inputValue.slice(0, 6)
        }

        return input.value = inputValue
    }