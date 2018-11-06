
'use strict';


const utils = {};

utils.getId = function(id){
    return document.getElementById(id);
}

utils.stringToDom = function(string){
    return document.createRange().createContextualFragment(string.trim());
}

/**
 * Copy to clipboard, state of the art.
 * 
 * For Web Extensions: Always require permission (clipboardWrite).
 *
 * For Browsers:
 * - Chrome + Safari (check quirks) allow async copy, this let
 *   us change the UI without freezing the browser.
 *    
 * - Firefox + Edge don't allow async copy, only solution to date
 *   is to degrade gracefully to click-to-copy only (no autocopy
 *   after generation).
 *
 * Reference:
 * https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7728456/
 * http://hansifer.com/clipboardCopyTest.html
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1012662#c51
 */
utils.copyToClipboard = function(el) {
 
  el.type = 'text';

  // handle iOS quirks
  // https://stackoverflow.com/questions/34045777/copy-to-clipboard-using-javascript-in-ios
  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {

    // save current contentEditable/readOnly status
    var editable = el.contentEditable;
    var readOnly = el.readOnly;

    // convert to editable with readonly to stop iOS keyboard opening
    el.contentEditable = true;
    el.readOnly = true;

    // create a selectable range
    var range = document.createRange();
    range.selectNodeContents(el);

    // select the range
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    el.setSelectionRange(0, 999999);

    // restore contentEditable/readOnly to original state
    el.contentEditable = editable;
    el.readOnly = readOnly;

  } else {
    // select for other os/devices
    el.select();
  }

  let success = document.execCommand("copy");

  //console.log('copy', success);

  el.type = 'password';

  // deselect
  if ('selectionStart' in el) {
    el.selectionEnd = el.selectionStart;
  }
  
  el.blur();

  return success;
}





utils.chainOnTransitionEnd = function( callback, _this ) {

	let runOnce = function(e){
		e.target.removeEventListener( e.type, runOnce );
		if (e.target == _this) callback();
	}

	_this.addEventListener( 'transitionend', runOnce );
	// if no transition
	// if ( getComputedStyle( this )[ 'transition-duration' ] == '0s' ) callback();
	return this;
};



utils.detectPlatform = function() {
  
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  let platform = {};

  platform.webext = !!(typeof browser !== 'undefined' && browser.runtime && browser.runtime.id) || !!(typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id);

  platform.macos = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  platform.mobile = !platform.webext && /mobi/i.test(userAgent);

  platform.standalone = platform.mobile && ( (window.navigator.standalone == true) || (window.matchMedia('(display-mode: standalone)').matches) );
  
  platform.ios = platform.mobile && (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);

  platform.android = platform.mobile && (/android/i.test(userAgent) && !window.MSStream);

  return platform;

}




module.exports = utils;