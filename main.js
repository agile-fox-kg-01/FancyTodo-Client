const SERVER_PATH = `http://localhost:3000`

function fetchData() {
    $(`#table-list-todo`).empty()

    $.ajax({
        method: `GET`,
        url: `${SERVER_PATH}/todos`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done((response) => {
            console.log(`done`);
            console.log(response);
            response.forEach(todo => {
                $(`#table-list-todo`).append(
                    `<tr id="${todo.id}">
                    <td class="id">${todo.id}</td>
                    <td class="title">${todo.title}</td>
                    <td class="description">${todo.description}</td>
                    <td class="status">${todo.status}</td>
                    <td class="due_date">${new Date(todo.due_date).toDateString()}</td>
                    <td> <button type="button" class="btn btn-primary">Update</button> <button type="button" class="btn btn-danger">Delete</button> </td>
                </tr>`
                )
            })
        })
        .fail((xhr, status, error) => {
            console.log(`fail`)
            console.log(xhr.responseJSON, status, error)
        })
        .always((response) => {
            console.log(`response`)
            console.log(response)
        })
}

$(document).ready(function () {

    if (!localStorage.getItem('token')) {
        $('#todo-list-nav').hide()
        $('#todo-create-nav').hide()
        $('#logout-nav').hide()
        $('#create-todo-page').hide()
        $('#list-todo-page').hide()
        $('#login-page').hide()
    } else {
        $('#login-nav').hide()
        $('#register-nav').hide()
        $('#login-page').hide()
        $('#register-page').hide()

        $('#create-todo-page').hide()
    }


    //NAV button before login
    $('#register-nav').click(function (event) {
        $(`#register-error`).remove()

        $('#login-page').hide()
        $('#register-page').show()

        event.preventDefault()
    })

    $('#login-nav').click(function (event) {
        $(`#login-error`).remove() //jika sebelumnya salah login

        $('#login-page').show()
        $('#register-page').hide()

        event.preventDefault()
    })

    //PAGE FORM before login
    $('#register-page').submit(function (event) {
        let registerEmail = $(`#email-register`).val();
        let registerPassword = $(`#password-register`).val();

        // console.log(registerEmail, registerPassword);

        $.ajax({
            method: `POST`,
            url: ` http://localhost:3000/register`,
            data: {
                email: registerEmail,
                password: registerPassword
            }
        })
            .done((response) => {
                console.log(`done`)
                console.log(response)

                $('#login-page').show()
                $('#register-page').hide()
            })
            .fail((xhr, status, error) => {
                console.log(`fail`)
                console.log(xhr.responseJSON, status, error)

                let errorMsg;
                if (Array.isArray(xhr.responseJSON.errors.message)) {
                    errorMsg = xhr.responseJSON.errors.message.join(', ')
                } else {
                    errorMsg = xhr.responseJSON.errors.message
                }
                $(`#register-error`).remove()
                $(`#form-register`).before(`<p id="register-error" style="color: red;">${errorMsg}</p>`)
            })
            .always((response) => {
                console.log(`response`)
                console.log(response)
            })

        $(`#email-register`).val('');
        $(`#password-register`).val('');

        event.preventDefault()
    })

    $(`#login-page`).submit(function (event) {

        let loginEmail = $(`#email-login`).val();
        let loginPassword = $(`#password-login`).val();

        console.log(loginEmail, loginPassword)

        $.ajax({
            method: `POST`,
            url: `${SERVER_PATH}/login`,
            data: {
                email: loginEmail,
                password: loginPassword
            }
        })
            .done((response) => {
                console.log(`done`);
                console.log(response);

                localStorage.setItem('token', response.accessToken);

                $('#login-nav').hide()
                $('#login-page').hide()

                $('#register-nav').hide()
                $('#register-page').hide()

                $('#todo-create-nav').show()
                $('#create-todo-page').hide()

                $('#todo-list-nav').show()
                $('#list-todo-page').show()

                $('#logout-nav').show()

                fetchData()
            })
            .fail((xhr, status, error) => {
                console.log(`fail`)
                console.log(xhr.responseJSON, status, error)

                $(`#login-error`).remove()
                $(`#form-login`).before(`<p id="login-error" style="color: red;">${xhr.responseJSON.errors.message}</p>`)
            })
            .always((response) => {
                console.log(`response`)
                console.log(response)
            })


        event.preventDefault()
    })

    $(`#create-todo-page`).submit(function (event) {
        const title = $(`#title-create`).val()
        const description = $(`#description-create`).val()
        const due_date = $(`#due_date-create`).val()
        const status = `undone`

        // console.log(title, description, due_date, status, localStorage.getItem('token'));

        $.ajax({
            method: `POST`,
            url: `${SERVER_PATH}/todos`,
            headers: {
                token: localStorage.getItem('token')
            },
            data: {
                title,
                description,
                due_date,
                status
            }
        })
            .done(response => {
                console.log(`done`);
                console.log(response);

                fetchData()
                $(`#list-todo-page`).show()
                $(`#create-todo-page`).hide()
            })
            .fail((xhr, status, error) => {
                console.log(`fail`);
                console.log(xhr.responseJSON);

                let errorMsg;
                if (Array.isArray(xhr.responseJSON.errors.message)) {
                    errorMsg = xhr.responseJSON.errors.message.join(', ')
                } else {
                    errorMsg = xhr.responseJSON.errors.message
                }
                $(`#create-error`).remove()
                $(`#form-create`).before(`<p id="create-error" style="color: red;">${errorMsg}</p>`)
            })
            .always(response => {
                console.log(`response`);
                console.log(response);
            })

        event.preventDefault()
    })


    //NAV button after login
    $('#logout-nav').click(function (event) {
        localStorage.removeItem('token');

        $('#login-nav').show()
        $('#login-page').hide()

        $('#register-nav').show()
        $('#register-page').show()

        $('#todo-list-nav').hide()
        $('#todo-create-nav').hide()


        $('#create-todo-page').hide()
        $('#list-todo-page').hide()

        $('#logout-nav').hide()

        event.preventDefault()
    })

    $('#todo-list-nav').click(function (event) {

        // console.log(`todo list nav`)

        $('#create-todo-page').hide()
        $(`#list-todo-page`).show()

        fetchData()

        event.preventDefault()
    })

    $(`#todo-create-nav`).click(function (event) {
        $(`#create-error`).remove()

        // console.log(`todo create nav`)

        $('#create-todo-page').show()
        $(`#list-todo-page`).hide()

        event.preventDefault()
    })


    //Belum bisa akses ke button
    $(`#table-list-todo tr td button.btn btn-primary`).click(function (event) {
        console.log(`test update`)
    })

    // $(`#table-list-todo, tr, td, .btn btn-danger`).click(function (event) {
    //     console.log(`test delete`)
    // })
})