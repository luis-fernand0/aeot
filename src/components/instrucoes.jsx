import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpFromBracket, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import '../style/instrucoes_component/instrucoes.css'

import React from "react"

const Instrucoes = () => {
    return (
        <>
            <div className="container-manual">
                <div className='container-arrow-icon'>
                    <Link to={'/'}>
                        <FontAwesomeIcon className='arrow-icon' icon={faChevronLeft} />
                    </Link>
                </div>
                <div className="descricao-manual">
                    <div className='titles-passo-a-passo'>
                        <h1 className="title-passo-a-passo title-1">
                            Instruções para fazer a INSTALAÇÃO do app AEOT no seu Iphone!
                        </h1>

                        <h2 className='title-passoa-a-passo title-2'>Passo-a-Passo</h2>
                    </div>

                    <ul className='list-passo-a-passo'>
                        <li className='passo-a-passo passo-1'>

                            <p className='text-passo-a-passo text-passo-1'>
                                <span className='span-passo-text'>Passo 01:</span>

                                No seu Iphone clique nesse icone de um quadrado com a setinha para cima parecido com o icone ao lado
                                <FontAwesomeIcon className='arrow-icon' icon={faArrowUpFromBracket} />
                            </p>

                            <img className='img-passo-a-passo' src="/img-passo-1.png" alt="passo-1" />

                            <p className='text-passo-a-passo obs-passo-1'>
                                OBS: Dependendo do seu Iphone o icone pode se encontrar em outro lugar
                            </p>
                        </li>

                        <li className='passo-a-passo passo-2'>
                            <p className='text-passo-a-passo text-passo-2'>
                                <span className='span-passo-text'>Passo 02:</span>
                                <br />
                                Após clicar no icone informado vai mostrar uma tela parecida com essa, busque a opção "Adicionar a Tela de Inicio".
                            </p>

                            <img className='img-passo-a-passo' src="/img-passo-2.png" alt="passo-2" />

                            <p className='text-passo-a-passo obs-passo-2'>
                                Se você ainda está tendo dificuldades não se preucupe, segue a abaixo um video explicando o passo-a-passo:
                            </p>
                            <video className='video-passo-a-passo' controls src="/video-passo-a-passo.mp4" width={250}></video>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Instrucoes