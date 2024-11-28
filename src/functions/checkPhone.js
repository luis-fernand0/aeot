import { maskPhone } from "./maskPhone"

export function checkPhone(e) {
    let input = e.target
    let inputValue = input.value

    if (inputValue.length > 15) {
      inputValue = inputValue.slice(0, 15)
    }

    input.value = inputValue

    input.value = maskPhone(input.value)

    return input
  }