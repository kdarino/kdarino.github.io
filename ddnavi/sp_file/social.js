jQuery(document).ready(function(){
	setTimeout(function(){
		if (window.localStorage) {
			if (window.localStorage.getItem("socialPopup") !== "hide") {
				checkPopupShow();
			}
		}
	},350);
});

jQuery(function(){
	jQuery("#btn-close-sns").on("click", function () {
		_gaq.push(['_trackEvent', 'ソーシャル', 'facebook', 'FB閉じる_TOP_ORANGE_SP']);
		closeSocialArea();
		jQuery.cookie("socialPopup", "hide", 30);
	});
});

function openSocialArea() {
	jQuery("#wrap").css({
		"margin-bottom" : 145
	}),
	jQuery("#topcontrol").css({
		bottom: 145
	}),
	jQuery("#sns-popup").css({
		bottom : 0,
		opacity: 1
	});
}

function closeSocialArea() {
	jQuery("#wrap").css({
		"margin-bottom" : 0
	}),
	jQuery("#topcontrol").css({
		bottom : 20
	}),
	jQuery("#sns-popup").css({
		bottom : -200,
		opacity: 0
	}),
	setHideData(false);
}

function setHideData(longTime) {
	if (longTime) {
		jQuery.cookie(
				"socialPopup",
				"hide",
				{
					expires: 365,
					path: '/',
					//domain: 'ddnaviap.wp-x.jp',
					domain: 'ddnavi.com',
					secure: false
				}
		);
	}
	else {
		jQuery.cookie(
				"socialPopup",
				"hide",
				{
					expires: 30,
					path: '/',
					//domain: 'ddnaviap.wp-x.jp',
					domain: 'ddnavi.com',
					secure: false
				}
		);
	}
}

function getHideData() {
	return jQuery.cookie("socialPopup");
}

function deleteHideData() {
	jQuery.removeCookie("socialPopup");
}

function checkPopupShow() {
	FB.getLoginStatus(function(response){
		if (response.status === 'unknown') {
			popupHide = true;
		}
		else {
			if (getHideData() === "hide") {
				popupHide = true;
			}
			else {
				popupHide = false;
			}
		}
		if (!popupHide) {
			openSocialArea();
		}
	});
}