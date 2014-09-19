<?php
require_once 'vendor/autoload.php';//
// Form Answers
parse_str(file_get_contents("php://input"), $data);

$m = new PHPMailer;

$m->isSMTP();
$m->SMTPAuth   = true;
$m->SMTPDebug  = 2; // gives messages only. 1 gives error codes, too
$m->Host       = 'smtp.gmail.com';
$m->Username   = 'xdquestionnaire@gmail.com';
$m->Password   = 'perficientxd';
$m->SMTPSecure = 'ssl';
$m->Port       = 465;

$m->IsHTML(true);

$m->From       = 'xdquestionnaire@gmail.com';
$m->FromName   = 'Derek Montgomery';
$m->To         = 'harish2rock@gmail.com';
$m->addAddress('harish2rock@gmail.com', 'Harish Gmail');
$m->Subject    = 'XD Questionnaire Answers';
$m->Body       = '';
$m->Body       .= 'JSON Body is <pre>'.var_dump($data).'</pre><br />';
foreach($data['questions'] as $k => $v) {
  // $m->Body .= 'Your answer to question one was '.$data['question_1'].'<br />';
  $m->Body .= "Your answer to ".$k." was ".$v.'.<br />';
}

// this will tell us if it was sent or not
// var_dump($m->send());
if(!$m->Send()){
  echo "Mailer error: " . $m->ErrorInfo;
} else {
  echo "Message sent!";
}

session_start();
// store session data

$endTime = date("H:i:s");
$_SESSION['endTime']=$endTime;

$time1 = strtotime($_SESSION['startTime']);

$time2 = strtotime($_SESSION['endTime']);

$time3 = ($time2 - $time1)/60;

?>

<p>Start Time - <?php echo date('H:i:s', $time1); ?> </p>
<p>End Time - <?php echo date('H:i:s', $time2); ?> </p>

<p>Time Taken - <?php echo round($time3); ?> minute(s)</p>




