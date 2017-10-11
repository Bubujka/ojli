<?php
def('group_by', function($fn, $arr){
  $r = [];
  foreach($arr as $v)
    $r[$fn($v)][] = $v;
  return $r;
});
