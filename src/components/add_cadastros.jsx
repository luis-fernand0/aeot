import { Link, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import '../style/add_cadastros_page/add_cadastro.css'

const AdicionarCadastros = () => {
  const navigate = useNavigate()

  const typeUser = localStorage.getItem('type_user')

  if (typeUser === 'driver' || typeUser === 'frentista') {
    return navigate('/', { replace: true })
  }

  return (
    <>
      <div className='container-btns-add-cadastro'>
        <div className='container-arrow-icon'>
          <Link to={'/home'}>
            <FontAwesomeIcon className='arrow-icon' icon={faChevronLeft} />
          </Link>
        </div>
        <div className='container-btns-cadastro'>
          {typeUser === 'administrador' && (
            <>
              <Link to={'/consultar_cadastros'}>
                <button className='btn-add-cadastro'>
                  Cadastros
                </button>
              </Link>

              <Link to={'/cadastros_pendentes'}>
                <button className='btn-add-cadastro'>
                  Cadastro Pendentes
                </button>
              </Link>

              <Link to={'/adicionar_postos_services'}>
                <button className='btn-add-cadastro'>
                  Cadastrar Posto/Serviço
                </button>
              </Link>

              <Link to={'/relatorio'}>
                <button className='btn-add-cadastro'>Relatorios</button>
              </Link>
            </>
          )}

          {typeUser === 'posto' && (
            <>
              <Link to={'/consultar_cadastros'}>
                <button className='btn-add-cadastro'>
                  Cadastros
                </button>
              </Link>
              
              <Link to={'/cadastrar_frentista'}>
                <button className='btn-add-cadastro'>Cadastrar Frentista</button>
              </Link>

              <Link to={'/relatorio'}>
                <button className='btn-add-cadastro'>Relatorios</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default AdicionarCadastros
