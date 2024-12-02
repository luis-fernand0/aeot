import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'

import '../style/add_cadastros_page/add_cadastro.css'

const AdicionarCadastros = () => {
  return (
    <>
      <div className='container-btns-add-cadastro'>
        <div className='container-arrow-icon'>
          <Link to={'/home'}>
            <FontAwesomeIcon className='arrow-icon' icon={faArrowLeftLong} />
          </Link>
        </div>
        <div className='container-btns-cadastro'>
          <Link to={'/cadastros_pendentes'}>
            <button className='btn-add-cadastro'>Cadastro Pendentes</button>
          </Link>

          <Link to={'/adicionar_postos_services'}>
            <button className='btn-add-cadastro'>Cadastrar Posto/Serviço</button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default AdicionarCadastros
