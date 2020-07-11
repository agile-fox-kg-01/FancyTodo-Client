const SERVER_PATH = `http://localhost:3000`;

$(document).ready(() => {
    getLatestNews();
    isLoggedIn();

    $('#login-button').click(function(event) {
        event.preventDefault();
        $('#loginModal').modal('toggle');
    })

    $('#login-modal').submit(function(event) {
        event.preventDefault();

        let email = $('#email-login').val();
        let password = $('#password-login').val();
        
        $.ajax({
            method: 'POST',
            url: `${SERVER_PATH}/login`,
            data: {
                email,
                password
            }
        })
        .done(response => {
            let token = response.token;
            let name = response.name;
            localStorage.setItem('token', token);
            localStorage.setItem('name', name)
            $('#loginModal').modal('toggle');
            $('#email-login').val('');
            $('#password-login').val('');
            dashboard();
        })
        .fail((xhr, status, error) => {
            console.log(xhr.responseJSON, status, error);
            $('#show-alert-login').empty()
            $('#show-alert-login').append(`
            <div class="alert alert-danger" role="alert">
                ${xhr.responseJSON.message}
            </div>
            `);
        })
        .always((response) => {
            console.log(response);
        })
    })

    $('#register-modal').submit(function(event) {
        event.preventDefault();

        let email = $('#email-register').val();
        let password = $('#password-register').val();
        let name = $('#name-register').val();
        console.log(email, password, name);
        
        $.ajax({
            method: 'POST',
            url: `${SERVER_PATH}/register`,
            data: {
                email,
                password,
                name
            }
        })
            .done((response) => {
                $('#registerModal').modal('toggle');
                $('#email-register').val('');
                $('#password-register').val('');
                $('#name-register').val('');
            })
            .fail((xhr, status, error) => {
                console.log(xhr.responseJSON, status, error);
                $('#show-alert-register').empty();
                $('#show-alert-register').append(`
                <div class="alert alert-danger" role="alert">
                    ${xhr.responseJSON.message.join(', ')}
                </div>
                `);
            })
            .always((response) => {
                console.log(response);
            })
    })
})

function fetchData() {
    $('#todo-list').empty();
    $.ajax({
        method: 'GET',
        url: `${SERVER_PATH}/todos`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
     .done(response => {
        console.log(response);
         
        response.forEach(todo => {
            $('#todo-list').append(`
            <tr id="todo-row">
                <td>${todo.title}</td>
                <td>${todo.description}</td>
                <td>${todo.status}</td>
                <td>${new Date(todo.dueDate.substring(0,10)).toString().substring(0,15)}</td>
                <td><a href="" class="btn btn-outline-warning btn-sm" id="edit-button-${todo.id}" data-todo-id="${todo.id}">✏️Edit</a> <a href="" class="btn btn-outline-danger btn-sm" id="delete-button-${todo.id}" data-todo-id="${todo.id}"><i class="fa fa-trash-o"></i>Delete</a></td>
            </tr>
            `)

            $(`#edit-button-${todo.id}`).click(function(event) {
                event.preventDefault();
                const id = Number($(this).data('todo-id'));
                $('#editModal').modal('toggle');
                fetchDataById(id);

                $('#edit-modal').submit(function(event) {
                    event.preventDefault();
                    $('#editModal').modal('toggle');
                    const title = $('#title-edit').val();
                    const description = $('#description-edit').val();
                    const status = $('#status-edit').val();
                    const dueDate = $('#dueDate-edit').val();
                    updateTodo(todo.id, title, description, status, dueDate);
                })
            })

            $(`#delete-button-${todo.id}`).click(function(event) {
                event.preventDefault();
                const id = Number($(this).data('todo-id'));
                deleteTodo(id);
            })

        })
     })
     .fail((xhr, status, error) => {
         console.log('fail');
         console.log(xhr.responseJSON, status, error);
     })
     .always((response) => {
         console.log('always');
         console.log(response);
     })
}

function addTodo(title, description, dueDate) {
    $.ajax({
        method: 'POST',
        url: `${SERVER_PATH}/todos`,
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            title,
            description,
            dueDate
        }
    })
    .done(response => {
        console.log(response);
        dashboard();  
    })
    .fail((xhr, status, error) => {
       console.log('fail');
       console.log(xhr.responseJSON, status, error);
    })
    .always((response) => {
       console.log('always');
       console.log(response);
    })
}

function addForm() {
    $('#add-modal').empty();
    $('#add-modal').prepend(`<form action="">
    <div class="form-group">
        <label for="title-add">Title</label>
        <input type="text" class="form-control" id="title-add">
    </div>
    <div class="form-group">
        <label for="description-add">Description</label>
        <input type="text" class="form-control" id="description-add">
    </div>
    <div class="form-group">
        <label for="duedate-add">Due Date</label>
        <input type="date" class="form-control" id="duedate-add">
    </div>
    <div class="form-group">
        <button type="submit" class="btn btn-primary">Add</button>
    </div>
</form>`)
}

function fetchDataById(id) {
    $.ajax({
        method: 'GET',
        url: `${SERVER_PATH}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
     .done(response => {
        console.log(response);
        $('#edit-modal').empty();
        $('#edit-modal').prepend(`
            <form action="">
                <div class="form-group">
                    <label for="title-edit">Title</label>
                    <input type="text" class="form-control" id="title-edit" value="${response.title}">
                </div>
                <div class="form-group">
                    <label for="description-edit">Description</label>
                    <input type="text" class="form-control" id="description-edit" value="${response.description}">
                </div>
                <div class="form-group">
                    <label for="status-edit">Status</label>
                    <select name="status-edit" class="form-control" id="status-edit">
                        <option value="On Progress" ${response.status === 'On Progress' ? 'selected' : ''}>${response.status}</option>
                        <option value"Finished" ${response.status === 'Finished' ? 'selected' : ''}>Finished</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="duedate-edit">Due Date</label>
                    <input type="date" class="form-control" id="duedate-edit" value="${response.dueDate.substring(0,10)}">
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">Edit</button>
                </div>
            </form>`
        );
     })
     .fail((xhr, status, error) => {
        console.log('fail');
        console.log(xhr.responseJSON, status, error);
     })
     .always((response) => {
        console.log('always');
        console.log(response);
     })
}

function updateTodo(id, title, description, status, dueDate) {
    $.ajax({
        method: 'PUT',
        url: `${SERVER_PATH}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            title,
            description,
            status,
            dueDate
        }
    })
    .done(response => {
        console.log(response);
        dashboard();
    })
    .fail((xhr, status, error) => {
       console.log('fail');
       console.log(xhr.responseJSON, status, error);
    })
    .always((response) => {
       console.log('always');
       console.log(response);
    })
}

