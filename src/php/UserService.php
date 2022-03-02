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
                    if($result->num_rows == 0) {
                        $_SESSION['server_validation'] = "User credentials are not matching, try to remember your password or username!";
                        return false;
                    }

                    $temp = $result->fetch_assoc();

                    if(password_verify($this->_password, $temp['password'])) {
                        $datetime = new DateTime();
                        $datetime->add(new DateInterval('PT5H'));
                        $session = base64_encode($datetime->format('Y-m-d H:i:s'));

                        $this->_db->execute_query("UPDATE web2_users SET session='$session' WHERE username='$this->_username'");
                        $this->_user = array("id" => $temp['id'], "username" => $temp['username'], "session" => $session);
                        $_SESSION['user'] = $this->_user;

                        $this->_password = null;
                        return $this->_user;
                    }else {
                        $_SESSION['server_validation'] = "User credentials are not matching, try to remember your password or username!";
                        return false;
                    }
                    
                }else throw new Exception('Error when trying to login a user! Error: '.mysqli_error($this->_db));

            }else {
                $_SESSION['server_validation'] = "User credentials are not matching, try to remember your password or username!";
                return false;
            }
        }

        private function _checkUser() {
            if($this->_username == null || $this->_password == null || !isset($this->_username) || !isset($this->_password)) {
               throw new Exception('User credentials not set!'); 
            }

            $result = $this->_db->execute_query("SELECT * FROM web2_users WHERE username = '$this->_username'");

            if($result->num_rows == 0) {
                return false;
            }else return true;
        }

        public function isLoggedIn() {
            if(isset($_SESSION['user']) && $_SESSION['user'] != null && $this->_user != null) {
                return true;
            }else return false;
        }

        public function recoverUser($session) {
            if(isset($session) && $session != null && ($this->_username == null && $this->_password == null)) {
                $id = $session['id'];
                $session_string = $session['session'];

                $result = $this->_db->execute_query("SELECT * FROM web2_users WHERE id = '$id' AND session = '$session_string'");
                if($result && $result->num_rows > 0) {
                    $userData = $result->fetch_assoc();
                    if($userData['session'] != null) {
                        $datetime = DateTime::createFromFormat('Y-m-d H:i:s', base64_decode($userData['session']));
                        $now = new DateTime("now");

                        if($datetime > $now) {
                            $this->_username = $userData['username'];
                            $this->_user = array("id" => $userData['id'], "username" => $userData['username'], "session" => $userData['session']);
                            $_SESSION['session'] = $session;

                            return $this->_user;
                        }else return false;
                    }else return false;
                }else return false;
            }else throw new Exception("Error while recovering user! Session cannot be empty or null!");
        }

        public function getUser() {
            return $this->_user ?? null;
        }
    }
    
?>