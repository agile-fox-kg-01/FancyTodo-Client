
// const Swal = require('sweetalert2')
const SERVER_PATH = 'http://localhost:3002'

if (!localStorage.getItem('token')) {
  $(document).ready(() => {
    homeUnlogin()
    weather()
    quotes()
  })
} else {
  $(document).ready(() => {
    homeLoggedin()
    weather()
    quotes()
  })
}


// sign-out google

function signOutGoogle() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut()
}

function homeUnlogin() {
  $('.div-home').show()
  $('#log-in').show()
  $('#sign-up').show()

  $('.todos').hide()
  $('.form-register').hide()
  $('.form-login').hide()
  $('#log-out').hide()
  $('#myTodos').hide()
}

function homeLoggedin() {
  $('.div-home').show()
  $('#log-out').show()
  $('#myTodos').show()

  $('#log-in').hide()
  $('#sign-up').hide()
  $('.todos').hide()
  $('.form-register').hide()
  $('.form-login').hide()
  $('.addTodoForm').hide()

}

function logIn() {
  $('#emailLogin').val('')
  $('#passwordLogin').val('')
  $('.form-login').show()
  $('#sign-up').show()

  $('.div-home').hide()
  $('#log-in').hide()
  $('.todos').hide()
  $('.form-register').hide()
  $('#log-out').hide()
  $('.addTodoForm').hide()
}

