(function() {
	"use strict";

	//Variable Declaration
	var	container,
		closeButton,
		banner,
		panel,
		header,
		supportedTransform,
		bannerClickThrough,
		panelClickthroughButton,
		bannerVideoSpriteContainer,
		panelVideoSpriteContainer,
		videoSpritePlayButton,
		launchPlayerButton,
		spriteVideoInterval,
		videoContainer,
		video,
		currentVideoThumbX = 0,
		currentVideoThumbY = 0,
		currentVideoSpriteContainer = 0,
		totalThumbsToPlay = 0,
		currentThumbPlaying = 0,
		currentLoop = 0,
		totalLoops = 1,
		isPlaying = true,
		isVideoPlaying = false,
		waitForOutView = false,
		poster,
		buttonPause,
		buttonPlay,
		currentSection = 0,
		spriteSection = 0;


	window.addEventListener("load", checkIfEBInitialized);
	window.addEventListener("message", onMessageReceived);

	function checkIfEBInitialized(event)
	{
		if (EB.isInitialized()) {
			initializeCreative();
		}
		else {
			EB.addEventListener(EBG.EventName.EB_INITIALIZED, initializeCreative);
		}
	}

	function initializeCreative(event)
	{

		initializeGlobalVariables();
		supportedTransform = getSupportedProp(['transform', 'webkitTransform', 'msTransform','MozTransform','OTransform']);
		addEventListeners();
		trackVideoInteractions(video);

		if(Utils.isMobile.iOS()){
			video.style.display='none';
		}

		autoExpand();
		playSpriteVideo(panelVideoSpriteContainer);
	}

	function initializeGlobalVariables()
	{
		container 					= document.getElementById("container");
		header 					= document.getElementById("header-container");
		//closeButton 				= document.getElementById("close-button");
		panel 						= document.getElementById("panel");
		//banner 						= document.getElementById("banner");
		//bannerClickThrough 			= document.getElementById("banner-clickthrough-button");
		//panelClickthroughButton		= document.getElementById("panel-clickthrough-button");
		//bannerVideoSpriteContainer 	= document.getElementById("banner-video-sprite-container");
		panelVideoSpriteContainer 	= document.getElementById("panel-video-sprite-container");
		//launchPlayerButton 			= document.getElementById("launch-player-button");
		videoSpritePlayButton 		= document.getElementById("video-sprite-play-button");
		videoContainer 				= document.getElementById("video-container");
		video 						= document.getElementById("myVideo");
		poster = document.getElementById("poster");

		buttonPause = document.getElementById("buttonPause");
		buttonPlay = document.getElementById("buttonPlay");
	}
	function addEventListeners()
	{
		//closeButton.addEventListener(				"click", handleClose);
		//bannerClickThrough.addEventListener(		"click", handleBannerClick);
		//bannerVideoSpriteContainer.addEventListener("click", handleBannerVideoClick);
		//panelClickthroughButton.addEventListener(	"click", handlePanelClick);
		videoSpritePlayButton.addEventListener(		"click", spriteClick);
		video.addEventListener("ontimeupdate", onVideoUpdate);
		video.ontimeupdate = function() {onVideoUpdate();};
		
		video.addEventListener("ended", onVideoEnd);
		poster.addEventListener(		"click", posterClick);
		header.addEventListener(		"click", handleHeaderClick);
		//launchPlayerButton.addEventListener(		"click", handlePlayClick);

		buttonPlay.addEventListener("click", onPlay);
		buttonPause.addEventListener("click", onPause);

	}

	function onVideoUpdate(){
      	var percentage = video.currentTime / video.duration;
      	if(currentSection==0 && percentage>0){
      		console.log("Video start");
      		EB.automaticEventCounter("Video start");
      		currentSection = 1;
      	}else if(currentSection==1 && percentage>0.25){
      		console.log("25% played");
      		EB.automaticEventCounter("Video 25% played");
      		currentSection = 2;
      	}else if(currentSection==2 && percentage>0.5){
      		console.log("50% played");
      		EB.automaticEventCounter("Video 50% played");
      		currentSection = 3;
      	}else if(currentSection==3 && percentage>0.75){
      		console.log("75% played");
      		EB.automaticEventCounter("Video 75% played");
      		currentSection = 4;
      	}
    }

	function onVideoEnd(){
		poster.style.display = "block";
		EB.automaticEventCounter("Video End");
		console.log("Video complete");
		currentSection = 0;
	}

	function onPlay(){
		console.log("user play");
		resumeSpriteVideo();
		EB.userActionCounter("Sprite play clicked");
		buttonPlay.style.display = "none";
		buttonPause.style.display = "block";
	}

	function onPause(){
		console.log("user pause");
		pauseSpriteVideo();
		EB.userActionCounter("Sprite pause clicked");
		buttonPlay.style.display = "block";
		buttonPause.style.display = "none";
	}


	function iosSafariResizeFix(){
		onVideoEnd();
		var message = {
			adId: getAdID(),
			type: "forceResizeForIOS"
		};
		postMessageToParent(message);
		//Utils.forceResizeOnSafari(launchPlayerButton);
		//Utils.forceResizeOnSafari(closeButton);
		//Utils.forceResizeOnSafari(panelClickthroughButton);
	}
	function handleBannerVideoClick(event){
		EB.userActionCounter("Banner_VideoSprite_Click");
		pauseSpriteVideo();
		playSpriteVideo(panelVideoSpriteContainer);
		panel.style.display = 'block';
		var message = {
			adId: getAdID(),
			type: "resizePanel",
			height: 150
		};
		postMessageToParent(message);
		handlePlayClick();
	}

	function spriteClick(event){
		//EB.userActionCounter("Sprite clicked to play video");
		handlePlayClick();
		//EB.clickthrough();
	}

	function posterClick(event){
		EB.userActionCounter("Replay clicked to play sprite");
		handlePlayClick();
		//rePlaySpriteVideo();
		//console.log("poster clicked");
	}

	function handlePlayClick(event)
	{
		if (screenfull.enabled) {
	       // screenfull.request(video);
	    }

		buttonPlay.style.display = "none";
		buttonPause.style.display = "none";

		poster.style.display = "none";
		video.muted = false;
		if(Utils.isMobile.iOS()){
			video.style.display = 'block';
		}
		pauseSpriteVideo();
		panelVideoSpriteContainer.style.display = 'none';
		videoContainer.style.display = 'block';
		video.play();
		isVideoPlaying = true;

		if(Utils.isMobile.Android2()){
			panelVideoSpriteContainer.style.display = 'block';
			videoContainer.style.display = 'block';
			resumeSpriteVideo();

			video.removeEventListener('ended',rePlaySpriteVideo);
			video.addEventListener('ended',rePlaySpriteVideo);

		}
		if (Utils.isMobile.Android4()) {
			Utils.forceResizeOnAndroid();
		}
	}

	function handleHeaderClick(event)
	{
		EB.clickthrough();
	}

	function handleBannerClick(event)
	{
		EB.clickthrough();
	}
	function handlePanelClick(event)
	{
		video.pause();
		isVideoPlaying = false;
		EB.clickthrough();
	}
	function handleClose(event)
	{
		video.pause();
		isVideoPlaying = false;
		try {
		    video.currentTime = 0;
		}
		catch(err) {
		}
		pauseSpriteVideo();
		//playSpriteVideo(bannerVideoSpriteContainer);
		EB.userActionCounter("Close_Clicked");
		panel.style.display = 'none';
		var message = {
			adId: getAdID(),
			type: "resizePanel",
			height: 50
		};
		postMessageToParent(message);
	}
	function playSpriteVideo(spriteContainer)
	{
		currentVideoSpriteContainer=spriteContainer;
		resetVideoSprite();
		initializeSpriteVideo();

	}
	function rePlaySpriteVideo()
	{
		poster.style.display = "none";
		panelVideoSpriteContainer.style.display = 'block';
		resetVideoSprite();
		initializeSpriteVideo();
	}
	function resetVideoSprite(){
		currentLoop = 0;
		currentVideoThumbX = 0;
		currentVideoThumbY = 0;
		currentThumbPlaying = 0;
	}
	function initializeSpriteVideo(){
		isPlaying = true;
		var panelsprite 		= (currentVideoSpriteContainer.getElementsByClassName('sprites')[0]);
		var totalImages 		= (panelsprite.getElementsByTagName('img')).length;
		var videoWidth 			= currentVideoSpriteContainer.offsetWidth;
		var videoHeight 		= currentVideoSpriteContainer.offsetHeight;
		var playInterval 		= 1000/videoSpriteSettings.fps;
			totalThumbsToPlay	= videoSpriteSettings.length;

		if( totalThumbsToPlay > (totalImages*videoSpriteSettings.imagesPerSpriteSheet) ){
			totalThumbsToPlay = (totalImages*videoSpriteSettings.imagesPerSpriteSheet);
		}
		function playMov(){
			if(currentLoop < totalLoops){
				if(currentThumbPlaying == 0){
					EB.automaticEventCounter("Sprite start");
					console.log("Sprite start");
				}
				panelsprite.style[supportedTransform] = 'translate(-' + (currentVideoThumbX*videoWidth) + 'px, -' + (currentVideoThumbY*videoHeight) + 'px)';
				currentVideoThumbX = currentVideoThumbX + 1;
				
				currentThumbPlaying++;
				
				var spritePercentage = Math.ceil(currentThumbPlaying / totalThumbsToPlay * 100);
				if(spriteSection == 0 && spritePercentage >= 25){
					spriteSection = 1;
					console.log("sprite 25%");
					EB.automaticEventCounter("Sprite 25% played");
				}else if(spriteSection == 1 && spritePercentage >= 50){
					spriteSection = 2;
					console.log("sprite 50%");
					EB.automaticEventCounter("Sprite 50% played");
				}else if(spriteSection == 2 && spritePercentage >= 75){
					spriteSection = 3;
					console.log("sprite 75%");
					EB.automaticEventCounter("Sprite 75% played");
				}

				if(currentVideoThumbX == videoSpriteSettings.column){
					currentVideoThumbX = 0;
					currentVideoThumbY = currentVideoThumbY + 1;
				}
				
				if(currentThumbPlaying == totalThumbsToPlay){
					resetVideoSprite();
					EB.automaticEventCounter("Sprite end");
					console.log("Sprite end");
					currentLoop++;
				}
				spriteVideoInterval = setTimeout(playMov,playInterval);
			}else{
				if(!isVideoPlaying) poster.style.display = "block";
			}
		}
		playMov();
	}
	function pauseSpriteVideo()
	{
		isPlaying = false;
		clearTimeout(spriteVideoInterval);
	}
	function resumeSpriteVideo()
	{
		isPlaying = true;
		initializeSpriteVideo();
	}
	function getSupportedProp(proparray)
	{
	    var root = document.documentElement;
	    for (var i = 0; i < proparray.length; i++)
	    {
	        if (proparray[i] in root.style)
	        {
	            return proparray[i];
	        }
	    }
	}
	function autoExpand()
	{
		EB.expand({ actionType: EBG.ActionType.AUTO });
		var message = {
			adId: getAdID(),
			type: "resizePanel",
			height: 150
		};
		postMessageToParent(message);
		container.className = "expanded";

	}
	function trackVideoInteractions(video) {
		var videoTrackingModule = new EBG.VideoModule(video);
	}
	function preventPageScrolling()
	{
		document.addEventListener("touchmove", stopScrolling);
	}

	function stopScrolling(event)
	{
		event.preventDefault();
	}
	function getAdID()
	{
		if (EB._isLocalMode) {	return null;
		} else {				return EB._adConfig.adId;
		}
	}

	/*
	function onMessageReceived(event)
	{
		var messageData = JSON.parse(event.data);
		if (messageData.adId && messageData.adId === getAdID()) {
			if (messageData.type && messageData.type === "resize") {

			}
		}
	}
	*/

	function setCustomVar(customVarName, defaultValue, parseNum) {	//create global var with name = str, taking value from adConfig if it's there, else use default
		var value = EB._adConfig.hasOwnProperty(customVarName) ? EB._adConfig[customVarName] : defaultValue;
		if (value === "true") value = true; //PENDING if we really need this check
		if (value === "false") value = false; //PENDING if we really need this check
		if (value === "undefined") value = undefined;
		if (arguments.length == 3 && parseNum && typeof value === "string") value = parseFloat(value);
		window[customVarName] = value;
	}
	function postMessageToParent(message){
		window.parent.postMessage(JSON.stringify(message), "*");
	}
	function registerAction(){		//this func is never called, it's parsed by the ad platform on upload of the ad

	}


	/*
	* ====================================
	* ====================================
	*/

	/**
	* ====================================
	* Check if element is in viewport
	* ====================================
	**/

	function onMessageReceived(event) {
		try {
			var messageData = JSON.parse(event.data);
			//parentData = messageData;

			if (messageData.adId && messageData.adId === getAdID()) {
				if (messageData.type === "checkInView") {
					onVisibilityChange(messageData);
				}
			}
		} catch (error) {

		}
	}

	function isElementInViewport (winWidth_, winHeight_, rectTop_, rectLeft_) {
		return (
	        rectTop_ >= -settings.adHeight/2 &&
	        rectTop_ < winHeight_ - settings.adHeight/2 &&
	        rectLeft_ >= -settings.adWidth/2 &&
	        rectLeft_ < winWidth_ - settings.adWidth/2
	    );
	}

	function onVisibilityChange (messageData) {
		if(messageData.winWidth != undefined){

			var isAndroid = navigator.userAgent.match(/android/i) !== null;
			var isiOS = navigator.userAgent.match(/ipod|iphone|ipad/i) !== null;

			if(!isiOS || (isiOS)){
			    if(isElementInViewport(messageData.winWidth, messageData.winHeight, messageData.rectTop, messageData.rectLeft)){
			    	console.log("in view port");
			    	resumeVideo();
			    }else{
			    	console.log("Out of view port");
			    	pauseVideo();
			    }
			}
		}
	}

	/*
	* ====================================
	* ====================================
	*/

	function pauseVideo()
	{
		if(isVideoPlaying){
			video.pause();
			isVideoPlaying = false;
			waitForOutView = false;
		}else{
			if(isPlaying) pauseSpriteVideo();
		}

	}
	function resumeVideo()
	{
		if(isVideoPlaying && !waitForOutView){
			video.play();
			isVideoPlaying = true;
			waitForOutView = true;
		}else{
			if(!isPlaying) resumeSpriteVideo();
		}
	}

}());
