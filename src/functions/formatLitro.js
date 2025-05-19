export function formatLitro(e) {
    let input = e.target
    let inputValue = input.value.replace(/[^0-9,]/g, '')

    let caracter = ",";
    let limite = 1;

    function limitarVirgula(string, caractere, limite) {
        let countVirgula = 0;
        let novaString = "";

        for (let i = 0; i < string.length; i++) {
            if (string[i] === caractere) {
                countVirgula++;
                if (countVirgula > limite) {
                    novaString += "";
                } else {
                    novaString += string[i];
                }
            } else {
                novaString += string[i];
            }
        }

        return novaString;
    }

    inputValue = limitarVirgula(inputValue, caracter, limite);

    if (inputValue.length > 7) {
        inputValue = inputValue.slice(0, 7)
    }
    
    return input.value = inputValue
}