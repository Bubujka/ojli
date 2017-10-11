<?php
def_memo('my_cards', function(){
  return [['user'=>user_id()], ['from_user'=>user_id()]];
});
def_memo('card', function($id){
  return mdb()->cards->findOne(['_id'=>$id, '$or'=>my_cards()]);
});

def('is_card_done', function($data){
  if(isset($data['status']) and $data['status'] == 'done')
    return true;
  if($data['dir'] == '$done')
    return true;
  return false;
});

todo('Проверять инпут');
def_js('dir_html', function($dir){
  if(is_friend_dir($dir)){
    $u = user_by_nick(dir_to_nick($dir));
    if(!$u)
      $cards = [];
    else
      $cards = mdb()->cards->find(['user'=>$u['_id'], 'from_user'=>user_id()]);
  }else{
    $cards = mdb()->cards->find(['user'=>user_id(), 'dir'=>$dir])->sort(['added'=>true]);
  }

  return dview('incoming', $cards);
});

def('all_dirs', function(){
  $t = mdb()->cards->aggregate([
    ['$project'=>['user'=>1, 'dir'=>1]],
    ['$match' => ['user'=>user_id()]],
    ['$group'=>['_id'=>'$dir']],
    ['$sort' => ['_id'=>1]]]);

  $dirs = [];
  foreach($t['result'] as $v)
    if(trim($v['_id']))
      $dirs[] = $v['_id'];

  $u = current_user();
  if(isset($u['friends']))
    foreach($u['friends'] as $t)
      $dirs[] = '@'.$t['nick'];
  $dirs = group_by(function($v){
    if(preg_match('/^\$/', $v))
      return 'system';
    if(preg_match('/^\./', $v))
      return 'info';
    if(preg_match('/^@/', $v))
      return 'friend';
    if(preg_match('/^#/', $v))
      return 'msg';
    return 'user';
  }, $dirs);
  return $dirs;
});

def_js('all_dirs_html', function(){
  return dview('dir/variants', all_dirs());
});

def_js('card_html', function($id){
  inc_stat('watch-card');
  mdb()->cards->update(['user'=>user_id(), '_id'=>mid($id)], ['$inc'=>['watches'=>1]]);
  $t = card(mid($id));
  if(!$t)
    return '';
  return dview('card/full', $t);
});

def_js('get_cards_ids_in_dir', function($dir){
  $ids = array();
  if(is_friend_dir($dir)){
    $fr = user_by_nick(dir_to_nick($dir));
    foreach(mdb()->cards->find(['user'=>$fr['_id'], 'from_user'=>user_id()], ['_id'=>1])->sort(['added'=>1]) as $v)
      $ids[] = (string)$v['_id'];
  }else{
    foreach(mdb()->cards->find(['dir'=>$dir, 'user'=>user_id()], ['_id'=>1])->sort(['added'=>1]) as $v)
      $ids[] = (string)$v['_id'];
  }
  return $ids;
});

def_js('move_card_to', function($id, $dir){
  if(is_friend_dir($dir)){
    $fr = user_by_nick(dir_to_nick($dir));
    mdb()->cards->update(
      ['_id'=>mid($id), 'user'=>user_id()],
      ['$set' => ['dir'=>'$incoming', 'from_user'=>user_id(),'user'=>$fr['_id']]]);
  }else{
    mdb()->cards->update(['_id'=>mid($id), 'user'=>user_id()], ['$set' => ['dir'=>$dir]]);
  }
  return true;
});
def_js('move_card_to_waiting_and_remove_from_day', function($id, $day){
  move_card_to_waiting($id);
  mdb()->today->update(
    ['date'=>$day, 'user'=>user_id()],
    ['$pull'=>['tasks-open'=>mid($id), 'tasks-done'=>mid($id)]]);
  return true;
});
def_js('move_card_to_waiting', function($id){
  inc_stat('waiting-card');
  move_card_to($id, '$waiting');
  return true;
});

def_js('all_open_cards_ids', function(){
  $r = [];
  foreach(mdb()->cards->find(['user'=>user_id(), 'dir'=>['$nin'=>['$done', '$today']]], ['_id'=>1]) as $v)
    $r[] = (string)$v['_id'];
  return $r;
});
def_js('delete_card', function($id){
  inc_stat('delete-card');
  mdb()->cards->remove(['_id'=>mid($id), 'user'=>user_id()]);
  return true;
});

def_js('make_today_card', function($id){
  mdb()->cards->update(['_id'=>mid($id), 'user'=>user_id()], ['$rename'=>['dir'=>'odir']]);
  mdb()->today->update(
    ['date' => today_date(), 'user' => user_id()],
    ['$push'=>['tasks-open' => mid($id)]],
    ['safe'=>true, 'upsert'=>true]);
  return true;
});

def_js('create_card_in_dir_from_text', function($dir, $txt){
  foreach(explode("\n", $txt) as $v)
    if($v = trim($v))
      create_card_in_dir($dir, $v);
  return true;
});
def_js('create_card_in_dir', function($dir, $txt){
  inc_stat('new-card');
  $data = 
    ['text' => $txt,
     'added' => mdate(),
     'odir' => '$incoming',
     'dir' => $dir];
  if(is_friend_dir($dir)){
     $fr = user_by_nick(dir_to_nick($dir));
     $data['dir'] = '$incoming';
     $data['user'] = $fr['_id'];
     $data['from_user'] = user_id();
  }else{
     $data['user'] = user_id();
  }
    
  mdb()->cards->insert(
    $data,
    ['w'=>1, 'j'=>true]);
  return true;
});

def_js('get_card_text', function($id){
  $c = card(mid($id));
  if(!$c)
    return ''; 
  return $c['text'];
});

def_js('edit_card', function($id, $text){
  $c = card(mid($id));
  if(!$c)
    return true; 
  $time = mdate();
  if(isset($c['updated']))
    $time = $c['updated'];
  elseif(isset($c['added']))
    $time = $c['added'];

  inc_stat('edit-card');
  $u = current_user();
  mdb()->cards->update(
    ['_id'=>mid($id)],
    ['$set'=>['text'=>$text, 'updated'=>mdate()],
     '$inc'=>['edits'=>1],
     '$push'=>['text-log'=>['text'=>$text, 'nick'=>$u['nick'], 'date'=>$time]]],
    ['w'=>1, 'j'=>true]);

  return true;
});

def('card_friend_class', function($card){
  if(isset($card['from_user']) and $card['from_user'] == user_id())
    return 'from-me';
  if(isset($card['from_user'])){
    $u = current_user();
    if(isset($u['friends'])){
      $i = 0;
      foreach($u['friends'] as $f){
        if($card['from_user'] == $f['_id'])
          return 'friend-'.$i;
        $i++;
      }
    }
    return 'unknown-friend';
  }
  return false;
});

def_js('msg_new', function(){
  $t = rand(10000, 99999);
  if(mdb()->cards->findOne(['user'=>user_id(), 'dir'=>'#msg-'.$t]))
    return msg_new();
  return '#msg-'.$t;
});

def_js('rename_dir', function($from, $to){
  mdb()->cards->update(
    ['user'=>user_id(), 'dir'=>$from],
    ['$set'=>['dir'=>$to]],
    ['multiple'=>true]);
  return true;
});

def_js('get_reread_list', function(){
  $r = [];
  foreach(mdb()->cards->find(['user'=>user_id(), 'dir'=>'$reread']) as $v)
    $r[] = $v['text']; 
  return $r;
});
