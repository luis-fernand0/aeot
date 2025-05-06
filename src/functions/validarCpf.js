export function validarCpf(inputCpf) {
    const cpf = String(inputCpf).replace(/\W+/g, "")    

	var numeros, digitos, soma, i, resultado, digitos_iguais;

	digitos_iguais = true;
	
	if (cpf.length < 11) return false;

	for (i = 0; i < cpf.length - 1; i++) {
		if (cpf.charAt(i) != cpf.charAt(i + 1)) {
			digitos_iguais = false;
			break;
		}
    }

	if (!digitos_iguais) {
		numeros = cpf.substring(0, 9);
		digitos = cpf.substring(9);
		soma = 0;

		for (let pesos = 10; pesos > 1; pesos--) {
			soma += numeros.charAt(10 - pesos) * pesos;
        }

		resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

		if (resultado != digitos.charAt(0)) return false;

		numeros = cpf.substring(0, 10);
		soma = 0;

		for (let pesos = 11; pesos > 1; pesos--)
			soma += numeros.charAt(11 - pesos) * pesos;

		resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

		if (resultado != digitos.charAt(1)) return false;

		return true;

	} else return false;
}