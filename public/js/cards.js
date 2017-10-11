var dir = '$incoming';

def_mode('chdir', {
  name: 'смена папки',
  init: function(){
    var i = $('.chdir input'), vars = $('.chdir .variants')
    $('.chdir input').keyup(function(e){
      var val = i.val()
      if(e.keyCode == 13){
        var it 
        if(val == ''){
          dir = '$incoming'
        }else{
          if(e.shiftKey){
            dir = val
          }else if((it = vars.find('.dir.active:first')).length == 0){
            dir = val
          }else{
            dir = $.trim(it.text())
          }
        }
        i.val('')
        change_mode('dir_show')
      }
      vars.find('.dir').removeClass('active').removeClass('first')
      if(val != ''){
        vars.find('.dir').each(function(){
          var self = $(this), text = self.text()
          if(text.indexOf(val) != -1){
            self.addClass('active')
          }
        })
        vars.find('.dir.active:first').addClass('first')
      }
    })
  },
  html: '<div class="legend">'+
      'Какую папку открыть:</div>'+
    '<input id="big-field" type="text">'+
    '<div class="variants">'+
    '</div>',
  start: function(){
    srv.all_dirs_html([], function(data){
      $('.chdir input').focus()
      $('.chdir .variants').html(data)
    })
  },
  stop: function(){
    $('.chdir input').blur()
  },
  keys: {
      
  }
});

def_mode('dir_rename', {
  name: function(){
    return 'Переименовать папку "' + dir + '"';
  },
  html: '<div class="legend">Как переименовать:</div><input id="big-field" type="text">',
  start: function(){
    $('.dir_rename input').focus()
  },
  stop: function(){
    $('.dir_rename input').blur()
  },
  init: function(){
    var i = $('.dir_rename input')
    $('.dir_rename input').keyup(function(e){
      if(e.keyCode == 13){
        var val = i.val()
        i.val('')
        if(val == ''){
          change_mode('dir_show')
        }else{
          srv.rename_dir([dir, val], function(data){
            dir = val
            change_mode('dir_show');
          });
        }
      }
    })
  },
  keys: {}
});

def_mode('dir_show', {
  name: function(){
    return dir
  },
  checkpoint: true,
  start: function(){
    srv.dir_html([dir], function(data){
      $('.dir_show').html(data)
    })
  },
  stop: function(){ },
  keys_on: function(){return $(document);},
  keys: {
    'return': {
      fn: function(){
        change_mode('dir_adder')
      },
      doc: 'creative-mode'
    },
    'e': {
      fn: function(){
        change_mode('dir_rename');
        return false
      },
      doc: 'Переименовать папку'
    },
    'r': {
      fn: function(){
        dir_reset_cards();
        view_mode = 'shuffle'
        change_mode('dir_resort')
      },
      doc: 'режим разбора каталога'
    },
    'p': {
      fn: function(){
        dir_reset_cards();
        view_mode = 'plain'
        change_mode('dir_resort')
      },
      doc: 'Просмотр карточек по порядку'
    },
    'shift_a': {
      fn: function(){
        change_mode('dir_text_adder');
        return false
      },
      doc: 'Создать карточки из текста'
    },
    'c': {
      fn: function(){
        change_mode('chdir')
      },
      doc: 'сменить папку'
    }
  }
});


var dir_current_card = false, dir_cards = [];

function dir_show_card(){
  dir_current_card = dir_cards.shift()
  srv.card_html([dir_current_card], function(data){
    $('.dir_resort').html(data);
  });
}


function dir_reset_cards(){
  dir_current_card = false;
  dir_cards = []
}

