<?php
wrp('user layout');
controller('today', function(){
  title_a('Today');
  echo view('today/js');
  echo dview('today/data', today_show_list());
});
