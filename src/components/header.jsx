import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faGasPump, faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

import '../style/header_component/header.css'

const Header = () => {
    return (
        <>
            <header className="header-home">

                <Link to={'/perfil'}>
                    <button className='header-btn' type="button">
                        <FontAwesomeIcon className='icon-header-btn' icon={faUser} /> Meu cartão de visita
                    </button>
                </Link>

                <button className='header-btn' type="button">
                    <FontAwesomeIcon className='icon-header-btn' icon={faGasPump} />
                </button>

                <button className='header-btn' type="button">
                    <FontAwesomeIcon className='icon-header-btn' icon={faLock} />
                </button>
            </header>
        </>
    )
}

export default Header
