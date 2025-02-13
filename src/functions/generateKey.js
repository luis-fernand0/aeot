export function generateKey(car_plate) {
    let numAleatorio = Math.floor(Math.random() * 3)
    let minutoAtual = new Date().getMinutes().toString().padStart(2, 0)
    let segundoAtual = new Date().getSeconds().toString().padStart(2, 0)
    let placa = car_plate
    let key = placa[numAleatorio] + minutoAtual + segundoAtual

    return key
}