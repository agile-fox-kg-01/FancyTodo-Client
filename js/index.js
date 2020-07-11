if (!localStorage.getItem('token')) {
    $('#loginForm').show()
    $('#registerForm').hide()
} else {
    $('#loginForm').hide()
    $('#registerForm').hide()
}