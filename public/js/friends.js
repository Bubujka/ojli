def_mode('friends', {
  name: 'Друзья',
  checkpoint: true,
  start: function(){
    srv.friends_list_html([], function(data){
      m.html(data)
    })
  },
  stop: function(){},
  keys: {
    'a': {
      doc: 'Добавить друга',
      fn: function(){
        change_mode('friends_adder');
        return false;
      }
    }
  }
});

def_mode('friends_adder', {
  name: 'Добавление друга',
  html: '<div class="legend">Ник или email:</div><input id="big-field" type="text">',
  start: function(){
    m.find('input').focus()
  },
  stop: function(){
    m.find('input').blur()
  },
  keys_on: function(){return m.find('input');},
  keys: {
    'return': { 
      fn: function(){
        var inp = m.find('input')
        if(inp.val() == ''){
          m.find('input').blur()
          change_mode('friends')
        }else{
          inp.attr('disabled', 'disabled') 
            srv.add_friend_by_email_or_nick([inp.val()], function(st){
              if(st == true){
                inp.val('');
              }
              inp.removeAttr('disabled')
              inp.focus()
            });
        }
      },
      doc: 'Добавить друга по имени или нику'
    }
  }
});
