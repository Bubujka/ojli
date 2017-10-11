def_adder_mode('blog', {
  name: 'Запись в блог',
  legend: 'Что случилось',
  doc: 'Режим для записи событий в жизни',
  empty_fn: function(){
    dir = '$incoming';
    change_mode('dir_show');
  },
  val_fn: function(text, cc){
    srv.create_card_in_dir(['$blog', text], cc);
  }
})
