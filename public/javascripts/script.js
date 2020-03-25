/*
getVideo - v1.0.0
Sameera Damith
damith.sameera1@gmail.com
*/

(function($) {

"use strict";

var app = [];

app.checkUrl = function(check_url) {
  var regexp =  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
	  if (regexp.test(check_url)) {
        return true;
    }
};

$('.error-text, #video-download').hide();

$('#download-button').on('click', function() {
  var url = $('.download-input').val();

  $('.download-view').hide();
  $('.loader-icon-view').show();

//if check valid URL & not empty
if( url !== "" && app.checkUrl(url) === true) {

  $('.error-text').hide();
  $('#video-download').show();


  $('html, body').animate({
    scrollTop: (670)
  }, 1000, "easeInOutExpo");


      $.ajax({
        method: "POST",
        url: "/",
        data: { "url" : url }
      })
      .done(function( data ) {

        $('.download-view').show();
        $('.loader-icon-view').hide();

        //Reset result view
        $('.videoAudioLink, .videoLink, .audioLink').html("");

        app.updateContent( data );
        app.downloadLink( data );
      });

 } else {
   $('.error-text').show();
 }

});


app.updateContent = function( data ) {
  $(".thumb-img").attr( "src", data.player_response.videoDetails.thumbnail.thumbnails[2].url );
  $(".title").text( data.title );

  //Convert sec to min
  var lengthMin = data.length_seconds / 60;

  $(".duration").text( lengthMin.toFixed(2) );
};


app.downloadLink = function( data ) {
  var dataLength = data.formats.length;

  for (var count=0; count < dataLength; count++ ) {

    //Video And Audio Format
    if( data.formats[count].resolution !== null && data.formats[count].audioBitrate !== null) {
      $('.videoAudioLink').append('<tr class="table-light">'
        +'<td>'+ data.formats[count].resolution +'</td>'
        +'<td>'+ (data.formats[count].container).toUpperCase() +'</td>'
        +'<td><a download="'+data.title+'.' +data.formats[count].container+ '" href="'+ data.formats[count].url + '&amp;title=' + encodeURI(data.title) +'"><button type="button" class="btn btn-sm btn-info">Download</button></a></td>'
      +'</tr>');
    }

    //Video Format Only
    if( data.formats[count].resolution !== null && data.formats[count].audioBitrate === null) {
      $('.videoLink').append('<tr class="table-light">'
        +'<td>'+ data.formats[count].resolution +'</td>'
        +'<td>'+ (data.formats[count].container).toUpperCase() +'</td>'
        +'<td><a download="'+data.title+'.' +data.formats[count].container+ '" href="'+ data.formats[count].url + '&amp;title=' + encodeURI(data.title) +'"><button type="button" class="btn btn-sm btn-info">Download</button></a></td>'
      +'</tr>');
    }

    //Audio Format Only
    if( data.formats[count].resolution === null && data.formats[count].audioBitrate !== null) {
      $('.audioLink').append('<tr class="table-light">'
        +'<td>'+ data.formats[count].audioBitrate +'</td>'
        +'<td>'+ (data.formats[count].container).toUpperCase() +'</td>'
        +'<td><a download="'+data.title+'.' +data.formats[count].container+ '" href="'+ data.formats[count].url + '&amp;title=' + encodeURI(data.title) +'"><button type="button" class="btn btn-sm btn-info">Download</button></a></td>'
      +'</tr>');
    }

  }

};

$('.scroll-down').on('click', function() {
  $('#video-download').hide();
  $('html, body').animate({
    scrollTop: (670)
  }, 1000, "easeInOutExpo");
});

// Smooth scrolling using jQuery easing
$('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
  if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

    if (target.length) {
      $('html, body').animate({
        scrollTop: (target.offset().top - 54)
      }, 1000, "easeInOutExpo");
      return false;
    }
  }
});

// Closes responsive menu when a scroll trigger link is clicked
$('.js-scroll-trigger').click(function() {
  $('.navbar-collapse').collapse('hide');
});

// Activate scrollspy to add active class to navbar items on scroll
$('body').scrollspy({
  target: '#mainNav',
  offset: 50
});

})(jQuery);
