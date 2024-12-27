export function formatarPlaca(e) {
    var placa = e.target
    var placaValue = placa.value.replace(/[^A-Za-z0-9]/g, '');

    if (placaValue.length > 3) {
        placaValue = placaValue.slice(0, 3) + '-' + placaValue.slice(3);
    }
    if (placaValue.length > 8) {
        placaValue = placaValue.slice(0, 8);
    }

    placa.value = placaValue.toUpperCase()

    return placa
}