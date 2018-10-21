
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
utils.copyToClipboard = function(element) {
 
  element.type = 'text';

  // copy to clipboard
  element.select();

  // TO DO: ios quirks...
  // ref: https://stackoverflow.com/questions/34045777/copy-to-clipboard-using-javascript-in-ios
/*
            let range = document.createRange();
            range.selectNodeContents(element);
            let selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            element.setSelectionRange(0, 999999);  
*/
  let success = document.execCommand("copy");

 	//console.log('copy', success);

	element.type = 'password';

  // deselect
  //var activeEl = document.activeElement;
  //if ('selectionStart' in activeEl) {
  //  element.selectionEnd = activeEl.selectionStart;
  //}

  //if ('selectionStart' in activeEl) {
    element.selectionEnd = element.selectionStart;
  //}
  
  //selection.removeAllRanges();

 	element.blur();

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


module.exports = utils;