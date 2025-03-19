import { useState, useEffect } from 'react'

import '../style/listarBrindes_component/listarBrindes.css'


const ListarBrindes = ({ clickBrinde, closeModal }) => {
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
        setBrindes(data)
    }

    useEffect(() => {
        listarBrindes()
    }, [])

    return (
        <>
            <div className="container-brindes">
                {closeModal && (
                    <button onClick={() => {closeModal(false)}}>
                        X
                    </button>
                )}
                {brindes && (
                    <ul className="lista-brindes">
                        {brindes && brindes.map((brinde, index) =>
                            <li
                                key={index}
                                onClick={() => clickBrinde && clickBrinde(brinde)}
                                className="brinde">
                                <p className='nome-brinde'>
                                    Nome do brinde: {brinde.nome_brinde.toUpperCase()}
                                </p>

                                <p className='brinde-descricao'>
                                    {brinde.descricao.toUpperCase()}
                                </p>

                                <p className='brinde-expiracao'>
                                    Brinde valido por: {brinde.expiracao} {brinde.expiracao > 1 ? 'Dias' : 'Dia'}
                                </p>
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </>
    )
}

export default ListarBrindes