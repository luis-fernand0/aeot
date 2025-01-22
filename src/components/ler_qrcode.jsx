import { Html5Qrcode } from "html5-qrcode"
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import Loading from '../components/loading'
import ModalResponse from '../components/modalResponse'

import '../style/ler_qrcode_component/ler_qrcode.css'

const urlVenda = import.meta.env.VITE_URL_VENDA

const LerQrCode = () => {
    const tokenUser = localStorage.getItem('token')
    const typeUser = localStorage.getItem('type_user')

    const navigate = useNavigate()

    const [scanner, setScanner] = useState(null);

    const [result, setResult] = useState(null)

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const startScanning = async () => {
        const html5QrCode = new Html5Qrcode("reader")

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            })

            const tracks = stream.getVideoTracks()
            const selectedDeviceId = tracks[0].getSettings().deviceId

            document.getElementById('dados-do-abastecimento').setAttribute('hidden', true)

            setScanner(html5QrCode);

            html5QrCode
                .start(
                    { deviceId: selectedDeviceId },
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
                    })
        } catch (err) {
            console.warn(`Não foi possivel usar o facing mode, tentando fallback: ${err}`)

            try {
                const devices = await navigator.mediaDevices.enumerateDevices()
                const videoDevices = devices.filter(device => device.kind === 'videoinput')

                if (videoDevices.length === 0) {
                    alert('Nenhuma câmera foi encotrada no dispositivo!')
                    return
                }

                const rearCamera = videoDevices.find(device =>
                    device.label.toLowerCase().includes('back') ||
                    device.label.toLowerCase().includes('environment')
                )

                const selectedDeviceId = rearCamera ? rearCamera.deviceId : videoDevices[0].deviceId

                document.getElementById('dados-do-abastecimento').setAttribute('hidden', true)

                setScanner(html5QrCode)

                html5QrCode
                    .start(
                        { deviceId: selectedDeviceId },
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
                        })
            } catch (fallBackErr) {
                console.error(`Erro ao tentar usar o fallback: ${fallBackErr}`)
                alert('Não foi possivel acessar nenhuma câmera! Verifique as permissões.')

            }
        }


    }

    function stopScanning() {
        if (scanner) {
            scanner.stop()

            document.getElementById('dados-do-abastecimento').removeAttribute('hidden')

            setScanner(null)
            return
        }
    }

    async function confirmarVenda() {
        setLoading(true)

        const myForm = new FormData()
        myForm.append('driver_id', result.driver_id)
        myForm.append('posto_id', result.posto_user_id)
        myForm.append('combustivel', result.tipo_combustivel)
        myForm.append('forma', result.forma_abastecimento)
        myForm.append('valor', result.valor_combustivel)
        myForm.append('quantidade', result.quantidade)
        myForm.append('valor_total', result.valor_total)
        myForm.append('metodo_pagamento', result.metodo_pagamento)

        const myFormData = Object.fromEntries(myForm)

        try {
            const response = await fetch(urlVenda, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(myFormData)
            })
            const data = await response.json()
            if (response.status === 403) {
                navigate('/', { replace: true })
                return
            }

            setModalMessage(data.message)
            setModalVisible(true)
            setResult(null)
        } catch (err) {
            setModalMessage(`Ocorreu um erro inesperado! ${err.message}`)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (typeUser === 'driver' || !tokenUser) {
            return navigate('/', { replace: true })
        }
    }, [])

    return (
        <>
            <Loading loading={loading} />
            <ModalResponse
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                message={modalMessage}
            />
            <div className="container-scan-respose">
                <div className="container-btn-arrow">
                    <Link to={'/home'}>
                        <button className="btn-arrow">
                            <FontAwesomeIcon className='arrow-icon' icon={faChevronLeft} />
                        </button>
                    </Link>
                </div>

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
                                    <span className="text-span-container">
                                        R$ {result.valor_combustivel}
                                    </span>
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
                                    Valor total:
                                    <span className="text-span-container">
                                        R$ {result.valor_total}
                                    </span>
                                </p>

                                <p className="text-container">
                                    Metodo de pagamento:
                                    <span className="text-span-container">
                                        {result.metodo_pagamento}
                                    </span>
                                </p>
                            </div>

                            <button
                                onClick={() => confirmarVenda()}
                                className="btn-abastecido">
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
