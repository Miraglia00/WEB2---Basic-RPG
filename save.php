<?php
session_start();
include('./db/DB.php');
include('./src/php/UserService.php');



$redirect = str_replace('save.php', '', $_SERVER['REQUEST_URI']);

if(isset($_POST['kills']) && isset($_SESSION['user'])) {
  //$username = $db -> real_escape_string($_POST['name']);
  //$review = $db -> real_escape_string($_POST['review']);
  $db = new DB();
  $id = $_SESSION['user']['id'];
  $escaped_review = $db->real_escape_string($_POST['review']);
  $review = ($escaped_review != "") ? "'$escaped_review'" : "NULL";
  $kills = $db->real_escape_string($_POST['kills']);
  $db->execute_query("INSERT INTO web2_saves(user_id, review, kills, saved_at) VALUES ('$id', $review, '$kills', NOW())");
  $_SESSION['success_message'] = "Your data saved to the Hall Of Fame! Check your status at the Leaderboard.";
  header('Location: '.$redirect);
}else{
  header('Location: '.$redirect);
}
?>