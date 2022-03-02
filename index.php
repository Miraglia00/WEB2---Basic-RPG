<?php
    session_start();
    include('./db/DB.php');
    include('./src/php/UserService.php');

    $db = new DB();
    $USER = new UserService(null,null, $db);
    if(isset($_SESSION['user']) && $_SESSION['user'] != null) {
        $recover = $USER->recoverUser($_SESSION['user']);
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dungeon Game</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js" integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>
    
    <link rel="stylesheet" href="./style.css" />

    <script type="module" src="./app.js" defer></script>
    <script type="text/javascript" src="./formValidator.js" defer></script>
</head>
<body>
    <?php 
        if(isset($_SESSION['server_validation'])) {
    ?>
            <div class="alert alert-danger d-flex align-items-center alert-dismissible fade show absolute-center w-50" role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                <div>
                   <?php echo $_SESSION['server_validation']; $_SESSION['server_validation'] = null; ?>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
    <?php
        }
    ?>
    <?php 
        if(isset($_SESSION['success_message'])) {
    ?>
            <div class="alert alert-success d-flex align-items-center alert-dismissible fade show absolute-center w-50" role="alert">
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
                <div>
                   <?php echo $_SESSION['success_message']; $_SESSION['success_message'] = null; ?>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
    <?php
        }
    ?>
    <div class="container-fluid d-flex justify-content-evenly hidden p-0 m-0 flex-column align-items-center not-scrollable" id="gameLayer">

        <h1 id="turnInfo"></h1>

        <div class="d-flex justify-content-center align-items-start flex-fill mt-2 flex-column">
            <div class="d-flex justify-content-center">
                <div id="gridHolder" class="flex-fill p-0 m-0 align-self-start">
                </div>

                <div id="gridInfo" class="ms-3 h-100 flex-fill d-flex flex-column justify-content-center align-items-center align-self-center">    
                    <p id="gridPos" class="d-block"></p>

                    <div id="occupantInfo" class="text-center"></div>

                    <div id="actionPool" class="d-flex flex-column">
                        <div>
                            <button id="moveBtn" type="button" class="btn btn-outline-secondary fs-5 w-100 mb-1">Move (-1 AP)</button>
                            <button id="attckBtn" type="button" class="btn btn-outline-secondary fs-5 w-100">Attack (-1 AP)</button>
                        </div>
                        <button id="endTurnBtn" type="button" class="btn btn-outline-secondary w-100 mt-4 fs-4 fw-bold">End Turn</button>
                    </div>
                </div>
            </div>
            <div id="playerStatHolder" class="d-flex flex-row align-items-center justify-content-center flex-grow-1 w-100">
                <img src="./entities_img/player.png" style="max-height: 100px;">
                <div id="playerStat" class="d-flex flex-row w-100 flex-fill flex-grow-1"></div>
            </div>
        </div>
    </div>

    <div class="container-fluid d-flex align-items-center flex-column scrollable h-100" id="menuLayer">

        <h1 id="title" class="justify-self-start mt-5 flex-shrink-0">Dungeon Game</h1>
        <?php 
            if($USER->isLoggedIn()) {
                echo "<small class='text-success flex-shrink-0'>
                    Logged in as: ".$USER->getUser()['username']."
                </small>";
            }else{
                echo "<small class='text-danger cursor-pointer flex-shrink-0' data-bs-toggle='modal' data-bs-target='#userDialog'>Not logged in!</small>";
            }
        ?>

        <div id="buttons" class="d-flex flex-column flex-grow-1 justify-content-center">
            <?php 
                if($USER->isLoggedIn()) {
                    ?>
                        <div class="custom-menu-btn d-flex justify-content-center align-items-center">
                            <img src="images/sword.png" class="btn-image me-2"> 
                            <button class="btn btn-lg w-75 custom-btn" id="startGameBtn">
                                <span>Start Game</span>
                                <br /><small class="text-light hidden" id="btn-info">Please use bigger screen to play!</small></button> 
                            <img src="images/shield.png" class="btn-image ms-2"> 
                        </div>
            <?php 
            }else{
                    ?>
                    <div class="custom-menu-btn d-flex justify-content-center align-items-center">
                        <img src="images/sword.png" class="btn-image me-2"> 
                        <button class="btn btn-lg w-75 custom-btn" data-bs-toggle='modal' data-bs-target='#userDialog'>Login/Register</button> 
                        <img src="images/shield.png" class="btn-image ms-2"> 
                    </div>
                <?php
                }
            ?>

            <div class="custom-menu-btn d-flex justify-content-center align-items-center">
                <img src="images/sword.png" class="btn-image me-2"> 
                <button class="btn btn-lg w-75" id="leaderboardBtn">Leaderboard</button> 
                <img src="images/shield.png" class="btn-image ms-2"> 
            </div>

            
            <?php if($USER->isLoggedIn()) { ?>
                <div class="custom-menu-btn d-flex justify-content-center align-items-center">
                    <img src="images/sword.png" class="btn-image me-2"> 
                    <button class="btn btn-lg w-75 custom-btn" id="logoutBtn">Leave</button> 
                    <img src="images/shield.png" class="btn-image ms-2"> 
                </div>
            <?php } ?>
        </div>

        <div id="leaderBoard" class="mt-5 hidden w-50 d-flex justify-content-center flex-column align-items-center">
            <button class="btn custom-btn align-self-start flex-shrink-0" id="backToMenuBtn">Back to the menu</button>
            <div id="leaderBoard-data" class="p-0 w-100 pb-3"></div>
        </div>
    </div>

    <div class="modal fade" id="endGameModalWIN" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-md">
            <form action="save.php" method="post">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="staticBackdropLabel">The game is over!</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h3 class="text-center text-success">You successfully escaped the dungeon!</h3>
                        <hr />
                        <b class="text-light text-center" id="enemyKilled"></b><br />
                        <small class="text-light text-center">Leave a short review if you want to.</small>
                        <div class="mb-3">
                            <input type="hidden" class="hidden" name="kills" id="kills">
                            <input type="hidden" class="hidden" name="turns" id="turns">
                          </div>
                          <div class="mb-3">
                            <textarea class="form-control" name="review" id="review" placeholder="Review..." rows="3"></textarea>
                          </div>
                    </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-success" id="saveData">Save Data</button>
                </div>
                </div>
            </form>
        </div>
    </div>

    <div class="modal fade" id="endGameModalLOSE" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <form action="save.php" method="post">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title text-danger" id="staticBackdropLabel">The game is over!</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <h3 class="text-center text-danger">You died! Better luck next time.</h3>
                        <img src="./images/reaper.png" style="max-height: 350px;"/>
                    </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </form>
        </div>
    </div>
    <?php if(!$USER->isLoggedIn()) { ?>
    <div onfocus="checkInputFields(this)" class="modal fade" id="userDialog" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="staticBackdropLabel">Login/Register</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                    <div class="card bg-transparent">
                    <div class="card-header">
                        <div class="btn-group w-100" role="group" aria-label="Basic example">
                            <button type="button" class="btn active custom-btn" id="registerButton">Register</button>
                            <button type="button" class="btn custom-btn" id="loginButton">Login</button>
                        </div>
                    </div>
                    <div class="card-body" id="registerBody">
                        <form action="register.php" method="post" id="registerForm" class="needs-validation">
                        <input type="text" class="form-control" name="regName" id="registerUsername" placeholder="username" onkeyup="validateInputField(this)" autocomplete="new-password">
                        <input type="password" class="form-control mt-3" name="regPassword_1" id="registerPassword_1" placeholder="password" onkeyup="validateInputField(this)" autocomplete="new-password">
                        <input type="password" class="form-control mt-3" name="regPassword_2" id="registerPassword_2" placeholder="password again..." onkeyup="validateInputField(this)" autocomplete="new-password">
                        </form>
                    </div>
                    <div class="card-body hidden" id="loginBody">
                        <form action="login.php" method="post" autocomplete="off" id="loginForm">
                        <input type="text" class="form-control" name="logName" id="loginUsername" placeholder="username" onkeyup="validateInputField(this)">
                        <input type="password" class="form-control mt-3" name="logPassword" id="loginPassword_1" placeholder="password" onkeyup="validateInputField(this)">
                        </form>
                    </div>
                    </div>
                    
                    </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-success disabled" id="submitBtn" form="registerForm" disabled="true">Register</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
        </div>
    </div>
    <?php } ?>

    <div class="d-flex h-100 w-100 hidden align-items-center justify-content-center" id="messageHolder">
    <div class="alert alert-danger d-flex hidden" role="alert" id="messageBox">
        <i class="bi bi-exclamation-triangle-fill me-2 fs-1"></i>
        <div id="messageBody">
        </div>
    </div>
    </div?
</body>
</html>