if( typeof $ == 'undefined' ){
	var $ = jQuery;
}


if (!("ontouchstart" in document.documentElement)){ 
    document.documentElement.className += " no-touch"; 
}

// ipad and iphone hover fix
// Ref: http://blog.0100.tv/2010/05/fixing-the-hover-event-on-the-ipadiphoneipod/
if((navigator.userAgent.match(/iPhone/i)) 
	|| (navigator.userAgent.match(/iPod/i)) 
	|| (navigator.userAgent.match(/iPad/i))) 
{
    $(".portfolio-4-columns a .overlay").on('click', function(){
        //we just need to attach a click event listener to provoke iPhone/iPod/iPad's hover event
        //strange

    });
    $(".portfolio-4-columns a .overlay").on('touchend', function(){
        console.log("touch ended");
    });
}




/*=====================================================================================
 Supports Retina
=======================================================================================*/
var supports = {
	init: function(){
		var browser, 
		classList, 
		os, 
		platform, 
		retina;

	    retina = window.devicePixelRatio > 1 ? "retina" : "no-retina";
	    platform = window.navigator.userAgent;
	    if (/Chrome/.test(platform)) {
	      browser = "chrome";
	    } else if (/Firefox/.test(platform)) {
	      browser = "firefox";
	    }else {
	      browser = "unknown-browser";
	    }
	    if (/Mac/.test(platform)) {
	      os = "mac";
	    } else if (/Windows/.test(platform)) {
	      os = "windows";
	    } else {
	      os = "unknown-os";
	    }
	    classList = os + " " + browser + " " + retina;
	    $("body").addClass(classList);
	    return false;
	}
};




/*=============================================================================================
 Ajax Loader
===============================================================================================*/
var Loader = {
	config: {
		'small' :{
			lines: 8, // The number of lines to draw
			length : 2,  // The length of each line
			width: 2, // The line thickness
			radius: 3 // The radius of the inner circle
		},
		'large' :{
			lines: 10, // The number of lines to draw
			length: 7, // The length of each line
			width: 3, // The line thickness
			radius: 10  // The radius of the inner circle
		}, 
		'custom' : {
			lines : 10, // The number of lines to draw
			length: 7, // The length of each line
			width: 3, // The line thickness
			radius: 10,   // The radius of the inner circle
			corners: 1.0, // 
			rotate: 22, // The rotation offset
			color: '#fff', // #rgb or #rrggbb
			speed: 1, // Rounds per second
			trail: 60, // Afterglow percentage
			shadow: false, // Whether to render a shadow
			hwaccel: false // Whether to use hardware acceleration
		}
	},
	init: function(){},
	// Show loader
	Show: function( opts, color ){
		if( Spinner ){
			if(opts !== false){
				if(typeof(opts) === 'string'){
					opts = ( opts in Loader.config ) ?  opts = Loader.config[opts] : opts = {};
				}
			}
			// Check if color exists
			if(color != null){
				opts.color = color;
			}
			// Initailize Spinner
			var spinner = new Spinner( 
				$.extend({ 
					color: color 
				}, opts ) 	
			).spin();

			var target = $('#loading');
				target.append(spinner.el);
			
		}else{
			try{
				"Spinner class not available.";
			} catch(Exception){}
		}

	},
	// Hide loader
	Hide: function(){}
};



/*=====================================================================================
 Hide and Show Homepage Blocks
 usage: data-block="show" | data-block="hide"
 wrapper container e.g. services wrapper
=======================================================================================*/
sectionBlocks = {
	/* param elem is the div ID e.g. services */
	init: function( elem ){

		$.each(['show', 'hide'], function (i, ev) {
	        var el = $.fn[ev];
	        $.fn[ev] = function () {
	          this.trigger(ev);
	          return el.apply(this, arguments);
	        };
	    });

	    $(elem).each( function(){
	    	var self 	  = $(this);
	    	var dataBlock = self.data('block');
		
	    	if ('show' == dataBlock && dataBlock != null ) {
				self.on('show', sectionBlocks.showBlock( self ) );
	    	}else if( 'hide' == dataBlock && dataBlock != null ){
				self.on('hide', sectionBlocks.hideBlock( self ) );
			}else{
				self.on('show', sectionBlocks.showBlock( self ) );
			}
	    });
	
	},
	showBlock : function( param ){
		param.show();
	},
	hideBlock : function( param ){
		param.hide();
	}
};




