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

function isLogin() {
    if (localStorage.getItem('token')) {
        navbarLogin()
        getAllToDo()
        $('#all-todo-list-section').show()
        $('#my-todo-list-section').hide()
        $('#home-section').hide()
        $('#login-section').hide()
        $('#register-section').hide()
        $('#create-todo-section').hide()
    } else {
        navbarGuest()
        $('#home-section').show()
        $('#my-todo-list-section').hide()
        $('#login-section').hide()
        $('#register-section').hide()
        $('#all-todo-list-section').hide()
        $('#create-todo-section').hide()
    }
}

function getAllToDo() {
    $('#todo-list').empty()

    $.ajax({
        method: "GET",
        url: `${SERVER}/todos/:userid`
    })
        .done(response => {
            let no = 1
            response.forEach(item => {
                $('#todo-list').append(`
                <tr>
                  <th scope="row">${no}</th>
                  <td>${item.title}</td>
                  <td>${item.description}</td>
                  <td>${item.status}</td>
                  <td>${item.dueDate}</td>
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
        })
        .fail((xhr, error, status) => {
            console.log('fail')
            console.log(xhr.responseJSON, status, error)
        })
        .always((response) => {
            console.log('always')
        })
}

// function getMyToDo() {
//     $('#todo-list').empty()

//     $.ajax({
//         method: "GET",
//         url: `${SERVER}/todos/:id`,
//         params: {
//             id: 
//         }
//     })
//         .done(response => {
//             let no = 1
//             response.forEach(item => {
//                 $('#todo-list').append(`
//                 <tr>
//                   <th scope="row">${no}</th>
//                   <td>${item.title}</td>
//                   <td>${item.description}</td>
//                   <td>${item.status}</td>
//                   <td>${item.dueDate}</td>
//                 </tr>
//                 `)
//                 no++;
//             })

//             //Show
//             navbarLogin()
//             $('#all-todo-list-section').show()

//             //Hide
//             $('#home-section').hide()
//             $('#login-section').hide()
//             $('#register-section').hide()
//             $('#create-todo-section').hide()
//         })
//         .fail((xhr, error, status) => {
//             console.log('fail')
//             console.log(xhr.responseJSON, status, error)
//         })
//         .always((response) => {
//             console.log('always')
//         })
// }

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

        event.preventDefault()
    })

    $('#my-todo-list-nav').click((event) => {
        getAllToDo()
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
        isLogin()
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

