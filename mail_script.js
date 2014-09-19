$(function(){
  $('body').on('click','#submit',function(e){

    e.preventDefault();
   //  alert('test');
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
