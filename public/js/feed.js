

function setupButtons() {

}
/*
<div class="accordion">
  <div id="folder_1" class="folder">Blogs</div>
  <div id="feeds_1" class="feeds">
    <li class="feed">This Blog Here</li>
	<li class="feed">That blog there</li>
  </div>
  <div id="folder_2" class="folder">Oracle</div>
  <div id="feeds_2" class="feeds colIco">
    <li class="feed">Ask Tom</li>
	<li class="feed">Jonathan Lewis</li>
	<li class="feed">Tanel Poder</li>
  </div>
  <div id="folder_3" class="folder">Tech</div>
  <div id="feeds_3" class="feeds">
    <li class="feed">Engadget</li>
	<li class="feed">gdgt</li>
	<li class="feed">Hexus</li>
	<li class="feed">Toms Hardware</li>
  </div>
</div>
*/
function populateFeedList() {
//  PHPSESSID=3f6ccd83df409f2d2c1907a255492f3a
  $.ajax({url: "api/feedlist",
          type: 'GET',
          contentType: "application/json",
          dataType: "text",
          context: this,
          success: function(data) {
			         var json = JSON.parse(data),
					     html = "",
						 node ;;
					 for (var idx in json) {
						 node = json[idx]
html = html + '<div id="folder_' + node.id + '" class="folder">' + node.folder_name + '</div>' ;
html = html + '<div id="feeds_' + node.id + '" class="feeds" style="display:none">' ;
var feeds = JSON.parse(node.feeds) ;

for (var j in feeds) {
	console.log(j) ;
  console.log(feeds[j].feed_title) ;	
  html = html + '<li class="feed">' + feeds[j].feed_title + '</li>' ;
}
//console.log(node.feeds) ;
html = html + '</div>' ;
//console.log(json[idx].folder_name) ;
					 }
					 $("#accordion").html(html) ;
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
/*                      this.flXMLProcessor.setXML(data);
                      this.updateListContents(this.flXMLProcessor.transform()) ; //update_list_contents(frag) ;
             this.openList() ; //open_list() ;

             var that = this ;
             $("[id^=feed_]").click(function() {
                                     that.showFeed(this.id.substring(5)) ;// show_feed(this.id.substring(5)) ;
                                    });*/
           }
         }) ;
}


$(document).ready(function() {
	setupButtons() ;



populateFeedList() ;
}) ;
