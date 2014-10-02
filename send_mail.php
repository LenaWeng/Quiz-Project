<?php
require_once 'vendor/PHPMailer/PHPMailerAutoload.php';//

// Timer
session_start();
$endTime = date("H:i:s");
$_SESSION['endTime']=$endTime;
$time1 = strtotime($_SESSION['startTime']);
$time2 = strtotime($_SESSION['endTime']);
$time3 = ($time2 - $time1)/60;



// Form Answers
parse_str(file_get_contents("php://input"), $data);

$m = new PHPMailer;

$m->isSMTP();
$m->SMTPAuth   = true;
$m->SMTPDebug  = 1; // 2 gives messages only. 1 gives error codes, too.
$m->Host       = 'smtp.gmail.com';
$m->Username   = 'xdquestionnaire@gmail.com';
$m->Password   = 'perficientxd';
$m->SMTPSecure = 'tls';
$m->Port       = 587;
$m->IsHTML(true);

$m->From       = 'xdquestionnaire@gmail.com';
$m->FromName   = 'Derek Montgomery';
$m->To         = 'derek.montgomery@perficient.com';
$m->addAddress('derek.montgomery@perficient.com', 'Derek Work');
$m->addAddress('harish.bhavanichikar@perficient.com', 'Harish Work');
// $m->addAddress('martin.ridgway@perficient.com', 'Martin Work');
$m->Subject    = 'XD Questionnaire Answers';
$m->Body       = '';
$m->Body      .= 'Quiz Taker: '.$data['name'].'<br />';
$m->Body      .= 'Contact Email: '.$data['email'].'<br />';
$m->Body      .= 'Start Time - '.date('H:i:s', $time1).'<br />';
$m->Body      .= 'End Time - '.date('H:i:s', $time2).'<br />';
$m->Body      .= 'Time Taken - '.round($time3).' minute(s)<hr /><br />';


// foreach($data['questions'] as $k => $q) {
//   $m->Body .= $k.': '.$q.'.<br />';
//   $m->Body .= 'Answer: '.$data['answers'].'<br />';
//   // $m->Body .= 'Answer:'.$k.' was '.$v.'.<br /><br />';
// }
$num_questions = count($data['questions']);
// $m->Body      .= 'Num questions: '.$num_questions.'<br />';

for ($i=0; $i < $num_questions; $i++) {
  $m->Body .= '<b>Question '.($i+1).':</b> ';
  $m->Body .= $data['questions']['question_'.($i+1)];
  $m->Body .= '<br />';
  $m->Body .= '<b>Answer:</b> ';
  $m->Body .= $data['answers']['answer_'.($i+1)];
  $m->Body .= '<br /><br />';
}

// this will tell us if it was sent or not
// var_dump($m->send());
if(!$m->Send()){
  echo "Mailer error: " . $m->ErrorInfo;

  // $host = "smtp.gmail.com";
  // $port = 465;
  // $checkconn = fsockopen($host, $port, $errno, $errstr, 5);
  // if(!$checkconn){
  //   echo "($errno) $errstr";
  // } else {
  //   echo 'ok';
  // }

} else {
  echo "Message sent!";
}

?>
