import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faUser, faLock, faPlus, faQrcode } from '@fortawesome/free-solid-svg-icons'
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

                {typeUser === 'administrador' || typeUser === 'driver' && (
                    <Link to={'/perfil'}>
                        <button className='header-btn header-btn-perfil' type="button">
                            <FontAwesomeIcon className='icon-header-btn' icon={faUser} />
                            Cartão de visita
                        </button>
                    </Link>

                )}

                {typeUser === 'administrador' ?
                    <Link to={`/adicionar_cadastros`}>
                        <button className='header-btn' type='button'>
                            <FontAwesomeIcon className='icon-header-btn' icon={faPlus} />
                        </button>
                    </Link> : ''}

                <Link to={'/editar_perfil'}>
                    <button className='header-btn' type="button">
                        <FontAwesomeIcon className='icon-header-btn' icon={faLock} />
                    </button>
                </Link>

                {typeUser != 'driver' && (
                    <Link to={'/ler_qrcode'}>
                        <button className='header-btn' type="button">
                            <FontAwesomeIcon className='icon-header-btn' icon={faQrcode} />
                        </button>
                    </Link>
                )}
            </header>
        </>
    )
}

export default Header