function deleteTodo(id) {
    $.ajax({
        method: 'DELETE',
        url: `${SERVER_PATH}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        } 
    })
    .done(response => {
        console.log(response);
        dashboard();
    })
    .fail((xhr, status, error) => {
       console.log('fail');
       console.log(xhr.responseJSON, status, error);
    })
    .always((response) => {
       console.log('always');
       console.log(response);
    })
}

function isLoggedIn() {
    !localStorage.getItem('token') ? home() : dashboard();
}

function home() {
    $('#logout-button').hide();
    $('#todo-list').hide();
    $('#header-text-after').hide();

    $('#login-button').show();
    $('#register-button').show();
    $('#todo-list-example').show();
    $('#header-text-before').show();
}

function dashboard() {
    $('#login-button').hide();
    $('#register-button').hide();
    $('#todo-list-example').hide();
    $('#header-text-before').hide();

    $('#logout-button').show();
    $('#todo-list').show();
    $('#header-text-after').show();

    const name = localStorage.getItem('name');
    $('#header-text-after').text(`Hi ${name}! Here is your task:`);
    

    $('#add-button').click(function(event) {
        event.preventDefault();
        $('#addModal').modal('toggle');
        addForm();
        $('#add-modal').submit(function(event) {
            event.preventDefault();
            $('#addModal').modal('toggle');
            const title = $('#title-add').val();
            const description = $('#description-add').val();
            const dueDate = $('#duedate-add').val();
            console.log(title, description, dueDate);
            
            addTodo(title, description, dueDate);
        })
    })

    $('#logout-button').click(function(event) {
        event.preventDefault();
        localStorage.removeItem('token');
        googleSignOut();
        })

    fetchData();
}

function onSignIn(googleUser) {
    const google_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        url: `${SERVER_PATH}/login/google`,
        method: 'POST',
        headers: {
            google_token
        }
    })
     .done(response => {
        console.log('done', response);
        const token = response.token;
        localStorage.setItem('token', token);
        $('#login-modal').modal('hide');
        dashboard();
     })
     .fail(response => {
        console.log('fail', response);
     })
     .always(response => {
         console.log('always', response);        
     })
}

function googleSignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      home();  
    });
  }

  function getLatestNews() {
      $.ajax({
          method: 'GET',
          url: `${SERVER_PATH}/currents/latest-news`
      })
      .done(response => {
        console.log('done', response);
        let i = 0;
        response.latestNews.forEach(news => {
            if(news.image !== 'None') {
                if(i === 0) {
                    $('.carousel-indicators').prepend(`
                    <li data-target="#carouselExampleIndicators" data-slide-to="${i}" class="active"></li>
                    `);
                    $('.carousel-inner').prepend(`
                    <div class="carousel-item active">
                        <img class="d-block w-100" src="${news.image}" alt="Slide ${i+1}">
                        <div class="carousel-caption d-none d-md-block">
                            <h5>${news.title}</h5>
                            <p>${news.description}</p>
                        </div>
                    </div>
                    `);
                } else {
                    $('#carousel-indicators').prepend(`
                    <li data-target="#carouselExampleIndicators" data-slide-to="${i}"></li>
                    `);
                    $('.carousel-inner').prepend(`
                    <div class="carousel-item">
                        <img class="d-block w-80" src="${news.image}" alt="Slide ${i+1}">
                        <div class="carousel-caption d-none d-md-block" id="carousel-caption">
                            <h5>${news.title}</h5>
                            <p>${news.description}</p>
                        </div>
                    </div>
                    `);
                }
                i++;
            }

        })
     })
     .fail(response => {
        console.log('fail', response);
     })
     .always(response => {
         console.log('always', response);        
     })
  }