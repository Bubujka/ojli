var incoming_finish_fn 
def_mode('incoming_adder', {
  name: function(){
    return 'Добавить в инкаминг';
  },
  html: '<div class="legend">'+
      'Записываем:</div>'+
    '<input id="big-field" type="text">',

  start: function(){
    $('.incoming_adder input').focus()
  },
  stop: function(){
    $('.incoming_adder input').blur();
  },
  keys_on: function(){return $('.incoming_adder input');},
  keys: {
    'return': { 
      fn: function(){
        if($('.incoming_adder input').val() == ''){
          incoming_finish_fn()
        }else{
          $('.incoming_adder input').attr('disabled', 'disabled') 
            srv.create_card_in_dir(['$incoming', $('.incoming_adder input').val()], function(st){
              if(st == true){
                $('.incoming_adder input').val('');
              }
              $('.incoming_adder input').removeAttr('disabled')
              $('.incoming_adder input').focus()
            });
        }
      },
      doc: 'Добавить что-то в каталог заметок и вернуться к предыдущей заметке'
    }
  }
});

function incoming_adder(fn){
  incoming_finish_fn = fn
  change_mode('incoming_adder')
}

def_mode('editor', {
  name: function(){
    return 'Редактировать карточку';
  },
  html: '<div class="legend">'+
      'Записываем:</div>'+
    '<input id="big-field" type="text">',

  start: function(){
    $('.editor input').attr('disabled', 'disabled') 
    srv.get_card_text([editor_card_id], function(data){
      $('.editor input').removeAttr('disabled')
      $('.editor input').val(data).attr('data-origin', data)
      $('.editor input').focus()
    })
  },
  stop: function(){
    $('.editor input').blur();
  },
  keys_on: function(){return $('.editor input');},
  keys: {
    'return': { 
      fn: function(){
        if($('.editor input').val() != ''){
          if($('.editor input').val() != $('.editor input').attr('data-origin')){
            $('.editor input').attr('disabled', 'disabled') 
              srv.edit_card([editor_card_id, $('.editor input').val()], function(st){
                if(st == true){
                  $('.editor input').val('');
                }
                $('.editor input').removeAttr('disabled')
                $('.editor input').focus()
              });
          }
        }
        editor_finish_fn()
      },
      doc: 'Редактировать карточку'
    }
  }
});
var editor_card_id, editor_finish_fn
function editor(card_id, fn){
  editor_card_id = card_id
  editor_finish_fn = fn
  change_mode('editor');
}
