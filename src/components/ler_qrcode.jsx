import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode"
import { useEffect, useState } from "react";

const LerQrCode = () => {
    const [camera, setCamera] = useState(null)
    const [scanner, setScanner] = useState(null);
    const [result, setResult] = useState(null)

    const startScanning = () => {
        if (!camera) {
            alert("Nenhuma câmera foi encotrada no dispositivo.");
            return;
        }

        const html5QrCode = new Html5Qrcode("reader");
        setScanner(html5QrCode);

        html5QrCode
            .start(
                camera,
                {
                    fps: 1,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText, decodedResult) => {
                    console.log("Código QR lido:", decodedText);
                    setResult(JSON.parse(decodedText))

                },
                (errorMessage) => {
                    console.warn("Erro ao escanear:", errorMessage);
                }
            )
            .catch((err) => {
                console.error("Erro ao iniciar o scanner:", err);
            });
    };

    const stopScanning = () => {
        if (scanner) {
            scanner.stop().then(() => {
                console.log("Scanner parado.");
                console.log(scanner)
            });
        }
    };

    useEffect(() => {
        // Obtenha as câmeras disponíveis ao carregar o componente
        Html5Qrcode.getCameras()
            .then((devices) => {
                if (devices && devices.length > 0) {
                    setCamera(devices[1].id);
                }
            })
            .catch((err) => {
                console.error("Erro ao obter câmeras:", err);
            });
    }, []);

    return (
        <>
            <div className="container-scan-respose">
                <div className="container-scan">
                    <h1>Leitor de QR Code</h1>
                    <div id="reader"></div>
                </div>

                <button onClick={() => {startScanning()}}>
                    Scannear
                </button>

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
