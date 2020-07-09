const SERVER = 'http://localhost:3000'

//Function
function navbarLogin() {
    //Show
    $('#home-nav').show()
    $('#todo-list-nav').show()
    $('#create-todo-nav').show()
    $('#logout-nav').show()
    $('#my-todo-list-nav').show()

    //Hide
    $('#register-nav').hide()
    $('#login-nav').hide()
}

function navbarGuest() {
    //Show
    $('#home-nav').show()
    $('#register-nav').show()
    $('#login-nav').show()

    //Hide
    $('#todo-list-nav').hide()
    $('#my-todo-list-nav').hide()
    $('#logout-nav').hide()
    $('#create-todo-nav').hide()
}

function emptyLogin() {
    $('#login-email').val("")
    $('#login-password').val("")
}

function emptyRegister() {
    $('#register-email').val("")
    $('#register-password').val("")
}

function emptyCreateToDo() {
    $('#create-title').val("")
    $('#create-description').val("")
    $('#create-status').val("")
    $('#create-duedate').val("")
}

function isLogin() {
    emptyLogin()
    emptyRegister()
    emptyCreateToDo()

    if (localStorage.getItem('token')) {
        navbarLogin()
        getAllToDo()
        $('#all-todo-list-section').show()
        $('#my-todo-list-section').hide()
        $('#home-section').hide()
        $('#login-section').hide()
        $('#register-section').hide()
        $('#create-todo-section').hide()
        $('#edit-todo-section').hide()
    } else {
        navbarGuest()
        $('#home-section').show()
        $('#my-todo-list-section').hide()
        $('#login-section').hide()
        $('#register-section').hide()
        $('#all-todo-list-section').hide()
        $('#create-todo-section').hide()
        $('#edit-todo-section').hide()
    }
}

function getAllToDo() {
    $('#todo-list').empty()

    $.ajax({
        method: "GET",
        url: `${SERVER}/todos`
    })
        .done(response => {


            let no = 1
            response.forEach(item => {
                let dueDate = item.dueDate
                dueDate = new Date(dueDate)
                let finaldate = dueDate.toISOString().slice(0, 10)

                $('#todo-list').append(`
                <tr>
                  <th scope="row">${no}</th>
                  <td>${item.title}</td>
                  <td>${item.description}</td>
                  <td>${item.status}</td>
                  <td>${finaldate}</td>
                </tr>
                `)
                no++;
            })

            //Show
            navbarLogin()
            $('#all-todo-list-section').show()

            //Hide
            $('#home-section').hide()
            $('#login-section').hide()
            $('#register-section').hide()
            $('#create-todo-section').hide()
            $('#edit-todo-section').hide()
            $('#my-todo-list-section').hide()
        })
        .fail((xhr, error, status) => {
            console.log('fail')
            console.log(xhr.responseJSON, status, error)
        })
        .always((response) => {
            console.log('always')
        })
}

function getMyToDo() {
    $('#my-todo-list').empty()

    $.ajax({
        method: "GET",
        url: `${SERVER}/todos/mytodo`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(response => {
            let no = 1
            response.forEach(item => {
                let dueDate = item.dueDate
                dueDate = new Date(dueDate)
                let finaldate = dueDate.toISOString().slice(0, 10)

                $('#my-todo-list').append(`
                <tr>
                  <th scope="row">${no}</th>
                  <td>${item.title}</td>
                  <td>${item.description}</td>
                  <td>${item.status}</td>
                  <td>${finaldate}</td>
                  <td>
                  <div class="btn-group" role="group">
                  <button type="button" class="btn btn-primary" id="edit-${item.id}">Edit</button>
                  <button type="button" class="btn btn-primary" id="delete-${item.id}">Delete</button>
                  </div>
                  </td>
                </tr>
                `)
                no++;

                //Edit Button
                $(`#edit-${item.id}`).click((event) => {
                    getEditToDo(item.id)
                })

                //Delete Button
                $(`#delete-${item.id}`).click((event) => {
                    deleteToDo(item.id)
                })
            })

            //Show
            navbarLogin()
            $('#my-todo-list-section').show()

            //Hide
            $('#all-todo-list-section').hide()
            $('#home-section').hide()
            $('#login-section').hide()
            $('#register-section').hide()
            $('#create-todo-section').hide()

        })
        .fail((xhr, error, status) => {
            console.log('fail')
            console.log(xhr.responseJSON, status, error)
        })
        .always((response) => {
            console.log('always')
        })
}

function getEditToDo(id) {
    $.ajax({
        method: "GET",
        url: `${SERVER}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(response => {
            let title = response.title
            let description = response.description
            let status = response.status
            let dueDate = response.dueDate
            dueDate = new Date(dueDate)
            let finaldate = dueDate.toISOString().slice(0, 10)

            //Show
            navbarLogin()
            $('#edit-todo-section').show()

            //Before update
            $('#edit-title').val(title)
            $('#edit-description').val(description)
            $('#edit-status').val(status)
            $('#edit-duedate').val(finaldate)

            //Post Edit
            $('#edit-todo-section').submit((event) => {
                putEditToDo(id)
            })

            //Hide
            $('#my-todo-list-section').hide()
            $('#all-todo-list-section').hide()
            $('#home-section').hide()
            $('#login-section').hide()
            $('#register-section').hide()
            $('#create-todo-section').hide()
        })
        .fail((xhr, error, status) => {
            console.log('fail')
            console.log(xhr.responseJSON, status, error)
        })
        .always((response) => {
            console.log('always')
        })

}

function putEditToDo(id) {
    let title = $('#edit-title').val()
    let description = $('#edit-description').val()
    let status = $('#edit-status').val()
    let dueDate = $('#edit-duedate').val()

    $.ajax({
        method: "PUT",
        url: `${SERVER}/todos/${Number(id)}`,
        data: {
            title,
            description,
            status,
            dueDate
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(response => {
            isLogin()
        })
        .fail((xhr, error, status) => {
            console.log('fail')
            console.log(xhr.responseJSON, status, error)
        })
        .always((response) => {
            console.log('always')
        })

}

function deleteToDo(id) {
    $.ajax({
        method: "DELETE",
        url: `${SERVER}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(response => {
            isLogin()
        })
        .fail((xhr, error, status) => {
            console.log('fail')
            console.log(xhr.responseJSON, status, error)
        })
        .always((response) => {
            console.log('always')
        })

}

function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        method: "POST",
        url: `${SERVER}/user/login/google`,
        headers: {
            id_token
        }
    })
        .done(response => {
            let token = response.token
            localStorage.setItem('token', token)
            isLogin()
        })
        .fail((xhr, error, status) => {
            console.log('fail')
            console.log(xhr.responseJSON, status, error)
        })
        .always((response) => {
            console.log('always')
        })
}

function googleSignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        isLogin()
        event.preventDefault()
    });
}

