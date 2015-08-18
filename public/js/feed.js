var currentFeedId, currentFeedTitle ;

function setupButtons() {
  $("#btn-feed-status").click(function(t) {
    if ($(t.target).text() == "View: Unread") {
      $(t.target).text("View: Read") ;
    } else if ($(t.target).text() == "View: Read"){
      $(t.target).text("View: All") ;
    } else {
      $(t.target).text("View: Unread") ;
    }

    showFeed({ id: currentFeedId, title: currentFeedTitle}) ;
  }) ;

  $("#btn-refresh-feed").click(function(t) {
    showFeed({ id: currentFeedId, title: currentFeedTitle}) ;
  }) ;

  $("#btn-mark-all-read").click(function(t) {
    setFeedStatus({ id: currentFeedId, status: 'R' }) ;
  }) ;
}

function setFeedStatus(params) {

  $.ajax({url: "/api/entry?feedid=" + params.id + "&status=" + params.status,
          type: 'PUT',
          contentType: "application/json",
          context: this,
          success: function(data) {
			  console.log(data) ;
          }
  }) ;

}

function setEntryStatus(params) {

  $.ajax({url: "/api/entry?key=" + params.key + "&status=" + params.status,
          type: 'PUT',
          contentType: "application/json",
          context: this,
          success: function(data) {
			  console.log(data) ;
          }
  }) ;

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

  currentFeedId = params.id ;
  currentFeedTitle = params.title ;

  $('.feedtitle').html(params.title) ;

  var status = 'A' ;

  if ($("#btn-feed-status").text() == 'View: Unread') {
	status = 'U' ;
  } else if ($("#btn-feed-status").text() == 'View: Read') {
	status = 'R' ;
  } else {
    status = 'A' ;
  }

  $.ajax({url: "/api/feedentries",
          type: 'GET',
          contentType: "application/json",
          dataType: "text",
          data : { feed: params.id, status: status },
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

function clickSuggestionCell(params) {
  if (params.field=='add') {

    console.log($(params.value).data('url-id')) ;// $resulyypt.text('Event: onClickRow, data: ' + JSON.stringify(row));

    $.ajax({   type: 'post',
              cache: false,
                url: '/api/subscribe',
               data: { feed: { id: $(params.value).data('url-id')} },              
            success: function (data) {                                
var sel ;
                       for (i in data) {
//console.log(data[i]) ;
//console.log($('[data-category-id="' + data[i].category_id + '"]')) ;
sel = $('[data-category-id="' + data[i].category_id + '"]').children() ;
val = $(sel).html() ;
if (val > 1) {
  $(sel).html(val-1) ;
} else {
console.log('remove badge') ;
$('[data-category-id="' + data[i].category_id + '"]').remove() ;
}
//console.log($(sel).html()-) ;
//console.log($('[data-category-id="' + data[i].category_id + '"]').children().html(666)) ;
                       }
                       // subscribed successfully so:
                       // if category count was > 1, decrease it
                       //    category count = 1, remove the category, remove the results as no suggestions left in :q
                       //
                     }                                                      
    }) ;
  }
}

function searchByCategory(params) {
/*  var suggestID = [] ;
  $("[id^='category-btn'].btn-success").each(function(b) {
    suggestID.push($(this).data('category-id')) ;
  }) ;*/

  $.ajax({ type:'get',
           cache:false,
         context: this,
             url:"/api/suggestfeeds?category_id=" + params.category_id, 
//            data:{jObject:  suggestID},
         success: function(data) {

                    var frag = "<table id='suggest-table' data-pagination='true' data-toggle='table'><thead><tr><th>Feed</th><th></th></tr></thead><tbody>" ;
                    for (i in data) {
                      frag = frag + "<tr><td><h5>" + data[i].title + "</h5>" + data[i].url
                                  + "</td><td id='add-feed' data-url-id='" + data[i].id
                                  + "' style='vertical-align:middle'><span id='add-feed' data-url-id='"
                                  + data[i].id + "' class='glyphicon glyphicon-plus' aria-hidden='true'></span></td></tr>" ;
                    }
                    frag = frag + "</tbody></table>" ;
                    $('#search-results').html(frag) ;

                    $('#suggest-table').bootstrapTable({ pageSize: 5, 
                                                         search: true,
                                                         onClickCell: function (field,value,row,element) {
                                                                        clickSuggestionCell({  field: field,
                                                                                               value: value,
                                                                                                 row: row,
                                                                                             element: element}) ;
console.log($(this)) ;
$(this).parent('tr').remove() ;
                                                                      }, 
/* function (field,value,row,element) {
                                                                        if (field=='add') {

                   console.log($(value).data('url-id')) ;// $resulyypt.text('Event: onClickRow, data: ' + JSON.stringify(row));

$.ajax({   type: 'post',
          cache: false,
            url: '/api/subscribe',
           data: { feed: { id: $(value).data('url-id')} },
        success: function (data) {
                 }
       }) ;
                                                                        }
                                                       },*/
                                                        columns: [ {field: 'info', sortable:true},
                                                                   {field: 'add', valign:'middle', align: 'center'}]}) ;
                  }
  });
}

$(document).ready(function() {
  setupButtons() ;
  populateFeedList() ;
//   $('[data-toggle="tooltip"]').tooltip();   
//
$("#suggest-feeds").click(function(e) {
  e.preventDefault() ;

  $("#search-results").html("") ;
  $.ajax({url: "/api/category",
          type: 'GET',
          contentType: "application/json",
          context: this,
          success: function(data) {
              console.log(data) ;
              var frag = "" ;
              for (i in data) {
                console.log(data[i]) ;
                frag = frag + "<button class='btn btn-sm' id='category-btn' data-category='" + data[i].category + "' data-category-id='" + data[i].id + "' style='margin:4px' type='button'>" + data[i].category + "&nbsp;&nbsp;<span class='badge'>" + data[i].number + "</span></button>" ;
              }
              $("#category-panel").html(frag) ;
              $("[id^='category-btn']").click(function(e) {
//                $(e.target).toggleClass('btn-success') ;

              $("[id^='category-btn']").removeClass('btn-success') ; 
                $(e.target).addClass('btn-success') ;
  searchByCategory({category_id: $(this).data('category-id')}) ;
              }) ;
          }
  }) ;

}) ;

$("#settings").click(function(e) {
  e.preventDefault() ;
}) ;

$("#add-feed").click(function(e) {
  e.preventDefault() ;
}) ;

$("#suggest-search").click(function(e) {
  e.preventDefault() ;

}) ;

}) ;

