var all_colors = [ 
'#6ECFF6', '#7BCDC8', '#7EA7D8',
'#82CA9D', '#8493CA', '#8882BE',
'#A187BE', '#A2D39C', '#BC8DBF',
'#C4DF9B', '#F49AC2', '#F6989D',
'#F7977A', '#F9AD81', '#FDC68A',
'#FFF79A']
  
function next_color(){
  return all_colors.shift()
}
var mode = {}, current_mode = false, global_keys = {}, m
// m - контейнер режима - всем доступен
var colors = {}

function global_key(key, fn, doc){
  global_keys[key] = {
    fn: fn,
    global: true,
    doc: doc}
}

function def_mode(name, data){
  $(function(){
    $('#modes-html').append($('<div></div>').addClass(name).addClass('mode').html(data['html']));
    if(typeof data.init === 'function'){
      data.init()
    }
  });

  if(data.checkpoint){
    for(var key in global_keys)
      if(data.keys[key]){
        console.log('conflict in ' + name + ' with key=' + key);
      }else{
        data.keys[key] = global_keys[key]; 
      }
  }

  mode[name] = data;
  colors[name] = next_color()
}

function title(t){
  $('.title').html(t);
}

function key_to_html(t){
  t = t.split('_')
  for(var k in t)
    t[k] = '<kbd>'+t[k]+'</kbd>'
  return t.join(' + ')
}

function build_help_on(mode){
  var hlp = $('#help');
  hlp.html('');
  var norm = global = ''
  for(key in mode.keys){
    var t = key_to_html(key)+' - ' + mode.keys[key].doc + '<br>';
    if(mode.keys[key].global)
      global += t;
    else
      norm += t;
  }
  hlp.html(norm + (global.length ? ('<hr>' + global) : ''))
}
var reread_txt = []

$(function(){
  srv.get_reread_list([], function(data){
    reread_txt = data
    display_next_reread()
  });
});
function random_reread(){
  return reread_txt[Math.floor(Math.random() * reread_txt.length)];
}
function display_next_reread(){
  $('.reread').html(random_reread())
}

function change_mode(name, stop){
  var t = mode[name];
  m = $('.mode.'+name)
  display_next_reread()
  if(current_mode != false){
    var prev = mode[current_mode];
    if(prev.keys_on){
      var on = prev.keys_on()
      for(i in prev.keys){
        on.unbind('keydown.'+i, prev.keys[i].fn)
      }
      if(prev.checkpoint){
        on.unbind('keydown.g');
      }
    }
    prev.stop()
    $('.'+current_mode).hide();
  }
  current_mode = name;
  console.log('changing to ' + name);
  if(typeof t.name === 'function'){
    title(t.name());
  }else{
    title(t.name);
  }
  if(t.keys)
    if(!t.keys_on)
       t.keys_on = function(){ return $(document);}
  if(t.keys_on){
    var on = t.keys_on()
    for(i in t.keys){
      on.bind('keydown.'+i, t.keys[i].fn)
    }
  }
  build_help_on(t)
  $('.masthead').css('background-color', colors[name]);
  $('.'+name).show();
  t.start()
}
var _default_mode = false;
function onload_mode(wtf){
  _default_mode = wtf
    $(function(){
      change_mode(wtf)
    })
}

function default_mode(){
  change_mode('today')
}
