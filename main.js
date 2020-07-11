const SERVER_PATH = 'http://localhost:3000'

function fetchData(){
    $('#list-todo').empty()
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
            response.forEach(todo => {
                $('#list-todo').append(`
                
                <div class="col-sm-5">
                    <div class="card" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">${todo.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Status: ${todo.status}</h6>
                            <p class="card-text">${todo.description}</p>
                            <p class="card-text">${todo.place}</p>
                            <p class="card-text">${todo.due_date}</p>
                            <button id="update-${todo.id}" class="btn btn-primary">Edit</button>
                            <button id="delete-${todo.id}" class="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
                `)

                $(`#delete-${todo.id}`).on('click', function(){
                    console.log(`delete-${todo.id}`)
                    destroyTodo(todo.id)


                })

                $(`#update-${todo.id}`).on('click', function(){
                    console.log(`show update-${todo.id}`)
                    showUpdateTodo(todo.id)

                })
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

function destroyTodo(id){
    $.ajax({
        method: 'DELETE',
        url: `${SERVER_PATH}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done(response => {
        // Response nya satu klo berhasil
        console.log('done', response)
        fetchData()
    })
    .fail(response => {
        console.log('done', response.error)
    })
    .always(response => {
        console.log('always', response)
    })


}

function showUpdateTodo(id){
    $.ajax({
        method: 'GET',
        url: `${SERVER_PATH}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done(response => {
        console.log('done', response)
        $('#update-page').show()
        $('#title-update').val(response.title)
        $('#description-update').val(response.description)
        $('#status-update').val(response.status)
        $('#due_date-update').val(response.due_date)
        $('#place-update').val(response.place)
        $('#todo-id').val(response.id)

        

    })
    .fail(response => {
        console.log('done', response.error)
    })
    .always(response => {
        console.log('always', response)
    })
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        method: 'POST',
        url: `${SERVER_PATH}/users/login/google`,
        headers: {
            id_token
        }
    })
    .done(response => {
        console.log('done ==> ', response)
        localStorage.setItem('token', response)
        $('#login-page').hide()
        $('#register-page').hide()
        $('#update-page').hide()
        $('#create-page').show()
        $('#logout-nav').show()
        $('#login-nav').hide()
        fetchData()
        getRestaurantBandung()

    })
    .fail(response => {
        console.log('fail', response)
    })
    .always(response => {
        console.log('always', response)
    })

}

// Sementara belum pakek parameter
function getRestaurantBandung(){
    $.ajax({
        method: 'GET',
        url: `${SERVER_PATH}/api/restaurant`
        // Gapake header

    })
        .done(response => {
            response.forEach( item => {
                
                // $('#list-restaurant').append(`
                //     <div class="col-sm-4">
                //         <div class="card" style="width: 18rem;">
                //             <img src="${item.restaurant.image_url}" class="card-img-top" alt="...">
                //             <div class="card-body">
                //                 <h5 class="card-title">${item.restaurant.name}</h5>
                //                 <p class="card-text">${item.restaurant.location.address}</p>
                //             </div>
                //         </div>
                //     </div>
                // `)

                $('#place').append(`
                    <option>${item.restaurant.name}. ${item.restaurant.location.address}</option>
                `)
                $('#place-update').append(`
                    <option>${item.restaurant.name}. ${item.restaurant.location.address}</option>
                `)
            })
        })
        .fail(response => {
            console.log('fail', response)
        })
        .always(response => {
            console.log('always', response)
        })
}





$(document).ready( function(){
    // TESTING Dan Mengatur Padding With jQuery
    $('section').css({
        'margin-top': '20px', 
        'padding': '20px 0'
    })
    
    // Handle Perpindahan Page
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
        getRestaurantBandung()
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

        // Remove google token
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
        $('#register-page').hide()
        $('#create-page').hide()
        $('#update-page').hide()
        $('#home-nav').hide()
        $('#logout-nav').hide()
        $('#login-page').show()
        $('#list-todo').empty()
        event.preventDefault()
    })

    // Login & Set Token
    $('#login-form').on('submit',function(event){
        const email = $('#email-login').val()
        const password = $('#password-login').val()
        
        //console.log(email, password)

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
                $('#email-login').val('')
                $('#password-login').val('')
                $('#login-error').show()
                $('#login-error').append(`
                    <div class="alert alert-danger" role="alert">
                        ${error}
                    </div>
                `)
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

    // CREATE
    $('#form-create').on('submit',function(event){
        const title = $('#title').val()
        const description = $('#description').val()
        const status = $('#status').val()
        const due_date = $('#due_date').val()
        const place = $('#place').val()

        getRestaurantBandung()

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
                fetchData()
                
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

    // UPDATE
    $('#form-update').on('submit',function(event){
        event.preventDefault()
        
        const title = $('#title-update').val()
        const description = $('#description-update').val()
        const status = $('#status-update').val()
        const due_date = $('#due_date-update').val()
        const place = $('#place-update').val()
        const id = $('#todo-id').val()
        getRestaurantBandung()
        // console.log('======>',id)
        

        $.ajax({
            method: 'PUT',
            url: `${SERVER_PATH}/todos/${id}`,
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
                console.log('done update')
                console.log(response)

                $('#title').val('')
                $('#description').val('')
                $('#status').val('')
                $('#due_date').val('')
                $('#place').val('')

                $('#update-page').hide()
                $('#create-page').show()
                fetchData()
                
            })
            .fail((xhr,status,error)=>{
                console.log('fail')
                console.log(xhr,status,error)
                console.log(localStorage.getItem('token'))
            }).always((response)=>{
                console.log('always')
                console.log(response)
            })

    })
        
        

    //even pada saat page scrool di klik
    $('.page-scroll').on('click', function(e){
        //ambil isi href
        let tujuan = $(this).attr('href');
        //tangkap elemen yang bersangkutan
        var elemenTujuan = $(tujuan);
        
        // Animasi
        $('html,body').animate({
            scrollTop: elemenTujuan.offset().top - 50
        }, 1000, 'easeInOutExpo');

        // Membajak fungsi href supaya ga pindah ke tujuan
        e.preventDefault();

        // Swing dan Linear yang jquery punya atau Cari Jquery Easing

    });
    
})