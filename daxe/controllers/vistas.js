//Primeramente vamos a hacer un index dinamico para que las vistas se vayan actualizando viendo constantemente en que vista estamos posicionados

const index = () => {
    const pathname = window.location.pathname;
    const path = pathname.split('/').pop();
    const vista = path ? path : 'index';
    const vistaElement = document.getElementById(vista);
    if (vistaElement) {
        vistaElement.classList.add('active');
    }
}

index();

const inicio = () => {
    return (
        <div>
            <h1>Inicio</h1>
        </div>
    )
}

export default inicio;