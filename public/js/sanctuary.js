def_mode('sanctuary', {
  name: 'Переход по разделам сайта',

  start: function(){ },
  stop: function(){ },
  keys_on: function(){return $(document);},
  keys: {
    'g': { 
      fn: function(){
        default_mode()
      },
      doc: 'Перейти к стандартному режиму'
    },
    'm': { 
      fn: function(){
        default_mode()
        srv.msg_new([], function(data){
          dir = data
          change_mode('dir_show')
        })
      },
      doc: 'Создать новую текстовую заметку'
    },
    'r': { 
      fn: function(){
        dir = '$reread'
        change_mode('dir_show')
      },
      doc: 'Посмотреть список перечитывания'
    },
    'a': { 
      fn: function(){
        change_mode('new_api_key')
      },
      doc: 'Создать новый ключ для апи'
    },
    'c': { 
      fn: function(){
        change_mode('count_cards')
      },
      doc: 'Посмотреть колличество карточек'
    },
    't': { 
      fn: function(){
        change_mode('today')
      },
      doc: 'Перейти к списку на сегодня'
    },
    'i': { 
      fn: function(){
        dir = '$incoming';
        change_mode('dir_show')
      },
      doc: 'Перейти к инкаминг'
    }
  }
});

function def_page_mode(name, desc, start){
  def_mode(name, {
    name: desc,
    checkpoint: true,
    start: function(){
      start()
    },
    stop: function(){ },
    keys_on: function(){return $(document);},
    keys: {
      'return': { 
        fn: function(){
          change_mode('today')
        },
        doc: 'Перейти к списку на сегодня'
      }
    }
  });
}



