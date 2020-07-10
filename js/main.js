
const SERVER_PATH = 'http://localhost:3000'

let selectedTask = null
const metaGoogle = "941386381500-egkg4t7c2s88igmd439bl4734qathnll.apps.googleusercontent.com"

function checkLogin() {
    if (!localStorage.getItem('token')) {
        showLogin()
    } else {
        showContent()
    }
}

function showLogin() {
    $('#content-list').hide()
    $('#edit-task-page').hide()
    $('#register-page').hide()
    $('#create-task-page').hide()
    $('#logout-nav').hide()
    $('#add-task-nav').hide()
    $('#list-task-nav').hide()
    $('#login-nav').hide()
    $('#weatherShow').hide()

    $('#login-page').show()
    $('#register-nav').show()
}

function onSignIn(googleUser) {
    const google_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: `${SERVER_PATH}/user/login/google`,
        method: 'POST',
        headers: {
            google_token
        }
    })
        .done(response => {
            localStorage.setItem('token', response.token)
            $('#show-alert').empty()
            $('#show-alert').append(`
            <div class="alert alert-success" role="alert">
                <strong>Success.</strong> Success login with your gmail
            </div>
            `)
            showContent()
        })
        .fail(response => {
            console.log('fail', response)
        })
        .always(response => {
            console.log('always', response)
        })
}

function googleSignOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      showLogin()
    });
}

function showRegister() {
    $('#login-page').hide()
    $('#create-task-page').hide()
    $('#edit-task-page').hide()
    $('#content-list').hide()
    $('#register-nav').hide()
    $('#weatherShow').hide()
    
    $('#login-nav').show()
    $('#register-page').show()
}

