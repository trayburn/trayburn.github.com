/** 
* IE 8 Detection Script to support IE8 
*/

  // IF IE 8 show it-ie9 output it-ie9 in html tag
  var IE = (!! window.ActiveXObject && +(/msie\s(\d+)/i.exec(navigator.userAgent)[1])) || NaN;
    if (IE < 9) {
      document.documentElement.className += ' lt-ie9' + ' ie' + IE;
  }

  // IF IE8 Load Polyfills using Modernizer load method
  if( IE == 8 ){
    Modernizr.load({
        load: [  
        'http://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.6.2/html5shiv.js',
        'http://s3.amazonaws.com/nwapi/nwmatcher/nwmatcher-1.2.5-min.js',
        'http://html5base.googlecode.com/svn-history/r38/trunk/js/selectivizr-1.0.3b.js',
        'http://cdnjs.cloudflare.com/ajax/libs/respond.js/1.1.0/respond.min.js'
        ]
    });  
  } 
