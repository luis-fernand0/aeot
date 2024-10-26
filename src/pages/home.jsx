import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faGasPump, faUser, faLock } from '@fortawesome/free-solid-svg-icons'

const Home = () => {
  var usuarioLogado = sessionStorage.getItem('userLogado');  

  if (!usuarioLogado) {
    window.location.replace('http://localhost:5173/')
  }
  return (
    <>
        <div className="container-home">
          <header className="header-home">
            <button type="button">
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>

            <button type="button">
              <FontAwesomeIcon icon={faUser} />
            </button>

            <button type="button">
              <FontAwesomeIcon icon={faGasPump} />
            </button>

            <button type="button">
              <FontAwesomeIcon icon={faLock} />
            </button>
          </header>

          <h2 className='title-home'>Todos os anuncios</h2>

          <div>
            <div className='btns-fuel-services'>
              <button type="button">Combustivel</button>
              <button type="button">Serviços</button>
            </div>
          </div>


        </div>
    </>
  )
}

export default Home
