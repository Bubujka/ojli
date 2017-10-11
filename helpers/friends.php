<?php

def_js('friends_list_html', function(){
  return view('friends/list');
});

def_js('add_friend_by_email_or_nick', function($t){
  $f = mdb()->users->findOne(['$or'=>[['email'=>$t], ['nick'=>$t]]]);
  if($f and $f['nick'])
    mdb()->users->update(['_id'=>user_id()], ['$addToSet'=>['friends'=>['_id'=>$f['_id'], 'nick'=>$f['nick']]]]);
  
  return true;
});
