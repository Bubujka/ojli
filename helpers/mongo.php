<?php
def_memo('mdb', function(){
  $t = new Mongo;
  return $t->ojli;
});

def('mref', function($coll, $id){
  return mdb()->createDBRef($coll, $id);
});

function rref(&$ref){
  $data = array();
  foreach($ref as $k=>$v)
    if($k != '$ref' and $k != '$id')
      $data[$k] = $v;
  $ref =  MongoDBRef::get(mdb(), $ref);
  $ref = array_merge($data, $ref);
  return $ref;
}

function arref(&$arr){
  foreach($arr as &$v)
    rref($v);
  return $arr;
}

def('mdate', function(){
  return new MongoDate;
});

def('mid', function($str = null){
  if(!func_num_args())
    return new MongoId();
  return new MongoId($str);
});

def('minc_field', function($ref, $field, $value = 1, $safe = false){
  mdb()->{$ref['$ref']}->update(
    array('_id'=>$ref['$id']),
    array('$inc'=>array($field=>$value)),
    array('safe'=>$safe));
});
