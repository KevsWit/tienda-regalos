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


async function iniciarSesion() {
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
    } else {
        alert('Credenciales incorrectas');
    }
}

function mostrarLoginForm() {
    document.getElementById('registroForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function mostrarRegistroForm() {
    document.getElementById('registroForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
}
