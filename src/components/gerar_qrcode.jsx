import { useState, useEffect } from "react"
import { useNavigate, Link } from 'react-router-dom'
import { QRCodeCanvas } from "qrcode.react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import '../style/gerar_qrcode_component/gerar_qrcode.css'

const urlData = import.meta.env.VITE_URL_DATAS_USER

const GerarQrCode = () => {
    const navigate = useNavigate()

    const abastecimento = JSON.parse(localStorage.getItem('dadosAbastecimento'))

    const tokenUser = localStorage.getItem('token');

    const [dataUser, setDataUser] = useState()

    const [dataPosto, setDataPosto] = useState(abastecimento?.posto || null)
    const [dataAbastecimento, setDataAbastecimento] = useState(abastecimento || null)

    const [showQRCode, setShowQRCode] = useState(false)
    const [qrCodeValue, setQrCodeValue] = useState("")

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

    const calcularPagamento = (num1, num2) => parseFloat(num1 * num2).toFixed(2)

    function generateQrCode() {
        const qrData = JSON.stringify({
            driver_id: dataUser?.user_id,
            usuario: dataUser?.nome,
            veiculo: {
                modelo: dataUser?.modelo,
                placa: dataUser?.placa
            },
            posto_user_id: dataPosto[0]?.user_id,
            posto: dataPosto[0]?.nome,
            tipo_combustivel: dataAbastecimento?.tipo_combustivel,
            valor_combustivel: dataPosto[0][dataAbastecimento?.tipo_combustivel],
            metodo_pagamento: dataAbastecimento?.metodo_pagamento,
            forma_abastecimento: dataAbastecimento?.forma_abastecimento,
            quantidade: dataAbastecimento?.preco_ou_litro,
            valor_total:
                dataAbastecimento?.forma_abastecimento != 'preco' ?
                    calcularPagamento(
                        Number(dataPosto[0][dataAbastecimento.tipo_combustivel]),
                        Number(dataAbastecimento.preco_ou_litro),
                    ) : dataAbastecimento?.preco_ou_litro
        })

        setQrCodeValue(qrData)
        setShowQRCode(true)
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
                                    R$ {dataPosto[0][dataAbastecimento.tipo_combustivel]}
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

                                    <p className="text-container abastecimento-preco-ou-litro">
                                        Quantidade que vai abastecer:
                                        {dataAbastecimento.forma_abastecimento != 'preco' ?
                                            ` ${dataAbastecimento.preco_ou_litro} Litros` :
                                            ` R$ ${dataAbastecimento.preco_ou_litro}`}
                                    </p>

                                    <p className="text-container abastecimento-preco-ou-litro">
                                        Valor total:
                                        {dataAbastecimento.forma_abastecimento != 'preco' ?
                                            ` R$ ${calcularPagamento(
                                                Number(dataPosto[0][dataAbastecimento.tipo_combustivel]),
                                                Number(dataAbastecimento.preco_ou_litro),
                                            )}` :
                                            `R$ ${dataAbastecimento.preco_ou_litro}`}
                                    </p>
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
                            <QRCodeCanvas value={qrCodeValue} size={256} />
                            <p>
                                <span>*Mostre o QRCode para o frentista*</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}


export default GerarQrCode