function fetchData() {
    $('#task-list').empty()
    $.ajax({
        method: 'GET',
        url: `${SERVER_PATH}/task`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done((response) => {
        console.log('done')
        $('#show-alert').empty()
        if(!response.length) {
            $('#show-alert').append(`
            <div class="alert alert-primary" role="alert">
                Task masih kosong, klik add task untuk membuat task baru
            </div>
            `)
        } else {
            response.forEach(task => {
                $('#task-list').append(`
                <div class="card col-12 mb-3">
                    <h5 class="card-header">${task.title}</h5>
                    <div class="card-body">
                        <blockquote class="blockquote mb-0">
                        <p>${task.description}</p>
                        </blockquote>
                        <a class="float-right btn btn-primary font-weight-bold mx-1" id="edit-task-${task.id}">Edit</a>
                        <a class="float-right btn btn-primary font-weight-bold mx-1" id="delete-task-${task.id}">delete</a>
                    </div>
                </div>
                `)
                $(`#edit-task-${task.id}`).click(function (event) {
                    selectedTask = task
                    showEditTask()
                    event.preventDefault()
                })
                $(`#delete-task-${task.id}`).click(function (event) {
                    deleteTask(task.id)
                    event.preventDefault()
                })
            })
        }
    })
    .fail((xhr, status, error) => {
        console.log('fail')
        console.log(xhr.responseJSON, status, error)
        $('#show-alert').empty()
        $('#show-alert').append(`
        <div class="alert alert-danger" role="alert">
            <strong>Error.</strong> ${xhr.responseJSON.errors}
        </div>
        `)
    })
    .always((response) => {
        console.log('always')
        console.log(response)
    })
}

function fetchWeather() {
    $.ajax({
        method: 'GET',
        url: `${SERVER_PATH}/weather`
    })
    .done((response) => {
        console.log('weather done')
        console.log(response)
        $('#weatherShow').empty()
        $('#weatherShow').append(`
        <div class="col-sm-12 col-md-12" style="padding-left: 0; padding-right: 0; z-index:1;">
            <div class="card">
                <div class="card-header font-weight-bold">
                    ${response.location.name}, ${response.location.region}, ${response.location.country}
                </div>
                <div class="card-body">
                <h1 class="card-title font-weight-bold">${response.current.temperature}° C</h1>
                <p class="card-text font-weight-bold">${response.current.weather_descriptions} </p>
                <img src="${response.current.weather_icons}" alt="weather">
                </div>
            </div>
        </div>
        `)
    })
    .fail((xhr, status, error) => {
        console.log('fail')
        console.log(xhr.responseJSON, status, error)
    })
    .always((response) => {
        console.log('weather always')
        console.log(response)
    })
}

function showContent() {
    $('#register-page').hide()
    $('#login-page').hide()
    $('#create-task-page').hide()
    $('#edit-task-page').hide()
    $('#register-nav').hide()
    $('#login-nav').hide()
    $('#list-task-nav').hide()

    $('#content-list').show()
    $('#add-task-nav').show()
    $('#logout-nav').show()
    fetchData()
    fetchWeather()
}

function showAddTask() {
    $('#content-list').hide()
    $('#register-page').hide()
    $('#login-page').hide()
    $('#edit-task-page').hide()
    $('#register-nav').hide()
    $('#login-nav').hide()
    $('#add-task-nav').hide()
    $('#weatherShow').hide()

    $('#create-task-page').show()
    $('#list-task-nav').show()
    $('#logout-nav').show()
}

function showEditTask() {
    if (selectedTask) {
        $('#edit-task-title').val(selectedTask.title)
        $('#edit-task-description').val(selectedTask.description)
        $('#edit-task-duedate').val(selectedTask.duedate)
    }
    $('#content-list').hide()
    $('#login-page').hide()
    $('#create-task-page').hide()
    $('#weatherShow').hide()
    $('#register-page').hide()
    $('#register-nav').hide()
    $('#login-nav').hide()
    $('#add-task-nav').hide()
    
    $('#edit-task-page').show()
    $('#list-task-nav').show()
    $('#logout-nav').show()
}

function deleteTask(id) {
    $.ajax({
        method: 'DELETE',
        url: `${SERVER_PATH}/task/delete/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done((response) => {
        console.log(response)
        $('#show-alert').empty()
        $('#show-alert').append(`
        <div class="alert alert-primary" role="alert">
            <strong>Success.</strong> Sukses Delete Task
        </div>
        `)
        showContent()
    })
    .fail((xhr, status, error) => {
        console.log('fail')
        console.log(xhr.responseJSON, status, error)
        $('#show-alert').append(`
        <div class="alert alert-danger" role="alert">
            <strong>Error.</strong> ${xhr.responseJSON.errors}
        </div>
        `)
    })
    .always((response) => {
        console.log('always')
        console.log(response)
    })
}

$(document).ready(() => {
    $('#google-meta').attr('content', metaGoogle);
    checkLogin()

    // Form login
    $('#login-form').submit(function (event) {
        const email = $('#login-email').val()
        const password = $('#login-password').val()
        $.ajax({
            method: 'POST',
            url: `${SERVER_PATH}/user/login`,
            data: {
                email: email,
                password: password
            }
        })
        .done(response => {
            console.log('done')
            console.log(response)
            localStorage.setItem('token', response.token)
            $('#show-alert').empty()
            $('#show-alert').append(`
            <div class="alert alert-success" role="alert">
                <strong>Success.</strong> Success login with ${email}
            </div>
            `)
            showContent()
        })
        .fail((xhr, status, error) => {
            console.log('fail')
            console.log(xhr.responseJSON, status, error)
            $('#show-alert').empty()
            $('#show-alert').append(`
            <div class="alert alert-danger" role="alert">
                <strong>Error.</strong> ${xhr.responseJSON.errors}
            </div>
            `)
        })
        .always(response => {
            console.log('always')
            console.log(response)
        })
        event.preventDefault()
    })

    // Form Register
    $('#register-form').submit(function (event) {
        const user = {
            email: $('#register-email').val(),
            password: $('#register-password').val(),
            firstname: $('#register-firstname').val(),
            lastname: $('#register-lastname').val(),
            birthOfDate: $('#register-birthOfDate').val()
        }
        $.ajax({
            method: 'POST',
            url: `${SERVER_PATH}/user/register`,
            data: user
        })
        .done(response => {
            console.log('done')
            console.log(response)
            localStorage.setItem('token', response.token)
            $('#show-alert').empty()
            $('#show-alert').append(`
            <div class="alert alert-success" role="alert">
                <strong>Success.</strong> Success Register with this ${user.email}
            </div>
            `)
            showContent()
        })
        .fail((xhr, status, error) => {
            console.log('fail')
            console.log(xhr.responseJSON, status, error)
            $('#show-alert').empty()
            $('#show-alert').append(`
            <div class="alert alert-danger" role="alert">
                <strong>Error.</strong> ${xhr.responseJSON.errors}
            </div>
            `)
        })
        .always(response => {
            console.log('always')
            console.log(response)
        })
        event.preventDefault()
    })

    // Form Add Task
    $('#add-task').submit(function(event) {
        const title = $('#task-title').val()
        const description = $('#task-description').val()
        const due_date = $('#task-duedate').val()
        $.ajax({
            method: 'POST',
            url: `${SERVER_PATH}/task/add`,
            headers: {
                token: localStorage.getItem('token')
            },
            data: {
                title,
                description,
                due_date
            }
        })
        .done((response) => {
            console.log('done')
            console.log(response)
            $('#show-alert').empty()
            $('#show-alert').append(`
            <div class="alert alert-success" role="alert">
                <strong>Success.</strong> Success add task ${title}
            </div>
            `)
            showContent()
        })
        .fail((xhr, status, error) => {
            console.log('fail')
            console.log(xhr.responseJSON, status, error)
            $('#show-alert').empty()
            $('#show-alert').append(`
            <div class="alert alert-danger" role="alert">
                <strong>Error.</strong> ${xhr.responseJSON.errors}
            </div>
            `)
        })
        .always((response) => {
            console.log('always')
            console.log(response)
        })
        event.preventDefault()
    })

    // Form Edit Task
    $('#edit-task').submit(function(event) {
        const title = $('#edit-task-title').val()
        const description = $('#edit-task-description').val()
        const due_date = $('#edit-task-duedate').val()
        $.ajax({
            method: 'PUT',
            url: `${SERVER_PATH}/task/edit/${selectedTask.id}`,
            headers: {
                token: localStorage.getItem('token')
            },
            data: {
                title,
                description,
                due_date
            }
        })
        .done((response) => {
            console.log('done')
            console.log(response)
            $('#show-alert').empty()
            $('#show-alert').append(`
            <div class="alert alert-success" role="alert">
                <strong>Success.</strong> Success edit task ${title}
            </div>
            `)
            showContent()
        })
        .fail((xhr, status, error) => {
            console.log('fail')
            console.log(xhr.responseJSON, status, error)
            $('#show-alert').empty()
            $('#show-alert').append(`
            <div class="alert alert-danger" role="alert">
                <strong>Error.</strong> ${xhr.responseJSON.errors}
            </div>
            `)
        })
        .always((response) => {
            console.log('always')
            console.log(response)
        })
        event.preventDefault()
    })

    // NavBar Register
    $('#register-nav').click(function (event) {
        showRegister()
        event.preventDefault()
    })

    // NavBar Login
    $('#login-nav').click(function (event) {
        showLogin()
        event.preventDefault()
    })

    // NavBar logOut
    $('#logout-nav').click(function (event) {
        localStorage.removeItem('token')
        googleSignOut()
        $('#show-alert').empty()
        $('#show-alert').append(`
        <div class="alert alert-success" role="alert">
            <strong>Success.</strong> Success logout
        </div>
        `)
        event.preventDefault()
    })

    // NavBar Add Task
    $('#add-task-nav').click(function (event) {
        showAddTask()
        event.preventDefault()
    })

    // NavBar List task
    $('#list-task-nav').click(function (event) {
        showContent()
        event.preventDefault()
    })
})