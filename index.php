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

  <link rel="stylesheet" href="assets/app.min.css">

  <!-- for more details visit: https://github.com/yeoman/grunt-usemin -->

  <script src="assets/config.min.js"></script>

  <script src="assets/vendor.min.js"></script>

  <script src="assets/app.min.js"></script>


</head>
<body>
  <!--[if lt IE 8]>
    <p class="browsehappy">
      You are using an <strong>outdated</strong> browser. Please
      <a href="http://browsehappy.com/">upgrade your browser</a>
      to improve your experience.
    </p>
  <![endif]-->



  <script>
    window.App = require('appkit/app')['default'].create(ENV.APP);
  </script>





</body>
</html>