/*===============================================================================================
/*	Contact Form Placeholder Text 
/*  Form Validation
=================================================================================================*/
var contactForm = {
	init: function(){

		var triggerForm = this;

		// Placeholders for input/textarea
    	triggerForm.placeholderText();
    	// Form Validation
    	triggerForm.formValidation();

	},
	placeholderText : function(){
		$("input, textarea").placeholder();
	},
	formValidation: function()
	{
		// validate the contact form when it is submitted
		$('#contactForm').validate({
			rules: {
				name: {
	               minlength: 3,
	               required: true
                },
				email: {
				   required: true,
				   email: true
				},
				subject: {
		           minlength: 3,
		           required: true
		        },
		        message: {
		           minlength: 20,
		           required: true
		        }
			},
			submitHandler: function( response ) {
				
				Loader.Show('large', '#303030');
				contactForm.processForm();

			},
			errorPlacement: function(error, element) {
				error.insertBefore( element );
			}
		});
	},
	processForm: function(event){
		
		var contactForm  = $('#contactForm');
		var formMethod   = contactForm.attr('method');
		var formAction   = contactForm.attr('action');
		var nameVal      = $('#name').val();
		var	emailVal     = $('#email').val();
		var	subjectVal   = $('#subject').val();
		var messageVal   = $('#message').val();

		$.ajax({
			url: formAction,
			type: formMethod,
			data:{
				name: nameVal,
				email: emailVal,
				subject: subjectVal,
				message: messageVal
			},
			success:function(response, textStatus)
			{

				$('#notice').html(response);

				// if ok output success message
				if(response.match('success') != null)
				$('#contactForm').slideUp('slow');
				$('html, body').animate({
					scrollTop: 0
				});
				
			}
		});
		return false;
	}
};




/*=================================================================================================
	Responsive Tabs Accordion Menu
===================================================================================================*/
var responsiveTabs = {
	init: function(){
		$('#horizontalTab').easyResponsiveTabs({
            type: 'default', //Types: default, vertical, accordion           
            width: 'auto', //auto or any width like 600px
            fit: true   // 100% fit in a container
        });
	}
};




/*===========================================================================================
	Responsive Accordion Menu
=============================================================================================*/
var responsiveAccordion = {
	init: function(){
		 $('#accordion').easyResponsiveTabs({
            type: 'accordion', //Types: default, vertical, accordion           
            width: 'auto', //auto or any width like 600px
            fit: true,   // 100% fit in a container
            closed: 'accordion', // Start closed if in accordion view
            activate: function(event) { // Callback function if tab is switched
			}
        });
    }
};




/*=================================================================================
	JQuery Filter & Sort Plugin
===================================================================================*/
var portfolioFilter = {
	init: function(){
		if(typeof jQuery().mixitup === "function"){
			$('#portfolio-filter').mixitup({
				//effects: ["fade", "rotateX"],
				transitionSpeed: 400
			});
		}
	}
};





/*===============================================================================================
  Animate Header on Scroll
=================================================================================================*/
var animateHeader = {
	init: function(){
		var anim = this;
		anim.docElem = document.documentElement;
		anim.siteElem = $('.site-header');
    	anim.didScroll = false;
		anim.changeHeaderOn = 100;
		anim.triggerScroll(anim);
	},
	triggerScroll: function(anim){
		/*window.addEventListener('scroll', animateHeader.addEvent, false);*/
		
		if ( window.addEventListener ) {
		  window.addEventListener('scroll', animateHeader.addEvent, false); 
		} else if (window.attachEvent)  {
		  window.attachEvent('onscroll', animateHeader.addEvent, false);
		}
		
	},
	addEvent: function(){
		if(!animateHeader.didScroll)
		{
			animateHeader.didScroll = true;
			setTimeout( animateHeader.initScroll, 100 );
		}
	},
	initScroll: function(){
		var vertScroll = animateHeader.setScrollY();
		
		if( vertScroll >= animateHeader.changeHeaderOn 
			&& $(window).width() >= 899 )
		{
			animateHeader.siteElem.addClass('shrink');
		}else{
			animateHeader.siteElem.removeClass('shrink');
		}
		animateHeader.didScroll = false;
	},
	setScrollY: function(){
		return window.pageYOffset || animateHeader.docElem.scrollTop;
	}
};





