const urlDeletarChave = import.meta.env.VITE_URL_DELETAR_CHAVE

export async function deletandoChave(tokenUser, chave, tipo) {
    try {
        const response = await fetch(urlDeletarChave, {
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