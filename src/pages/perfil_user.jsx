import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import Header from "../components/header"
import '../style/perfil_user_page/perfil_user.css'

const urlData = import.meta.env.VITE_URL_DATAS_USER

const PerfilUser = () => {
    const [dataUser, setDataUser] = useState()
    const { cod_driver } = useParams()

    async function callInfoUser() {
        const response = await fetch(`${urlData}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "cod_driver": `${cod_driver}` })
        })
        const data = await response.json()

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
