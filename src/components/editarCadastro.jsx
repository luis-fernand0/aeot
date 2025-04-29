import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import '../style/editarCadastro_component/editarCadastro.css'

const EditarCadastro = () => {
    return (
        <>
            <div className="editar-cadastro-container">
                <div className="editar-cadastro">
                    <div className="container-btn-close-cadastro">
                        <button className='btn-close'>
                            <FontAwesomeIcon className='x-icon' icon={faXmark} />
                        </button>
                    </div>

                    <div className='container-datas-cadastro'>
                        <div className='foto-cadastro'>
                            <img src="" alt="" />
                            {/* VER CNH */}
                            {/* VER PRINT DO APP */}
                        </div>

                        <div className='datas-cadastro'>
                            {/* PARA MOSTORISTA */}
                                {/* NOME */}
                                <input type="text" name='nome'placeholder='Nome'/>
                                {/* CPF */}
                                <input type="text" name="cpf" placeholder='CPF' />
                                {/* EMAIL */}
                                <input type="text" name='email' placeholder='Email'/>
                                {/* SENHA ? */}
                                <input type="password" name='pass' placeholder='Senha'/>
                                {/* TELEFONE */}
                                <input type="text" name='telefone' placeholder='Telefone'/>
                                {/* INFORMAÇÕES DO VEICULO */}
                                <input type="text" name='modelo'placeholder='Modelo'/>
                                <input type="text" name='placa' placeholder='Placa'/>
                                {/* ENDEREÇO COMPLETO */}
                                <input type="text" name="cep" placeholder='CEP'/>
                                <input type="text" name='endereco' placeholder='Endereco'/>
                                <input type="text" name="numero" placeholder='N°'/>
                                <input type="text" name='cidade' placeholder='Cidade'/>
                                <input type="text" name='uf' placeholder='UF'/>
                                {/* ATIVO DESDE DE: */}
                                <input type="text" name='created_at'placeholder='Criado em:'/>
                            {/* PARA POSTO */}
                                {/* NOME */}
                                {/* CNPJ */}
                                {/* EMAIL */}
                                {/* SENHA ? */}
                                {/* TELEFONE */}
                                {/* ENDEREÇO COMPLETO */}
                                {/* DESCRIÇÃO */}
                                {/* COMBUSTIVEIS */}
                                {/* ATIVO DESDE DE: */}
                            {/* PARA FRENTISTA */}
                                {/* NOME */}
                                {/* EMAIL */}
                                {/* SENHA ? */}
                                {/* TELEFONE */}
                                {/* ATIVO DESDE DE: */}
                                {/* POSTO */}


                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditarCadastro