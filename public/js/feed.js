function setupButtons() {

}

function showFeed(id) {
console.log(id) ;
  $.ajax({url: "/api/feed",
          type: 'GET',
          contentType: "application/json",
          dataType: "text",
          data : { feed: id },
          dataType : 'json',
          context: this,
          success: function(data) {

          }
  }) ;
}

function populateFeedList() {

  $.ajax({url: "api/feedlist",
          type: 'GET',
          contentType: "application/json",
          dataType: "text",
          context: this,
          success: function(data) {
			               var json = JSON.parse(data),
					               html = "",
						             node ;
					           for (var idx in json) {
						           node = json[idx]
                       html = html + '<div id="folder_' + node.id + '" class="folder">' + node.folder_name + '</div>'
                                   + '<div id="feeds_' + node.id + '" class="feeds" style="display:none">' ;
                       var feeds = JSON.parse(node.feeds) ;

                       for (var j in feeds) {
                         html = html + '<li class="feed" id="' + feeds[j].id + '">' + feeds[j].feed_title + '</li>' ;
                       }
                       html = html + '</div>' ;
					           }  
					           $("#accordion").html(html) ;
                     $(".folder").click(function(t) {
                       $("#feeds_" + t.target.id.substring(7)).slideToggle("fast") ;
                     }) ;

                     $(".feed").click(function(t) {
                       //  clear feedSelected class
                       $(".feedSelected").removeClass("feedSelected") ;

                       //  add feedSelected class
                       $(t.target).addClass("feedSelected") ;
                       showFeed(t.target.id) ;
                     }) ;
                   }
  }) ;
}

$(document).ready(function() {
	setupButtons() ;
  populateFeedList() ;
}) ;
