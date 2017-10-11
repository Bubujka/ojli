<?php
if(php_sapi_name() == 'cli-server')
  if(preg_match('/\.(?:png|jpg|jpeg|gif|js|css)$/', $_SERVER["REQUEST_URI"]))
        return false;   

require_once 'load.php';
dev_hosts('localhost:8001');

run_site();