/*===========================================================================================
 Scroll To Top Link
=============================================================================================*/
var scrollEvent ={
 	init: function(){
 		$('#scroll-top').on('click', scrollEvent.scrollUp);	
 	},
 	scrollUp: function(e){
    	e.preventDefault();

    	$('html, body').animate(
    		{ scrollTop: 0
    		}, 600);

    	return false;
    }
 };






/*============================================================================================
	Flexslider for Blog posts
==============================================================================================*/
var blogSlider = {
	init: function(){
		var s = this;
		s.sliderContainer =  $('.slider-container');
		s.sliderContainer.each( function(){
			var self = $(this),

				postId = self.attr('data-id');
				self.flexslider({
					animation: "slide",
					pauseOnAction: true,
	                controlNav: false,
	                directionNav: true,
	                reverse: false, 
	                prevText: "", 
		 			nextText: "", 
	                animationLoop: false,
	                smoothHeight: true,
	                slideshow: false,
	                keyboard: true,
	                controlsContainer : ".slider-container"
				});
		});
		
	}
};





/*===============================================================================================
	Flexslider for Portfolio 
=================================================================================================*/
var portfolioSlider = {
	options : {
		animation: "slide",
		controlNav: true,
	    directionNav: false,
	    reverse: false, 
	    animationLoop: false,
	    slideshow: false,
	    keyboard: true,
	    touch: true,
	    controlsContainer : ".slider-container"
	},
	init: function(){
		var p = this;
			p.sliderContainer = $('.slider-container');
			p.sliderContainer.flexslider(p.options);
	}
};




/*================================================================================================
 jPlayer Plugin 
==================================================================================================*/
var jplayer_init = {
	init: function(){
		var media = this;
			media.audioPlayer();
			//console.log(media);
	},
	audioPlayer: function(){
		var audio = this;
			audio.el = $('.format-audio');

			if(audio.el != null){
				audio.el.each( function(){
					var self = $(this);

					// Initailize jPlayer Audio
					self.find('.jp-player').each(function(){
						var post_id  = $(this).data('id'),
							dataSrc  = $(this).data('src');
				
					if( $().jPlayer ){
						$("#jquery-jplayer-audio-"+post_id).jPlayer({
							ready: function(){
								$(this).jPlayer("setMedia", {
									mp3: dataSrc,
									end: ""
								});
							},
							play: function() { // To avoid both jPlayers playing together.
								$(this).jPlayer("pauseOthers");
							},
							swfPath: "assets/js",
							cssSelectorAncestor: "#jp-audio-interface-"+post_id,
							supplied: "mp3"
						});
					} 
				  });
			   });
			}
	},
	videoPlayer: function(){
		// Video jPlayer for posts
	}
};





/*=================================================================================================
  Headroom Sticky Navigation
===================================================================================================*/
var stickyNavigation = {
	init: function(){
		var opts = {
			// vertical offset in px before element is first unpinned
		    offset : 50,
		    // scroll tolerance in px before state changes
		    tolerance : 0,
		    // css classes to apply
		    classes: {
		    	// when element is initialised
		        initial : "site-header",
		        // when scrolling up
		        pinned : "site-header--pinned",
		        // when scrolling down
		        unpinned : "site-header--unpinned"
		    }
		};
		var element = document.querySelector("#masthead");
		
		if(typeof Headroom !== 'undefined'){
			var header  = new Headroom(element, opts);
			header.init();
		}
	}
};




/*=============================================================================================
	Superfish Dropdown Menu
===============================================================================================*/
var subMenu = {
	init: function(){
		this.navigation = $('.primary-menu');
		this.navigation.supersubs({
			minWidth: 14,
			maxWidth: 14,
			extraWidth: 1
		}).superfish({
			delay: 100,
			animation: {opacity:'show'},
			speed: 'fast',
			autoArrows: false,
			dropShadows: false
		});
	}
};



/*=============================================================================================
  Responsive Video
===============================================================================================*/
var responsiveVideo = {
	init: function(){
		$(".fitvideo").fitVids();
	}
};




