import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode"
import { useEffect, useState } from "react";

import '../style/ler_qrcode_component/ler_qrcode.css'

const LerQrCode = () => {
    const [camera, setCamera] = useState(null)
    const [scanner, setScanner] = useState(null);
    const [result, setResult] = useState(null)

    const startScanning = () => {
        if (!camera) {
            alert("Nenhuma câmera foi encotrada no dispositivo ou a permissão foi negada!");
            return;
        }

        document.getElementById('dados-do-abastecimento').setAttribute('hidden', true)

        const html5QrCode = new Html5Qrcode("reader");
        setScanner(html5QrCode);

        html5QrCode
            .start(
                camera,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText, decodedResult) => {
                    setResult(JSON.parse(decodedText))

                    document.getElementById('stop-scan').click()

                },
                (errorMessage) => {
                    console.warn("Erro ao escanear:", errorMessage);
                }
            )
            .catch((err) => {
                console.error("Erro ao iniciar o scanner:", err);
            });
    };

    function stopScanning() {
        if (scanner) {
            scanner.stop()

            document.getElementById('dados-do-abastecimento').removeAttribute('hidden')

            setScanner(null)
            return
        }
    };

    useEffect(() => {
        // Obtenha as câmeras disponíveis ao carregar o componente
        Html5Qrcode.getCameras()
            .then((devices) => {
                if (devices && devices.length > 0) {
                    setCamera(devices[0].id);
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
                    <p className="text-scan">
                        {scanner === null ? '*Clique em scannear para ler um QRCode*' : ''}
                    </p>
                </div>

                <div id="dados-do-abastecimento">
                    {result && (
                        <>
                            <div className="container-title-dados-abastecimento">
                                <h2 className="title-dados-abastecimento">
                                    Dados do abastecimento
                                </h2>
                            </div>

                            <div className="container-dados-do-motorista">
                                <h2 className="title-container">Motorista</h2>

                                <p className="text-container">
                                    Nome do motorista:
                                    <span className="text-span-container">
                                        {result.usuario}
                                    </span>
                                </p>

                                <p className="text-container">
                                    Modelo:
                                    <span className="text-span-container">
                                        {result.veiculo?.modelo || ''}
                                    </span>
                                </p>
                                <p className="text-container">
                                    Placa:
                                    <span className="text-span-container">
                                        {result.veiculo?.placa || ''}
                                    </span>
                                </p>
                            </div>

                            <div className="container-abastecimento">
                                <h2 className="title-container">
                                    Abastecimento
                                </h2>

                                <p className="text-container">
                                    Tipo do combustivel:
                                    <span className="text-span-container">
                                        {result.tipo_combustivel}
                                    </span>
                                </p>
                                <p className="text-container">
                                    Valor do combustivel:
                                </p>

                                <p className="text-container">
                                    Forma de abastecimento:
                                    <span className="text-span-container">
                                        {result.forma_abastecimento}
                                    </span>
                                </p>

                                <p className="text-container">
                                    Quatidade abastecida:
                                    <span className="text-span-container">
                                        {result.quantidade}
                                    </span>
                                </p>

                                <p className="text-container">
                                    Metodo de pagamento:
                                    <span className="text-span-container">
                                        {result.metodo_pagamento}
                                    </span>
                                </p>
                            </div>

                            <button className="btn-abastecido">
                                Abastecido!
                            </button>
                        </>
                    )}
                </div>

                <div className="container-btns">
                    <button className="btn-scan" onClick={() => { startScanning() }}>
                        Scannear
                    </button>
                    <button className="btn-scan" id="stop-scan" onClick={() => { stopScanning() }}>
                        Parar scanneamento
                    </button>
                </div>
            </div>
        </>
    )
}

export default LerQrCode
