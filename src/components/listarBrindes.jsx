import { useState, useEffect } from 'react'


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
                                <p>{index}</p>
                                <p>{brinde.nome_brinde}</p>

                                <p>{brinde.descricao}</p>
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </>
    )
}

export default ListarBrindes