
document.addEventListener('DOMContentLoaded', () => {

    const botones = document.querySelectorAll('.btn-cart');

    botones.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();


            alert('Debes iniciar sesión para agregar productos al carrito');


            window.location.href = 'login.html';
        });
    });
});