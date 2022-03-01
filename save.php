<?php

include('./db/DB.php');
include('./src/php/UserService.php');




if(isset($_POST['name']) && isset($_POST['kills'])) {
  //$username = $db -> real_escape_string($_POST['name']);
  //$review = $db -> real_escape_string($_POST['review']);
  $db = new DB();
  $user = new UserService("1234", "asdff", $db);

}else{
  $redirect = str_replace('save.php', '', $_SERVER['REQUEST_URI']);
  header('Location: '.$redirect);
}
?>