
/*
  Aprico UI: 
  implementation of Aprico

*/

'use strict';


const VERSION = '0.1.0';

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

const utils = require('./utils.js');



const isWebExt = (typeof browser !== 'undefined' && browser.runtime && browser.runtime.id) || (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id);

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

if (isWebExt && typeof chrome === "undefined") window.chrome = window.browser;




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
  if (isWebExt) {
    chrome.storage.local.set({'hashId': hashId}, renderMain);
  } else {
    localStorage.setItem('hashId', hashId);
    renderMain();
  }
}

function resetHashId() {
  _hashId = false;
  if (isWebExt) {
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

  if (isWebExt) {
    _root.classList.add('aprico-webext');
    chrome.storage.local.get('hashId', onHashId);
  } else {
    _root.classList.add('aprico-browser');
    let hashId = localStorage.getItem('hashId');
    onHashId({ 'hashId' : hashId });
  }

}














function renderLogin() {

  let node = utils.stringToDom(template.login);

  if (_root.firstChild) _root.removeChild(_root.firstChild);

  _root.appendChild(node);
  
  setupLogin();
}


function renderMain() {

  let node = utils.stringToDom(template.main);

  if (_root.firstChild) _root.removeChild(_root.firstChild);

  _root.appendChild(node);

  setupMain();
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

  // Autofocus Service or Password inputs
  if (isWebExt) {
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


  // Simulate submission
  $pass.addEventListener('keyup',function(e){
     if (e.key === "Enter") generate();
  });


  // Extra
  $triggerExtra.addEventListener('click',function(e){
    e.preventDefault();
    if (this.classList.contains('bg-gray-1')) {
      this.classList.remove('bg-gray-1');
      show($aboutDiv);
    } else {
      this.classList.add('bg-gray-1');
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
  $trigger.addEventListener('click', generate);

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

      $triggerExtra.classList.remove('bg-gray-1');

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
    if (copy) $label.textContent = 'Password copied to clipboard.';
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
    $resultDiv.hidden = true;
    $aboutDiv.hidden = true;
    $extraDiv.hidden = true;
    section.hidden = false;
  }

  // hide results on form change
  let formEls = document.querySelectorAll('input');
  Array.from(formEls).forEach(function(el){
    el.addEventListener('input',function(){
      if ($resultDiv.hidden != true) show($aboutDiv);
    });
  });

  // At least one checkbox selected
  let checkboxes = document.querySelectorAll('.switch-toggle');

  [...checkboxes].forEach(checkbox => checkbox.addEventListener('change', checkboxOnChange));
  
  function checkboxOnChange(){
    let checkedOne = Array.prototype.slice.call(checkboxes).some(x => x.checked);
    if (!checkedOne) this.checked = true;
  };

  // Validate characters count
  $length.addEventListener('blur', function(){
    if (+this.value == 0) this.value = 20;
    else if (+this.value < 4) this.value = 4;
    else if (+this.value > 40) this.value = 40;
  });
  

  // links
  let $aboutLink = utils.getId('ap-link-about');
  $aboutLink.addEventListener('click', function(){window.open("https://aprico.org/")});
}


module.exports = bootstrap;
module.exports.version = VERSION_TREE;
