import { useState, useEffect } from "react"
import { useNavigate, Link } from 'react-router-dom'
import { QRCodeCanvas } from "qrcode.react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faChevronLeft, faKey } from '@fortawesome/free-solid-svg-icons'

import Loading from "./loading"
import ModalResponse from "./modalResponse"

import { generateKey } from "../functions/generateKey"

import '../style/gerar_qrcode_component/gerar_qrcode.css'
import { deletandoChave } from "../functions/deletandoChave"

const urlData = import.meta.env.VITE_URL_DATAS_USER
const urlCadastrarChave = import.meta.env.VITE_URL_CADASTRAR_CHAVE

const GerarQrCode = () => {
    const navigate = useNavigate()

    const dadosAbastecimento = JSON.parse(localStorage.getItem('dadosAbastecimento'))
    const tokenUser = localStorage.getItem('token');

    const [dataUser, setDataUser] = useState()

    const [dataPosto, setDataPosto] = useState(dadosAbastecimento?.posto || null)
    const [dataAbastecimento, setDataAbastecimento] = useState(dadosAbastecimento || null)
    const [abastecimento, setAbastecimento] = useState()

    const [showQRCode, setShowQRCode] = useState(false)
    const [qrCodeValue, setQrCodeValue] = useState({ qrCode: '', chave: null })
    const [expiracaoQrCode, setExpiracaoQrCode] = useState('')

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    async function callInfoUser() {
        try {
            const response = await fetch(`${urlData}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            if (response.status === 401) {
                navigate('/', { replace: true })
            }
            setDataUser(data)
        } catch (err) {
            setModalMessage(`Desculpe ocorreu um erro inesperado ao consultar o motorista: ${err.message}`)
            setModalVisible(true)
        }
    }

    const calcularPagamento = (valorCombustivel, litrosAbastecidos) => {
        if (dataAbastecimento?.preco) {
            return dataAbastecimento?.preco
        }

        valorCombustivel = Number(valorCombustivel)
        litrosAbastecidos = Number(litrosAbastecidos)

        return parseFloat(valorCombustivel * litrosAbastecidos).toFixed(2)
    }

    const calcularLitros = (valorCombustivel, valorAbastecido) => {
        if (dataAbastecimento?.litros) {
            return dataAbastecimento?.litros
        }

        valorCombustivel = Number(valorCombustivel)
        valorAbastecido = Number(valorAbastecido)

        return parseFloat(valorAbastecido / valorCombustivel).toFixed(3)
    }

    async function generateQrCode() {
        try {
            setLoading(true)

            let chaveID = qrCodeValue.chave || generateKey(dataUser?.placa)

            const qrData = JSON.stringify({
                chave: chaveID,
                driver_id: dataUser?.user_id,
                usuario: dataUser?.nome,
                foto_user: dataUser?.foto,
                veiculo: {
                    modelo: dataUser?.modelo,
                    placa: dataUser?.placa
                },
                posto_user_id: dataPosto?.user_id,
                posto: dataPosto?.nome,
                tipo_combustivel: abastecimento?.combustivel,
                valor_combustivel: abastecimento?.valor,
                metodo_pagamento: abastecimento?.forma_pagamento,
                forma_abastecimento: abastecimento?.forma_abastecimento,
                quantidade: calcularLitros(abastecimento?.valor, dataAbastecimento?.preco),
                valor_total: calcularPagamento(abastecimento?.valor, dataAbastecimento?.litros)
            })

            if (!qrCodeValue.chave) {
                try {
                    const response = await fetch(urlCadastrarChave, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${tokenUser}`,
                            'Content-Type': 'application/json'
                        },
                        body: qrData
                    })

                    const data = await response.json()
                    if (response.status === 401) {
                        navigate('/', { replace: true })
                        return
                    }

                    if (!response.ok) {
                        setModalMessage(data.message)
                        setModalVisible(true)
                        return
                    }

                    let hora_atual = new Date()
                    let dezMinutosDepois = new Date(hora_atual.getTime() + 10 * 60 * 1000)
                    let hora = String(dezMinutosDepois.getHours()).padStart(2, '0')
                    let minuto = String(dezMinutosDepois.getMinutes()).padStart(2, '0')
                    setExpiracaoQrCode(`${hora}:${minuto}`)
                } catch (err) {
                    setModalMessage(err.message)
                    setModalVisible(true)
                }
            }

            setQrCodeValue({ qrCode: qrData, chave: chaveID })
            setShowQRCode(true)

            setTimeout(async () => {
                await deletandoChave(tokenUser, chaveID, 'abastecimento')
                setExpiracaoQrCode('')
                setQrCodeValue({ qrCode: '', chave: null })
                setShowQRCode(false)
                navigate('/abastecimento')
                return
            }, 600000)
        } catch (err) {
            setModalMessage(`Desculpe ocorreu um erro inesperado ao gerar o QRCode! ${err.message}`)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (dadosAbastecimento === null) {
            navigate('/home', { replace: true })
            return
        }
        callInfoUser()
        let combustivel = dadosAbastecimento.tipo_combustivel
        let forma_pagamento = dadosAbastecimento.metodo_pagamento
        let forma_abastecimento = dadosAbastecimento.forma_abastecimento
        let keysFormasValor = Object.keys(dataPosto?.combustiveis?.[combustivel].formas_valor)
        for (let elemento of keysFormasValor) {
            let linhaAtual = dataPosto?.combustiveis?.[combustivel].formas_valor[elemento]
            if (linhaAtual.forma_pagamento == forma_pagamento) {
                if (linhaAtual.forma_abastecimento == forma_abastecimento) {
                    setAbastecimento({ combustivel, forma_pagamento, forma_abastecimento, valor: linhaAtual.valor })
                    break
                }
                setAbastecimento({ combustivel, forma_pagamento, forma_abastecimento, valor: linhaAtual.valor })
            }
        }
    }, [])
    return (
        <>
            <Loading loading={loading} />
            <ModalResponse
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                message={modalMessage} />

            {dataAbastecimento && (
                <>
                    <div className="container-dados-abastecimento">
                        <div className="container-btn-arrow">
                            <Link to={'/abastecimento'}>
                                <button className="btn-arrow">
                                    <FontAwesomeIcon className="arrow-icon" icon={faChevronLeft} />
                                </button>
                            </Link>
                        </div>
                        <div className="container-dados">

                            <h1 className="title-dados-abastecimento">
                                Confirme os dados do abastecimento
                            </h1>

                            <div className="container-posto">
                                <h2 className="title-container title-dados-posto">
                                    Dados do posto de combustivel
                                </h2>

                                <p className="text-container dado-posto-nome">
                                    {dataPosto?.nome}
                                </p>

                                <div className="container-img-posto">
                                    <img
                                        className="img-posto"
                                        src={`https://aeotnew.s3.amazonaws.com/${dataPosto?.foto}`}
                                        alt="foto_posto" />
                                </div>

                                <p className="text-container dado-posto-endereco">
                                    {dataPosto?.endereco}
                                </p>

                                <p className="text-container dado-posto-combustivel">
                                    {abastecimento?.combustivel}:
                                    R$ {abastecimento?.valor}
                                </p>
                            </div>

                            <div className="container-abastecimento">
                                <h2 className="title-container title-abastecimento">
                                    Abastecimento
                                </h2>

                                <div className="container-sobre-abastecimento">
                                    <p className="text-container abastecimento-tipo-combustivel">
                                        Tipo de combustivel: {abastecimento?.combustivel}
                                    </p>

                                    <p className="text-container abastecimento-forma-abastecimento">
                                        Vai abastecer por: {abastecimento?.forma_abastecimento}
                                    </p>

                                    <p className="text-container abastecimento-metodo-pagamento">
                                        Metodo de Pagamento: {abastecimento?.forma_pagamento}
                                    </p>

                                    {abastecimento?.forma_abastecimento != 'Encher Tanque' && (
                                        <>
                                            <p className="text-container abastecimento-preco-ou-litro">
                                                Quantidade que vai abastecer:
                                                {dataAbastecimento?.preco && (
                                                    ` ${calcularLitros(abastecimento?.valor, dataAbastecimento?.preco)} Litros`
                                                )}

                                                {dataAbastecimento.litros && (
                                                    ` ${dataAbastecimento?.litros} Litros`
                                                )}
                                            </p>

                                            <p className="text-container abastecimento-preco-ou-litro">
                                                Valor total:
                                                {dataAbastecimento.preco && (
                                                    ` $R$ ${dataAbastecimento?.preco}`
                                                )}

                                                {dataAbastecimento.litros && (
                                                    ` R$ ${calcularPagamento(abastecimento?.valor, dataAbastecimento?.litros)}`
                                                )}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <button className="btn-criar-qrcode" onClick={() => { generateQrCode() }}>
                                Gerar QRCode de Abastecimento!
                            </button>
                        </div>

                    </div>
                </>
            )}


            {showQRCode && (
                <div className="qrcode-container">
                    <div className="qrcode-btn-close-container">
                        <div className="container-btn-close">
                            <button
                                onClick={() => { setShowQRCode(false) }}
                                className="btn-close">
                                <FontAwesomeIcon className="x-icon" icon={faXmark} />
                            </button>
                        </div>
                        <div className="qrcode">
                            <QRCodeCanvas value={qrCodeValue.qrCode} size={256} />
                            <p>
                                <span>*Mostre o QRCode para o frentista*</span>
                            </p>

                            <p className="tempo-expiracao">
                                <span>
                                    *Valido até: {expiracaoQrCode}*
                                </span>
                            </p>

                            <p>
                                Ou se preferir, envie a chave do QRCode:
                            </p>

                            <p>
                                <FontAwesomeIcon className="key-icon" icon={faKey} /> {qrCodeValue.chave}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}


export default GerarQrCode