import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'

import Header from "../components/header"
import '../style/perfil_user_page/perfil_user.css'

const urlData = import.meta.env.VITE_URL_DATAS_USER

const PerfilUser = () => {
    const [dataUser, setDataUser] = useState()

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
        if (response.status === 403) {
            navigate('/', { replace: true })
        }

        setDataUser(data)
    }

    useEffect(() => {
        callInfoUser()
    }, [])
    return (
        <>
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
                                <button className="btn-brinde">
                                    Meus brindes!
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default PerfilUser
