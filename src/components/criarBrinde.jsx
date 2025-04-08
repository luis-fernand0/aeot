import { useNavigate } from 'react-router-dom'
import { useState } from 'react';

import Loading from './loading'
import ModalResponse from './modalResponse';

import '../style/criarBrinde_component/criarBrinde.css'

const urlCadastrarBrinde = import.meta.env.VITE_URL_CADASTRAR_BRINDE

const CriarBrinde = ({ user }) => {
    const tokenUser = localStorage.getItem('token');
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    async function cadastrarBrinde(e) {
        e.preventDefault()
        setLoading(true)
        try {
            const myForm = new FormData(document.getElementById('cadastrar-brinde'))
            myForm.append('cod_posto', user[0].cod_posto)
            const formCadastro = Object.fromEntries(myForm)

            const response = await fetch(urlCadastrarBrinde, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formCadastro)
            })
            const data = await response.json()

            if (response.status === 401) {
                navigate('/', { replace: true })
            }
            setModalMessage(data.message)
            setModalVisible(true)
            e.target.reset()
        } catch (err) {
            setModalMessage(`Desculpe! Ocorreu um erro inesperado. Não foi possível cadastrar o brinde.` + err.message)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }
    }

    function formatarInput(e) {
        let input = e.target
        var inputValue = input.value.replace(/[^0-9]/g, '')

        return input.value = inputValue
    }
    return (
        <>
            <Loading loading={loading} />
            <ModalResponse
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                message={modalMessage}
            />
            <div className='container-form-cadastrar-brinde'>
                <form id='cadastrar-brinde' onSubmit={(e) => cadastrarBrinde(e)}>
                    <div className='container-inputs'>
                        <label className='text-input' htmlFor="nome-brinde">Nome do brinde</label>
                        <input className='input-info'
                            id='nome-brinde'
                            name='nome_brinde'
                            type="text" placeholder='Nome do brinde' required />
                    </div>

                    <div className='container-inputs'>
                        <label className='text-input' htmlFor="descricao">Descrição</label>
                        <textarea className='textarea' name="descricao" id="descricao" placeholder='Descrição do brinde' required />
                    </div>

                    <div className='container-inputs'>
                        <label className='text-input' htmlFor="expiracao">Ganha X abastecimentos</label>
                        <input onChange={(e) => formatarInput(e)} className='input-info' name='abastecimento_minimo' id='abastecimento_minimo' type="text" placeholder='Vezes que deve abastecer' required />
                    </div>

                    <div className='container-inputs'>
                        <label className='text-input' htmlFor="expiracao">Tempo de expiração</label>
                        <input onChange={(e) => formatarInput(e)} className='input-info' name='expiracao' id='expiracao' type="text" placeholder='Tempo em dias' required />
                    </div>

                    <button className='btn-criar' type='submit'>
                        Criar brinde!
                    </button>
                </form>
            </div>
        </>
    )
}

export default CriarBrinde