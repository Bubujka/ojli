<?php
def_memo('user_by_email', function($e){
  return mdb()->users->findOne(['email'=>$e]);
});
def_memo('user_by_nick', function($e){
  return mdb()->users->findOne(['nick'=>$e]);
});

def_memo('is_user', function(){
  if(($e = cookie('email')) and cookie('salt') and cookie('sign'))
    if($u = user_by_email($e))
      if(saltify($u['email'], cookie('salt').$u['salt']) == cookie('sign'))
        return true;
  return false;
});

def_memo('user_by_id', function($mid){
  return mdb()->users->findOne(['_id'=>$mid]);
});

def_memo('is_guest', function(){
  return !is_user();
});

def('check_admin_user_exists', function(){
  if(!mdb()->users->find(['email'=>admin_user_email()])->count())
    create_user(admin_user_email(), admin_user_init_password(), ['is-admin' => true, 'nick'=>'bubujka']);
});

def('create_user', function($email, $pwd, $opts = []){
  $opts['email'] = $email;
  $opts['salt'] = random_salt();
  $opts['password'] = saltify($pwd, $opts['salt']);
  $opts['regtime'] = mdate();
  mdb()->users->save($opts);
});

def('log_in_with', function($user){
  $expire = time() + 3600 * 24 * 365;
  setcookie('email', $user['email'], $expire, '/');
  $salt = random_salt();
  setcookie('salt', $salt, $expire, '/');
  setcookie('sign', saltify($user['email'], $salt.$user['salt']), $expire, '/');
});

def('user_img', function($user, $size = 200){
  return 'http://www.gravatar.com/avatar/'.md5(strtolower(trim($user['email']))).'?s='.$size;
});

wrp('user');
def_memo('current_user', function(){
  return user_by_email(cookie('email'));
});

wrp('user');
def_memo('user_id', function(){
  $t = current_user();
  return $t['_id'];
});

def('current_user_img', function(){
  $user = current_user();
  return 'http://www.gravatar.com/avatar/'.md5(strtolower(trim($user['email']))).'?s=40';
});

def('valid_api_key', function($key){
  return !!mdb()->api_keys->find(['key'=>$key])->count();
});

def('get_user_by_api_key', function($key){
  $a = mdb()->api_keys->findOne(['key'=>$key]);
  return user_by_id($a['user']);
});

def_js('get_new_api_key', function(){
  $s = random_salt();
  // валидация уникальности
  mdb()->api_keys->insert(['key'=>$s, 'user'=>user_id()]);
  return $s;
});

