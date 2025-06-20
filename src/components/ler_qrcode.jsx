import { Html5Qrcode } from "html5-qrcode"
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faKey } from '@fortawesome/free-solid-svg-icons'

import { formasPagamento, combustiveis } from "../functions/contants";
import { formatLitro } from "../functions/formatLitro";

import Loading from '../components/loading'
import ModalResponse from '../components/modalResponse'

import '../style/ler_qrcode_component/ler_qrcode.css'
import { validarLitro } from "../functions/validarLitro";

const urlVenda = import.meta.env.VITE_URL_VENDA
const urlBuscarChave = import.meta.env.VITE_URL_BUSCAR_CHAVE
const urlResgatarBrinde = import.meta.env.VITE_URL_RESGATAR_BRINDE

const LerQrCode = () => {
    const tokenUser = localStorage.getItem('token')
    const typeUser = localStorage.getItem('type_user')

    const navigate = useNavigate()

    const [scanner, setScanner] = useState(null);

    const [result, setResult] = useState(null)
    const [valorTotal, setValorTotal] = useState(null)

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [litroValid, setLitroValid] = useState(false);

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

                        setValorTotal(null)
                        if (document.getElementById('litros-abastecidos')) {
                            document.getElementById('litros-abastecidos').value = ''
                        }

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

    const changeValorTotal = (e) => {
        //se o litro não for valido, porque eu inverto o resultado quando peço para verificar o se o litro é valido ou não, true = false e false = true 
        if (litroValid === true) {
            setValorTotal('0.00')
            document.getElementById('litros-abastecidos').classList.add('litros-abastecidos-alert')
            return
        }

        let litro = e.target.value.replace(/[^0-9]/g, '.')
        litro = Number(litro).toFixed(3)

        setValorTotal(parseFloat(litro * Number(result.valor_combustivel)).toFixed(2))

        if (e.target.value === '') {
            document.getElementById('litros-abastecidos').classList.add('litros-abastecidos-alert')
            return
        }

        document.getElementById('litros-abastecidos').classList.remove('litros-abastecidos-alert')
    }

    async function confirmarVenda() {
        setLoading(true)
        try {
            if (result.forma_abastecimento === 'Encher Tanque') {
                if (!valorTotal || valorTotal == 0.00) {
                    setLoading(false)
                    setModalMessage('*Por favor informe a quantidade abastecida antes de finalizar a venda!')
                    setModalVisible(true)
                    document.getElementById('litros-abastecidos').classList.add('litros-abastecidos-alert')

                    return
                }
            }
            const myForm = new FormData()
            myForm.append('chave', result.chave)
            myForm.append('driver_id', result.driver_id || result.driver_user_id)
            myForm.append('posto_id', result.posto_user_id)

            combustiveis.forEach((combustivel) => {
                if (combustivel.label === result.tipo_combustivel) {
                    result.tipo_combustivel = combustivel.value
                }
            })
            myForm.append('combustivel', result.tipo_combustivel)
            myForm.append('km', result.km)

            if (result.forma_abastecimento === 'Litragem Livre') {
                result.forma_abastecimento = 1
            } else {
                result.forma_abastecimento = 2
            }
            myForm.append('forma_abastecimento', result.forma_abastecimento)

            myForm.append('valor', result.valor_combustivel)
            if (result.forma_abastecimento === 2) {
                const litros = document.getElementById('litros-abastecidos').value.replace(/[^0-9]/g, '.')
                myForm.append('quantidade', litros)
                myForm.append('valor_total', valorTotal)
            } else {
                myForm.append('quantidade', result.quantidade)
                myForm.append('valor_total', result.valor_total)
            }

            formasPagamento.forEach((pagamento) => {
                if (pagamento.label === result.metodo_pagamento) {
                    result.metodo_pagamento = pagamento.value
                }
            })
            myForm.append('forma_pagamento', result.metodo_pagamento)

            const myFormData = Object.fromEntries(myForm)

            const response = await fetch(urlVenda, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(myFormData)
            })
            const data = await response.json()
            if (response.status === 401) {
                navigate('/', { replace: true })
                return
            }

            setModalMessage(data.message)
            setModalVisible(true)
            setResult(null)
            setValorTotal(null)
            document.querySelector('.key-input').value = ''
        } catch (err) {
            setModalMessage(`Ocorreu um erro inesperado! ${err.message}`)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }
    }

    async function resgatarBrinde() {
        setLoading(true)
        try {
            const myForm = new FormData()
            myForm.append('chave', result.chave)
            myForm.append('driver_id', result.driver_id || result.driver_user_id)
            myForm.append('posto_id', result.posto_user_id)
            myForm.append('cod_brinde', result.cod_brinde)
            myForm.append('cod', result.cod)

            const myFormData = Object.fromEntries(myForm)

            const response = await fetch(urlResgatarBrinde, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(myFormData)
            })
            const data = await response.json()
            if (response.status === 401) {
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

    async function buscarChave(e) {
        try {
            setLoading(true)

            const response = await fetch(urlBuscarChave, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chave: e })
            })
            const data = await response.json()

            if (response.status === 401) {
                navigate('/', { replace: true })
                return
            }

            if (!response.ok) {
                setModalMessage(data.message)
                setModalVisible(true)
                setResult(null)
                document.querySelector('.key-input').classList.add('key-input-alert')
                return
            }
            setValorTotal(null)
            if (document.getElementById('litros-abastecidos')) {
                document.getElementById('litros-abastecidos').value = ''
            }
            setResult(data.abastecimento || data.brinde)
            document.querySelector('.key-input').classList.remove('key-input-alert')
        } catch (err) {
            setModalMessage(`Desculpe ocorreu um erro inesperado! ${err.message}`)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }
    }

    function limitarCaracter(e) {
        let key = e.target
        let keyValue = key.value

        if (keyValue.length > 5) {
            keyValue = keyValue.slice(0, 5)
        }

        return key.value = keyValue.toUpperCase()
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
                    {scanner === null && (
                        <>
                            <div className="text-scan-key-input">
                                <p className="text-scan">
                                    *Clique em scannear para ler um QRCode*
                                </p>
                                <p className="text-scan">
                                    Ou se preferir digite a chave do QRCode <FontAwesomeIcon className='key-icon' icon={faKey} /> :
                                </p>

                                <input
                                    onChange={(e) => limitarCaracter(e)}
                                    onBlur={(e) => buscarChave(e.target.value)}
                                    type="text"
                                    className="key-input"
                                    placeholder="Chave QRCode" />
                            </div>
                        </>
                    )}
                </div>

                <div id="dados-do-abastecimento">
                    {result && (
                        <>
                            {result.tipo != 'resgate_de_brinde' && (
                                <div className="container-title-dados-abastecimento">
                                    <h2 className="title-dados-abastecimento">
                                        Dados do abastecimento
                                    </h2>
                                </div>
                            )}

                            <div className="container-dados-do-motorista">
                                <h2 className="title-container">Motorista</h2>

                                <p className="text-container">
                                    Nome do motorista:
                                    <span className="text-span-container">
                                        {result.usuario || result.driver_nome}
                                    </span>
                                </p>

                                <p className="text-container text-img-container">
                                    Foto do motorista:
                                    <img className="img-foto-motorista" src={`https://aeotnew.s3.amazonaws.com/${result.foto_user || result.foto_driver}`} alt="foto-do-motorista" />
                                </p>

                                <p className="text-container">
                                    Modelo:
                                    <span className="text-span-container">
                                        {result.veiculo?.modelo || result.modelo}
                                    </span>
                                </p>
                                <p className="text-container">
                                    Placa:
                                    <span className="text-span-container">
                                        {result.veiculo?.placa || result.placa}
                                    </span>
                                </p>
                            </div>

                            {result.tipo === 'resgate_de_brinde' && (
                                <div className="container-brinde">
                                    <h2 className="title-container">
                                        Brinde
                                    </h2>

                                    <p className="text-container">
                                        Nome do brinde:
                                        <span className="text-span-container">
                                            {result.brinde_nome || result.nome_brinde}
                                        </span>
                                    </p>
                                </div>
                            )}

                            {result.tipo != 'resgate_de_brinde' && (
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
                                        {result.forma_abastecimento === 'Encher Tanque' && (
                                            <>
                                                <span className="text-span-container">
                                                    <input
                                                        onChange={(e) => {
                                                            formatLitro(e);
                                                            setLitroValid(!validarLitro(e))
                                                        }}
                                                        onBlur={(e) => changeValorTotal(e)}
                                                        id="litros-abastecidos"
                                                        name="litros_abastecidos"
                                                        type="text"
                                                        placeholder="Litros abastecido" />
                                                </span>
                                            </>
                                        )}
                                        <span className="text-span-container">
                                            {result.forma_abastecimento === 'Encher Tanque' ? 'Litros' : `${result?.quantidade} Litros`}
                                        </span>
                                    </p>

                                    <p className="text-container">
                                        Valor total:
                                        {result.forma_abastecimento === 'Encher Tanque' && (
                                            <span className="text-span-container">
                                                R$ {valorTotal}
                                            </span>
                                        )}

                                        {result.forma_abastecimento != 'Encher Tanque' && (
                                            <span className="text-span-container">
                                                R$ {result.valor_total}
                                            </span>
                                        )}
                                    </p>

                                    <p className="text-container">
                                        Metodo de pagamento:
                                        <span className="text-span-container">
                                            {result.metodo_pagamento}
                                        </span>
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={() => result.tipo === 'resgate_de_brinde' ? resgatarBrinde() : confirmarVenda()}
                                className="btn-abastecido"
                                disabled={litroValid}>
                                Confirmar!
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
