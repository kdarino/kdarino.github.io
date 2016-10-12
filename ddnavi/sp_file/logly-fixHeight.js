/**
 *
 */
function adjust_frame_css(F){
	if (document.getElementById(F)) {
		var myF = document.getElementById(F);
		var myC = myF.contentWindow.document.documentElement;
		var myH = 150;
		if (document.all) {
			myH  = myC.scrollHeight;
		}
		else {
			myH = myC.offsetHeight;
		}
		myF.style.height = myH+"px";
	}
}
