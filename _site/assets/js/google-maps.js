/**
/*	Google Maps API
/*
/*
/*=========================================================*/





/*======================================================================
 1.0 Fullwidth Google Maps Custom Header
========================================================================*/
;(function ($) {

 	"use strict";

 	var body        = $('body'),
 	mapType         = body.data( 'fwmap' );

 	/**
 		Sidebar Widget Googlemaps 
 	*/
 	function sidebar_map(){}

 	/**
 		Fullwidth Googlemaps Custom Header
 	*/
 	function fullwidth_googlemaps(){

 		var mapTitle        = "101 West Street, New York",
	 	mapShowControls     = "true",
	 	dataLat             = "40.711046",
	 	dataLng             = "-74.014716",
	 	dataZoom            = "10",
	 	dataType            = "terrain"; // 'roadmap', 'satellite',  'hybrid' , 'terrain' 
	        

 		body.addClass('fullwidth-map');
 		$('<div id="map-canvas" data-type="'+dataType+'" data-title="'+mapTitle+'" data-showcontrols="'+mapShowControls+'" data-lat="'+dataLat+'" data-lng="'+dataLng+'" data-zoom="'+dataZoom+'"></div>').prependTo('#custom-header');
 		$('#tagline').hide();
 		$('#location').remove();
 	}

 	/* Show Fullwidth Google Maps custom header */
 	if ( mapType == 'show' && mapType != '' ) {
 		fullwidth_googlemaps();
 	}else{
 		sidebar_map();
 	}

}(jQuery));


if( typeof google != 'undefined' ){

	function initialize(){


	// Info Window 
	// config your own address details here
	var contentString = '<div id="company-address">'+
	'<p>'+
	'101 West Street, '+
	'<br>'+
	'New York, <br>'+
	'NY 12345'+
	'</p>'+
	'</div>';
	

	var  mapCanvas   = document.getElementById('map-canvas'),

	// 'Getting' HTML5 data-attributes using dataset	
	datatitle    =  mapCanvas.getAttribute('data-title') || '101 West Street, New York',
	dataControls =  mapCanvas.getAttribute('data-showcontrols'),
	dataLat 	 =  mapCanvas.getAttribute('data-lat'),
	dataLng      =  mapCanvas.getAttribute('data-lng'),
	dataZoom     = parseInt( mapCanvas.getAttribute('data-zoom') || 5),
	dataposition = document.body.getAttribute('data-fwmap'),
	dataType     = mapCanvas.getAttribute('data-type'),
	zcSize, 
	zcPos,
	mtStyle, 
	mtPos;

	switch( dataposition ){
		case 'show':
			zcSize  = google.maps.ZoomControlStyle.LARGE;
			zcPos   = google.maps.ControlPosition.LEFT_CENTER;
			mtStyle = google.maps.MapTypeControlStyle.HORIZONTAL_BAR;
			mtPos   = google.maps.ControlPosition.RIGHT_CENTER;
		break;
		default:
			zcSize = google.maps.ZoomControlStyle.SMALL;
			zcPos  = google.maps.ControlPosition.LEFT_TOP;
			mtStyle = google.maps.MapTypeControlStyle.DROPDOWN_MENU;
			mtPos   = google.maps.ControlPosition.RIGHT_TOP;
		break;
	}

	switch(dataType ){
		case 'satellite':
			google.maps.MapTypeId.SATELLITE // displays Google Earth satellite images 
		break;
		case 'hybrid': 
			google.maps.MapTypeId.HYBRID // displays a mixture of normal and satellite views
		break;
		case 'terrain': 
			google.maps.MapTypeId.TERRAIN // displays a physical map based on terrain information.
		break;
		default:
			google.maps.MapTypeId.ROADMAP  // displays the default road map view. This is the default map type.
		break;
	}

	
	var latlng = new google.maps.LatLng( dataLat, dataLng );
  		
	var mapOptions = {
	  	zoom: dataZoom,
	  	zoomControlOptions: {
        	style: zcSize,
       		position: zcPos  // BOTTOM_CENTER, LEFT_CENTER
    	},
	  	visible: true,
	  	center: latlng, // Set center from the specified lat and lng
	    mapTypeControl: true,
	    disableDefaultUI: dataControls,
	  	scrollwheel: false,
	  	paneControl: true,
	    mapTypeControlOptions: {
        	style: mtStyle,
        	position: mtPos
   		},
	    zoomControl: true,
	    mapTypeControl: true,
	    scaleControl: true,
	    streetViewControl: true,
	    overviewMapControl: true,
	    rotateControl: true,
	  	mapTypeId: dataType
	  };


	// Init
	var contactLocation = new google.maps.Map( mapCanvas , mapOptions);
	
	// Info Options
	var infoOpts = {
    	content : contentString,
    	disableAutoPan: false,
    	maxWidth: 0,
    	boxStyle: { 
        	background: "url('tipbox.gif') no-repeat",
        	opacity: 0.75,
        	width: "100px"
    	}
	}
	// Initialize infowindow
	var infowindow = new google.maps.InfoWindow(infoOpts);

	// Add a icon marker
	var marker = new google.maps.Marker({
      position: latlng,
      map: contactLocation,
      title: datatitle
  	});

	// Click Event
  	google.maps.event.addListener(marker, 'click', function() {
    	infowindow.open(contactLocation,marker);
  	});
	
  }
  // Initialize Google Maps API
  google.maps.event.addDomListener(window, 'load', initialize);
 }


