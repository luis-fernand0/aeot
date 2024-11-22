import { Link } from 'react-router-dom';

import '../style/add_cadastros_page/add_cadastro.css'

const AdicionarCadastros = () => {
  return (
    <>
        <div className='container-btns-add-cadastro'>
            <Link to={'/cadastros_pendentes'}>
                <button className='btn-add-cadastro'>Cadastro Pendentes</button>
            </Link>

            <Link to={'/adicionar_postos_services'}>
                <button className='btn-add-cadastro'>Cadastrar Posto/Serviço</button>
            </Link>
        </div>
    </>
  )
}

export default AdicionarCadastros
