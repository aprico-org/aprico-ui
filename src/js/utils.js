
'use strict';


const utils = {};

utils.getId = function(id){
    return document.getElementById(id);
}

utils.stringToDom = function(string){
    return document.createRange().createContextualFragment(string.trim());
}

/**
 * Legacy clipboard copy, kept only as a fallback for the paths the
 * async Clipboard API does not cover (see utils.copyToClipboard).
 *
 * Note this has to briefly unmask the field to select its contents,
 * which is exactly why it is no longer the primary path.
 */
function execCommandCopy(el) {

  el.type = 'text';

  // the field is unmasked for the duration of the selection, so restore it
  // in a finally: an exception here must never leave the password visible.
  try {

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

    return document.execCommand("copy");

  } finally {

    el.type = 'password';

    // deselect
    if ('selectionStart' in el) {
      el.selectionEnd = el.selectionStart;
    }

    el.blur();
  }
}

/**
 * Copy the contents of an input to the clipboard.
 *
 * Primary path is the async Clipboard API. It reads the value straight off
 * the element, so unlike the old execCommand approach it never unmasks the
 * password field and never disturbs the user's selection or focus.
 *
 * This ships into four places:
 *
 * - Browser page (https). Chrome copies freely while the page is focused;
 *   Safari and Firefox want transient user activation.
 * - PWA / standalone. Same as above, but iOS has the strictest activation
 *   window, so an auto-copy that follows scrypt often lands on the fallback.
 * - Extension popup (chrome-extension: / moz-extension:). Popups frequently
 *   report themselves as unfocused, which makes writeText reject with
 *   NotAllowedError, hence the focus nudge below. Firefox additionally needs
 *   the `clipboardWrite` manifest permission for the execCommand fallback.
 * - Offline single-file build opened over file:. `file` is a potentially
 *   trustworthy scheme, so this is a secure context and navigator.clipboard
 *   is exposed -- but browsers vary on whether they will actually honour a
 *   write from a file: origin, so this is the case the fallback most earns
 *   its keep on.
 *
 * Callers that copy after a slow operation (generate() awaits scrypt) should
 * *start* the copy as early as possible rather than awaiting it early, so the
 * write lands inside the activation window.
 *
 * Falls back to execCommand when the API is missing or rejects (write refused
 * from file:, activation expired, document not focused, popup without
 * permission). Every environment therefore keeps a working copy path.
 *
 * @param {HTMLInputElement} el
 * @returns {Promise<boolean>} whether the copy succeeded
 */
utils.copyToClipboard = async function(el) {

  if (window.isSecureContext && navigator.clipboard && navigator.clipboard.writeText) {

    // An extension popup can be considered unfocused even while the user is
    // clicking in it, which rejects the write for no good reason. Nudge it
    // back into focus first; harmless in the other environments.
    try {
      if (!document.hasFocus || !document.hasFocus()) window.focus();
    } catch (err) {
      // non-fatal, carry on and let the write decide
    }

    try {
      await navigator.clipboard.writeText(el.value);
      return true;
    } catch (err) {
      // fall through and retry the legacy way
    }
  }

  try {
    return execCommandCopy(el);
  } catch (err) {
    return false;
  }
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

utils.setPlatformCSSClasses = function (platform, element) {

  platform = platform || utils.detectPlatform();
  element = element || document.body;

  platform.webext ? element.classList.add('platform-webext') : element.classList.add('platform-browser');

  platform.macos ? element.classList.add('platform-macOS') : element.classList.add('platform-otherOS');

  platform.mobile ? element.classList.add('platform-mobile') : element.classList.add('platform-desktop');

  if (platform.mobile) {

    platform.standalone ? element.classList.add('platform-mobile-app') : element.classList.add('platform-mobile-browser');
  
    if (platform.ios) { element.classList.add('platform-iOS') } 
      else if (platform.android) { element.classList.add('platform-android') }
  }
}


module.exports = utils;