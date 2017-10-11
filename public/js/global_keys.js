global_key('shift_i', function(){
  dir = '$incoming';
  change_mode('dir_show');
}, 'Посмотреть инкаминг')

global_key('shift_w', function(){
  dir = '$waiting';
  change_mode('dir_show');
}, 'Посмотреть ожидающие')

global_key('shift_t', function(){
  change_mode('today')
}, 'вернуться к сегодняшнему дню')

global_key('shift_r', function(){
  setup_all_cards_to_resort(function(){
    change_mode('dir_resort')
  });
}, 'Глобальная пересортировка карточек');

global_key('shift_f', function(){
    change_mode('friends')
}, 'Переход к режиму друзей');

global_key('shift_b', function(){
  change_mode('blog_adder')
  return false;
}, 'Запись в микроблог');

global_key('g', function(){
    change_mode('sanctuary')
}, 'спец-переходы');
