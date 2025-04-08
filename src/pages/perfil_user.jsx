import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { QRCodeCanvas } from "qrcode.react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faKey } from '@fortawesome/free-solid-svg-icons'

import { generateKey } from "../functions/generateKey"

import Header from "../components/header"
import ListarBrindes from "../components/listarBrindes"
import Loading from "../components/loading"
import ModalResponse from "../components/modalResponse"
import '../style/perfil_user_page/perfil_user.css'

const urlData = import.meta.env.VITE_URL_DATAS_USER
const urlCadastrarChave = import.meta.env.VITE_URL_CADASTRAR_CHAVE

const PerfilUser = () => {
    const [dataUser, setDataUser] = useState()
    const [exibirBrindes, setExibirBrindes] = useState(false)

    const [showQrCode, setShowQRCode] = useState(false)
    const [qrCodeValue, setQrCodeValue] = useState({ qrCode: '', chave: null })

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');


    const navigate = useNavigate()

    const tokenUser = localStorage.getItem('token');

    async function callInfoUser() {
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
    }

    async function gerarQrCode(brinde) {
        setLoading(true)
        try {
            let chaveID = qrCodeValue.chave || generateKey(dataUser?.placa)

            const qrData = JSON.stringify({
                tipo: 'resgate_de_brinde',
                chave: chaveID,
                driver_id: dataUser?.user_id,
                usuario: dataUser?.nome,
                foto_user: dataUser?.foto,
                veiculo: {
                    modelo: dataUser?.modelo,
                    placa: dataUser?.placa
                },
                posto: brinde.nome_posto,
                posto_user_id: brinde.user_id,
                cod_brinde: brinde.cod_brinde,
                nome_brinde: brinde.nome_brinde
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
                if (response.status === 401) {
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
        callInfoUser()
    }, [])
    return (
        <>
            <Loading loading={loading} />
            <ModalResponse
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                message={modalMessage} />
            <div className="container-perfil">
                <Header redirectTo={'/home'} />

                {dataUser && (
                    <>
                        <div className="container-logo-title">
                            <div className="container-logo">
                                <img className="logo-aeot-perfil" src="/logo_AEOT.png" alt="aeot-logo" />
                            </div>
                        </div>
                        <div className="foto-user-datas">
                            <div className="foto-user-container">
                                <img className="foto-user" src={`https://aeotnew.s3.amazonaws.com/${dataUser.foto}`} alt="foto_user" />
                            </div>

                            <div className="data-user-perfil">
                                <p className="data-user">Nome:
                                    <span className="data-user-span"> {dataUser.nome}</span>
                                </p>

                                <p className="data-user">Veiculo:
                                    <span className="data-user-span"> {dataUser.modelo}</span>
                                </p>

                                <p className="data-user">Placa:
                                    <span className="data-user-span"> {dataUser.placa}</span>
                                </p>
                            </div>

                            <div className="container-btn-brinde">
                                <button onClick={() => { setExibirBrindes(true) }} className="btn-brinde">
                                    Resgatar brinde
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {exibirBrindes && (
                <div className="container-brindes-user">
                    <ListarBrindes
                        showBtns={false}
                        clickBrinde={gerarQrCode}
                        closeModal={setExibirBrindes}
                        driverBrinde={true} />
                </div>
            )}

            {showQrCode && (
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

export default PerfilUser
