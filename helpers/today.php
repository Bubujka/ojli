<?php
def_js('have_today_list', function(){
  if(mdb()->today->find(['date'=>today_date(), 'user'=>user_id()])->count())
    return true;
  return false;
});

def('today_list', function($day){
  return mdb()->today->findOne(['date'=>$day, 'user'=>user_id()]);
});

todo('Валидация $date');
def_js('create_card_and_append_to_today', function($date, $str){
  $cid = mid();
  inc_stat('new-card');
  mdb()->cards->insert(
    ['_id'=>$cid, 
     'text' => $str,
     'user' => user_id(),
     'added' => mdate(),
     'dir' => '$today',
     'odir' => '$incoming'],
    ['safe'=>true]);
  mdb()->today->update(
    ['date' => $date, 'user' => user_id()],
    ['$addToSet'=>['tasks-open' => $cid]],
    ['safe'=>true, 'upsert'=>true]);

  return true;
});

todo('Валидация $date');
def_js('create_card_append_to_day_and_done_it', function($date, $str){
  $cid = mid();
  inc_stat('new-card');
  mdb()->cards->insert(
    ['_id'=>$cid, 
     'text' => $str,
     'user' => user_id(),
     'added' => mdate(),
     'odir' => '$incoming',
     'dir' => '$today'],
    ['safe'=>true]);
  mdb()->today->update(
    ['date' => $date, 'user' => user_id()],
    ['$addToSet'=>['tasks-open' => $cid]],
    ['safe'=>true, 'upsert'=>true]);

  today_make_card_done((string)$cid, $date);
  return true;
});

def_js('today_show_list', function($day = null){
  if(is_null($day))
    $day = today_date();

  $r = "";
  $r .= dview('stats', stats_at_day($day));
  $r .= view('today/list', ['data'=>today_list($day), 'day'=>$day]);
  return $r;
});

def_js('today_date', function(){
  return date('Y-m-d');
});

def_js('today_day_before', function($date){
  list($y, $m, $d) = explode('-', $date);
  return date('Y-m-d', mktime(0, 0, 0, (int)$m, (int)$d, (int)$y) - (3600*24));
});

def_js('today_day_after', function($date){
  list($y, $m, $d) = explode('-', $date);
  return date('Y-m-d', mktime(0, 0, 0, (int)$m, (int)$d, (int)$y) + (3600*24));
});

def_js('today_get_cards_ids', function($day){
  $l = today_list($day); 
  return array_map(function($v){
    return (string)$v;
  }, $l['tasks-open']);
});

def_js('today_one_card', function($id){
  return card_html($id);
});


/// --->>> FUCKING SHIT
def_js('make_card_done', function($id){
  inc_stat('done-card');
  mdb()->cards->update(
    ['_id'=>mid($id), 'user'=>user_id()],
    ['$rename'=>['dir'=>'odir']]);
  mdb()->cards->update(
    ['_id'=>mid($id), 'user'=>user_id()],
    ['$set'=>['dir'=>'$done']]);
});
def_js('make_card_done_today', function($id){
  make_card_done($id);
  today_make_card_done($id, today_date());
});
def_js('today_make_card_done', function($id, $day){
  inc_stat('done-card');
  mdb()->cards->update(
    ['_id'=>mid($id), 'user'=>user_id()],
    ['$rename' => ['dir'=>'odir']]);
  mdb()->cards->update(
    ['_id'=>mid($id), 'user'=>user_id()],
    ['$set' => ['donetime'=>mdate(), 'dir'=>'$done']]);
  mdb()->today->update(
    ['date'=>$day, 'user'=>user_id()],
    ['$pull' => ['tasks-open'=>mid($id)],
    '$addToSet' => ['tasks-done'=>mid($id)]],
    ['safe'=>true, 'upsert'=>true]);
  return true;
});
/// <<<<< -----

def_js('today_move_open_to_incoming', function($day){
  $t = mdb()->today->findOne(['date'=>$day, 'user'=>user_id()], ['tasks-open'=>1]);
  if($t['tasks-open']){
    mdb()->cards->update(
      ['_id'=>['$in'=>$t['tasks-open']], 'user'=>user_id()],
      ['$rename'=>['odir'=>'dir']],
      ['multiple'=>true]);
    mdb()->today->update(
      ['date'=>$day, 'user'=>user_id()],
      ['$set'=>['tasks-open'=> []]]);
  }
  return true;
});

def_js('move_cards_from_day_to_today', function($day){
  $t = mdb()->today->findOne(['date'=>$day, 'user'=>user_id()], ['tasks-open'=>1]);
  if($t['tasks-open']){
    mdb()->today->update(
      ['date' => today_date(), 'user' => user_id()],
      ['$pushAll'=>['tasks-open' => $t['tasks-open']]],
      ['safe'=>true, 'upsert'=>true]);
    mdb()->today->update(
      ['date'=>$day, 'user'=>user_id()],
      ['$set'=>['tasks-open'=> []]]);
  }
  return true;
});


def_js('today_make_card_undone', function($id, $day){
  inc_stat('done-card', -1);
  mdb()->cards->update(
    ['_id'=>mid($id), 'user'=>user_id()],
    ['$unset'=>['donetime'=>1, 'status'=>1]]);
  mdb()->today->update(
    ['date'=>$day, 'user'=>user_id()],
    ['$addToSet' => ['tasks-open'=>mid($id)],
     '$pull' => ['tasks-done'=>mid($id)]]);
  return true;
});

def_js('today_remove_card', function($id, $day){
  inc_stat('delete-card');
  mdb()->cards->remove(['_id'=>mid($id), 'user'=>user_id()]);
  mdb()->today->update(
    ['date'=>$day, 'user'=>user_id()],
    ['$pull'=>['tasks-open'=>mid($id), 'tasks-done'=>mid($id)]]);
  return true;
});

def('have_cards_in_today', function($data){
  if(isset($data['tasks-open']) and count($data['tasks-open']))
    return true;
  if(isset($data['tasks-done']) and count($data['tasks-done']))
    return true;
  return false;
});
