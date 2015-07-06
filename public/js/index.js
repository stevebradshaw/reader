function setupButtons() {
  $("#signin-button").click(function() {
    console.log('do signin') ;
  }) ;

  $("#signup-button").click(function() {
    console.log('do signup') ;
  }) ;
}

$(document).ready(function() {
    setupButtons() ;
}) ;

