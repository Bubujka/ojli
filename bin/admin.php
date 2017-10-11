<?php

wrp('admin');
controller('create_user', function(){
  create_user(get('email'), get('password'),['nick'=>get('nick')]);
  echo 'ok';
});
