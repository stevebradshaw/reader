var currentFeedId, currentFeedTitle ;

var cache = [] ;

function populateCache(params) {
  //
  // Parameters
  //
  // params.key - the cache key to populate
  // params.url - url to load into the cache
  //
  // TODO
  //
  // params.defer - whether to load immediately or wait until the cache entry is requested. May be
  //                performance implications of defering the load of a resource
  // params.ttl - how long (in seconds) should the entry remain in the cache
  //
  // Debug logging of cache operations
  //

  var ttl = typeof params.ttl !== 'undefined' ? params.ttl : 0 ;

  var node = { url: params.url, data: '', ttl: ttl } ;

  $.get( params.url , function( data ) {
    node.data = data ; 
   cache[params.key] = node ; //{ /*url: params.url, */data: data } ;
  });

}

function loadCache(params) {
  $.get( params.url , function( data ) {
    cache[params.key].data = data ; // = node ; //{ /*url: params.url, */data: data } ;
  });
}

function getCacheEntry(params) {
  return cache[params.key].data ;
}

populateCache({ key: "suggest", url: "templates/suggest.tmpl"}) ;
populateCache({ key: "feedentries", url: "templates/feed-entries.tmpl"}) ;
populateCache({ key: "folderlist", url: "templates/folderlist.tmpl"}) ;
populateCache({ key: "searchresults", url: "templates/searchresults.tmpl"}) ;
populateCache({ key: "managefeeds", url: "templates/managefeeds.tmpl"}) ;

console.log(cache) ;
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
  var template = getCacheEntry({ key: "feedentries"})  ;

  $("#entrylist").html(Mustache.render(template, feed)) ;
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
					 template = getCacheEntry({ key: 'folderlist'}) ;

                     $("#accordion").html(Mustache.render(template, json)) ;

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
console.log(data) ;
                     // subscribed successfully so:
                     // if category count was > 1, decrease it
                     //    category count = 1, remove the category, remove the results as no suggestions left in :q
                     //
					 toastr.success('You are now subscribed to <b>' + data[0].feed_title + '</b>', 'Subscription Successful!') ;
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
                   }                                                      
  }) ;

}

