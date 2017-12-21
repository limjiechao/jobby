$(document).ready(function(){
	let messages = [];
	let socket = io();
	let chatForm = $('#chatForm');
	let message = $('#chatInput');
	let chatWindow = $('#chatWindow');
	let userForm = $('#userForm');
	let username = $('#username');
	let users = $('#users');
	let error = $('#error');

	// Submit User Form
	userForm.on('submit', function(e){
		socket.emit('set user', username.val(), function(data){
			if(data){
				$('#userFormWrap').hide();
				$('#mainWrap').show();
			} else {
				error.html('Username is taken');
			}
		});
		e.preventDefault();
	});

	// Submit Chat Form
	chatForm.on('submit', function(e) {
		socket.emit('send message', message.val());
		message.val('');
		e.preventDefault();
	});

	message.on('keydown', function(e) {
		socket.emit('user is typing');
	});

	message.on('keyup', function(e) {
		socket.emit('user stopped typing');
	});

	socket.on('show status', function(data) {
		// console.log(data)
		$(".user-status").remove()
		$('#status-bar').append("<small class=\"user-status\">" + "<strong>" + data.user + "</strong>" + " is typing…" + "</small><br class=\"user-status\">");
		// $(".user-status").remove()
		// chatWindow.append('<small class="user-status">' + data.user + ' is typing…' + '</small><br class="user-status">');
	});

	socket.on('hide status', function(data) {
		setTimeout(function(){
			$(".user-status").fadeOut();
		}, 1000);
	});

	// Show message
	socket.on('show message', function(data) {
		chatWindow.append('<strong>' + data.user + '</strong>: ' + data.msg + '<br>');
	});

	// Display Usernames
	socket.on('users', function(data) {
		let html = '';
		for (let i = 0; i < data.length; i++) {
			html += '<li class="list-group-item">' + data[i] + '</li>';
		}
		users.html(html);
	});
});