<?php
def('random_salt', function(){
  return md5(rand().microtime(true).rand());
});

def('our_salt', function(){
  return 'ПоняяяяяяяяяяяяяяяяяшкиОлоло1';
});

def('saltify', function($t, $salt){
  return md5($t.'-'.$salt.'-'.our_salt());
});