function editData(id) {
  $(".editTodoForm").show()
  $('.addTodoForm').hide()
  $.ajax({
    method: 'GET',
    url: `${SERVER_PATH}/todos/${id}`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done((response) => {
      console.log(response);
      $("#editId").val(response.id)
      $("#editTitle").val(response.title)
      $("#editDescription").val(response.description)
      $("#editDue_date").val(response.due_date)
      $("#editStatus").val(response.status)
    })
    .fail((response) => {
      console.log(response);
    })
    .always((response) => {
      console.log(response);
    })
}

async function deleteData(id) {
  await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    }
  })
  console.log(id);
  $.ajax({
    method: 'DELETE',
    url: `${SERVER_PATH}/todos/${id}`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(response => {
      $('#all-todos').empty()
      $('.todos').show()
      fetchData(response.dataTodos)
    })
    .always(response => {
      console.log(response);
    })
}

function fetchData(dataTodos) {

  $('#all-todos').empty()
  dataTodos.forEach(todo => {
    if (todo.status === false) {
      $('#all-todos').append(`
        <tr id="undone-todo">
        <td id="idEdit"  style="text-decoration: line-through blue;">${todo.id}</td>
        <td id="title" style="text-decoration: line-through blue;" >${todo.title}</td>
        <td id="description" style="text-decoration: line-through blue;">${todo.description}</td>
        <td id="due_date"  style="text-decoration: line-through blue;">${todo.due_date}</td>
        <td>
        <a href="#" onclick="done(${todo.id})"><i class="fa fa-times fa-2x" aria-hidden="true"></i></a>&nbsp;
        <a href="#" onclick="undone(${todo.id})"><i class="fa fa-check fa-2x"
            aria-hidden="true"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </td>
      <td>
        <a href="#" onclick="deleteData(${todo.id})" id="deleteIcon"><i class="fa fa-trash fa-2x"
            aria-hidden="true"></i></a>&nbsp;&nbsp;
        <a href="#" onclick="editData(${todo.id})"><i class="fa fa-pencil-square-o fa-2x"
            aria-hidden="true"></i></a>
      </td>
        </tr >
        `)
    } else if (todo.status === true) {
      $('#all-todos').append(`
      <tr id="undone-todo">
      <td id="idEdit">${todo.id}</td>
      <td id="title">${todo.title}</td>
      <td id="description">${todo.description}</td>
      <td id="due_date">${todo.due_date}</td>
      <td>
      <a href="#" onclick="done(${todo.id})"><i class="fa fa-times fa-2x" aria-hidden="true"></i></a>&nbsp;
      <a href="#" onclick="undone(${todo.id})"><i class="fa fa-check fa-2x"
          aria-hidden="true"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </td>
    <td>
      <a href="#" onclick="deleteData(${todo.id})" id="deleteIcon"><i class="fa fa-trash fa-2x"
          aria-hidden="true"></i></a>&nbsp;&nbsp;
      <a href="#" onclick="editData(${todo.id})"><i class="fa fa-pencil-square-o fa-2x"
          aria-hidden="true"></i></a>
    </td>
      </tr >
      `)
    }

  })

  event.preventDefault()
}

function showSignup() {
  $('.form-register').show()
  $('#home').show()
  $('.todos').hide()
  $('.form-login').hide()
  $('.form-login').hide()
  $('#log-in').hide()
  $('#log-out').hide()
  $('#sign-up').hide()
  $('.div-home').hide()
  $('.addTodoForm').hide()
  $('.editTodoForm').hide()
}

function showTodos(token) {
  localStorage.setItem('token', token)
  $('.todos').show()
  $('#home').show()
  $('#log-out').show()

  $('.form-login').hide()
  $('#form-register').hide()
  $('#sign-up').hide()
  $('#log-in').hide()
  $('.div-home').hide()
  $('.editTodoForm').hide()

  event.preventDefault()

}

function weather() {

  $.ajax({
    method: 'GET',
    url: `${SERVER_PATH}/weathers`,
  })
    .done((response) => {
      console.log(response);
      $('#weather').append(
        `<h5>${response.output}</h5>`
      )
    })
    .fail((response) => {
      console.log(response.responseText);
    })
    .always((response) => {
    })
}

function quotes() {

  $.ajax({
    method: 'GET',
    url: `${SERVER_PATH}/quote`,
  })
    .done((response) => {
      console.log(response.result);
      $('#quote').append(
        ` <img id="book" src="img/book.png"><p style="font-size:13px; padding-top:7px">${response}</p>`
      )
    })
    .fail((response) => {
      console.log(response.responseText);
    })
    .always((response) => {
      console.log(response);
    })
}

function done(id) {
  const status = false
  $.ajax({
    method: 'PATCH',
    url: `${SERVER_PATH}/todos/${id}`,
    headers: {
      token: localStorage.getItem('token')
    },
    data: {
      status: status
    }
  })
    .done(response => {
      console.log('success change to status false')
      $('.todos').show()
      fetchData(response.dataTodos)

    })
    .fail(response => {
      console.log(response);
    })
    .always(response => {
      console.log(response);
    })

}

function undone(id) {
  const status = true
  $.ajax({
    method: 'PATCH',
    url: `${SERVER_PATH}/todos/${id}`,
    headers: {
      token: localStorage.getItem('token')
    },
    data: {
      status: status
    }
  })
    .done(response => {
      console.log('success change to status true');
      $('.todos').show()
      fetchData(response.dataTodos)

    })
    .fail(response => {
      console.log(response);
    })
    .always(response => {
      console.log(response);
    })
}

function addAndEditHide(dataTodos) {
  fetchData(dataTodos)
  $("#title").val('')
  $("#description").val('')
  $("#due_date").val('')

  $(".addTodoForm").hide()
  $(".editTodoForm").hide()
}


/* This line for every FORM */

// login
$('.form-login').submit((event) => {

  const email = $('#emailLogin').val()
  const password = $('#passwordLogin').val()

  $.ajax({
    method: 'POST',
    url: `${SERVER_PATH}/users/login`,
    data: {
      email: email,
      password: password

    }
  })
    .done(response => {
      console.log(response.token)
      console.log(response.dataTodos)
      $('.createTodo').show()
      showTodos(response.token)
      fetchData(response.dataTodos)

    })
    .fail(response => {
      console.log(response.responseText);
    })
    .always(response => {
      console.log(response);
    })

  event.preventDefault()
})

// sign-in google
function onSignIn(googleUser) {
  const google_token = googleUser.getAuthResponse().id_token;;
  $.ajax({
    url: `${SERVER_PATH}/users/login/google`,
    method: 'POST',
    headers: {
      google_token
    }
  })
    .done(response => {
      showTodos(response.token)
      fetchData(response.dataTodos)

    })
    .fail(response => {
      console.log(response);
    })
    .always(response => {
      console.log(response);
    })
}

// sign-up / register
$('#form-sign-up').submit((event) => {
  const first_name = $('#first_name').val()
  const last_name = $('#last_name').val()
  const email = $('#email').val()
  const password = $('#password').val()
  const date_of_birth = $('#date_of_birth').val()

  $.ajax({
    method: 'POST',
    url: `${SERVER_PATH}/users/register`,
    data: {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      date_of_birth: date_of_birth
    }
  })
    .done(response => {
      console.log(response);
      logIn()

    })
    .fail(response => {
      console.log(response.responseText);
    })
    .always(response => {
      console.log(response);
    })

  event.preventDefault()

})

// newTodo
$('.addTodoForm').submit((event) => {

  const title = $("#title").val()
  const description = $("#description").val()
  const due_date = $("#due_date").val()
  const status = true

  $.ajax({
    method: 'POST',
    url: `${SERVER_PATH}/todos`,
    headers: {
      token: localStorage.getItem('token')
    },
    data: { title, description, due_date, status }
  })
    .done(response => {
      console.log(response);
      $('.createTodo').show()
      addAndEditHide(response.dataTodos)

    })
    .fail(response => {
      console.log(response);
    })
    .always(response => {
      console.log(response);
    })
  event.preventDefault()

})

// editTodo
$('.editTodoForm').submit((event) => {
  event.preventDefault()
  const id = $("#editId").val()
  const title = $("#editTitle").val()
  const description = $("#editDescription").val()
  const due_date = $("#editDue_date").val()
  const status = $("#editStatus").val()
  $.ajax({
    method: 'PUT',
    url: `${SERVER_PATH}/todos/${id}`,
    headers: {
      token: localStorage.getItem('token')
    },
    data: { title, description, due_date, status }
  })
    .done(response => {
      $('.createTodo').show()
      showTodos(response.token)
      addAndEditHide(response.dataTodos)

    })
    .fail(response => {
      console.log(response);
    })
    .always(response => {
      console.log(response);
    })

})


/* This line for every navbar onCLick */

$('#myTodos').click((event) => {
  const token = localStorage.getItem('token')
  showTodos(token)
})

$('#sign-up').click((event) => {
  showSignup()
})

$('#log-in').click((event) => {
  logIn()
})

$('#home').click((event) => {
  if (!localStorage.getItem('token')) {
    homeUnlogin()
  } else {
    homeLoggedin()
  }
})

$('#log-out').click((event) => {
  Swal.fire({
    title: 'Error!',
    text: 'Do you want to log out',
    icon: 'error',
    confirmButtonText: 'yes'
  })
  localStorage.removeItem('token')
  signOutGoogle()
  homeUnlogin()
})

// button moreTodo (to add new Todo)
$('.createTodo').click((event) => {
  $('.addTodoForm').show()
  $('.createTodo').hide()
})

