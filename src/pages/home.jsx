import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faGasPump, faUser, faLock } from '@fortawesome/free-solid-svg-icons'

import '../style/home_page/home.css'

const Home = () => {
  var usuarioLogado = sessionStorage.getItem('userLogado');  

  if (!usuarioLogado) {
    window.location.replace('http://localhost:5173/')
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
              <button className='btn-combustivel' type="button">Combustivel</button>
              <button className='btn-services' type="button">Serviços</button>
            </div>

            <div className='fuel-services'>
              <ul className='ul-gas-station'>
                <li className='gas-station'>
                    <img src="https://placehold.co/200" alt="" srcset="" />

                    <p>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam omnis possimus nulla dolores praesentium a minus aliquid beatae doloremque odit, deserunt hic quasi officiis molestias modi doloribus, odio, alias natus!
                    </p>
                </li>

                <li className='gas-station'>
                    <img src="https://placehold.co/200" alt="" srcset="" />

                    <p>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam omnis possimus nulla dolores praesentium a minus aliquid beatae doloremque odit, deserunt hic quasi officiis molestias modi doloribus, odio, alias natus!
                    </p>
                </li>

                <li className='gas-station'>
                    <img src="https://placehold.co/200" alt="" srcset="" />

                    <p>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam omnis possimus nulla dolores praesentium a minus aliquid beatae doloremque odit, deserunt hic quasi officiis molestias modi doloribus, odio, alias natus!
                    </p>
                </li>

                <li className='gas-station'>
                    <img src="https://placehold.co/200" alt="" srcset="" />

                    <p>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam omnis possimus nulla dolores praesentium a minus aliquid beatae doloremque odit, deserunt hic quasi officiis molestias modi doloribus, odio, alias natus!
                    </p>
                </li>
              </ul>
            </div>
          </div>


        </div>
    </>
  )
}

export default Home