function showSearchResults(data) {

  var template = getCacheEntry({ key: 'searchresults' }) ;

  $('#search-results').html(Mustache.render(template, data)) ;

  $('#suggest-table').dataTable({ "pageLength": 50 }) ;


  $('#suggest-table').on('click', '.search-result', function(event) {
  //$('#suggest-table').on('click', '#add-feed', function(event) {
console.log('add feed - ' + $(this).data('url-id')) ;
console.log($(this)) ;
    // TODO: Pop up dialog and ask for folder.  When added, auto-update the menu 
    subscribeFeed({id: $(this).data('url-id')}) ;
    var st = $('#suggest-table').DataTable() ;
    st.row( $(this)).remove().draw();
    //st.row( $(this).parent('tr')).remove().draw();
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

function editFeed(that) {
  var tr = $(that).parent().parent()[0] ;
console.log(tr) ;

console.log('url-id = ' + $(tr).data('url-id')) ;
console.log($(tr)[0].childNodes) ; //.childNodes[0].textContent) ;
console.log($(tr)[0].childNodes[2].textContent) ; //.childNodes[0].textContent) ;
console.log($(tr)[0].childNodes[4].textContent) ; //.childNodes[0].textContent) ;
  $('#edit-url-id').val($(tr).data('url-id')) ;
  $('#feedTitle').val($(tr)[0].childNodes[2].textContent) ;
  $('#folder-ta').html('<input id="feedFolder" class="typeahead" type="text" placeholder="Folder">') ;
  $('#feedFolder').val($(tr)[0].childNodes[4].textContent) ;
  setupFolderSelect() ;
  $('#modal-edit-feed').modal('show') ;
}

function showManageFeeds() {
  $.ajax({url: "/api/subscription",
          type: 'GET',
          contentType: "application/json",
          context: this,
          success: function(data) {

var template = getCacheEntry({ key: 'managefeeds' }) ;

                     $("#managefeeds").html(Mustache.render(template, data)) ;
                     $('.selectpicker').selectpicker();

                     $('#manage-table').dataTable({"aoColumns": [ { //"targets": [ 0 ],
                                                                      "visible": false },
                                                                    {},//feed title
                                                                    {},//folder
					                     						   {},
                                                                  ],
                                                     "aaSorting": [[1,'asc']]
                       }) ; 


/*                     $('[id^=XXedit-feed]').click(function(e) {
alert('edit feed') ;
console.log(this) ;
                                                  editFeed(this) ;
                                                }) ; */
                }
  }) ;
}

function refreshFeedList() {
  // TODO:  refresh feeds, redisplay etc

  populateFeedList() ;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
function setupToolBarButtons() {
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

  $("#settings").click(function(e) {
    e.preventDefault() ;
  }) ;
}
////////////////////////////////////////////////////////////////////////////////////////////////////
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
              var template = getCacheEntry({ key: 'suggest'}) ; //cache['suggest'] ;

              $("#category-panel").html(Mustache.render(template, data)) ;
              $("[id^='category-btn']").click(function(e) {

                $(e.target).toggleClass('btn-success') ;
				console.log('---------------------------------------------------------------') ;
				$("[id^='category-btn'].btn-success").each(function(index) {
console.log($(this).data('category-id')) ;
                }) ;
				console.log('---------------------------------------------------------------') ;
                searchByCategory({category_id: $(this).data('category-id')}) ;
              }) ;
            }
    }) ;

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

  // add on-show confirm dialog handler

  $('#modal-edit-feed').on('show.bs.modal', function(e) {
    $('#edit-url-id').val($(e.relatedTarget).data('url-id')) ;
    $('#feedTitle').val($(e.relatedTarget).data('feed-title')) ;
    $('#folder-ta').html('<input id="feedFolder" class="typeahead" type="text" placeholder="Folder">') ;
    setupFolderSelect() ;
    $('#feedFolder').val($(e.relatedTarget).data('folder-name')) ;
    $("#save-edit-feed").unbind('click').click(function(e) {

  var url_id = $('#edit-url-id').val()
    , feed_title = $('#feedTitle').val()
    , folder_name = $('#feedFolder').val()
    , sel = '*[data-url-id="' + url_id + '"]';

//  $(sel).children().eq(0).html(feed_title);
//  $(sel).children().eq(1).html(folder_name);
//  //update title in the folder list, just incase it is visible to the user
//  $('li#' + url_id + '.feed').html(feed_title) ;
  $('#modal-edit-feed').modal('hide'); 

  var json = '[{"feed_id":' + url_id + ', "feed_title":"' + feed_title + '","folder_name":"' + folder_name + '"} ]' ;
console.log('PUT /api/subscription') ;
console.log(json) ;
  $.ajax({url: "/api/subscription",
          type: 'PUT',
          contentType: "application/json",
          context: this,
          data: json,
          success: function(data) {
console.log('update success') ;
			  console.log(data) ;
console.log(json) ;
if ($("[id^=folder_]").filter(function() { return $(this).text() === "Oracle TechX" ; }).length === 0 ) {
  console.log('that was a new folder so add it to the menu etc') ;
} else {
  console.log('existing tree so do different stuff') ;
}

/*  var url_id = $('#edit-url-id').val()
    , feed_title = $('#feedTitle').val()
    , folder_name = $('#feedFolder').val()
    , sel = '*[data-url-id="' + url_id + '"]';*/
  $(sel).children().eq(0).html(feed_title);
  $(sel).children().eq(1).html(folder_name);
  //update title in the folder list, just incase it is visible to the user
  $('li#' + url_id + '.feed').html(feed_title) ;
  // if folder has changed, move feed in folder list
//  $('li#' + url_id + '.feed').remove() ;
  $("[id^=feeds][data-folder-name='" + folder_name + "']").append($('li#' + url_id + '.feed')) ;
  // TODO: Now sort the nodes as the moved node may be in the wrong place!
  var arr = $("[id^=feeds][data-folder-name='" + folder_name + "']").children() ; // $("[data-folder-name='Uncategorised']").children() ;
  arr.sort(function(a,b) {
	 
    var x = $(a).html(), y = $(b).html() ;
    return x.localeCompare(y); 
	 
  }) ;

  $("[id^=feeds][data-folder-name='" + folder_name + "']").html(arr) ;
  
  // Update data-feed-title and data-folder-name on buttons
  $('*[data-url-id="' + url_id + '"]:nth-child(1)').data('feed-title', feed_title) ;
  $('*[data-url-id="' + url_id + '"]:nth-child(1)').data('folder-name', folder_name) ;
  $('*[data-url-id="' + url_id + '"]:nth-child(2)').data('feed-title', feed_title) ;

  
          }
  }) ;

    }) ;
  }) ;

  $('#confirm-modal').on('show.bs.modal', function(e) {
 
    var feedTitle = $(e.relatedTarget).data('feed-title'),
        urlID = $(e.relatedTarget).data('url-id');

    $('#confirm-body').html('Are you sure you want to unsubscribe from <strong>' + feedTitle + '</strong>?<br/><br/>You an subscribe again, but you will lose any previous interactions with the feed.');
    $('#confirm-title').html('Confirm Unsubscribe') ;
    $('#confirm-ok').text('Unsubscribe') ;
    $('#confirm-cancel').text('Cancel') ;
    $('#confirm-ok').unbind('click').click(function() { 

                             var json = '{ "feed": {"feed_id":' + urlID + ', "feed_title":"' + feedTitle + '"}}' ;
                             $.ajax({ url: "/api/subscription",
                                      type: 'DELETE',
                                      contentType: "application/json",
                                      context: this,
                                      data: json,
                                      success: function(data) {
                         			             // TODO: if successful, remove feed from the manage feeds table, and from the feed menu on the left
console.log('remove li#' + urlID) ;
                         						 $('li#' + urlID + '.feed').remove() ;
var row = $(sel = '*[data-url-id="' + urlID + '"]') ;
var st = $('#manage-table').DataTable() ;
st.row( row.remove().draw());

                                               }  
                         
                                   }) ;
                             $('#confirm-modal').modal('hide');
    });

//  $('#edit-modal').on('show.bs.modal', function(e) {
	  
	  
  }) ;

}) ;
