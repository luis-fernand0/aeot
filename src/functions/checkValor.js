export function checkValor(e) {
    let input = e.target

    if (input.getAttribute('name') === 'descricao' || input.getAttribute('name') === 'endereco') {
        return
    }
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
        inputValue = input.value.replace(/[^0-9]/g, '')
        inputValue = inputValue.slice(0, 4) + '.' + inputValue.slice(4);
    }


    if (inputValue.length > 7) {
      inputValue = inputValue.slice(0, 7)
    }

    input.value = inputValue
  }