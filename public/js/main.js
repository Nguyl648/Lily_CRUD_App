/* Your code starts here */

var app = {};
app.init = function() {
    console.log('Your code starts here!');
    // deploy hash listener
    hashRouter();
    // Refresh hash
    location.hash = '';
    // check if user exists in localStorage
    if (localStorage['user']) {
        location.hash = '#projects';
    } else {
        // render first page
        location.hash = '#register';
    }

};

// A function where we detect the change of '#' on the browser address field
var hashRouter = function() {
    $(window).off('hashchange').on('hashchange', function() {
        console.log('Current hash is ' + location.hash);
        //Render templates
        if (location.hash == '#register') {
            renderRegister();
        } else if (location.hash == '#projects') {
            renderProjects();
        } else if (location.hash == '#create') {
            renderCreate();
        } else if (location.hash == '#update') { 
            renderUpdate();
        }
        attachEvents();
    });
};

// A function where we keep all user's interaction listener (buttons, etc)
var attachEvents = function() {
    console.log('Attaching Events');

    // register page
    $('#btnRegister').off('click').on('click', function() {
        // Ajax call
        $.post('/register', {
            email: $('#iptEmailRegister').val()
        }, function(result) {
            console.log(result);
            localStorage['user'] = result.email;
            alert('Registered');
            // Assuming the email has been through the registeration process
            // and return to the user
            // the user may now proceed to the next page
            location.hash = '#projects';
        });
    });
    // create button
    $('#btnCreate').off('click').on('click', function() {
        location.hash = '#create';
    });
    // submit button
    $('#btnSubmit').off('click').on('click', function() {
        $.post('/project', {
            user: localStorage['user'],
            p_title: $('#iptProjectTitle').val(),
            p_deadline: $('#iptProjectDeadline').val()
        }, function(result) {
            console.log(result);
            location.hash = '#projects';
        });
    });
    // delete button
    $('.btnDelete').off('click').on('click', function() {
        var that = this;
        // delete item in database
        $.ajax({
            url: '/project',
            type: 'DELETE',
            data: {
                user: localStorage['user'],
                id: $(this).siblings().attr('data-id')
            },
            success: function(result) {
                // delete item in view
                $(that).parent().slideUp(function() { //jQuery slideUp method
                    location.reload();
                });
            }
        });
    });
    // Update button
    $('.btnUpdate').off('click').on('click', function() { 
        
        var that = this;
        // delete item in database
        $.ajax({
            url: '/project',
            type: 'PUT',
            data: {
                user: localStorage['user'],
                id: $(this).siblings().attr('data-id'),
                p_title: $('#iptNewProjectTitle').val(),
                p_deadline: $('#iptNewProjectDeadline').val()
            },
            success: function(result) {
                
            }
        });
        location.hash = '#update';
    });
    // Update button
    $('#btnSaveUpdate').off('click').on('click', function() { 
        
        $.post('/project', {
            user: localStorage['user'],
            id: $(this).siblings().attr('data-id'),
            p_title: $('#iptNewProjectTitle').val(),
            p_deadline: $('#iptNewProjectDeadline').val()
        }, function(result) {
            console.log(result);
            location.hash = '#projects';
        });      
    });
    // Back to All Projects button
    $('#btnBackToAllProjects').off('click').on('click', function() { 
            location.hash = '#projects';  
    });
    // Log out --> localStorage.clear()
    $('#btnLogout').on('click', function() {
        localStorage.clear();
        location.hash = '#register';
    });
};

/*
	functions to render different pages
*/
var renderRegister = function() {
    // This is how we compile underscore template
    // Usually, it may be applied to other template brands as well
    var tplToCompile = $('#tpl_register').html();
    var compiled = _.template(tplToCompile, {
        title: 'My Projects',
        date: new Date()
    });
    $('#view').html(compiled);
};

var renderProjects = function() {
    // Fetch projects from database
    $.get('/projects', {
        email: localStorage['user']
    }, function(results) {
        console.log(results); // --> data
        var tplToCompile = $('#tpl_projects').html();
        var compiled = _.template(tplToCompile, {
            title: 'All Projects', 
            data: results.data.results,
            user: localStorage['user']
        });
        $('#view').html(compiled);
        console.log('Projects rendered');
        attachEvents();
    });
};

var renderCreate = function() {
    // This is how we compile underscore template
    // Usually, it may be applied to other template brands as well
    var tplToCompile = $('#tpl_create').html();
    var compiled = _.template(tplToCompile, {
        title: 'Create New Project',
        date: new Date()
    });
    $('#view').html(compiled);
};

var renderUpdate = function() {
    $.get('/project', {
        email: localStorage['user']
    }, function(results) {
        console.log(results); // --> data
        var tplToCompile = $('#tpl_update').html();
        var compiled = _.template(tplToCompile, {
            title: 'Update Projects', 
            data: results.data.results,
            user: localStorage['user']
        });
        $('#view').html(compiled);
        console.log('Projects rendered');
        attachEvents();
    });
};

app.init();