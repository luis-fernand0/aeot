import '../style/modal_edit_item_component/edit_item.css'

const EditItem = ({ show, close, categoria, item }) => {
    return (
        <>
            <div className="container-modal-editar-item" hidden={show ? false : true}>
                <div className='container-btn-form'>
                    <button onClick={close}>
                        X
                    </button>
                    <form className="form-editar-item">
                        <textarea
                            className="editar-item-descricao"
                            name="descricao"
                            id="descricao-item"
                            placeholder="Descrição"
                            value={item.descricao} />
                        <input
                            className="input-editar-item"
                            type="text"
                            name="endereco"
                            id="endereco-item"
                            value={item.endereco} />

                        {/*verificar se eh posto ou anuncio nessa etapa*/}
                        {categoria.categoria === 'postos' && (
                            <>
                                <p className='text-editar-item'>
                                    Valores dos combustiveis
                                </p>
                                <div className='container-edit-combustivel'>
                                    <input
                                        className="input-editar-item"
                                        type="text"
                                        value={item.etanol} />
                                </div>

                                <div className='container-edit-combustivel'>
                                    <input
                                        className="input-editar-item"
                                        type="text"
                                        value={item.gasolina} />
                                </div>

                                <div className='container-edit-combustivel'>
                                    <input
                                        className="input-editar-item"
                                        type="text"
                                        value={item.diesel} />
                                </div>

                                <p className='text-editar-item'>
                                    Formas de Pagamento
                                </p>
                                <div className='container-formas-de-pagamento'>
                                    <div className='container-forma-de-pagamento'>
                                        <input
                                            className='forma-de-pagamento-checkbox'
                                            type="checkbox"
                                            name="dinheiro"
                                            id="dinheiro"
                                            checked={item.credito} />
                                        <label className='text-forma-de-pagamento' htmlFor="dinheiro">Dinheiro</label>
                                    </div>

                                    <div className='container-forma-de-pagamento'>
                                        <input
                                            className='forma-de-pagamento-checkbox'
                                            type="checkbox"
                                            name="pix"
                                            id="pix"
                                            checked={item.credito} />
                                        <label className='text-forma-de-pagamento' htmlFor="pix">Pix</label>
                                    </div>

                                    <div className='container-forma-de-pagamento'>
                                        <input
                                            className='forma-de-pagamento-checkbox'
                                            type="checkbox"
                                            name="debito"
                                            id="debito"
                                            checked={item.credito} />
                                        <label className='text-forma-de-pagamento' htmlFor="debito">Debito</label>
                                    </div>

                                    <div className='container-forma-de-pagamento'>
                                        <input
                                            className='forma-de-pagamento-checkbox'
                                            type="checkbox"
                                            name="credito"
                                            id="credito"
                                            checked={item.credito} />
                                        <label className='text-forma-de-pagamento' htmlFor="credito">Credito</label>
                                    </div>

                                </div>
                            </>
                        )}

                        <button type="submit" className="btn-salvar">
                            Salvar
                        </button>
                    </form>

                </div>
            </div>
        </>
    )
}

export default EditItem