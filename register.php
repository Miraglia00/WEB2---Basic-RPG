<?php
    session_start();
    include('src/php/UserService.php');
    include('db/DB.php');

    $redirect = str_replace('register.php', '', $_SERVER['REQUEST_URI']);
    if(isset($_POST['regName']) && isset($_POST['regPassword_1']) && isset($_POST['regPassword_2'])) {
        if($_POST['regName'] >= 3 && $_POST['regPassword_1'] >= 3 && $_POST['regPassword_1'] == $_POST['regPassword_2']) {
            $user = new UserService($_POST['regName'],$_POST['regPassword_1'], new DB());
            $user->register();
            header('Location: '.$redirect);
        }else{
            $_SESSION['server_validation'] = "The posted data does not match the required parameters. (Minimum 3 character long and the matching password)";
            header('Location: '.$redirect);
        }
    }else{
        header('Location: '.$redirect);
    }
?>