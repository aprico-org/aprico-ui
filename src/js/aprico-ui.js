/*!
 * aprico-ui
 * Universal UI component for Aprico Password Manager. 
 * Copyright (c) 2018 Pino Ceniccola | GPLv3
 * https://aprico.org
 */

'use strict';


const VERSION = require('./version.js');

const aprico = require('aprico-gen');

const VERSION_TREE = {
  'aprico-gen' : aprico.version,
  'aprico-ui' : VERSION
}

// Save a few bytes because tiny-sha256 includes... its source code in a var
// const sha256 = require('tiny-sha256');
const sha256 = function a(b){function c(a,b){return a>>>b|a<<32-b}for(var d,e,f=Math.pow,g=f(2,32),h="length",i="",j=[],k=8*b[h],l=a.h=a.h||[],m=a.k=a.k||[],n=m[h],o={},p=2;64>n;p++)if(!o[p]){for(d=0;313>d;d+=p)o[d]=p;l[n]=f(p,.5)*g|0,m[n++]=f(p,1/3)*g|0}for(b+="\x80";b[h]%64-56;)b+="\x00";for(d=0;d<b[h];d++){if(e=b.charCodeAt(d),e>>8)return;j[d>>2]|=e<<(3-d)%4*8}for(j[j[h]]=k/g|0,j[j[h]]=k,e=0;e<j[h];){var q=j.slice(e,e+=16),r=l;for(l=l.slice(0,8),d=0;64>d;d++){var s=q[d-15],t=q[d-2],u=l[0],v=l[4],w=l[7]+(c(v,6)^c(v,11)^c(v,25))+(v&l[5]^~v&l[6])+m[d]+(q[d]=16>d?q[d]:q[d-16]+(c(s,7)^c(s,18)^s>>>3)+q[d-7]+(c(t,17)^c(t,19)^t>>>10)|0),x=(c(u,2)^c(u,13)^c(u,22))+(u&l[1]^u&l[2]^l[1]&l[2]);l=[w+x|0].concat(l),l[4]=l[4]+w|0}for(d=0;8>d;d++)l[d]=l[d]+r[d]|0}for(d=0;8>d;d++)for(e=3;e+1;e--){var y=l[d]>>8*e&255;i+=(16>y?0:"")+y.toString(16)}return i};

const Identicon = require('identicon.js');

const DEFAULT_TEMPLATES = require('./templates.js');

// Temporary, to be replaced with proper i18n someday
const TIPS = require('./tips.js');

const utils = require('./utils.js');

const platform = utils.detectPlatform();


/**
 *  Web Extension API, state of the art.
 *  We're going to use the "chrome" APIs based on callbacks
 *  until this mess is cleared:
 *  https://github.com/mozilla/webextension-polyfill/issues/3
 *  https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/9421085/
 *
 *  Long story short: Microsoft did it wrong again using the new 
 *  standard "browser" namespace but based on the old "chrome" APIs
 *  (using callbacks instead of promises).
 *
 *  Temporary fix: Firefox supports both "browser" (promise based) and
 *  "chrome" (callback based), Edge supports only "browser" but callback
 *  based. So, use "chrome" where available and call things with its
 *  name in Edge. 
 */

if (platform.webext && typeof chrome === "undefined") window.chrome = browser;




const IDENTICON_OPTIONS = {
  foreground: [239, 61, 51, 255],
  background: [255, 255, 255, 255],
  margin: 0.24,
  size: 41,
  format: 'svg'
};


let _root;
let _hashId;
let template;

const hashIdKey = 'hashId_' + VERSION_TREE['aprico-gen'].replace(/\./g , "_");










function setHashId(hashId) {
  _hashId = hashId;
  if (platform.webext) {
	chrome.storage.local.set({'hashId': hashId}, renderMain);
  } else {
	localStorage.setItem('hashId', hashId);
	renderMain();
  }
}

function resetHashId() {
  _hashId = false;
  if (platform.webext) {
	chrome.storage.local.set({'hashId': ''}, renderLogin);
  } else {
	localStorage.setItem('hashId', '');
	renderLogin();
  }
}


function onHashId(result) {
  //console.log(result);
  if (result && result.hashId) {
	_hashId = result.hashId;
	renderMain();
  } else {
	_hashId = false;
	renderLogin();
  }
}












function bootstrap(element, user_template){

  _root = document.querySelector(element);

  if (!_root) throw new Error("Root element is undefined.");

  template = (user_template) ? user_template : DEFAULT_TEMPLATES;

  utils.setPlatformCSSClasses(platform, _root);

  if (platform.webext) {
	chrome.storage.local.get('hashId', onHashId);
  } else {
	let hashId = localStorage.getItem('hashId');
	onHashId({ 'hashId' : hashId });
  }


}









