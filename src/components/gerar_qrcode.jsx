import { useState, useEffect } from "react"
import { useNavigate, Link } from 'react-router-dom'
import { QRCodeCanvas } from "qrcode.react"
import { nanoid } from "nanoid"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faChevronLeft, faKey } from '@fortawesome/free-solid-svg-icons'

import Loading from "./loading"
import ModalResponse from "./modalResponse"

import '../style/gerar_qrcode_component/gerar_qrcode.css'

const urlData = import.meta.env.VITE_URL_DATAS_USER
const urlCadastrarChave = import.meta.env.VITE_URL_CADASTRAR_CHAVE

const GerarQrCode = () => {
    const navigate = useNavigate()

    const abastecimento = JSON.parse(localStorage.getItem('dadosAbastecimento'))
    const tokenUser = localStorage.getItem('token');

    const [dataUser, setDataUser] = useState()

    const [dataPosto, setDataPosto] = useState(abastecimento?.posto || null)
    const [dataAbastecimento, setDataAbastecimento] = useState(abastecimento || null)

    const [showQRCode, setShowQRCode] = useState(false)
    const [qrCodeValue, setQrCodeValue] = useState({ qrCode: '', chave: null })

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    async function callInfoUser() {
        const response = await fetch(`${urlData}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenUser}`,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        if (response.status === 403) {
            navigate('/', { replace: true })
        }

        setDataUser(data)
    }

    const calcularPagamento = (formaAbastecimento, num1, num2) => {
        if (formaAbastecimento === 'valor') {
            return (num2).toFixed(2)
        }

        return parseFloat(num1 * num2).toFixed(2)
    }

    const calcularLitros = (formaAbastecimento, num1, num2) => {
        if (formaAbastecimento != 'valor') {
            return num2
        }

        return parseFloat(num2 / num1).toFixed(2)
    }

    async function generateQrCode() {
        try {
            setLoading(true)
            
            let chaveID = qrCodeValue.chave || nanoid(6) + dataUser?.user_id

            const qrData = JSON.stringify({
                chave: chaveID,
                driver_id: dataUser?.user_id,
                usuario: dataUser?.nome,
                foto_user: dataUser?.foto,
                veiculo: {
                    modelo: dataUser?.modelo,
                    placa: dataUser?.placa
                },
                posto_user_id: dataPosto[0]?.user_id,
                posto: dataPosto[0]?.nome,
                tipo_combustivel: dataAbastecimento?.tipo_combustivel,
                valor_combustivel: dataPosto[0].combustivel[dataAbastecimento?.tipo_combustivel]?.valor,
                metodo_pagamento: dataAbastecimento?.metodo_pagamento,
                forma_abastecimento: dataAbastecimento?.forma_abastecimento,
                quantidade: calcularLitros(
                    dataAbastecimento?.forma_abastecimento,
                    Number(dataPosto[0].combustivel[dataAbastecimento.tipo_combustivel]?.valor),
                    Number(dataAbastecimento.litros)
                ),
                valor_total: calcularPagamento(
                    dataAbastecimento?.forma_abastecimento,
                    Number(dataPosto[0].combustivel[dataAbastecimento.tipo_combustivel]?.valor),
                    Number(dataAbastecimento.litros)
                )
            })

            if (!qrCodeValue.chave) {
                const response = await fetch(urlCadastrarChave, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${tokenUser}`,
                        'Content-Type': 'application/json'
                    },
                    body: qrData
                })
                const data = await response.json()
                if (response.status === 403) {
                    navigate('/', { replace: true })
                    return
                }

                if (!response.ok) {
                    setModalMessage(data.message)
                    setModalVisible(true)
                    return
                }
            }

            setQrCodeValue({ qrCode: qrData, chave: chaveID })
            setShowQRCode(true)

            setTimeout(() => {
                setQrCodeValue({ qrCode: '', chave: null })
                setShowQRCode(false)
            }, 300000)
        } catch (err) {
            setModalMessage(`Desculpe ocorreu um erro inesperado! ${err.message}`)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (abastecimento === null) {
            navigate('/home', { replace: true })
            return
        }
        callInfoUser()
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
                                    {dataPosto[0].nome}
                                </p>

                                <div className="container-img-posto">
                                    <img
                                        className="img-posto"
                                        src={`https://aeotnew.s3.amazonaws.com/${dataPosto[0].foto}`}
                                        alt="foto_posto" />
                                </div>

                                <p className="text-container dado-posto-endereco">
                                    {dataPosto[0].endereco}
                                </p>

                                <p className="text-container dado-posto-combustivel">
                                    {dataAbastecimento.tipo_combustivel}:
                                    R$ {dataPosto[0].combustivel[dataAbastecimento.tipo_combustivel].valor}
                                </p>
                            </div>

                            <div className="container-abastecimento">
                                <h2 className="title-container title-abastecimento">
                                    Abastecimento
                                </h2>

                                <div className="container-sobre-abastecimento">
                                    <p className="text-container abastecimento-tipo-combustivel">
                                        Tipo de combustivel: {dataAbastecimento.tipo_combustivel}
                                    </p>

                                    <p className="text-container abastecimento-forma-abastecimento">
                                        Vai abastecer por: {dataAbastecimento.forma_abastecimento}
                                    </p>

                                    <p className="text-container abastecimento-metodo-pagamento">
                                        Metodo de Pagamento: {dataAbastecimento.metodo_pagamento}
                                    </p>

                                    {dataAbastecimento.forma_abastecimento != 'encher-tanque' && (
                                        <>
                                            <p className="text-container abastecimento-preco-ou-litro">
                                                Quantidade que vai abastecer:
                                                {
                                                    dataAbastecimento.forma_abastecimento === 'valor' ?
                                                        ` ${calcularLitros(dataAbastecimento?.forma_abastecimento,
                                                            Number(dataPosto[0].combustivel[dataAbastecimento.tipo_combustivel]?.valor),
                                                            Number(dataAbastecimento.litros),
                                                        )} Litros` :
                                                        ` ${dataAbastecimento.litros} Litros`
                                                }
                                            </p>

                                            <p className="text-container abastecimento-preco-ou-litro">
                                                Valor total:
                                                {` R$ ${calcularPagamento(dataAbastecimento?.forma_abastecimento,
                                                    Number(dataPosto[0].combustivel[dataAbastecimento.tipo_combustivel]?.valor),
                                                    Number(dataAbastecimento.litros),
                                                )}`}
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

                            <p>
                                Ou se preferir, envie a chave do QRCode:
                            </p>
                            <p>
                                <FontAwesomeIcon className="key-icon" icon={faKey} />: {qrCodeValue.chave}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}


export default GerarQrCode