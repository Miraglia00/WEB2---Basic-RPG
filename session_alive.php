<?php 
    session_start();
    include('./db/DB.php');
    include('./src/php/UserService.php');
    if(isset($_SESSION['user'])) {

        $db = new DB();
        $user = new UserService(null ,null, $db);
        $alive = $user->recoverUser($_SESSION['user']);
        $alive = ($alive != false) ? true : false;
        echo $alive;

    }else echo false;

?>