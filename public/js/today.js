onload_mode('today')

def_mode('adder', {
  name: 'Добавить на сегодня',
  html: 
    '<div class="legend">'+
      'Что надо сделать сегодня</div>'+
    '<input id="big-field" type="text">',
  start: function(){
    $('.adder input').focus()
  },
  stop: function(){
    $('.adder input').blur()
  },
  keys_on: function(){return $('.adder input');},
  keys: {
    'return': { 
      fn: function(){
        if($('.adder input').val() == ''){
          srv.today_show_list([today], function(data){
            $('.today').html(data)
            change_mode('today');
          })
        }else{
          $('.adder input').attr('disabled', 'disabled') 
            srv.create_card_and_append_to_today([today, $('.adder input').val()], function(st){
              if(st == true){
                $('.adder input').val('');
              }
              $('.adder input').removeAttr('disabled')
              $('.adder input').focus()
            });
        }
      },
      doc: 'Добавить что-то к списку на сегодня. Если строка пустая - показать список'
    }
  }
});




def_mode('anti_adder', {
  name: 'Добавить выполненное дело',
  html: '<div class="legend">' +
            'Что было сегодня сделано</div>' +
          '<input id="big-field" type="text">',
        
  start: function(){
    $('.anti_adder input').focus()
  },

  stop: function(){
    $('.anti_adder input').blur()
  },
  keys_on: function(){return $('.anti_adder input');},
  keys: {
    'return': { 
      fn: function(){
        if($('.anti_adder input').val() == ''){
          srv.today_show_list([today], function(data){
            $('.today').html(data)
            change_mode('today');
          })
        }else{
          $('.anti_adder input').attr('disabled', 'disabled') 
            srv.create_card_append_to_day_and_done_it([today, $('.anti_adder input').val()], function(st){
              if(st == true){
                $('.anti_adder input').val('');
              }
              $('.anti_adder input').removeAttr('disabled')
              $('.anti_adder input').focus()
            });
        }
      },
      doc: 'Добавить выполненное дело на сегодня. Если строка пустая - показать список'
    }
  }
});




var current_card = false, cards = []
function show_card(){
  current_card = cards.shift()
    srv.card_html([current_card], function(data){
      $('.resort').html(data);
    });
}
function reset_cards(){
  current_card = false;
  cards = []
}
def_mode('resort', {
  name: function(){ return 'Пересортировка списка за ' + today },
  checkpoint: true,
  start: function(){
    if(cards.length == 0){
      srv.today_get_cards_ids([today], function(data){
        if(data.length == 0){
          change_mode('today');
        }else{
          cards = shuffle(data)
          show_card()
        }
      });
    }else{
      show_card()
    }
  },
  stop: function(){ },
  keys_on: function(){return $(document);},
  keys: {
    'r': {
      fn: function(){
        change_mode('resort');
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
    'a': {
      fn: function(){
        cards.unshift(current_card);
        incoming_adder(function(){
          change_mode('resort');
        })
        return false
      },
      doc: 'Добавить карточку и вернуться после этого к текущей'
    },
    'e': {
      fn: function(){
        cards.unshift(current_card);
        editor(current_card, function(){
          change_mode('resort');
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
    'd': {
      fn: function(){
        srv.today_make_card_done([current_card, today], function(data){
          change_mode('resort');
        })
      },
      doc: 'Пометить выполненым'
    },
    'u': {
      fn: function(){
        srv.today_make_card_undone([current_card, today], function(data){
          change_mode('resort');
        })
      },
      doc: 'Разделать карточку'
    },
    'w': {
      fn: function(){
        srv.move_card_to_waiting_and_remove_from_day([current_card, today], function(data){
          change_mode('resort');
        })
      },
      doc: 'перенести карточку в папку ожидания'
    },
    'shift_d': {
      fn: function(){
        srv.today_remove_card([current_card, today], function(data){
          change_mode('resort');
        })
      },
      doc: 'Удалить карточку вообще'
    },
    'return': {
      fn: function(){
        change_mode('today');
      },
      doc: 'Вернуться к списку'
    }
  }
});

def_mode('today', {
  name: function(){
    return 'Просмотр дел за ' + human_date(today)
  },
  checkpoint: true,
  start: function(){
    reset_cards()
    srv.today_show_list([today], function(data){
      $('.today').html(data)
    })
  },
  stop: function(){ },
  keys_on: function(){return $(document);},
  keys: {
    'return': {
      fn: function(){
        change_mode('adder');
      },
      doc: 'Перейти к добавлению'
    },
    'a': {
      fn: function(){
        change_mode('anti_adder');
        return false
      },
      doc: 'Перейти к anti-todo режиму'
    },
    'r': {
      fn: function(){
        current_card = false
        change_mode('resort')
      },
      doc: 'Перейти в режим пересмотра'
    },
    'n': {
      fn: function(){
        srv.today_day_after([today], function(data){
          today = data
          change_mode('today')
        });
      },
      doc: 'Посмотреть следующий день'
    },
    'p': {
      fn: function(){
        srv.today_day_before([today], function(data){
          today = data
          change_mode('today')
        });
      },
      doc: 'Посмотреть предыдущий день'
    },
    't': {
      fn: function(){
        srv.today_date([today], function(data){
          today = data
          change_mode('today')
        });
      },
      doc: 'Посмотреть сегодняшний день'
    },
    'shift_m': {
      fn: function(){
        srv.move_cards_from_day_to_today([today], function(data){
          change_mode('today')
        });
      },
      doc: 'Перенести незакрытые таски на сегодняшний день'
    },
    'shift_u': {
      fn: function(){
        srv.today_move_open_to_incoming([today], function(data){
          change_mode('today')
        });
      },
      doc: 'Перенести незакрытые таски в инкаминг'
    }
  }
});
