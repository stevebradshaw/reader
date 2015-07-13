function setupButtons() {
  $("#signin-button").click(function() {
    console.log('do signin') ;
    $.ajax({ url: "api/login",
             data: { username: $("#inputEmail").val(), password: $("#inputPassword").val(), rememberuser: 'on' },
             type: 'POST',
             success : function(data) {
console.log('done it!!!!') ;
                          if (CookieMgr.read("loggedin") == "yes") {
                             window.location = "viewer.php" ;
                          } else {
                            // TODO:  handle login failed...
                            $("#signin_message").addClass("highlight",150) ;
                            $("#signin_message").html("Invalid username or password!") ;
                          }
                       },
             error : function (xhr, ajaxOptions, thrownError){
                        console.log(xhr.status);
                        console.log(thrownError);
                     }
    });
  }) ;

  $("#signup-button").click(function() {
    console.log('do signup') ;
  }) ;
}

$(document).ready(function() {
    setupButtons() ;
}) ;

