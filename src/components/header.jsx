import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faUser, faLock, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

import '../style/header_component/header.css'

const Header = ({ redirectTo }) => {
    const typeUser = localStorage.getItem('type_user')

    return (
        <>
            <header className="header-home">

                <Link to={redirectTo} replace={false}>
                    <button className='header-btn header-btn-perfil' type="button">
                        <FontAwesomeIcon className='icon-header-btn' icon={faChevronLeft} />
                    </button>
                </Link>

                <Link to={'/perfil'}>
                    <button className='header-btn header-btn-perfil' type="button">
                        <FontAwesomeIcon className='icon-header-btn' icon={faUser} />
                        Cartão de visita
                    </button>
                </Link>

                <Link to={`/adicionar_cadastros`}
                    className={`${typeUser === 'user' ? 'header-btn-hidden' : ''}`}>
                    <button className='header-btn' type='button'>
                        <FontAwesomeIcon className='icon-header-btn' icon={faPlus} />
                    </button>
                </Link>

                <Link to={'/editar_perfil'}>
                    <button className='header-btn' type="button">
                        <FontAwesomeIcon className='icon-header-btn' icon={faLock} />
                    </button>
                </Link>
            </header>
        </>
    )
}

export default Header
