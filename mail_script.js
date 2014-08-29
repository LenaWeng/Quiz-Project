$(function(){
  $('#submit').click(function(e){
    e.preventDefault();
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