function setup_all_cards_to_resort(fn){
  dir_reset_cards();
  srv.all_open_cards_ids([], function(data){
    dir_cards = shuffle(data)
    fn()
  });
}
var view_mode = 'shuffle' // shuffle | plain
def_mode('dir_resort', {
  name: function(){ return 'Пересортировка списка в каталоге ' + dir },
  checkpoint: true,
  start: function(){
    if(dir_cards.length == 0){
      srv.get_cards_ids_in_dir([dir], function(data){
        if(data.length == 0){
          change_mode('dir_show');
        }else{
          if(view_mode == 'shuffle'){
            data = shuffle(data) 
          }
          dir_cards = data
          dir_show_card()
        }
      });
    }else{
      dir_show_card()
    }
  },
  stop: function(){ },
  keys_on: function(){return $(document);},
  keys: {
    'r': {
      fn: function(){
        change_mode('dir_resort');
      },
      doc: 'К следующему таску'
    },
    'shift_o': {
      fn: function(){
        window.open($('.card.full .text').text());
      },
      doc: 'открыть карточку как ссылку'
    },
    'shift_g': {
      fn: function(){
        window.open('http://www.google.com/search?q='+encodeURI($('.card.full .text').text()))
      },
      doc: 'загуглить содержимое карточки'
    },
    't': {
      fn: function(){
        srv.make_today_card([dir_current_card], function(data){
          change_mode('dir_resort');
        })
      },
      doc: 'Перенести на сегодня'
    },
    'm': {
      fn: function(){
        change_mode('move_to');
      },
      doc: 'перенести карточку'
    },
    'a': {
      fn: function(){
        dir_cards.unshift(dir_current_card);
        incoming_adder(function(){
          change_mode('dir_resort');
        })
        return false
      },
      doc: 'Добавить карточку и вернуться после этого к текущей'
    },
    'e': {
      fn: function(){
        dir_cards.unshift(dir_current_card);
        editor(dir_current_card, function(){
          change_mode('dir_resort');
        })
        return false
      },
      doc: 'Редактировать карточку'
    },
    'h': {
      fn: function(){
        $('.card.full .history').toggleClass('hidden')
      },
      doc: 'показать/скрыть историю изменений'
    },
    'w': {
      fn: function(){
        srv.move_card_to_waiting([dir_current_card], function(data){
          change_mode('dir_resort');
        })
      },
      doc: 'перенести карточку в папку ожидания'
    },
    'd': {
      fn: function(){
        srv.make_card_done([dir_current_card], function(data){
          change_mode('dir_resort');
        })
      },
      doc: 'Пометить выполненым'
    },
    'shift_a': {
      fn: function(){
        srv.make_card_done_today([dir_current_card], function(data){
          change_mode('dir_resort');
        })
      },
      doc: 'Пометить выполненым сегодня'
    },
    'shift_d': {
      fn: function(){
        srv.delete_card([dir_current_card], function(data){
          change_mode('dir_resort');
        })
      },
      doc: 'Удалить карточку вообще'
    },
    'return': {
      fn: function(){
        change_mode('dir_show');
      },
      doc: 'Вернуться к списку'
    }
  }
});

def_mode('dir_text_adder', {
  name: function(){
    return 'Добавить в папку ' + dir;
  },
  html: '<div class="legend">Записываем:</div><textarea id="big-field"></textarea>',

  start: function(){
    $('.dir_text_adder textarea').focus()
  },
  stop: function(){
    $('.dir_text_adder textarea').blur();
  },
  keys_on: function(){return $('.dir_text_adder textarea');},
  keys: {
    'return': { 
      fn: function(){
        if($('.dir_text_adder textarea').val() == ''){
          change_mode('dir_show');
        }else{
          $('.dir_text_adder textarea').attr('disabled', 'disabled') 
            srv.create_card_in_dir_from_text([dir, $('.dir_text_adder textarea').val()], function(st){
              if(st == true){
                $('.dir_text_adder textarea').val('');
              }
              $('.dir_text_adder textarea').removeAttr('disabled')
              $('.dir_text_adder textarea').focus()
              change_mode('dir_show')
            });
        }
      },
      doc: 'Добавить много заметок в папку'
    }
  }
});

def_mode('dir_adder', {
  name: function(){
    return 'Добавить в папку ' + dir;
  },
  html: '<div class="legend">'+
      'Записываем:</div>'+
    '<input id="big-field" type="text">',

  start: function(){
    $('.dir_adder input').focus()
  },
  stop: function(){
    $('.dir_adder input').blur();
  },
  keys_on: function(){return $('.dir_adder input');},
  keys: {
    'return': { 
      fn: function(){
        if($('.dir_adder input').val() == ''){
          change_mode('dir_show');
        }else{
          $('.dir_adder input').attr('disabled', 'disabled') 
            srv.create_card_in_dir([dir, $('.dir_adder input').val()], function(st){
              if(st == true){
                $('.dir_adder input').val('');
              }
              $('.dir_adder input').removeAttr('disabled')
              $('.dir_adder input').focus()
            });
        }
      },
      doc: 'Добавить что-то в каталог заметок. Если строка пустая - показать список заметок'
    }
  }
});

def_mode('move_to', {
  name: 'перенести карточку',
  init: function(){
    var i = $('.move_to input'), vars = $('.move_to .variants')
    $('.move_to input').keyup(function(e){
      var val = i.val()
      if(e.keyCode == 13){
        var it 
        if(val == ''){
          dir_cards.unshift(dir_current_card)
          change_mode('dir_resort')
        }else{
          if(!e.shiftKey)
            if((it = vars.find('.dir.active:first')).length != 0){
              val = $.trim(it.text())
            }
          srv.move_card_to([dir_current_card, val], function(){
            change_mode('dir_resort')
          });
        }
        i.val('')
      }
      vars.find('.dir').removeClass('active').removeClass('first')
      if(val != ''){
        vars.find('.dir').each(function(){
          var self = $(this), text = self.text()
          if(text.indexOf(val) != -1){
            self.addClass('active')
          }
        })
      }
      vars.find('.dir.active:first').addClass('first')
    })
  },
  html: '<div class="legend">'+
      'В какую папку перенести:</div>'+
    '<input id="big-field" type="text">'+
    '<div class="variants">'+
    '</div>',
  start: function(){
    srv.all_dirs_html([], function(data){
      $('.move_to input').focus()
      $('.move_to .variants').html(data)
    })
  },
  stop: function(){
    $('.move_to input').blur()
  },
  keys: { }
});
