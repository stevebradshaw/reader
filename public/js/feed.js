function setupButtons() {
$("#btn-feed-status").click(function(t) { console.log(t)  ;
if ($(t.target).text() == "View: Unread") {
  $(t.target).text("View: Read") ;
} else{
  $(t.target).text("View: Unread") ;
}
}) ;
}

function setEntryStatus(params) {
//  console.log(params.key) ;

  $.ajax({url: "/api/entry?key=" + params.key + "&status=" + params.status,
          type: 'PUT',
          contentType: "application/json",
//          dataType: "text",
//          data : "_METHOD=PUT&accessToken=63ce0fde", //{ key: params.key, status: params.status },
//          dataType : 'json',
          context: this,
          success: function(data) {
			  console.log(data) ;
//			         displayFeed(data) ;

          }
  }) ;
console.log(params) ;
}
/*
   <div id="entrylist">
     <div class="entry" uri= "http://feedproxy.google.com/~r/CppSoup/~3/BpgUzXm_HXI/rich-pointers-update-and-reflection.html" id="4752653a9c6d0f31d78cb5b61fa5a799">
       <div class="header unread" id="header">
         <span class="title">Rich Pointers (Update) and Reflection</span>
		 <span class="pubdate">2012-09-28 16:00:00 UTC</span>
       </div>

       <div class="content collapsed" id="content"></div>
     </div>

{ id: 18973274,
entry_key: 'dc0168baeec09da8837a1b01a6bdb2e1',
entry_title: 'Apple\'s future iPhones could hide FaceTime camera & flash inside earpiece grille',
entry_html: 'The clean and simple design of Apple\'s iconic iPhone could become even simpler, thanks to a new concept that describes concealing the FaceTime camera within the earpiece speaker slot, and even adding a camera flash module that would illuminate forward facing pictures.<img width=\'1\' height=\'1\' src=\'http://appleinsider.com.feedsportal.com/c/33975/f/616168/s/3d476db8/sc/28/mf.gif\' border=\'0\'/><br clear=\'all\'/><br/><br/><a href="http://da.feedsportal.com/r/204366302233/u/0/f/616168/c/33975/s/3d476db8/sc/28/rc/1/rc.htm" rel="nofollow"><img src="http://da.feedsportal.com/r/204366302233/u/0/f/616168/c/33975/s/3d476db8/sc/28/rc/1/rc.img" border="0"/></a><br/><a href="http://da.feedsportal.com/r/204366302233/u/0/f/616168/c/33975/s/3d476db8/sc/28/rc/2/rc.htm" rel="nofollow"><img src="http://da.feedsportal.com/r/204366302233/u/0/f/616168/c/33975/s/3d476db8/sc/28/rc/2/rc.img" border="0"/></a><br/><a href="http://da.feedsportal.com/r/204366302233/u/0/f/616168/c/33975/s/3d476db8/sc/28/rc/3/rc.htm" rel="nofollow"><img src="http://da.feedsportal.com/r/204366302233/u/0/f/616168/c/33975/s/3d476db8/sc/28/rc/3/rc.img" border="0"/></a><br/><br/><a href="http://da.feedsportal.com/r/204366302233/u/0/f/616168/c/33975/s/3d476db8/sc/28/a2.htm"><img src="http://da.feedsportal.com/r/204366302233/u/0/f/616168/c/33975/s/3d476db8/sc/28/a2.img" border="0"/></a><img width="1" height="1" src="http://pi.feedsportal.com/r/204366302233/u/0/f/616168/c/33975/s/3d476db8/sc/28/a2t.img" border="0"/>',
entry_author: '',
entry_uri: 'http://appleinsider.com.feedsportal.com/c/33975/f/616168/s/3d476db8/sc/28/l/0Lappleinsider0N0Carticles0C140C0A80C0A70Capples0Efuture0Eiphones0Ecould0Ehide0Efacetime0Ecamera0Eflash0Einside0Eearpiece0Egrille/story01.htm',
publication_date: Thu Aug 07 2014 13:51:50 GMT+0100 (BST),
publication_tz: 'UTC',
feed_title: 'AppleInsider',
status: 'unread' }
*/
function displayFeed(feed) {

  var frag = '', node ;
  for (var i in feed) {
	  node = feed[i] ;
console.log(node.entry_key + ' ' + node.status) ;
	  frag = frag + '<div class="entry" uri="' + node.entry_uri + '" id="' + node.entry_key + '">'
                  + '<div class="header ' + node.status + '" id="header">'
                  + '<span class="title">' + node.entry_title + '</span>'
                  + '<span class="pubdate">' + node.publication_date + '</span>'
                  + '</div>'
//                  + '<div class="content collapsed" id="content_' + node.entry_key + '">' + node.entry_html + '</div>' 
                  + '<div class="content collapsed" id="content_' + node.entry_key + '">' 
                  + '<div class="content-title " id="tittle_' + node.entry_key + '"><h4>' + node.entry_title + '</h4></div>' 
                  + '<div class="content-body" id="body_' + node.entry_key + '">' + node.entry_html + '</div>' 
                  + '<div class="content-footer" id="footer_' + node.entry_key + '">'
                  + '<span class="glyphicon glyphicon-bookmark" aria-hidden="true"></span>'
                  + '<span class="glyphicon glyphicon-tag" aria-hidden="true"></span>'
                  + '<img id="bookmark" src="/images/book-grey-256.png" width="24" height="24" style="margin:1px ; cursor: pointer; ">'
                  + '<img id="tag" src="/images/tag.png" width="24" height="24" style="margin:1px ; cursor: pointer; ">'
                  + '<span class="social">'
                  + '<img id="fb_share" src="/images/facebook.png" width="24" height="24" style="margin:1px ; cursor: pointer; ">'
                  + '<img id="mail_entry" src="/images/twitter.png" width="24" height="24" style="margin:1px ; cursor: pointer; ">'
                  + '<img id="google_share" src="/images/google+.png" width="24" height="24" style="margin:1px ; cursor: pointer; ">'
                  + '<img id="mail_entry" src="/images/mail.png" width="24" height="24" style="margin:1px ; cursor: pointer; "></span>'
                  + '</div>' 
				  + '</div>' 
				  + '</div>' 
				  + '</div>' ;

  }
 // frag = frag + '</div>' ;
  $("#entrylist").html(frag) ;

//  $("[id^=header]").css("background-color", "yellow");
  $("[id^=header]").click(function(t) {
//  $(".header").click(function(t) {
	  console.log(t) ;
$(t.target.parentNode).removeClass('unread') ;
	  console.log(t.target.parentNode.parentNode.id) ;
//	  showFeedEntry({ key: t.target.parentNode.parentNode.id })
	  setEntryStatus({ key: t.target.parentNode.parentNode.id, status: 'R' }) ;
$("#content_" + t.target.parentNode.parentNode.id).toggleClass('collapsed') ;
  });
}

function showFeed(params) {

$('.feedtitle').html(params.title) ;
  $.ajax({url: "/api/feedentries",
          type: 'GET',
          contentType: "application/json",
          dataType: "text",
          data : { feed: params.id },
          dataType : 'json',
          context: this,
          success: function(data) {
			         displayFeed(data) ;

          }
  }) ;
}

function populateFeedList() {

  $.ajax({url: "api/folderlist",
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
                       showFeed({ id: t.target.id, title: t.target.innerHTML }) ;
                     }) ;
                   }
  }) ;
}

$(document).ready(function() {
	setupButtons() ;
  populateFeedList() ;
//   $('[data-toggle="tooltip"]').tooltip();   
}) ;
