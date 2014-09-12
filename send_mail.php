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
$m->To         = 'montgomerygraphics@gmail.com';
$m->addAddress('montgomerygraphics@gmail.com', 'Derek Gmail');
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