//AJAX
$(document).ready(() => {
    //Homepage
    isLogin()

    //Navigation
    $('#home-nav').click((event) => {
        isLogin()
        event.preventDefault()
    })

    $('#login-nav').click((event) => {
        //Show
        navbarGuest()
        $('#login-section').show()

        //Hide
        $('#my-todo-list-section').hide()
        $('#home-section').hide()
        $('#register-section').hide()
        $('#all-todo-list-section').hide()
        $('#create-todo-section').hide()
        $('#edit-todo-section').hide()

        event.preventDefault()
    })

    $('#register-nav').click((event) => {
        //Show
        navbarGuest()
        $('#register-section').show()

        //Hide
        $('#my-todo-list-section').hide()
        $('#home-section').hide()
        $('#login-section').hide()
        $('#all-todo-list-section').hide()
        $('#create-todo-section').hide()
        $('#edit-todo-section').hide()

        event.preventDefault()
    })

    $('#todo-list-nav').click((event) => {
        getAllToDo()
        event.preventDefault()
    })

    $('#create-todo-nav').click((event) => {
        //Show
        navbarLogin()

        $('#create-todo-section').show()

        //Hide
        $('#my-todo-list-section').hide()
        $('#home-section').hide()
        $('#login-section').hide()
        $('#register-section').hide()
        $('#all-todo-list-section').hide()
        $('#edit-todo-section').hide()

        event.preventDefault()
    })

    $('#my-todo-list-nav').click((event) => {
        getMyToDo()
        event.preventDefault()
    })


    //Login
    $('#login-section').submit((event) => {
        let email = $('#login-email').val()
        let password = $('#login-password').val()

        $.ajax({
            method: "POST",
            url: `${SERVER}/user/login`,
            data: {
                email,
                password
            }
        })
            .done((response) => {
                let token = response.token
                localStorage.setItem('token', token)
                isLogin()
            })
            .fail((xhr, error, status) => {
                console.log('fail')
                console.log(xhr.responseJSON, status, error)
            })
            .always((response) => {
                console.log(response)
                console.log('always')
            })

        event.preventDefault()
    })

    //Register
    $('#register-section').submit((event) => {
        let email = $('#register-email').val()
        let password = $('#register-password').val()

        $.ajax({
            method: "POST",
            url: `${SERVER}/user/register`,
            data: {
                email,
                password
            }
        })
            .done((response) => {
                isLogin()
            })
            .fail((xhr, error, status) => {
                console.log('fail')
                console.log(xhr.responseJSON, status, error)
            })
            .always((response) => {
                console.log('always')
            })

        event.preventDefault()
    })

    //Logout
    $('#logout-nav').click((event) => {
        localStorage.removeItem('token')
        googleSignOut()
        event.preventDefault()
    })

    //Create To Do
    $('#create-todo-section').submit((event) => {
        let title = $('#create-title').val()
        let description = $('#create-description').val()
        let status = $('#create-status').val()
        let dueDate = $('#create-duedate').val()

        $.ajax({
            method: "POST",
            url: `${SERVER}/todos`,
            data: {
                title,
                description,
                status,
                dueDate
            },
            headers: {
                token: localStorage.getItem('token')
            }
        })
            .done(response => {
                isLogin()
            })
            .fail((xhr, error, status) => {
                console.log('fail')
                console.log(xhr.responseJSON, status, error)
            })
            .always((response) => {
                console.log('complete')
            })

        event.preventDefault()
    })

})

