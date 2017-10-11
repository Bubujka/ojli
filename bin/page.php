<?php
wrp('user');
controller('page_count_cards', function(){
  $t = mdb()->cards->aggregate([
    ['$project'=>['user'=>1, 'dir'=>1]],
    ['$match' => ['user'=>user_id()]],
    ['$group'=>['_id'=>'$dir', 'count'=>['$sum' => 1]]],
    ['$sort' => ['count'=>-1]]]);
  $dirs = [];
  foreach($t['result'] as $v)
    if(trim($v['_id']))
      $dirs[] = $v;

  echo dview('count-cards', $dirs);
});

