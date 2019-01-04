/*
 * Aprico UI Templates
*/

const templates = {
	login: `
  <div id="aprico-login" class="p2 sm-p3 bg-white">
	<div class="mb2">
      <label class="label" for="ap-hashid">ID</label>
      <input class="sm-h3" type="text" id="ap-hashid" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
  	</div>
  	<div class="mb2 h6">
  		<p class="sm-h5"><strong>Please choose an ID:</strong> it can be your e-mail address, your nickname or a longer passphrase.</p>
      <p>It will be only asked once, but please <strong>make sure to remember it</strong> as there is no way to recover your ID.</p>
    </div>
  	<div class="mb2">
      <button id="ap-trigger-login" class="btn btn-primary h6 caps white">Start using Aprico</button>
  	</div>
    <div class="border-top border-gray pt2">
      <p class="h6 m0"><strong>aprico</strong> is a deterministic password manager that works 100% in your browser. No data will ever be sent to any server or cloud. You can read more in our super friendly <a class="webext-newlink" href="https://aprico.org/privacy.html">Privacy Policy</a>.</h6>
    </div>
    </div>
  	`,
	main: `
  <div id="aprico-main" class="flex flex-column col-12">
  <div class="p2 sm-p3 bg-white">
  	<div class="mb2">
      <label class="label">Service</label>
      <input class="sm-h3 sm-mb2" type="text" placeholder="website.com or appname" id="ap-service" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
  	</div>
  	<form id="fake-form" action="login">
    <div class="mb2">
      
      <input id="fake-user-text-field" type="hidden" autocomplete="username" value="aprico master password">
      <label class="label">Master Password</label>
      <input id="ap-pass" class="sm-h3 sm-mb2 bg-identicon" type="password" autocomplete="password">
      
  	</div>
  	<div class="sm-mb2">
    	<div class="flex">
      	<button type="submit" id="ap-trigger-gen" class="btn btn-primary white h6 caps" style="margin-left:1px">Get Password</button>
      	<span class="flex-auto"></span>
      	<button id="ap-trigger-extra" class="btn h6 caps right icon icon-opts px0 border-gray rounded"><span style="opacity:0">More</span></button>
    	</div>
  	</div>
    </form>
  </div>

  <div class="flex-auto flex flex-column bg-gray-1 border-top border-gray-2" style="min-height:220px">

  <div id="aprico-extra" class="p2 sm-p3" hidden>
    <div class="flex justify-between mb2">
        <div class="sm-mb2 col-3 ">
            <label class="label">Length</label>
            <input class="lg-h3" type="number" min="4" max="40" value="20" id="ap-length">
        </div>
        <div class="sm-mb2 col-9 flex-auto pl2 sm-pl4 md-pl2 lg-pl4">
            <label class="label">Alphabet</label>
            <ul class="list-reset flex justify-between center">
                <li>
                    <input type="checkbox" checked value="1" id="ap-letters" class="switch-toggle switch-toggle-round">
                    <label for="ap-letters"><span class="mt2 block">Letters</span></label>
                </li>
                <li>
                    <input type="checkbox" checked value="1" id="ap-numbers" class="switch-toggle switch-toggle-round">
                    <label for="ap-numbers"><span class="mt2 block">Numbers</span></label>
                </li>
                <li>
                    <input type="checkbox" checked value="1" id="ap-symbols" class="switch-toggle switch-toggle-round">
                    <label for="ap-symbols"><span class="mt2 block">Symbols</span></label>
                </li>
            </ul>
        </div>
    </div>
    <div class="">
        <div class="-mb2">
            <label class="label">Variant</label>
            <input class="sm-h3" type="text" id="ap-variant">
        </div>
    </div>
  </div>

  <div id="aprico-result" class="p2 sm-p3" hidden>
  <div class="mb2">
      <label class="label bold mb2" id="a-pass-label">Password</label>
      <input class="sm-h3 sm-mb2 monospace" type="password" id="ap-result" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" readonly="true">
  </div>
  <div class="flex">
  <button class="btn btn-small h6 px0 hidden mr2 icon icon-view weight-400" id="ap-show">Show</button>
  <button class="btn btn-small h6 px0 hidden icon icon-copy weight-400" id="ap-copy">Copy</button>
  </div>
  </div>

  <div id="aprico-about" class="flex-auto flex flex-column col-12">
  <!-- <div class="flex flex-column bg-gray-1"> -->
  <div class="p2 sm-p3">
    <p id="aprico-tips" class="h6 md-h5"></p>
  </div>
  <span class="flex-auto"></span>
  <div class="flex p2 sm-p3">
  <a class="btn btn-small h6 px0 icon icon-open weight-400 external-link" href="https://aprico.org">About</a>
  <a class="hide btn btn-small h6 px0 icon icon-open weight-400  ml2 external-link" href="mailto:pino@aprico.org?subject=Feedback%20about%20aprico">Feedback</a>

  <button id="ap-link-online" class="hide btn btn-small h6 px0 icon icon-open">Online Version</button>
  <span class="flex-auto"></span>
  <button class="btn btn-small h6 px0 icon icon-logout" id="ap-delete-hash">Change ID</button>
  </div>  
  <!-- </div> -->
  </div>

  </div>
</div>
	`
}

module.exports = templates;