var CookieMgr = new Cookies() ;

function setupButtons() {
  $("#signin-button").click(function() {

    // if rememberme is set, store the email and preference in a cookie to use later
    // otherwise clear the cookie
    //
    if ($("#rememberme").is(":checked")) {
      console.log('remember me') ;
      CookieMgr.create( "rememberuser", "on", 365) ;
      CookieMgr.create( "rememberemail", $("#inputEmail").val(), 365) ;
    } else {
      CookieMgr.erase("rememberuser") ;
      CookieMgr.erase("rememberemail") ;
    }

    $.ajax({ url: "api/signin",

             data: { username: $("#signin > #inputEmail").val(), password: $("#signin > #inputPassword").val(), rememberuser: $("#rememberme").is(':checked') },
             type: 'POST',
             success : function(data) {
                          if (CookieMgr.read("loggedin") == "yes") {
							  toastr.success('Sign in successful!') ;
                             window.location = "/reader" ;
                          } else {
                            // TODO:  handle signin failed...
                            $("#signin_message").addClass("highlight",150) ;
                            $("#signin_message").html("Invalid username or password!") ;
                          }
                       },
             error : function (xhr, ajaxOptions, thrownError){
                        console.log(xhr.status);
                        console.log(thrownError);
console.log('bad error!!!!') ;
                            $("#signin_message").addClass("highlight",150) ;
                            $("#signin_message").html("Invalid username or password!") ;
                     }
    });
  }) ;

  $("#signup-button").click(function() {
    console.log('do signup') ;
    $.ajax({ url: "api/signup",

             data: { username: $("#signup > #inputEmail").val(), password: $("#signup > #inputPassword").val(), name: $("#signup > #inputName").val() },
             type: 'POST',
             success : function(data) {
/*                          if (CookieMgr.read("loggedin") == "yes") {
                             window.location = "/reader" ;
                          } else {
                            // TODO:  handle signin failed...
                            $("#signin_message").addClass("highlight",150) ;
                            $("#signin_message").html("Invalid username or password!") ;
                          }*/
                       },
             error : function (xhr, ajaxOptions, thrownError){
                        console.log(xhr.status);
                        console.log(thrownError);
console.log('bad error!!!!') ;
                            $("#signin_message").addClass("highlight",150) ;
                            $("#signin_message").html("Invalid username or password!") ;
                     }
    });
  }) ;
}

$(document).ready(function() {
    setupButtons() ;

if (CookieMgr.read("rememberuser") == "on") {
  $("#inputEmail").val(CookieMgr.read("rememberemail")) ;
  $("#rememberme").prop('checked', true);
  $("#inputPassword").focus() ;
}

}) ;

