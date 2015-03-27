<?php
session_start();
// store session data

$startTime = date("H:i:s");
$_SESSION['startTime']=$startTime;

?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Perficient XD Questionnaire</title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="stylesheet" href="assets/vendor.css">

  <link rel="stylesheet" href="assets/xd-online-test-project.css">

  <!-- for more details visit: https://github.com/yeoman/grunt-usemin -->

  <!-- <script src="assets/config.min.js"></script> -->


 

  <!-- <script src="//cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.11.1/jquery.validate.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.11.1/additional-methods.js"></script> -->

</head>
<body>
  <!--[if lt IE 8]>
    <p class="browsehappy">
      You are using an <strong>outdated</strong> browser. Please
      <a href="http://browsehappy.com/">upgrade your browser</a>
      to improve your experience.
    </p>
  <![endif]-->



  <!-- <script>
    window.App = require('appkit/app')['default'].create(ENV.APP);
  </script> -->

     <div id="main-content" class="container-fluid"></div>
    
       <script src="assets/vendor.js"></script>

  <script src="assets/xd-online-test-project.js"></script>



</body>
</html>
