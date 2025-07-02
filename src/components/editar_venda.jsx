export const EditarVenda = ({ view, item }) => {
    if (!view) return null;

    return (
        <div>
            {item && (
                <>
                    <p>{item.posto}</p>
                    <p>{item.motorista}</p>
                    <p>{item.combustivel}</p>
                    <p>{item.forma_abastecimento}</p>
                    <p>{item.forma_pagamento}</p>
                    <p>{item.valor}</p>
                    <p>{item.litros}</p>
                    <p>{item.valor_total}</p>
                    <p>{item.frentista}</p>
                </>
            )}
        </div>
    )
}