function renderLogin() {

  let node = utils.stringToDom(template.login);

  if (_root.firstChild) _root.removeChild(_root.firstChild);

  _root.appendChild(node);
  
  setupLogin();
  setupCommon();
}


function renderMain() {

  let node = utils.stringToDom(template.main);

  if (_root.firstChild) _root.removeChild(_root.firstChild);

  _root.appendChild(node);

  setupMain();
  setupCommon();
}



function setupLogin(){

  let $hashId = utils.getId('ap-hashid');
  let $login = utils.getId('ap-trigger-login');
  $hashId.focus();
  $login.addEventListener('click',function(e){
	  e.preventDefault();
	  if ($hashId.value) {
		_hashId = aprico.getHashId($hashId.value);
		setHashId(_hashId);
	  } else {
		$hashId.focus();
	  }
  });

};


function setupMain(){

  let $pass         = utils.getId('ap-pass');
  let $service      = utils.getId('ap-service');
  let $result       = utils.getId('ap-result');
  let $trigger      = utils.getId('ap-trigger-gen');

  // extra fields
  let $variant      = utils.getId('ap-variant');
  let $letters      = utils.getId('ap-letters');
  let $numbers      = utils.getId('ap-numbers');
  let $symbols      = utils.getId('ap-symbols');
  let $length       = utils.getId('ap-length');
  
  let $triggerExtra = utils.getId('ap-trigger-extra');
  let $label        = utils.getId('a-pass-label');

  let $triggerCopy  = utils.getId('ap-copy');
  let $triggerShow  = utils.getId('ap-show');

  let $extraDiv     = utils.getId('aprico-extra');
  let $resultDiv    = utils.getId('aprico-result');
  let $aboutDiv     = utils.getId('aprico-about');

  // Render random tip
  randomTip();

  // Autofocus Service or Password inputs
  if (platform.webext) {
	chrome.tabs.query({active:true,currentWindow:true}, function(tabs){
	  if (tabs[0].url.indexOf('.') > 0) {
		$service.value = aprico.normalizeService(tabs[0].url);
		$pass.focus();
	  } else {
		$service.focus();
	  }
	});
  } else {
	$service.focus();
  }
  

  // Normalize Service on blur
  $service.addEventListener('blur',function(e){
	this.value = aprico.normalizeService(this.value);
  });


  // Identicon support
  $pass.addEventListener('input',function(e){
	if (this.value.length) {
	  // this.value to base64 because tiny-sha256 works with ASCII only
	  let value64 = btoa(encodeURIComponent(this.value).replace(/%([0-9A-F]{2})/g, function(match, p1) {
		  return String.fromCharCode(parseInt(p1, 16));
	  }));
	  let data = new Identicon(sha256(_hashId+value64), IDENTICON_OPTIONS).toString();
	  $pass.style.backgroundImage = 'url(data:image/svg+xml;base64,' + data + ')';
	} else {
	  $pass.style.backgroundImage = '';
	}
  });


  // Extra
  $triggerExtra.addEventListener('click',function(e){
	e.preventDefault();
	if (this.classList.contains('bg-gray-2')) {
	  this.classList.remove('bg-gray-2');
	  show($aboutDiv);
	} else {
	  this.classList.add('bg-gray-2');
	  show($extraDiv);
	}
	
  });


  // Switch Password type
  $result.addEventListener('focus', function(){
	this.type = 'text';
  });
  $result.addEventListener('blur', function(){
	this.type = 'password';
  });



  // Generating Password

  async function generate(e) {
	// 0. Validate fields
	if (!$service.value) {$service.focus();return false;}
	if (!$pass.value) {$pass.focus();return false;}
	
	let timerId,
		results,
		copy;


	// 1. Prepare UI
	let step1 = await new Promise(function(resolve) {

	  $label.classList.remove('icon','icon-done','icon-alldone');
	  $triggerCopy.classList.add('hidden');
	  $triggerShow.classList.add('hidden');
	  $result.classList.remove('border-red');

	  $triggerExtra.classList.remove('bg-gray-2');

	  show($resultDiv);

	  //utils.getId('aprico-result').classList.add('bg-black');

	  timerId = setInterval(function(){
		$label.textContent += '.';
	  },50);

	  $label.classList.add('red');
	  $label.textContent = 'Generating.';
		  
	  $trigger.disabled = true;
	  $triggerExtra.disabled = true;
	  $result.value = '';

	  return setTimeout(resolve,100);
	});

	// 2. Generate Password
	let step2 = await new Promise(function(resolve){
	  
	  let time = new Date().getTime();

	  results = aprico.getPassword($pass.value, $service.value, _hashId, {
		length:  +$length.value,
		letters: +$letters.checked,
		numbers: +$numbers.checked,
		symbols: +$symbols.checked,
		variant: $variant.value
	  });

	  //console.log((new Date().getTime()) - time);

	  // in step 2 because... timing
	  $result.value = results.pass;
	  results = false;
	  copy = utils.copyToClipboard($result);

	  return setTimeout(resolve,100);
	});

	// 3. Resolve UI
	let step3 = await new Promise(function(resolve){

	  $result.classList.add('border-red');

	  $label.classList.remove('red');

	  clearInterval(timerId);

	  if (copy) {
		$label.classList.add('icon','icon-alldone');
		$label.textContent = 'Password copied to clipboard.';
	  } else {
		$label.classList.add('icon','icon-done');
		$label.textContent = 'Password is ready.';
		$triggerCopy.classList.remove('hidden');
	  }

	  $triggerShow.classList.remove('hidden');
	  
	  $trigger.disabled = false;
	  $triggerExtra.disabled = false;

	  return resolve();
	});

  };



  $triggerCopy.addEventListener('click',function(e){
	let copy = utils.copyToClipboard($result);
	if (copy) $label.textContent = 'Password copied to clipboard.'
	  else alert('There was an error with the clipboard copy.');
  });


  // Reset hashId
  let $reset = utils.getId('ap-delete-hash');
  $reset.addEventListener('click',resetHashId);

  // Show Password
  $triggerShow.addEventListener('click',function(e){
	$result.focus();
  });

  // Switch About/Results
  function show(section){
	
	if (section.id == "aprico-about") randomTip();
	
	$resultDiv.hidden = true;
	$aboutDiv.hidden = true;
	$extraDiv.hidden = true;
	section.hidden = false;
  };

  // Hide results on form change
  let formEls = document.querySelectorAll('input');
  Array.from(formEls).forEach(function(el){
	el.addEventListener('input',function(){
	  if ($resultDiv.hidden != true) show($aboutDiv);
	});
  });

  // At least one checkbox selected
  // Note: Safari doesn't support 'input' event on checkboxes
  let checkboxes = document.querySelectorAll('.switch-toggle');
  Array.from(checkboxes).forEach(checkbox => checkbox.addEventListener('change', checkboxOnChange));
  function checkboxOnChange(){
	let checkedOne = Array.prototype.slice.call(checkboxes).some(x => x.checked);
	if (!checkedOne) this.checked = true;
	this.value = this.checked ? 1 : 0;

	// Redundant, but needed for Safari
	$triggerExtra.classList.toggle('btn-mod-notify', formHasChanges($extraInputs));
  };

  // Setup fake form submission
  utils.getId('fake-form').addEventListener('submit', (e) => {
	e.preventDefault(); 

	// if PWA trigger Save Password?
	// Note: not needed in iOS, Android needs tests.
	// history.replaceState({success:true}, 'aprico', "/success.html");
	
	generate();

  });

  // Validate characters count
  $length.addEventListener('change', () => {
	if (+$length.value == 0) $length.value = 20;
	else if (+$length.value < 4) $length.value = 4;
	else if (+$length.value > 40) $length.value = 40;

	$triggerExtra.classList.toggle('btn-mod-notify', formHasChanges($extraInputs));
	$length.classList.toggle('border-red', $length.dataset.origValue !== $length.value );
  });

  // Add notification icon on extra fields change
  let $extraInputs = document.querySelectorAll('#aprico-extra input');

  Array.from($extraInputs).forEach(el => {
	el.dataset.origValue = el.value;
	el.addEventListener('input',e => {
	  $triggerExtra.classList.toggle('btn-mod-notify', formHasChanges($extraInputs));
	  el.classList.toggle('border-red', (el.dataset.origValue !== el.value));
	});
  });

  function formHasChanges(form) {
	return Array.from(form).some(el => 'origValue' in el.dataset && el.dataset.origValue !== el.value );
  }



  // Tips logic
  function randomTip() {
	let _tips = TIPS['common'];

	// Web Extension
	if (platform.webext) _tips = [..._tips, ...TIPS['webext']];
	// Mobile but not standalone
	if (platform.mobile && !platform.standalone) _tips = [..._tips, ...TIPS['mobile']];
	// Desktop but not web extension
	if (!platform.mobile && !platform.webext) _tips = [..._tips, ...TIPS['desktop']];

	let tip = _tips[Math.random() * _tips.length | 0];

	let $tip = utils.getId('aprico-tips');
	while ($tip.firstChild) $tip.removeChild($tip.firstChild);
	$tip.appendChild( utils.stringToDom(tip) );
  }


}


function setupCommon(){

  // links in new window in web-ext
  if (platform.webext || platform.standalone) {
	Array.from(document.querySelectorAll('.external-link')).forEach(
	  _link => _link.addEventListener('click', (e) => {
		e.preventDefault();
		window.open(_link.getAttribute('href'));
	  })
	);
  }

}

module.exports = bootstrap;
module.exports.version = VERSION_TREE;
