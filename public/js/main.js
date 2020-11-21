// isi server side kalian
const SERVER_PATH = 'https://aarsandi-fancytodo.herokuapp.com'
// const WEATHER_API = 'efddb2b39b1e6a7ad4c71bdbbfe3427b'

let selectedTask = null

jQuery(document).ready(() => {
    // Check if already login or not
    checkLogin()
    // Form login
    $('#login-form').submit(function (event) {
        event.preventDefault()
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
                localStorage.setItem('token', response.token)
                showContent()
            })
            .fail((xhr, status, error) => {
                $('#loginMessage').empty()
                $('#loginMessage').append(xhr.responseJSON.errors)
            })
    })
    // Form Register
    $('#register-form').submit(function (event) {
        event.preventDefault()
        if ($('#register-password').val() == $('#confirm_password').val()) {
            const user = {
                username: $('#register-username').val(),
                email: $('#register-email').val(),
                password: $('#register-password').val()
            }
            $.ajax({
                method: 'POST',
                url: `${SERVER_PATH}/user/register`,
                data: user
            })
                .done(response => {
                    // console.log('done')
                    // console.log(response)
                    $('#emailHelp').empty()
                    $('#emailHelp').append("success, please login to app")
                    showLogin()
                })
                .fail((xhr, status, error) => {
                    // console.log('fail')
                    // console.log(xhr.responseJSON, status, error)
                    $('#emailHelp').empty()
                    $('#emailHelp').append(xhr.responseJSON.errors)
                })
        } else {
            $('#messageConfirm').html('Not Matching');
        }
    })
    // Form Add Task
    $('#add-task').submit(function (event) {
        event.preventDefault()
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
                // console.log('done')
                // console.log(response)
                $('#addModal').modal('hide')
                showContent()
            })
            .fail((xhr, status, error) => {
                // console.log('fail')
                // console.log(xhr.responseJSON, status, error)
                $('#addTaskMessage').empty()
                $('#addTaskMessage').append(xhr.responseJSON.errors)
            })
            // .always((response) => {
            //     console.log('always')
            //     console.log(response)
            // })
    })
    // Form Edit Task
    $('#edit-task').submit(function (event) {
        event.preventDefault()
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
                // console.log('done')
                // console.log(response)
                $('#editModal').modal('hide')
                showContent()
            })
            .fail((xhr, status, error) => {
                // console.log('fail')
                // console.log(xhr.responseJSON, status, error)
                $('#editTaskMessage').empty()
                $('#editTaskMessage').append(xhr.responseJSON.errors)
            })
            // .always((response) => {
            //     console.log('always')
            //     console.log(response)
            // })
    })
    // NavBar logOut
    $('#logout-nav').click(function (event) {
        event.preventDefault()
        localStorage.removeItem('token')
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
            showLogin()
        }).catch(err => {
            console.log(err)
            showLogin()
        })
    })
    //Show-Hide site-register
    jQuery('#toggle1').on("click", multiClickFunctionStop);
    //Fix for site-register height
    jQuery("#site-register").css('minHeight', jQuery("#content").outerHeight());
})

function checkLogin() {
    if (!localStorage.getItem('token')) {
        showLogin()
    } else {
        showContent()
    }
}

function showLogin() {
    $('#content-list').hide()
    $('#login-page').show()
}

function showContent() {
    fetchData()
    // fetchWeather()
    $('#login-page').hide()
    $('#content-list').show()
}

