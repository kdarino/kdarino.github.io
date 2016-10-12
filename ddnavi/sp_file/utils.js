var ua = navigator.userAgent;
var androidResizeTimeout;

var Utils={
	isMobile : {
	    Android: function() {
	        return  (/android/i).test(ua);
	    },
	    Android2: function() {
	        return  (/android 2/i).test(ua);
	    },
	    Android4: function() {
	        return  (/android 4/i).test(ua);
	    },
	    iOS: function() {
	        return  (/ipod|iphone|ipad/i).test(ua);
	    },
	    iOS6: function() {
	        return  (/(iPhone|iPad|iPod).*OS [6]_/i).test(ua);
	    },
	    iPad: function() {
	        return  (/ipad/i).test(ua);
	    },
	    Windows: function() {
	        return  (/windows phone/i).test(ua);
	    },
	    HTC: function() {
	        return  (/htc/i).test(ua);
	    },
	    any: function() {
	        return (Utils.isMobile.Android() || Utils.isMobile.iOS() || Utils.isMobile.Windows());
	    }
	},
	isBrowser : {
	    Safari:function(){
	    	var isSafari=false;
	    	if ((/safari/i).test(ua) && !(/chrome/i).test(ua)) {
	    		isSafari=true;
	    	}
	    	return isSafari;
	    },
	    Chrome:function(){
	    	return  (/chrome/i).test(ua);
	    },
	    IE:function(){
	    	return  (/msie/i).test(ua);
	    }
	},
	getViewPort:function(){
		var _height, _width;
        if (!Utils.isMobile.Android2()) {
            _height = window.innerHeight;
            _width = window.innerWidth;
        }
        else {
            var outerHeight = Math.round(window.outerHeight / window.devicePixelRatio);
            _height = Math.min(window.innerHeight, outerHeight);

            var outerWidth = Math.round(window.outerWidth / window.devicePixelRatio);
            _width = Math.min(window.innerWidth, outerWidth);
        }
        return {width:_width,height:_height};
	},
	forceResizeOnAndroid:function(){
		document.body.style.opacity = 0.99;
		clearTimeout(androidResizeTimeout);
		androidResizeTimeout = setTimeout(function() {
			document.body.style.opacity = 1;
			document.body.style.height = window.innerHeight;
			document.body.style.width = window.innerWidth;
		}, 200);
	},
	forceRedraw:function(_div){
		document.body.style.opacity = 0.99;
		clearTimeout(androidResizeTimeout);
		androidResizeTimeout = setTimeout(function() {
			document.body.style.opacity = 1;
			document.body.style.height = window.innerHeight;
			document.body.style.width = window.innerWidth;
		}, 200);
	},
	forceResizeOnSafari:function(element){
	  var disp = element.style.display;
	  element.style.display = 'none';
	  var trick = element.offsetHeight;
	  element.style.display = disp;
	}
}