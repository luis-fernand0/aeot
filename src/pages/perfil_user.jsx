import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'


import Header from "../components/header"
import '../style/perfil_user_page/perfil_user.css'

const urlData = import.meta.env.VITE_URL_DATAS_USER

const tokenUser = localStorage.getItem('token');

const PerfilUser = () => {
    const [dataUser, setDataUser] = useState()

    const navigate = useNavigate()

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
                <Header />

                {dataUser && (
                    <>
                        <div className="container-logo-title">
                            <div className="container-logo">
                                <img className="logo-aeot-perfil" src="/logo_AEOT.png" alt="aeot-logo" />
                            </div>
                            {/* <p>Aplicativo Enche o Tanque</p> */}
                        </div>
                        <div className="foto-user-datas">
                            <div className="foto-user-container">
                                <img className="foto-user" src={dataUser.foto} alt="" />
                            </div>

                            <div className="data-user-perfil">
                                <p className="data-user">Nome:
                                    <span className="data-user-span"> {dataUser.full_name}</span>
                                </p>

                                <p className="data-user">Veiculo:
                                    <span className="data-user-span"> {dataUser.car_model}</span>
                                </p>

                                <p className="data-user">Placa:
                                    <span className="data-user-span"> {dataUser.car_plate}</span>
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default PerfilUser
