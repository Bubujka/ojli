$(function(){
  $('input:first').focus()
})

function enter(fn){
  hotkey('return', fn)
}

function shift_enter(fn){
  hotkey('shift_return', fn)
}
function hotkey(t, fn){
  $(document).hk(t, fn)
}

function start_loader(){
  $('h3.muted').addClass('active');
}
function stop_loader(){
  $('h3.muted').removeClass('active');
}

(function(jQuery){
  jQuery.fn.hk = function(t, fn){
    $(this).unbind('keydown.'+t)
    $(this).bind('keydown.'+t, fn)
  }
})(jQuery);

function unixtime(y, m, d){
  if(!y){
    var t = new Date();
    var y = t.getFullYear()
    var m = t.getMonth() +1
    var d = t.getDate()
  }
  return Math.round((new Date(y, m, d, 0,0,0,0)).getTime() / 1000)
}

function human_date(temp){

  var t = temp.split('-')
  var y = parseInt(t[0])
  var m = parseInt(t[1])
  var d = parseInt(t[2])

  var ms = [
    'нулября', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
  var suf = '';
  var ts = unixtime()
  var ds = unixtime(y, m, d)

  if(ts == ds)
    suf = ' (сегодня)';
  var DAY = 3600 * 24;
  if((ts - DAY) == ds)
    suf = ' (вчера)';
  if((ts - DAY - DAY) == ds)
    suf = ' (позавчера)';
  if((ts + DAY) == ds)
    suf = ' (завтра)';
  if((ts + DAY + DAY) == ds)
    suf = ' (послезавтра)';
  return d + ' ' + ms[m] + ' ' + y + suf;
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