/*=============================================================================================
  Mobile Menu
===============================================================================================*/
var mobileMenu = {
	init: function(){
		var navigation = responsiveNav('.primary-menu', 
		{   
			animate: true,        // Boolean: Use CSS3 transitions, true or false
		    transition: 280,      // Integer: Speed of the transition, in milliseconds
		    label: "",        // String: Label for the navigation toggle
		    insert: "after",      // String: Insert the toggle before or after the navigation
		    customToggle: ".nav-toggle", // Selector: Specify the ID of a custom toggle
		    openPos: "relative",  // String: Position of the opened nav, relative or static
		    navClass: "nav-collapse", // String: Default CSS class. If changed, you need to edit the CSS too!
		    navActiveClass: "js-nav-active", // String: Class that is added to  element when nav is active
		    jsClass: "js",        // String: 'JS enabled' class which is added to <html> el
		    init: function(){},   // Function: Init callback
		    open: function(){},   // Function: Open callback
		    close: function(){}   // Function: Close callback);
		});
	}
};




/*======================================================================================================
	jQuery Nicescroll
========================================================================================================*/
var niceScrollInit = {
	init: function(){

	var _s = this;
	_s.cursorColor = $('html').data('cursor');

	var nice = $('html').niceScroll({
        cursorcolor: "#"+_s.cursorColor || '#14ddb3', 
        railpadding: {
            top: 0,
            right: 5,
            left: 5,
            bottom: 0
        },
        cursoropacitymin: 0,
        scrollspeed: 100,
        cursoropacitymax: 0.8,
        cursorborderradius: '0px',
        cursorwidth: '10px',
        cursorborder: 'none',
        background: ''
    });
   }
};





/*==============================================================================================
 Vertical Timeline Add More Posts
================================================================================================*/
  var loadMorePosts = { 
  	init: function(){
  		var el 	    	  = this;
  		el.selector 	  = $('.vertical-timeline');
  		el.customCount    = el.selector.data('count');
  		el.len            = 0;
	    el.curStart 	  = 0;
	    el.count    	  = el.customCount;
	    el.items    	  = new Array();
	    
  		el.limitPosts(el);
  		$('#load-more a').on('click', el.showPosts);	
  	},
  	limitPosts: function(el){
  		var lst    = $(".vertical-timeline");
            el.len = $(".vertical-timeline .post-item").length;
            

          	// Hide button
  			if(el.count == el.len){
  				$('#load-more a').hide();
  				$('.blog-content--timeline').css('padding-bottom', '20px');
  			}
  		
            if (el.len <= el.count)
              return;

	        $(".vertical-timeline .post-item").each(function() {
	            el.items.push($(this));
	            $(this).remove();
	        });

	        
	        var html="";
	        for (el.curStart; el.curStart < el.count && el.curStart < el.len; el.curStart++) {
	            html += '<li class="post-item">' + $(el.items[el.curStart]).html() + '</li>';
	        }
	        $(html).prependTo($(lst)).promise().done(function(){
	        	// your callback logic / code here
	        	blogSlider.init();
				responsiveVideo.init();
				jplayer_init.init();
	        });
  	},
  	showPosts: function(e){
  		e.preventDefault();

  		var self = $(this);
  		
  		if( loadMorePosts.curStart >= loadMorePosts.len ){
  		  loadMorePosts.curStart = 0;
  		}
      	var len = loadMorePosts.curStart;
        var html = "";
        for (loadMorePosts.curStart; loadMorePosts.curStart < (len + loadMorePosts.count) && loadMorePosts.curStart < loadMorePosts.len; loadMorePosts.curStart++) {
            html += '<li class="post-item">' + loadMorePosts.items[loadMorePosts.curStart].html() + '</li>';
        }
        
		self.remove('a');
        loadMorePosts.appendLoader(loadMorePosts);
        $('#load-more .status').addClass('active');

        var _throttleTimer = null,
		    _throttleDelay = 1500;
		clearTimeout(_throttleTimer);
        _throttleTimer = setTimeout( function(){
        	$(html).fadeIn(250).appendTo('.vertical-timeline').promise().done(function(){
	        	// your callback logic / code here
	        	blogSlider.init();
				responsiveVideo.init();
				jplayer_init.init();
	        });
        	
        	$('.load-more-posts').remove();
        	$('.blog-content--timeline').css('padding-bottom', '20px');
    	}, _throttleDelay );

        return false;
  	},
  	appendLoader:function(el){
  		el.loading = $( '<span />', {
			'id': 'loading'
		});
		el.loadingText = $('<span />', {
			'class' : 'loadingtext',
			'text' : 'loading...'
		});
		el.inside = $('<div />', {
			'class' : 'status'
		});
		el.inside.appendTo('#load-more');
		el.loadingText.appendTo('#load-more');
		el.loading.appendTo(loadMorePosts.inside);
		Loader.Show('large', '#303030');

  	}
  };






