let sesionIniciada = false;
let user = "";
let nombreProductoSeleccionado = "";
async function registrarUsuario() {
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const emailRegistro = document.getElementById('emailRegistro').value;
    const contrasenaRegistro = document.getElementById('contrasenaRegistro').value;

    const response = await fetch('http://localhost:3000/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre,
            telefono,
            email: emailRegistro,
            contrasena: contrasenaRegistro,
        }),
    });

    const result = await response.text();
    alert(result);

    // Limpiar los campos después de un registro exitoso
    document.getElementById('nombre').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('emailRegistro').value = '';
    document.getElementById('contrasenaRegistro').value = '';
}

async function obtenerProductos() {
    try {
        const response = await fetch('http://localhost:3000/productos');
        const productos = await response.json();
        return productos;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return [];
    }
}

async function enviarPedido() {
    const nombreProducto = document.getElementById('nombreProductoSeleccionado').innerText;
    const tamanio = parseFloat(document.getElementById('tamanio').value);
    const contenido = document.getElementById('contenido').value;
    const direccionEnvio = document.getElementById('direccionEnvio').value;
    const correoUsuario = user;

    // Calcular el costo
    const costo = contenido.length * 0.8 + tamanio * 1.01;

    const mensaje = `Vamos a enviar el ${nombreProducto} con grabado de ${tamanio} cm, con "${contenido}" como contenido a ${direccionEnvio} por el valor de ${costo.toFixed(2)}. Cualquier queja o cancelación del servicio, comunicarse a reclamos@regalos.com en un plazo de 1 día.`;

    alert(mensaje);

    // Guardar la información en la colección "pedidos"
    const pedido = {
        nombreProducto,
        tamanio,
        contenido,
        costo,
        correoUsuario,
        direccionEnvio,
    };

    await guardarPedidoEnColeccion(pedido);

    // Limpiar el formulario después de enviarlo
    const formularioDetalle = document.getElementById('formularioDetalle');
    formularioDetalle.querySelector('#tamanio').value = '';
    formularioDetalle.querySelector('#contenido').value = '';
    formularioDetalle.querySelector('#direccionEnvio').value = '';
}

async function guardarPedidoEnColeccion(pedido) {
    try {
        const response = await fetch('http://localhost:3000/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedido),
        });

        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error('Error al guardar el pedido:', error);
    }
}

// Agregar evento de clic a las imágenes de productos
document.addEventListener('click', function (event) {
    if (event.target.tagName === 'IMG') {
        nombreProductoSeleccionado = event.target.alt;
        actualizarNombreProductoSeleccionado();

        // Mostrar el formulario automáticamente
        document.getElementById('formularioDetalle').style.display = 'block';
    }
});

// Actualizar el nombre del producto seleccionado en el formulario
function actualizarNombreProductoSeleccionado() {
    const nombreProductoElemento = document.getElementById('nombreProductoSeleccionado');
    nombreProductoElemento.innerText = nombreProductoSeleccionado;

    // Verificar si el usuario ha iniciado sesión
    if (sesionIniciada) {
        // Puedes realizar aquí cualquier otra acción que necesites al seleccionar un producto
    } else {
        alert('Debes iniciar sesión para realizar un pedido.');
    }
}

async function mostrarProductos() {
    const productos = await obtenerProductos();

    const jarrosContainer = document.getElementById('jarros-container');
    const camisetasContainer = document.getElementById('camisetas-container');
    const llaverosContainer = document.getElementById('llaveros-container');

    productos.forEach(producto => {
        const elementoProducto = document.createElement('div');
        elementoProducto.className = 'producto';
        elementoProducto.innerHTML = `
            <img src="${producto.imagenPath}" alt="${producto.nombre}">
            <p>${producto.nombre}</p>
        `;

        switch (producto.tipo) {
            case 'jarro':
                jarrosContainer.appendChild(elementoProducto);
                break;
            case 'camiseta':
                camisetasContainer.appendChild(elementoProducto);
                break;
            case 'llavero':
                llaverosContainer.appendChild(elementoProducto);
                break;
            default:
                break;
        }
    });

    // Añadir títulos a las secciones
    agregarTituloSeccion('Jarros', jarrosContainer);
    agregarTituloSeccion('Camisetas', camisetasContainer);
    agregarTituloSeccion('Llaveros', llaverosContainer);
}

function agregarTituloSeccion(titulo, contenedor) {
    const tituloElemento = document.createElement('h2');
    tituloElemento.innerText = titulo;
    contenedor.parentNode.insertBefore(tituloElemento, contenedor);
}

async function iniciarSesion() {
    if (sesionIniciada) {
        alert('Ya has iniciado sesión. Cierra sesión para volver a entrar.');
        return;
    }

    const emailLogin = document.getElementById('emailLogin').value;
    const contrasenaLogin = document.getElementById('contrasenaLogin').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: emailLogin,
            contrasena: contrasenaLogin,
        }),
    });

    const result = await response.text();
    if (result === 'Ingreso satisfactorio') {
        document.getElementById('mensaje').innerText = `Sesión del usuario: ${emailLogin}`;
        sesionIniciada = true; // Actualizar el estado de la sesión
        user=emailLogin;

        // Deshabilitar formularios
        document.getElementById('registroForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'none';

        // Mostrar el botón de cerrar sesión
        document.getElementById('cerrarSesionBtn').style.display = 'block';

        // Llamar a la función para mostrar productos después del inicio de sesión
        mostrarProductos();
    } else {
        alert('Credenciales incorrectas');
    }
}

function cerrarSesion() {
    sesionIniciada = false; // Restablecer el estado de la sesión
    user = "";
    nombreProductoSeleccionado = "";
    document.getElementById('mensaje').innerText = ''; // Limpiar mensaje

    // Mostrar formularios y ocultar contenedores de productos y botón de cerrar sesión
    document.getElementById('registroForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('formularioDetalle').style.display = 'none';
    
    ocultarContenedorYTitulo('jarros-container');
    ocultarContenedorYTitulo('camisetas-container');
    ocultarContenedorYTitulo('llaveros-container');

    document.getElementById('cerrarSesionBtn').style.display = 'none';
}

function ocultarContenedorYTitulo(contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.style.display = 'none';
    // Obtener el elemento hermano anterior (en este caso, el título) y ocultarlo
    const titulo = contenedor.previousElementSibling;
    titulo.style.display = 'none';
}

function mostrarLoginForm() {
    document.getElementById('registroForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function mostrarRegistroForm() {
    document.getElementById('registroForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
}

