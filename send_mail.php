<?php
require_once 'vendor/PHPMailer/PHPMailerAutoload.php';//
// Timer
session_start();
set_time_limit(3600);
$endTime = date("H:i:s");
$_SESSION['endTime']=$endTime;
$time1 = strtotime($_SESSION['startTime']);
$time2 = strtotime($_SESSION['endTime']);
$time3 = ($time2 - $time1)/60;
// Form Answers
parse_str(file_get_contents("php://input"), $data);
$m = new PHPMailer;
$m->isSMTP();
$m->Encoding   = base64;
$m->SMTPAuth   = true;
$m->SMTPSecure = "ssl";
$m->SMTPDebug  = 1; // 2 gives messages only. 1 gives error codes, too.
$m->Host       = "server501.webhostingpad.com"; // SMTP server
$m->Username   = 'xdquestionnaire@perficientxd.com';
$m->Password   = 'perficientxd';
$m->SMTPSecure = 'ssl';
$m->Port       = 465;
$m->IsHTML(true);
$m->Timeout = 10;
$m->From       = 'xdquestionnaire@perficientxd.com';
$m->FromName   = 'XD';
$m->To         = 'harish.bhavanichikar@perficient.com';
//$m->addAddress('derek.montgomery@perficient.com', 'Derek Work');
$m->addAddress('martin.ridgway@perficient.com', 'Martin Work');
$m->addAddress('harish.bhavanichikar@perficient.com', 'Harish Work');
$m->addAddress('jennifer.siegfried@perficient.com', 'Jennifer Work');
$m->addAddress('jacob.schulke@perficient.com', 'Jacob Work');
$m->Subject    = $data['name'].' - Skills Assessment Results';
$m->Body       = '';
$m->Body      .= '<!doctype html><style type=\'text/css\'>@media only screen and (max-width:640px), handheld { td[class=stack] { display:block !important; width:auto !important; clear: both !important; margin:0 !important; } td[id=logo] { text-align: center !important; } td[id=title] { text-align: center !important; } td[id=userinfo] { text-align: left !important; } img { display:inline !important; } }</style>';
$m->Body      .= '<body leftmargin=\'0\' topmargin=\'0\'><table border=\'0\' cellpadding=\'0\' cellspacing=\'0\' width=\'100%\'><tr><td style=\'vertical-align:middle; padding:10px; width:1px; background-color:#cc0c0d;\' valign=\'middle\' align=\'left\' class=\'stack\' id=\'logo\'><img src=\'http://dev.perficientxd.com/Screening-Assets/logo-xd-redwhite.png\' align=\'middle\' border=\'0\' style=\'display:block;\'></td><td style=\'color:#ffffff; font-family:sans-serif; font-weight:100; background-color:#cc0c0d;\' class=\'stack\' id=\'title\'>SKILLS ASSESSMENT RESULTS</td><td style=\'color:#ffffff; font-family:sans-serif; font-weight:100; text-align:right; padding:10px; font-size:12px; background-color:#cc0c0d;\' class=\'stack\' id=\'userinfo\'>';
$m->Body      .= '<strong>Quiz Taker:</strong> '.$data['name'].'<br />';
$m->Body      .= '<strong>Contact Email:</strong> <a href=\'mailto:'.$data['email'].'\' style=\'color:#ffffff;\'><strong style=\'font-weight:normal; color:#fefefe;\'>'.$data['email'].'</strong></a><br />';
$m->Body      .= '<strong>Start Time:</strong> '.date('H:i:s', $time1).'<br />';
$m->Body      .= '<strong>End Time:</strong> '.date('H:i:s', $time2).'<br />';
$m->Body      .= '<strong>Time Taken:</strong> '.round($time3).' minute(s)';
$m->Body      .= '</td></tr>';
//<h3 style="color:#333333;">Question 1: What are the benefits of using the HTML5 tag semantics?</h3>      <p>Answer: sdfg</p>
// foreach($data['questions'] as $k => $q) {
//   $m->Body .= $k.': '.$q.'.<br />';
//   $m->Body .= 'Answer: '.$data['answers'].'<br />';
//   // $m->Body .= 'Answer:'.$k.' was '.$v.'.<br /><br />';
// }
$num_questions = count($data['questions']);
// $m->Body      .= 'Num questions: '.$num_questions.'<br />';
for ($i=0; $i < $num_questions; $i++) {
  $m->Body .= '<tr><td colspan=\'3\' style=\'padding:60px 40px; font-family:sans-serif; font-weight:100; font-size:14px; border-bottom:1px dotted #cccccc;\'><font style=\'font-size:24px;\'>Question '.($i+1).': ';
  $m->Body .= $data['questions']['question_'.($i+1)].'</font>';
  $m->Body .= '<p style=\'font-weight:bold; color:#333333; display:block;\'>Answer: ';
  $m->Body .= htmlspecialchars($data['answers']['answer_'.($i+1)]);
  $m->Body .= '</p></td></tr>';
}
$m->Body      .= '</table></body>';
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