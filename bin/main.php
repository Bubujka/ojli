<?php
wrp('user layout');
controller('index', function(){
  redirect_to_today();
  #echo nl2br(h(file_get_contents('README')));
});

def_return('index_url', '/');

controller('api_new_card', function(){
  $text = post('text');
  $key = post('key');
  if(valid_api_key($key)){
    $user = get_user_by_api_key($key);
    def_return('is_user', true);
    def_return('user_id', $user['_id']);
    create_card_in_dir('$incoming', $text);
    echo 'true';
  }else{
    echo 'false';
  }
});
wrp('guest layout');
controller('login', function(){
  echo login_process_post_form(function(){
    echo view('login-form');
  },'Войти');
});

wrp('guest');
controller('login_process', function(){
  if(post('email') and post('password')){
    if(post('email') == admin_user_email())
      check_admin_user_exists();

    if($u = user_by_email(post('email')))
      if(saltify(post('password'), $u['salt']) == $u['password']){
        log_in_with($u);
        redirect_to_index();
      }
  }
  redirect_to_login();
});

controller('show_404', function(){
  echo '404';
});

