<?php
def_wrp('user', function($fn){
  if(is_guest())
    redirect_to_login();
  else
    return $fn();
});

def_wrp('guest', function($fn){
  if(is_user())
    redirect_to_index();
  else
    return $fn();
});

def_wrp('admin', function($fn){
  if(!is_user())
    redirect_to_index();
  else{
    $u = current_user();
    if(isset($u['is-admin']) and $u['is-admin'])
      return $fn();
  }
  redirect_to_index();
});

def_accessor('layout', 'default');
def_wrp('layout', function($fn){
  echo dview('layout/'.layout(), ob($fn));
});
