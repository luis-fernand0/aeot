import { useState, useEffect } from 'react'

import '../style/listarBrindes_component/listarBrindes.css'


const ListarBrindes = () => {
    const tokenUser = localStorage.getItem('token');

    const [brindes, setBrindes] = useState([])

    async function listarBrindes() {
        const response = await fetch('http://localhost:3000/aeot/auth/listar_brindes', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenUser}`
            }
        })
        const data = await response.json()
        console.log(data)
        setBrindes(data)
    }

    useEffect(() => {
        listarBrindes()
    }, [])

    return (
        <>
            <div className="container-brindes">
                {brindes && (
                    <ul className="lista-brindes">
                        {brindes && brindes.map((brinde, index) => 
                            <li key={index} className="brinde">
                                <p className='nome-brinde'>{brinde.nome_brinde.toUpperCase()}</p>

                                <p className='brinde-descricao'>{brinde.descricao.toUpperCase()}</p>

                                <p className='brinde-expiracao'>Brinde valido por: {brinde.expiracao} {brinde.expiracao > 1 ? 'Dias' : 'Dia'}</p>
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </>
    )
}

export default ListarBrindes