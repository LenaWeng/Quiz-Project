$(function(){
  //alert('test');
  var seconds1 = new Date().getTime() / 1000;
alert(seconds1);
  $('html').on('click','#submit',function(e){
    //e.preventDefault();
     var seconds2 = new Date().getTime() / 1000;
alert(seconds2);

    var formData = $("#questionnaire_form").serializeArray();
    console.log(formData);
    $.post("send_mail.php", formData)
      .done(function(data){
        console.log("post succeeded!")
        // redirect to thank you page here
      })
      .fail(function(data){
        console.log("failed to post")
      })
      .always(function(data){
      })
  });
});
