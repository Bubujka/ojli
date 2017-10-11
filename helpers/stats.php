<?php
def('inc_stat', function($what, $inc = 1){
  mdb()->stats->update(
    ['user'=>user_id(), 'date'=>today_date()],
    ['$inc'=>[$what=>$inc]],
    ['upsert'=>true]);
});

def_return('stat_types', [
  'watch-card'=>'просмотрено',
  'new-card'=>'создано',
  'edit-card'=>'редактировано',
  'done-card'=>'окончено',
  'delete-card'=>'удалено',
  'waiting-card'=>'ожидающие'
]);

def('stats_at_day', function($day){
  return mdb()->stats->findOne(['user'=>user_id(), 'date'=>$day]);
}); 


