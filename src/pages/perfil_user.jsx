import Header from "../components/header"

const PerfilUser = () => {
    return (
        <>
            <div className="container-perfil">
                <Header />

                <div className="container-logo-title">
                    <div>
                        <img className="logo-aeot-perfil" src="/logo_AEOT.png" alt="aeot-logo" />
                    </div>
                    <p>Aplicativo Enche o Tanque</p>
                </div>

                <div className="foto-user-datas">
                    <img src="" alt="" />

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