/*===============================================================================================
	Flickr Photos
=================================================================================================*/
var flickrPhotos = {
	init: function(){
		this.selector 	= $('#flickerPhotos');
		this.dataLimit 	= this.selector.data('limit');
		this.dataRandom = this.selector.data('random');
		this.userId 	= this.selector.data('userid');
		// init
		this.pluginInit(
			this.dataLimit,
			this.dataRandom,
			this.userId
		);	
	},
	pluginInit: function(count, random, userid){
		$('#flickerPhotos').flickrush({
			limit: count, // The number of photos to display 
			random: random, // Display the photos in a random sequence 
			id: userid, // ID of the flickr user 
			ssl: true // 
		}); 
	}
};






/*===============================================================================================
	Initialise scripts on Screen Width
=================================================================================================*/
function customImage( el, opacity){

		var customHeader = $(el),
			dataImage 	 = customHeader.data('image'),
			dataOpacity  = customHeader.data('opacity'),
			dataColor 	 = customHeader.data('color');
			
			// Path to image banner directory
			imgBg        = "assets/images/banner/"+ dataImage; 	
			$(el).backstretch(imgBg);	
			
			$(el+' .backstretch').css({
				'opacity': dataOpacity
			});
			$(el).css('background-color', "#"+dataColor);
			
	}





/*==========================================================================================
	Initialize Plugins and Scripts
============================================================================================*/
$(document).ready( function(){
	"use strict";

	/*=========================================
	Define Our Variables
	===========================================*/
	var body = $('body'),
	    lastScreenWidth = window.innerWidth;

	if( IE == 8 ){
		/* Disabled jQuery nicescroll in IE 8 due to a scroll bug */
		// IE 8 Stuff
	}else{
		niceScrollInit.init();
	}

	screenSize();
	$(window).resize( function(){
		if( lastScreenWidth <= 899 && window.innerWidth > 899 ){

			if ( $('#primary').length ) {
				var nav = responsiveNav('#primary');
				nav.destroy();
		
				$('#primary').each(function(){
            		this.className = this.className.split(' ')[0];
        		});
			}else{
			    subMenu.init();
			}

			animateHeader.init();
			subMenu.init();

		}
		if(lastScreenWidth > 899 && window.innerWidth <= 899 ){
			$('#primary').superfish('destroy');				
			mobileMenu.init();
		}
		lastScreenWidth = window.innerWidth;
    });
    
    function screenSize(){
    	if( window.innerWidth >= 899 ){
			animateHeader.init();
			subMenu.init();	
		}else{
			mobileMenu.init();
			$('#primary').superfish('destroy');
		}
    }

	if(body.hasClass('home') )
	{
		customImage( '#custom-header', 0.15 );

	}else if(body.hasClass('blog') ){
		
		customImage( '#custom-header');	
		blogSlider.init();
		responsiveVideo.init();

	}else if(body.hasClass('vertical-blog') ){

		customImage('#custom-header');
		blogSlider.init();
		responsiveVideo.init();
		loadMorePosts.init();

	}else if( body.hasClass('portfolio-3-columns') ){

		portfolioFilter.init();
		customImage( '#custom-header', '');

	}else if(body.hasClass( 'portfolio-2-columns' ) 
		|| body.hasClass( 'portfolio-4-columns' ) ){

		portfolioFilter.init();		
		customImage('#custom-header');

	}else if( body.hasClass('contact') ){

		customImage('#custom-header');		

	}else if( body.hasClass('single-portfolio') ){

		customImage('#custom-header');
		portfolioSlider.init();

	}else if(body.hasClass('single-blog')){
		customImage('#custom-header');
	}
	else if(body.hasClass('sample-page'))
	{
		customImage('#custom-header');			
	}

	// Initailize Scripts
    supports.init();
    scrollEvent.init();
	flickrPhotos.init();
	contactForm.init();
	responsiveTabs.init();
	responsiveAccordion.init();  
	stickyNavigation.init();


	/* Homepage Section Blocks Show or Hide */
	sectionBlocks.init('#services');
	sectionBlocks.init('#testimonials');
});