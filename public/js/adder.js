// opts содержит
//  name: function|string # название режима
//  doc: string | документация к режиму
//  legend: string | что написать перед полем
//  empty_fn: function # что произойдёт при нажатии enter с пустым полем 
//  val_fn: function(text, cc) # код для обработки полученного текста - сс надо будет потом вызвать
function def_adder_mode(name, opts){
  var inp = '.' + name + '_adder input';
  def_mode(name+'_adder', {
    name: opts.name,
    html: '<div class="legend">'+ opts.legend + ':</div><input id="big-field" type="text">',

    start: function(){
      $(inp).focus()
    },
    stop: function(){
      $(inp).blur();
    },
    keys_on: function(){return $(inp);},
    keys: {
      'return': { 
        fn: function(){
          if($(inp).val() == ''){
            opts.empty_fn()
          }else{
            $(inp).attr('disabled', 'disabled');
            opts.val_fn($(inp).val(), function(){
              $(inp).val('');
              $(inp).removeAttr('disabled')
              $(inp).focus()
            });
          }
        },
        doc: opts.doc
      }
    }
  });
}
