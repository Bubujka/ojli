def_page_mode('count_cards', 'Посмотреть колличество карточек', function(){
  $('.mode.count_cards').load('/page_count_cards');
})

def_page_mode('new_api_key', 'Создать новый ключ для апи', function(){
  srv.get_new_api_key([], function(data){
    $('.mode.new_api_key').html(data);
  });
})
