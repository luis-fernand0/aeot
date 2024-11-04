import Header from "../components/header"
import '../style/perfil_user_page/perfil_user.css'

const PerfilUser = () => {
    return (
        <>
            <div className="container-perfil">
                <Header />

                <div className="container-logo-title">
                    <div className="container-logo">
                        <img className="logo-aeot-perfil" src="/logo_AEOT.png" alt="aeot-logo" />
                    </div>
                    {/* <p>Aplicativo Enche o Tanque</p> */}
                </div>

                <div className="foto-user-datas">
                    <img src="https://placehold.co/250x400" alt="" />

                    <div className="data-user-perfil">
                        <p>Nome:</p>
                        <p>Veiculo:</p>
                        <p>Placa:</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PerfilUser
