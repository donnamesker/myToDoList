  var view = "all";
  var getAndDisplayAllTasks = function (view) {
    $('#todo-list').html("");
    var allTasks = 0;
    var activeTasks = 0;
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1321',
      dataType: 'json',
      success: function (response, textStatus) {
        allTasks = response.tasks.length;
        response.tasks.forEach(function (task) {
          //console.log(task.content);
          task.completed ? null : ++activeTasks;
          switch (view) {
            case 'active':
              if (!task.completed) {
                $('#todo-list').append('<div class="row g-3 py-2 justify-content-center border-bottom"><div class="col-1 text-center pt-2"><input type="checkbox" class="mark-complete" data-id="' + task.id + '" ' + (task.completed ? 'checked' : '') + '></div><div class="col-10 col-lg-6"><span class="task-content fs-3 fw-lighter">' + task.content + '</span></div><div class="col-1 text-center"><button type="button" class="btn-close delete" data-id="' + task.id + '"></button></div></div>');
              }
              break;
            case 'completed':
              if (task.completed) {
                $('#todo-list').append('<div class="row g-3 py-2 justify-content-center border-bottom"><div class="col-1 text-center pt-2"><input type="checkbox" class="mark-complete" data-id="' + task.id + '" ' + (task.completed ? 'checked' : '') + '></div><div class="col-10 col-md-6"><span class="task-content fs-3 fw-lighter">' + task.content + '</span></div><div class="col-1 text-center"><button type="button" class="btn-close delete" data-id="' + task.id + '"></button></div></div>');
              }
              break;
            case 'all':
              $('#todo-list').append('<div class="row g-3 py-2 justify-content-center border-bottom"><div class="col-1 text-center pt-2"><input type="checkbox" class="mark-complete" data-id="' + task.id + '" ' + (task.completed ? 'checked' : '') + '></div><div class="col-10 col-md-6"><span class="task-content fs-3 fw-lighter">' + task.content + '</span></div><div class="col-1 text-center"><button type="button" class="btn-close delete" data-id="' + task.id + '"></button></div></div>');
              break;
            
          }
        });
        $("#activeItems").html(activeTasks);
        //console.log("activeTasks: " + activeTasks + "  TOTAL TASKS: " + allTasks);
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }
  
  var createTask = function () {
    $.ajax({
      type: 'POST',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1321',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          content: $('#newTaskContent').val()
        }
      }),
      success: function (response, textStatus) {
        $('#newTaskContent').val(''); // Add this line
        getAndDisplayAllTasks('all');
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }
  
  var deleteTask = function (id) {
    $.ajax({
      type: 'DELETE',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '?api_key=1321',
      success: function (response, textStatus) {
        getAndDisplayAllTasks('all');
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }
  
  var markTaskComplete = function (id) {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_complete?api_key=1321',
      dataType: 'json',
      success: function (response, textStatus) {
        //getAndDisplayAllTasks('all');
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }
  
  var markTaskActive = function (id) {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_active?api_key=1321',
      dataType: 'json',
      success: function (response, textStatus) {
        //getAndDisplayAllTasks('all');
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }
  var toggleAllComplete = function () {
    var allCheckboxes = $('.mark-complete').length;
    var checkboxesChecked = $('.mark-complete:checked').length;
    console.log("ALL: " + allCheckboxes + " CHECKED: " + checkboxesChecked);
    if(allCheckboxes == checkboxesChecked) {
      $('.mark-complete').each(function() {
          markTaskActive($(this).data('id'));
      });
    
    } else {
      $('.mark-complete').each(function() {
          markTaskComplete($(this).data('id'));
      });
    }
    window.setTimeout(function () {
      getAndDisplayAllTasks('all');
    }, 200);
  }
  
$(document).ready(function(){
  // Create a new task
  $('#create-task').on('submit', function (e) {
    e.preventDefault();
    createTask();
  });
  
  // Delete a task
  $(document).on('click', '.delete', function () {
    deleteTask($(this).data('id'));
  });
  
  // Mark task as complete
  $(document).on('change', '.mark-complete', function () {
    if (this.checked) {
      markTaskComplete($(this).data('id'));
    } else {
      markTaskActive($(this).data('id'));
    }
    
    window.setTimeout(function () {
      getAndDisplayAllTasks('all');
    }, 200);
  });
  
  // Display ALL tasks
  getAndDisplayAllTasks('all');
  
  //Show active tasks
  $(document).on('click', '#showActive', function () {
    getAndDisplayAllTasks('active');
    $('#showAll').removeClass().addClass('btn btn-sm btn-outline-secondary');
    $('#showActive').removeClass().addClass('btn btn-sm btn-secondary');
    $('#showComplete').removeClass().addClass('btn btn-sm btn-outline-secondary');
  });
  
  //Show completed tasks
  $(document).on('click', '#showComplete', function () {
    getAndDisplayAllTasks('completed');
    $('#showAll').removeClass().addClass('btn btn-sm btn-outline-secondary');
    $('#showActive').removeClass().addClass('btn btn-sm btn-outline-secondary');
    $('#showComplete').removeClass().addClass('btn btn-sm btn-secondary');
  });
  
  //Show ALL tasks
  $(document).on('click', '#showAll', function () {
    getAndDisplayAllTasks('all');
    $('#showAll').removeClass().addClass('btn btn-sm btn-secondary');
    $('#showActive').removeClass().addClass('btn btn-sm btn-outline-secondary');
    $('#showComplete').removeClass().addClass('btn btn-sm btn-outline-secondary');
  });
  
  //Check ALL tasks
  $(document).on('click', '#checkAll', function () {
    toggleAllComplete();
  });
  
  $(document).on('click', '.mark-complete-button', function () {
    deleteTask($(this).data('id'));
  });
});