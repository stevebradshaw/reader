var currentFeedId, currentFeedTitle ;

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

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

function displayFeed(feed) {

  var frag = '', node ;
  for (var i in feed) {
	  node = feed[i] ;

      // TODO: Use template engine
	  frag = frag + '<div class="entry" uri="' + node.entry_uri + '" id="' + node.entry_key + '">'
                  + '<div class="header ' + node.status + '" id="header">'
                  + '<span class="title">' + node.entry_title + '</span>'
                  + '<span class="pubdate">' + node.publication_date + '</span>'
                  + '</div>'
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

  $("#entrylist").html(frag) ;
  $("[id^=header]").click(function(t) {
      $(t.target.parentNode).removeClass('unread') ;
	  setEntryStatus({ key: t.target.parentNode.parentNode.id, status: 'R' }) ;
      $("#content_" + t.target.parentNode.parentNode.id).toggleClass('collapsed') ;
  });
}

function openMenu(params) {
  console.log(params) ;
// 183Node
var sel = 'li#' + params.id ;
$(".feedSelected").removeClass("feedSelected") ;
$(sel).addClass('feedSelected') ;
$(sel).parent().css('display', '');
showFeed(params) ;
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
					   node = json[idx] ;
                       // TODO: Use template engine
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

console.log(currentFeedId) ;
					openMenu({id: currentFeedId, title: currentFeedTitle}) ;

                   }
  }) ;
}

function subscribeFeed(params) {

  $.ajax({   type: 'post',
            cache: false,
              url: '/api/subscription',
             data: { feed: { id: params.id } },              
          success: function (data) {                                
                     var sel ;
                     for (i in data) {
                       sel = $('[data-category-id="' + data[i].category_id + '"]').children() ;
                       val = $(sel).html() ;
                       if (val > 1) {
                         $(sel).html(val-1) ;
                       } else {
                         $('[data-category-id="' + data[i].category_id + '"]').remove() ;
                       }
                     }
                       // subscribed successfully so:
                       // if category count was > 1, decrease it
                       //    category count = 1, remove the category, remove the results as no suggestions left in :q
                       //
                   }                                                      
  }) ;

}

function showSearchResults(data) {

  var frag = "<table id='suggest-table' data-pagination='true' data-toggle='table'><thead><tr><th>Feed</th><th></th></tr></thead><tbody>" ;
  for (i in data) {
    frag = frag + "<tr data-url-id=" + data[i].id + "'><td><h5><b>" + data[i].title + "</b></h5>" + data[i].url
         + "</td><td id='add-feed' data-url-id='" + data[i].id
         + "' style='vertical-align:middle'><span id='Xadd-feed' data-url-id='"
         + data[i].id + "' class='glyphicon glyphicon-plus' aria-hidden='true'></span></td></tr>" ;
  }
  frag = frag + "</tbody></table>" ;
  $('#search-results').html(frag) ;

  $('#suggest-table').dataTable() ;

  var st = $('#suggest-table').DataTable() ;

  $('#suggest-table').on('click', '#add-feed', function(event) {
    subscribeFeed({id: $(this).data('url-id')}) ;
    st.row( $(this).parent('tr')).remove().draw();
  }) ;
}

function searchByCategory(params) {

  $.ajax({ type:'get',
           cache:false,
         context: this,
             url:"/api/suggestfeeds?category_id=" + params.category_id, 
         success: function(data) {
                    showSearchResults(data) ;
                  }
  });
}

function searchByString(params) {

  $.ajax({ type:'get',
           cache:false,
         context: this,
             url:"/api/suggestfeeds?q=" + params.q, 
         success: function(data) {
                    showSearchResults(data) ;
                  }
  });
}

function setupFolderSelect() {
  $.ajax({url: "/api/userfolders",
          type: 'GET',
          contentType: "application/json",
          context: this,
          success: function(data) {

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];
    
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
    
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
    if (substrRegex.test(str)) {
    matches.push(str);
    }
    });
    
    cb(matches);
    };
    };
    
    
    $('#folder-ta .typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
    },
    {
    name: 'folders',
    source: substringMatcher(data)
    });
    }

  }) ;
}

