<?php
def('human_date', function($date){
  list($y, $m, $d) = explode('-', $date);
  $ms = [
    'нулября', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  $suf = '';
  if(date('Y-m-d') == $date)
    $suf = ' (сегодня)';
  $DAY = 3600 * 24;
  if(date('Y-m-d', time() - $DAY) == $date)
    $suf = ' (вчера)';
  if(date('Y-m-d', time() - $DAY -$DAY) == $date)
    $suf = ' (позавчера)';
  if(date('Y-m-d', time() + $DAY) == $date)
    $suf = ' (завтра)';
  if(date('Y-m-d', time() + $DAY + $DAY) == $date)
    $suf = ' (послезавтра)';
  return sprintf('%s %s %s%s', (int)$d, $ms[$m], $y, $suf);
});

def('relative_time', function($s){
  return date('j-n-Y H:i', $s);
});
