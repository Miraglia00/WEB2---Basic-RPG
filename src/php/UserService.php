<?php
    class UserService {
        protected $_username;
        protected $_password;
        protected $_user;
        protected $_db;
        
        public function __construct($username=null, $password=null, $database) {
            $this->_db = $database;
            if(($username != null && strlen($username) < 4) || ($password != null && strlen($password) < 4)) {
                throw new Exception('Username and password must be at least 4 character long!');
            }

           $this->_username = $this->_db->real_escape_string($username);
           $this->_password = $this->_db->real_escape_string($password);
        }

        public function register() {
            $user_check = $this->_checkUser();
            if(!$user_check) {
                $hashed_psw = password_hash($this->_password, PASSWORD_DEFAULT);
                $result = $this->_db->execute_query("INSERT INTO web2_users(username, password) VALUES ('$this->_username','$hashed_psw')");
                if($result) {
                    $this->login();
                }else throw new Exception('Error when trying to register a user! Error: '.mysqli_error($this->_db));
            }else return false;
        }

        public function login() {
            $user_check = $this->_checkUser();
            if($user_check) {
                $result = $this->_db->execute_query("SELECT * FROM  web2_users WHERE username='$this->_username'");

                if($result) {
                    $temp = $result->fetch_assoc();

                    if(password_verify($this->_password, $temp['password'])) {
                        $session = $this->generatesessionString();
                        $this->_db->execute_query("UPDATE web2_users SET session='$session' WHERE username='$this->_username'");
                        $this->_user = array("id" => $temp['id'], "username" => $temp['username'], "session" => $session);
                        $_SESSION['session'] = $session;

                        $this->_password = null;

                        return $this->_user;
                    }else return false;
                    
                }else throw new Exception('Error when trying to login a user! Error: '.mysqli_error($this->_db));

            }else return false;
        }

        private function _checkUser() {
            if($this->_username == null || $this->_password == null || !isset($this->_username) || !isset($this->_password)) {
               return throw new Exception('User credentials not set!'); 
            }

            $result = $this->_db->execute_query("SELECT * FROM web2_users WHERE username = '$this->_username'");

            if($result->num_rows == 0) {
                return false;
            }else return true;
        }

        public function isLoggedIn() {
            if(isset($_SESSION['session']) && $_SESSION['session'] != null) {
                return true;
            }else return false;
        }

        private function generatesessionString() {
            $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $randomString = '';
            
            for ($i = 0; $i < 10; $i++) {
                $index = rand(0, strlen($characters) - 1);
                $randomString .= $characters[$index];
            }
            
            return $randomString;
        }

        public function recoverUser($session) {
            if(isset($session) && $session != null && ($this->_username == null && $this->_password == null)) {
                $result = $this->_db->execute_query("SELECT * FROM web2_users WHERE session = '$session'");
                if($result) {
                    $userData = $result->fetch_assoc();
                    if($userData['session'] != null) {
                        $this->_username = $userData['username'];
                        $this->_user = array("id" => $userData['id'], "username" => $userData['username'], "session" => $userData['session']);
                        $_SESSION['session'] = $session;

                        return $this->_user;
                    }else return false;
                }else return false;
            }else throw new Exception("Error while recovering user! Session cannot be empty or null!");
        }

        public function getUser() {
            return $this->_user ?? null;
        }
    }
    
?>