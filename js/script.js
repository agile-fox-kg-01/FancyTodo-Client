const SERVER_PATH = 'http://localhost:3000'

$(document).ready(function(){

    

    // PERPINDAHAN HALAMAN

    $('#register-page').hide()
    $('#create-page').hide()
    $('#update-page').hide()
    $('#login-page').show()

    $('#login-nav').click(function(event){
        // hide list
        $('#register-page').hide()
        $('#create-page').hide()
        $('#update-page').hide()
        
        // show list
        $('#login-page').show()
    
        event.preventDefault()
    })

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

    // MENGOLAH DATA 
    $('#form-create').on('submit', function (event) {
        const title = $('#title').val()
        const description = $('#description').val()
        const status = $('#status').val()
        const due_date = $('#due_date').val()
    
        console.log(title, description, status, due_date)
    
        // $.ajax({
        //   method: 'POST',
        //   url: `${SERVER_PATH}/todos/`,
        //   headers: {
        //     token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImljaGxhc3VsMDg5OUBnbWFpbC5jb20iLCJpYXQiOjE1OTQxOTEyMTB9.hPPKiRqHypuGPw35GPyK6taKtMi4tWFhiwdheXUkVIo'
        //     // token: localStorage.getItem('token')
        //   },
        //   data: {
        //     name,
        //     singer,
        //     releasedYear
        //   }
        // })
        // .done((response) => {
        //   console.log('done')
        //   console.log(response)
        //   $('#song-name').val('')
        //   $('#song-singer').val('')
        //   $('#song-released-year').val('')
        //   fetchData()
        // })
        // .fail((xhr, status, error) => {
        //   console.log('fail')
        //   console.log(xhr.responseJSON, status, error)
        // })
        // .always((response) => {
        //   console.log('always')
        //   console.log(response)
        // })
    
        event.preventDefault()
      })




})