function fetchData() {
    $('#task-list').empty()
    $('#duedate-list').empty()
    $.ajax({
        method: 'GET',
        url: `${SERVER_PATH}/task`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done((response) => {
            $('#show-alert').empty()
            if (!response.todo.length && !response.duedate.length) {
                $('#show-alert').append(`
            <div class="alert alert-primary" role="alert">
                Task masih kosong, klik add task untuk membuat task baru
            </div>
            `)
            } else {
                response.todo.forEach(task => {
                    $('#task-list').append(`
                <div class="col-6 mb-4">
                    <div class="task-card card">
                        <h5 class="card-header"><a id="read-task-${task.id}" class="btn">${task.title}</a>
                        <span id="delete-task-${task.id}" class="pull-right clickable close-icon"><i class="fa fa-trash"></i></span>
                        <span id="edit-task-${task.id}" class="pull-right clickable close-icon mx-2"><i class="fa fa-edit"></i></span>
                        </h5>
                        <div class="card-body">
                            <blockquote class="blockquote mb-0">
                            ${task.description}
                            </blockquote>
                            <p>${timeSince(task.createdAt)}</p>
                        </div>
                    </div>
                </div>
                `)
                    $(`#read-task-${task.id}`).click(function (event) {
                        event.preventDefault()
                        selectedTask = task
                        showReadTask()
                    })
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
                response.duedate.forEach(task => {
                    $('#duedate-list').append(`
                <div class="col-12 mb-4">
                    <div class="card duedate-card">
                        <h5 class="card-header"><a id="read-task-${task.id}" class="btn">${task.title}</a>
                        <span id="delete-task-${task.id}" class="pull-right clickable close-icon"><i class="fa fa-trash"></i></span>
                        <span id="edit-task-${task.id}" class="pull-right clickable close-icon mx-2"><i class="fa fa-edit"></i></span>
                        </h5>
                        <div class="card-body">
                            <blockquote class="blockquote mb-0">
                            ${task.description}
                            </blockquote>
                            <p>${timeSince(task.due_date)}</p>
                        </div>
                    </div>
                </div>
                `)
                    $(`#read-task-${task.id}`).click(function (event) {
                        event.preventDefault()
                        selectedTask = task
                        showReadTask()
                    })
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
            $('#show-alert').empty()
            $('#show-alert').append(`
        <div class="alert alert-danger" role="alert">
            <strong>Error.</strong> ${xhr.responseJSON.errors}
        </div>
        `)
        })
}

// function fetchWeather() {
//     $.getJSON("https://api.ipify.org/?format=json", function(e) {
//         console.log(e.ip);
//         $.ajax({
//             method: 'GET',
//             url: `http://api.weatherstack.com/current?access_key=${WEATHER_API}&query=${e.ip}/weather`
//         })
//             .done((response) => {
//                 $('#weatherShow').empty()
//                 $('#weatherShow').append(`
//             <div class="card weatherShow">
//                 <div class="card-header font-weight-bold">
//                     ${response.location.name}, ${response.location.region}
//                 </div>
//                 <div class="card-body">
//                 <h1 class="card-title font-weight-bold">${response.current.temperature}°C</h1>
//                 <p class="card-text font-weight-bold">${response.current.weather_descriptions} </p>
//                 <img src="${response.current.weather_icons}" alt="weather">
//                 </div>
//             </div>
//             `)
//             })
//     });
// }

function showReadTask() {
    if (selectedTask) {
        $('#readTitle, #readContent, #duedateContent').empty()
        $('#readTitle').append(selectedTask.title)
        $('#readContent').append(selectedTask.description)
        $('#duedateContent').append(`deadline: ${timeSince(selectedTask.due_date)}`)
    }
    $('#readModal').modal('show')
}

function showEditTask() {
    if (selectedTask) {
        $('#edit-task-title').val(selectedTask.title)
        $('#edit-task-description').val(selectedTask.description)
        $('#edit-task-duedate').val(selectedTask.duedate)
    }
    $('#editModal').modal('show')
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
            // console.log(response)
            showContent()
        })
        .fail((xhr, status, error) => {
            // console.log('fail')
            // console.log(xhr.responseJSON, status, error)
            $('#show-alert').append(`
        <div class="alert alert-danger" role="alert">
            <strong>Error.</strong> ${xhr.responseJSON.errors}
        </div>
        `)
        })
        // .always((response) => {
        //     console.log('always')
        //     console.log(response)
        // })
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
            showContent()
        })
        .fail((xhr, status, error) => {
            $('#loginMessage').empty()
            $('#loginMessage').append(xhr.responseJSON.errors)
        })
}

function multiClickFunctionStop(e) {
    e.preventDefault();
    jQuery('#toggle2').off("click");
    jQuery('#toggle2').toggleClass("on");
    jQuery('html, body, .site-register').toggleClass("open");
    jQuery('#toggle2').on("click", multiClickFunctionStop);
};

function timeSince(date) {
    switch (typeof date) {
        case 'number':
            break;
        case 'string':
            date = +new Date(date);
            break;
        case 'object':
            if (date.constructor === Date) date = date.getTime();
            break;
        default:
            date = +new Date();
    }
    let time_formats = [
        [60, 'seconds', 1], // 60
        [120, '1 minute ago', '1 minute from now'], // 60*2
        [3600, 'minutes', 60], // 60*60, 60
        [7200, '1 hour ago', '1 hour from now'], // 60*60*2
        [86400, 'hours', 3600], // 60*60*24, 60*60
        [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
        [604800, 'days', 86400], // 60*60*24*7, 60*60*24
        [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
        [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
        [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
        [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
        [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    let seconds = (+new Date() - date) / 1000,
        token = 'ago',
        list_choice = 1;

    if (seconds === 0) {
        return 'Just now'
    }
    if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = 'from now';
        list_choice = 2;
    }
    let i = 0,
        format;
    while ((format = time_formats[i++]))
        if (seconds < format[0]) {
            if (typeof format[2] == 'string')
                return format[list_choice];
            else
                return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
        }
    return date;
}
