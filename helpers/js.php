<?php
class MemoJs{
  static $fns = array();
}

def('def_js', function($name, $fn){
  MemoJs::$fns[] = $name;
  def($name, $fn);
});

controller('fn_proxy', function(){
  $error = false;
  if(!get('fn'))
    $error = 'fn argument not set';
  if(!in_array(get('fn'), MemoJs::$fns))
    $error = 'fn not valid';

  if(!post('args'))
    $args = array();
  else
    $args = post('args');
  if($error)
    return array('error'=>$error, 'data'=>null);
  $data = call_user_func_array(get('fn'), $args);
  header('Content-Type: text/javascript'); 
  echo json_encode(array('error'=>$error, 'data'=>$data));
});

controller('js_fns', function(){
  header('Content-Type: text/javascript');
  echo "var srv = {}\n";
  foreach(MemoJs::$fns as $v){
    echo 
      'srv.'.$v."=function(a,c){ start_loader();"
        ."if(a instanceof Function) { c = a; a=[]; } "
        ."if(!a) { c = function(){stop_loader()}; a=[]; } "
        ." $.post('/fn_proxy?fn=".$v."', {'args':a},function(d){c(d['data'],d['error']); stop_loader()},'json') }\n";
  }
});
