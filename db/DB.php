<?php
include_once('config.php');

class DB extends mysqli{
  protected $_db;

  public function __construct() {
    parent::__construct(DB_HOST, DB_USR, DB_PSW ,DB_DBNAME);

    if (mysqli_connect_error()) {
      exit(mysqli_connect_error());
    }
  }

  public function execute_query($query) {
    if(isset($query) && $query != '') {
      $result = $this->query($query);
      if($result) {
        return $result;
      }else throw new Exception('Error when trying to execute query! Error: '.mysqli_error($this));

    }else throw new Exception('Query cannot be executed if it is empty or null!');
  }
}


?>