<?php
def_accessor('title', 'Ojli.org');
def('title_a', function($v){
  $t = title();
  $t .= ' - '.$v;
  title($t);
});

def('menu', function(){
  if(is_user())
    return view('menu');
});

def_alias('htmlspecialchars', 'h');
