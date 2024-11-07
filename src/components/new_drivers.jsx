const NewDrivers = () => {
    return (
        <>
            <div className="container-cadastros">
                <h1 className="title-cadastro-pendentes">Cadastros Pendentes</h1>

                <div className="container-ul-cadastros">
                    <ul className="new-drivers-list">
                        <li className="new-driver">
                            <table>
                                <td>
                                    <p>Nome</p>
                                    <tr>Nome:</tr>
                                </td>
                                <td>
                                    <p>Email</p>
                                    <tr>Email:</tr>
                                </td>
                                <td>
                                    <p>Telefone</p>
                                    <tr>Telefone:</tr>
                                </td>
                                <td>
                                    <p>Carro</p>
                                    <tr>Carro:</tr>
                                </td>
                                <td>
                                    <p>Placa</p>
                                    <tr>Placa:</tr>
                                </td>
                            </table>
                            <button type="button">Ver mais detalhes!</button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default NewDrivers
