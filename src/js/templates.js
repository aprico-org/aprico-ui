/*
 * Aprico UI Templates
*/

const templates = {
	login: `
  <div id="aprico-login" class="p2 bg-white">
	<div class="mb2">
      <label class="label">ID</label>
      <input type="text" id="ap-hashid" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
  	</div>
  	<div class="mb2 h6">
  		<p><strong>Please choose an ID:</strong> it can be your e-mail address, your nickname or a longer passphrase.</p>
      <p>It will be only asked once, but please, <strong>make sure to remeber it</strong> as there is no way to recover your ID.</p>
    </div>
  	<div class="mb2">
      <button id="ap-trigger-login" class="btn btn-primary h6 caps white">Start using Aprico</button>
  	</div>
    <div class="border-top border-gray-2 pt2">
      <p class="h6"><strong>Aprico</strong> is a deterministic password manager that works 100% in your browser. No data will ever be sent to any server or cloud. You can read more in our super friendly <a href="https://aprico.org/privacy.html">Privacy Policy</a>.</h6>
    </div>
    </div>
  	`,
	main: `
  <div id="aprico-main">
  <div class="p2 bg-white">
  	<div class="mb2">
      <label class="label">Service</label>
      <input type="text" id="ap-service" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
  	</div>
  	<div class="mb2">
      <label class="label">Master Password</label>
      <input type="password" id="ap-pass" class="bg-identicon">
  	</div>
  	<div class="-mb2">
    	<div class="flex">
      	<button id="ap-trigger-gen" class="btn btn-primary white h6 caps" style="margin-left:1px">Get Password</button>
      	<span class="flex-auto"></span>
      	<button id="ap-trigger-extra" class="btn h6 caps right icon icon-opts px0 border-gray rounded"><span style="opacity:0">More</span></button>
    	</div>
  	</div>
  </div>

  <div id="aprico-extra" class="bg-gray-1 p2" hidden>
    <div class="flex justify-between mb2">
        <div class="-mb2 col-3 ">
            <label class="label">Length</label>
            <input type="number" min="4" max="40" value="20" id="ap-length">
        </div>
        <div class="-mb2 col-9 flex-auto pl2">
            <label class="label">Alphabet</label>
            <ul class="list-reset flex justify-between center">
                <li>
                    <input type="checkbox" checked id="ap-letters" class="switch-toggle switch-toggle-round">
                    <label for="ap-letters"><span class="mt2 block">Letters</span></label>
                </li>
                <li>
                    <input type="checkbox" checked id="ap-numbers" class="switch-toggle switch-toggle-round">
                    <label for="ap-numbers"><span class="mt2 block">Numbers</span></label>
                </li>
                <li>
                    <input type="checkbox" checked id="ap-symbols" class="switch-toggle switch-toggle-round">
                    <label for="ap-symbols"><span class="mt2 block">Symbols</span></label>
                </li>
            </ul>
        </div>
    </div>
    <div class="">
        <div class="-mb2">
            <label class="label">Variant</label>
            <input type="text" id="ap-variant">
        </div>
    </div>
  </div>

  <div id="aprico-result" class="-bg-black bg-gray-1 -white p2" hidden>
  <div class="mb2">
      <label class="label bold -white mb2" id="a-pass-label">Password</label>
      <input type="password" id="ap-result" class="monospace" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" readonly="true">
  </div>
  <div class="flex">
  <button class="btn btn-small -white h6 px0 hidden mr2 icon icon-view weight-400" id="ap-show">Show</button>
  <button class="btn btn-small -white h6 px0 hidden icon icon-copy weight-400" id="ap-copy">Copy</button>
  </div>
  </div>

  <div id="aprico-about">
  <div class="flex flex-column bg-gray-1" style="min-height:126px">
  <div class="flex-auto p2">
  <p class="h5">Thank you for using <strong>Aprico</strong>.</p>
  </div>
  <div class="flex p2">
  <button id="ap-link-about" class="btn btn-small h6 px0 mr1 icon icon-open weight-400">About</button>
  <button id="ap-link-online" class="hide btn btn-small h6 px0 icon icon-open">Online Version</button>
  <span class="flex-auto"></span>
  <button class="btn btn-small h6 px0 icon icon-logout" id="ap-delete-hash">Change ID</button>
  </div>  
  </div>
  </div>
</div>
	`
}

module.exports = templates;