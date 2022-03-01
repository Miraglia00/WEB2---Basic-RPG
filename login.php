<?php
    session_start();
    include('src/php/UserService.php');
    include('db/DB.php');

    $redirect = str_replace('login.php', '', $_SERVER['REQUEST_URI']);
    if(isset($_POST['logName']) && isset($_POST['logPassword'])) {
        if($_POST['logName'] >= 3 && $_POST['logPassword'] >= 3) {
            $user = new UserService($_POST['logName'],$_POST['logPassword'], new DB());
            $user->login();
            header('Location: '.$redirect);
        }else{
            $_SESSION['server_validation'] = "The posted data does not match the required parameters. (Minimum 3 character long and the matching password)";
            header('Location: '.$redirect);
        }
    }else{
        header('Location: '.$redirect);
    }
?>