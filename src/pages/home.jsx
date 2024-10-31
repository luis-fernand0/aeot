import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faGasPump, faUser, faLock } from '@fortawesome/free-solid-svg-icons'

import '../style/home_page/home.css'

const urlSite = import.meta.env.VITE_URL_AEOT_SITE;

const Home = () => {
  var usuarioLogado = sessionStorage.getItem('userLogado');

  if (!usuarioLogado) {
    window.location.replace(`${urlSite}`)
  }


  return (
    <>
      <div className="container-home">
        <header className="header-home">
          <button className='header-btn' type="button">
            <FontAwesomeIcon className='icon-header-btn' icon={faArrowLeft} />
          </button>

          <button className='header-btn' type="button">
            <FontAwesomeIcon className='icon-header-btn' icon={faUser} />
          </button>

          <button className='header-btn' type="button">
            <FontAwesomeIcon className='icon-header-btn' icon={faGasPump} />
          </button>

          <button className='header-btn' type="button">
            <FontAwesomeIcon className='icon-header-btn' icon={faLock} />
          </button>
        </header>

        <h2 className='title-home'>Todos os anuncios</h2>

        <div className='btns-ul'>
          <div className='btns-fuel-services'>
            <button className='btn-option btn-combustivel' type="button">Combustivel</button>
            <button className='btn-option btn-services' type="button">Serviços</button>
          </div>

          <ul className='ul-gas-station'>
            <li className='gas-station'>
              <img className='img-gas-station' src="https://placehold.co/200" alt="imagem-do-posto-de-gasolina"/>
              <div className='info-gas-station'>
                <h3 className='title-gas-station'>
                  Lorem, ipsum dolor sit amet
                </h3>

                <p className='endereco-gas-station'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, labore molestias nisi deleniti quasi qui, laborum dolore necessitatibus nostrum ratione tenetur
                </p>

                <p className='combustiveis-gas-station'>
                  ETANOL: R$ 00
                </p>
                <p className='combustiveis-gas-station'>
                  GASOLINA: R$ 00
                </p>
              </div>
            </li>

            <li className='gas-station'>
              <img className='img-gas-station' src="https://placehold.co/200" alt="imagem-do-posto-de-gasolina"/>
              <div className='info-gas-station'>
                <h3 className='title-gas-station'>
                  Lorem, ipsum dolor sit amet
                </h3>

                <p className='endereco-gas-station'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, labore molestias nisi deleniti quasi qui, laborum dolore necessitatibus nostrum ratione tenetur
                </p>

                <p className='combustiveis-gas-station'>
                  ETANOL: R$ 00
                </p>
                <p className='combustiveis-gas-station'>
                  GASOLINA: R$ 00
                </p>
              </div>
            </li>

            <li className='gas-station'>
              <img className='img-gas-station' src="https://placehold.co/200" alt="imagem-do-posto-de-gasolina"/>
              <div className='info-gas-station'>
                <h3 className='title-gas-station'>
                  Lorem, ipsum dolor sit amet
                </h3>

                <p className='endereco-gas-station'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, labore molestias nisi deleniti quasi qui, laborum dolore necessitatibus nostrum ratione tenetur
                </p>

                <p className='combustiveis-gas-station'>
                  ETANOL: R$ 00
                </p>
                <p className='combustiveis-gas-station'>
                  GASOLINA: R$ 00
                </p>
              </div>
            </li>

            <li className='gas-station'>
              <img className='img-gas-station' src="https://placehold.co/200" alt="imagem-do-posto-de-gasolina"/>
              <div className='info-gas-station'>
                <h3 className='title-gas-station'>
                  Lorem, ipsum dolor sit amet
                </h3>

                <p className='endereco-gas-station'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, labore molestias nisi deleniti quasi qui, laborum dolore necessitatibus nostrum ratione tenetur
                </p>

                <p className='combustiveis-gas-station'>
                  ETANOL: R$ 00
                </p>
                <p className='combustiveis-gas-station'>
                  GASOLINA: R$ 00
                </p>
              </div>
            </li>
          </ul>
        </div>


      </div>
    </>
  )
}

export default Home
