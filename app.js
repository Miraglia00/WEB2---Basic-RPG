import Game from "./src/js/Game.js";

const endGameModalWIN =  new bootstrap.Modal(document.getElementById('endGameModalWIN'), {});
const endGameModalLOSE =  new bootstrap.Modal(document.getElementById('endGameModalLOSE'), {});

const startGame = () => {
    const gameInstance = new Game();
    gameInstance.endGame(true)
}

$('#startGameBtn').click(() => {
    startGame();
});

$('#logoutBtn').click(() => {
    redirectLogout();
});




window.onload = () => {   
    let storedWin = localStorage.getItem('status');
    let storedKills = localStorage.getItem('kills');

    if(storedWin !== null) {
        if(storedWin) {
            endGameModalWIN.toggle();
            $('#kills').val(storedKills);
            window.localStorage.clear();
        }else{
            endGameModalLOSE.toggle();
            window.localStorage.clear();
        }
        
    }
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


//startGame();