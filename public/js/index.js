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

    $.ajax({ url: "api/login",

             data: { username: $("#inputEmail").val(), password: $("#inputPassword").val(), rememberuser: $("#rememberme").is(':checked') },
             type: 'POST',
             success : function(data) {
                          if (CookieMgr.read("loggedin") == "yes") {
                             window.location = "/reader" ;
                          } else {
                            // TODO:  handle login failed...
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