function showManageFeeds() {
  $.ajax({url: "/api/subscription",
          type: 'GET',
          contentType: "application/json",
          context: this,
          success: function(data) {
                     var selfrag ;
//TODO: Use a template engine
                     var frag = "<table class='table table-striped table-bordered' id='manage-table' data-pagination='true' data-toggle='table'><thead><tr><th></th><th>Title</th><th>Folder</th><th></th></tr></thead><tbody>" ;
                     for (i in data) {
//                       selfrag = '<div id="the-basics"><input class="typeahead" type="text" placeholder="' + data[i].folder_name + '" value="' + data[i].folder_name +'"></div>' ;
//console.log('typeahead: ' + selfrag) ;
                       selfrag = data[i].folder_name ;
                       frag = frag + "<tr data-url-id=" + data[i].feed_id + "><td>" + data[i].feed_id
                            + "</td><td>" + data[i].feed_title + "</td><td>" + selfrag + "</td><td>"
                            + "<button id='edit-feed' class='btn btn-sm btn-primary'><span class='glyphicon glyphicon-pencil'></span></button>&nbsp;"
                            + "<button id='delete-feed' class='btn btn-sm btn-danger' data-toggle='modal' data-target='#confirm-modal'><span class='glyphicon glyphicon-trash'></span></button>"
                            + "</td></tr>" ;
                     }
                     frag = frag + "</tbody></table>" ;

//                     $("#manage-list").html(frag) ;
                     $("#managefeeds").html(frag) ;
                     $('.selectpicker').selectpicker();



                     $('#manage-table').dataTable({"aoColumns": [ { //"targets": [ 0 ],
                                                                      "visible": false },
                                                                    {},//feed title
                                                                    {},//folder
					                     						   {},
                                                                  ],
                                                     "aaSorting": [[1,'asc']]
                       }) ; 

                     $('[id^=delete-feed]').click(function(e) {
var tr = $(this).parent().parent()[0] ;
console.log('delete subscription: ' + $(tr).data('url-id')) ;
					 }) ;

                     $('[id^=edit-feed]').click(function(e) {
var tr = $(this).parent().parent()[0] ;

console.log(tr) ;
console.log($(tr).data('url-id')) ;
console.log($(tr)[0].childNodes[0].textContent) ;
console.log($(tr)[0].childNodes[1].textContent) ;

$('#edit-url-id').val($(tr).data('url-id')) ;
$('#feedTitle').val($(tr)[0].childNodes[0].textContent) ;
$('#folder-ta').html('<input id="feedFolder" class="typeahead" type="text" placeholder="Folder">') ;
$('#feedFolder').val($(tr)[0].childNodes[1].textContent) ;
setupFolderSelect() ;
$('#modal-edit-feed').modal('show') ;
                                                }) ; 
                }
  }) ;
}

function refreshFeedList() {
  // TODO:  refresh feeds, redisplay etc

  populateFeedList() ;
}

$(document).ready(function() {
  setupButtons() ;
  populateFeedList() ;

  $("#suggest-feeds").click(function(e) {
    e.preventDefault() ;

    $("#search-results").html("") ;

    $.ajax({url: "/api/category",
            type: 'GET',
            contentType: "application/json",
            context: this,
            success: function(data) {
              
              var frag = "" ;
              for (i in data) {
                frag = frag + "<button class='btn btn-sm' id='category-btn' data-category='" + data[i].category + "' data-category-id='" + data[i].id + "' style='margin:4px' type='button'>" + data[i].category + "&nbsp;&nbsp;<span class='badge'>" + data[i].number + "</span></button>" ;
              }
              $("#category-panel").html(frag) ;
              $("[id^='category-btn']").click(function(e) {

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

$("#manage-feeds").click(function(e) {
  e.preventDefault() ;

  if (endsWith($(this).html(), "Manage Feeds")) {
    // Show manage feeds page, change button to say 'View Feeds'
    $(this).html('<span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>&nbsp;&nbsp;View Feeds') ;
    showManageFeeds() ;
    $('#managefeeds').show() ;
    $('#feedcontents').hide() ;
  } else {
    // Show the view feeds page and change button to say 'Manage Feeds'
    $(this).html('<span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>&nbsp;&nbsp;Manage Feeds') ;
    refreshFeedList() ;
//	openMenu({id: currentFeedId, title: currentFeedTitle}) ;

    $('#managefeeds').hide() ;
    $('#feedcontents').show() ;
  }

}) ;

$("#suggest-search").click(function(e) {
  e.preventDefault() ;
  searchByString({q: $("#q").val()}) ;
}) ;

$("#save-edit-feed").click(function(e) {

  var url_id = $('#edit-url-id').val()
    , feed_title = $('#feedTitle').val()
    , folder_name = $('#feedFolder').val()
    , sel = '*[data-url-id="' + url_id + '"]';

  $(sel).children().eq(0).html(feed_title);
  $(sel).children().eq(1).html(folder_name);
  //update title in the folder list, just incase it is visible to the user
  $('li#' + url_id + '.feed').html(feed_title) ;
  $('#modal-edit-feed').modal('hide'); 

  var json = '[{"feed_id":' + url_id + ', "feed_title":"' + feed_title + '","folder_name":"' + folder_name + '"} ]' ;

  $.ajax({url: "/api/subscription",
          type: 'PUT',
          contentType: "application/json",
          context: this,
          data: json,
          success: function(data) {
			  console.log(data) ;
              // TODO:  Update source fields in manage feeds table
          }
  }) ;
}) ;

  // add on-show confirm dialog handler

        $('#confirm-modal').on('show.bs.modal', function(e) {
            $(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
            
            $('#confirm-body').html('<strong>Are you sure?</strong>');
            $('#confirm-title').html('Confirm Delete') ;
$('#confirm-ok').text('Delete') ;
$('#confirm-cancel').text('Cancel') ;
        });
}) ;
