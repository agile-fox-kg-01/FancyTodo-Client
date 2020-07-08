const SERVER_PATH = 'http://localhost:3000'

function fetchData(){
    $.ajax({
        method: 'GET',
        url: `${SERVER_PATH}/todos`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(response => {
            console.log('done')
            console.log(response)
            response.forEach(todo=>{
                $('#list-todo').append(`
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${todo.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${todo.status}</h6>
                        <p class="card-text">${todo.description}</p>
                        <p class="card-text">${todo.place}</p>
                        <p class="card-text">${todo.due_date}</p>
                        <p class="card-text">${todo.UserId}</p>
                        <a id="update-button" href="" class="card-link">Edit</a>
                        <a id="delete-button" href="" class="card-link">Delete</a>
                    </div>
                </div>
                `)
            })
        })
        .fail((xhr,status,error)=>{
            console.log('fail')
            console.log(xhr,status,error)
        })
        .always((response)=>{
            console.log('always')
            console.log(response)
        })
}

$(document).ready( function(){
    // TESTING
    $('h1').css('color', 'red')
    $('section').css({
        'margin-top': '20px', 
        'padding': '20px 0'
    })
    //localStorage.setItem('token','dummy')
    // Jika belum login maka tampilkan halaman login
    if(!localStorage.getItem('token')){
        $('#register-page').hide()
        $('#create-page').hide()
        $('#update-page').hide()
        $('#home-nav').hide()
        $('#logout-nav').hide()

        $('#register-button').click(function(event){
            // hide list
            $('#update-page').hide()
            $('#create-page').hide()
            $('#login-page').hide()
            // show list
            $('#register-page').show()
    
            event.preventDefault()
        })
    
        $('#login-button').click(function(event){
            // hide list
            $('#register-page').hide()
            $('#create-page').hide()
            $('#update-page').hide()
            
            // show list
            $('#login-page').show()
        
            event.preventDefault()
        })       
    } else {
        $('#login-page').hide()
        $('#register-page').hide()
        $('#update-page').hide()
        $('#create-page').show()
        $('#logout-nav').show()
        $('#login-nav').hide()
        fetchData()
        $('#home-nav').click(function(event){
            // hide list
            $('#register-page').hide()
            $('#update-page').hide()
            $('#login-page').hide()
            // show list
            $('#create-page').show()
        
            event.preventDefault()
        })
    
        $('#update-button').click(function(event){
            // hide list
            $('#register-page').hide()
            $('#create-page').hide()
            $('#login-page').hide()
            // show list
            $('#update-page').show()
        
            event.preventDefault()
        })
    
        $('#back-to-home').click(function(event){
            // hide list
            $('#register-page').hide()
            $('#update-page').hide()
            $('#login-page').hide()
            // show list
            $('#create-page').show()
        
            event.preventDefault()
        })

        
    }

    // Logout
    $('#logout-nav').click(function(event){
        console.log('logout')
        localStorage.removeItem('token')
        $('#register-page').hide()
        $('#create-page').hide()
        $('#update-page').hide()
        $('#home-nav').hide()
        $('#logout-nav').hide()
        $('#login-page').show()

        event.preventDefault()
    })

    // Login & Set Token
    $('#login-form').on('submit',function(event){
        const email = $('#email-login').val()
        const password = $('#password-login').val()
        
        console.log(email, password)

        $.ajax({
            method: 'POST',
            url: `${SERVER_PATH}/users/login`,
            data: {
                email,
                password
            }
        })
            .done((response)=>{
                console.log('done')
                console.log(response)
                localStorage.setItem('token',response)
                $('#login-page').hide()
                $('#register-page').hide()
                $('#update-page').hide()
                $('#create-page').show()
                $('#logout-nav').show()
                $('#login-nav').hide()
                $('#email-login').val('')
                $('#password-login').val('')

                fetchData()
            })
            .fail((xhr,status,error)=>{
                console.log('fail')
                console.log(xhr,status,error)
            })
            .always((response)=>{
                console.log('always')
                console.log(response)
            })
        
        event.preventDefault()
    })
    
    // Register
    $('#registrasi-form').on('submit',function(event){
        const email = $('#email').val()
        const username = $('#username').val()
        const password = $('#password').val()
        
        // console.log(email, username, password)

        $.ajax({
            method: 'POST',
            url: `${SERVER_PATH}/users/register`,
            data: {
                email,
                username,
                password
            }
        }).done(response => {
            console.log('done')
            console.log(response)
            
            $('#email').val('')
            $('#username').val('')
            $('#password').val('')

            // Note tambahin alert eror di register lalu ubah dengan jquery untuk menampilkan


        }).fail((xhr,status,error)=>{
            console.log('fail')
            console.log(xhr,status,error)
        }).always((response)=>{
            console.log('always')
            console.log(response)
        })

        event.preventDefault()
    })

    // Note : Registrasi Udah bisa tapi belum menangani tampilan error nya

    $('#form-create').on('submit',function(event){
        const title = $('#title').val()
        const description = $('#description').val()
        const status = $('#status').val()
        const due_date = $('#due_date').val()
        const place = $('#place').val()

        // console.log(title, description, status, due_date, place)

        $.ajax({
            method: 'POST',
            url: `${SERVER_PATH}/todos`,
            data: {
                title,
                description,
                status,
                due_date,
                place
            },
            headers: {
              token: localStorage.getItem('token')  
            }
        })
            .done(response=>{
                console.log('done')
                console.log(response)

                $('#title').val('')
                $('#description').val('')
                $('#status').val('')
                $('#due_date').val('')
                $('#place').val('')

                // Ambil response nya append ke list todo
            })
            .fail((xhr,status,error)=>{
                console.log('fail')
                console.log(xhr,status,error)
                console.log(localStorage.getItem('token'))
            }).always((response)=>{
                console.log('always')
                console.log(response)
            })

        event.preventDefault()
    })

    // Note : Create Todo Bisa, eror handler nya belum di tangani


    // Delete
    $('#delete-button').click( function(event) {
        $.ajax({
            method: 'DELETE',
            url: `${SERVER_PATH}/todos/:id`,
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done(response => {
            console.log('done')
            console.log(response)
        })
        .fail((xhr,status,error)=>{
            console.log('fail')
            console.log(xhr,status,error)
        })
        .always(response => {
            console.log('always')
            console.log(response)
        })

        event.preventDefault()
    })
    









})