export async function deletandoChave(tokenUser, chave, tipo) {
    try {
        const response = await fetch('http://localhost:3000/aeot/auth/deletar_chave', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tokenUser}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chave, tipo })
        })

        return response
    } catch (err) {
        console.error(`Não foi possivel deletar a chave ${err}`)
    }
}