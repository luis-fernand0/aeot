import { Html5QrcodeScanner } from "html5-qrcode"
import { useEffect, useState } from "react";

const LerQrCode = () => {
    const [result, setResult] = useState({})

    const onScanSuccess = (decodedText, decodedResult) => {
        // Ação quando o QR Code é lido com sucesso
        console.log("Texto decodificado:", decodedText);
        console.log(JSON.parse(decodedText))
        setResult(JSON.parse(decodedText))
    }

    const onScanFailure = (error) => {
        // Ação quando ocorre um erro
        console.warn("Erro na leitura:", error);
    };

    // Configurar o scanner
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader", // ID do elemento onde o scanner será renderizado
            {
                fps: 10, // Leituras por segundo
                qrbox: { width: 250, height: 250 } // Tamanho da área de leitura
            },
            false // Não mostrar logs detalhados
        );

        scanner.render(onScanSuccess, onScanFailure);

        // Cleanup para evitar problemas de memória
        return () => scanner.clear();
    }, []);


    return (
        <>
            <div className="container-scan-respose">
                <div className="container-scan">
                    <h1>Leitor de QR Code</h1>
                    <div id="reader"></div>
                </div>

                {result && (
                    <>
                        <h2>
                            Dados do abastecimento
                        </h2>

                        <p>
                            Nome do motorista: {result.usuario}
                        </p>
                        <p>
                            Modelo: {result.veiculo?.modelo || ''}
                        </p>
                        <p>
                            Placa: {result.veiculo?.placa || ''}
                        </p>

                        <p>
                            Tipo do combustivel: {result.tipo_combustivel}
                        </p>
                        <p>
                            Valor do combustivel:
                        </p>
                        <p>
                            Forma de abastecimento: {result.forma_abastecimento}
                        </p>
                        <p>
                            Quatidade abastecida: {result.quantidade}
                        </p>
                        <p>
                            Metodo de pagamento: {result.metodo_pagamento}
                        </p>
                    </>
                )}

            </div>
        </>
    )
}

export default LerQrCode