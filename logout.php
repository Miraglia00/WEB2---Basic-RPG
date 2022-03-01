<?php 
    session_start();
    $redirect = str_replace('logout.php', '', $_SERVER['REQUEST_URI']);
    if(isset($_SESSION['user'])) {
        session_destroy();
        Header('Location: '.$redirect);
    }
?>