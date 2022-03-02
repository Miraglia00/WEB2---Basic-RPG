import Game from "./src/js/Game.js";

const endGameModalWIN =  new bootstrap.Modal(document.getElementById('endGameModalWIN'), {});
const endGameModalLOSE =  new bootstrap.Modal(document.getElementById('endGameModalLOSE'), {});

const startGame = () => {
    const gameInstance = new Game();
}

$('#startGameBtn').click(() => {
    $.ajax({
        type: "GET",
        url: "session_alive.php",
        async: false,
        success: function(response) {
           if(parseInt(response) === 1){
            startGame();
           }else{
            redirectLogout();
           }
        }
    });
});

$('#logoutBtn').click(() => {
    redirectLogout();
});

$('#leaderboardBtn').click(() => {
    $('#buttons').addClass('hidden');
    $('#leaderBoard').removeClass('hidden');
    $('#title').text($('#title').text() + " - Hall Of Fame");

    $.ajax({
        type: "GET",
        url: "leaderboard.php",
        async: false,
        success: function(response) {
            $('#leaderBoard-data').text("");
            $('#leaderBoard-data').append(response);
        }
    });

    //make leaderboard.php display all data in card divs and then load that html to index.php easy peasy
});

$('#backToMenuBtn').click(() => {
    $('#buttons').removeClass('hidden');
    $('#leaderBoard').addClass('hidden');
    $('#title').text('Dungeon Game');
});

$(window).resize(() => {
    Game.isGameReady() ? disablePlayButton(false) : disablePlayButton(true);
});



window.onload = () => {   
    let storedWin = localStorage.getItem('status');
    let storedKills = localStorage.getItem('kills');
    let storedTurns = localStorage.getItem('turns');

    if(storedWin !== null) {
        if(storedWin) {
            endGameModalWIN.toggle();
            $('#kills').val(storedKills);
            $('#turns').val(storedTurns);
            $('#enemyKilled').text(`You killed ${storedKills} enemy, and escaped in ${storedTurns} turns!`);
            window.localStorage.clear();
        }else{
            endGameModalLOSE.toggle();
            window.localStorage.clear();
        }
    }

    Game.isGameReady() ? disablePlayButton(false) : disablePlayButton(true);
};

$('#registerButton').click((e) => {
    $('#registerButton').addClass('active');
    $('#loginButton').removeClass('active');

    $('#registerBody').removeClass('hidden');
    $('#loginBody').addClass('hidden');

    $('#submitBtn').text('Register');
    $('#submitBtn').attr('form', 'registerForm');

    checkInputFields('#userDialog');
});

$('#loginButton').click((e) => {
    $('#loginButton').addClass('active');
    $('#registerButton').removeClass('active');

    $('#loginBody').removeClass('hidden');
    $('#registerBody').addClass('hidden');

    $('#submitBtn').text('Login');
    $('#submitBtn').attr('form', 'loginForm');

    checkInputFields('#userDialog');
});

const redirectLogout = () => {
    window.location = window.location.href + 'logout.php';
}

const disablePlayButton = (t) => {
    if(t) {
        $('#startGameBtn').addClass('btn-danger').addClass('disabled').attr('disabled', 'disabled');
        $('#startGameBtn > span').addClass('text-decoration-line-through');
        $('#btn-info').removeClass('hidden');
    }else{
        $('#startGameBtn').removeClass('btn-danger').removeClass('disabled').removeAttr('disabled');
        $('#startGameBtn > span').removeClass('text-decoration-line-through');
        $('#btn-info').addClass('hidden');
    }
}

//startGame();