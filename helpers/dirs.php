<?php

def('is_friend_dir', function($t){
  return preg_match('/^@/', $t);
});

def('dir_to_nick', function($t){
  return substr($t, 1);
});
