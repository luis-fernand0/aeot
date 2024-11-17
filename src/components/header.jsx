import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGasPump, faUser, faLock, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Link, useParams } from 'react-router-dom';

import '../style/header_component/header.css'

const Header = () => {
    const { cod_driver } = useParams()

    return (
        <>
            <header className="header-home">

                <Link to={`/perfil`}>
                    <button className='header-btn header-btn-perfil' type="button">
                        <FontAwesomeIcon className='icon-header-btn' icon={faUser} /> 
                        Cartão de visita
                    </button>
                </Link>

                <Link to={`/cadastros_pendentes`}>
                    <button className='header-btn header-btn-perfil' type='button'>
                        <FontAwesomeIcon className='icon-header-btn' icon={faPlus} />
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
