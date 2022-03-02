import Game from "./src/js/Game.js";

const endGameModalWIN =  new bootstrap.Modal(document.getElementById('endGameModalWIN'), {});
const endGameModalLOSE =  new bootstrap.Modal(document.getElementById('endGameModalLOSE'), {});

const startGame = () => {
    const gameInstance = new Game();
}

$('#startGameBtn').click(() => {
    startGame();
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
    Game.isGameReady() ? isPlayButtonAvailable(true) : isPlayButtonAvailable(false);
});



window.onload = () => {   
    let storedWin = localStorage.getItem('status');
    let storedKills = localStorage.getItem('kills');

    if(storedWin !== null) {
        if(storedWin) {
            endGameModalWIN.toggle();
            $('#kills').val(storedKills);
            $('#enemyKilled').text(`You killed ${storedKills} enemy!`);
            window.localStorage.clear();
        }else{
            endGameModalLOSE.toggle();
            window.localStorage.clear();
        }
    }

    Game.isGameReady() ? isPlayButtonAvailable(true) : isPlayButtonAvailable(false);
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

const isPlayButtonAvailable = (t) => {
    (t) ? $('#startGameBtn').removeAttr('disabled').removeClass('disabled') : $('#startGameBtn').attr('disabled', 'disabled').addClass('disabled');
}

//startGame();