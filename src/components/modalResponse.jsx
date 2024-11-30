import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import '../style/modal_response_component/modal_response.css'

const ModalResponse = ({ isVisible, onClose, message, buttonText, redirectTo }) => {
    return (
        <>
            <div className={`container-response-cadastro ${isVisible ? '' : 'container-response-cadastro-hidden'}`}>
                <div className='container-info-response'>
                    <div className='div-close-alert-response-cadastro'>
                        <button onClick={onClose} className='btn-close-alert-response-cadastro'>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    <div className='container-text-cadastro'>
                        <p className='response-text-cadastro'>{message}</p>
                        {redirectTo && (
                            <Link to={redirectTo}>
                                <button className='btn-response-cadastro'>
                                    {buttonText || 'Retornar'}
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalResponse
