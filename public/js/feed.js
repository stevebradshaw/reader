

function setupButtons() {

}

function populateFeedList() {
//  PHPSESSID=3f6ccd83df409f2d2c1907a255492f3a
}

$(document).ready(function() {
	setupButtons() ;

$(".folder").click(function(t) {
  console.log(t.target.id.substring(7)) ;
  //$("#feeds_1").toggleClass('colIco') ;
  $("#feeds_" + t.target.id.substring(7)).slideToggle("fast") ;
}) ;

$(".feed").click(function(t) {
//  clear feedSelected class
$(".feedSelected").removeClass("feedSelected") ;

//  add feedSelected class
$(t.target).addClass("feedSelected") ;

}) ;


populateFeedList() ;
}) ;
