# jQuery CookieBar Plugin

**A lightweight (5,4kb minified) customisable and freely stylable jQuery cookie consent bar that can be used for implied and explicit opt-in and opt-out scenarios and has optional support for “Do Not Track” detection. It includes wrapper functions for consent-dependent (or do-not-track-dependent) functionality and methods for resetting cookie consent options, e.g. from a privacy policy page.**

*Note: jQuery Cookiebar is for simple universal consent situations and does not provide any means for more granular control of different kinds of cookie usage.*

## Introduction

jQuery CookieBar adds a cookie consent notice bar with a short message and (optional) accept, decline, and privacy policy buttons. When a visitor decides to accept or decline cookies, the plugin sets a cookie (yes, a cookie) and the cookie bar no longer displays.

jQuery CookieBar also provides methods for responding to cookie consent and ‘Do Not Track’ status in your code, so that you can disable, skip or provide alternative content for code that collects personal information.

jQuery CookieBar can be used for different scenarios:

- Implied consent / assumed consent: Cookies are used but the visitor is given an opportunity to opt out. Cookie status: `enabled`. Implied consent can be automatic (`autoEnable`), on click (`acceptAnyClick`), on scrolling (`acceptOnScroll`) or continuing (`acceptOnContinue`).
- Explicit consent: Cookies are not used until the visitor explicitly gives consent. Cookie status: `accepted`.
- Do Not Track recognition: a message is shown on the first visit, then cookies are declined. Cookie status: `declined`.

Additional methods are provided to respond to cookie consent status in your code, as well as to Do Not Track browser settings.

jQuery CookieBar is freely stylable and positionable and own class names can be specified for the cookiebar and Do Not Track message bars. The accept, decline and privacy policy buttons can also alternatively be incorporated as text links in the text message instead of as separate buttons.


## Installing

Upload the javascript and CSS files to your website and add them between your head tags as usual. Make sure to include the latest version of jQuery if your website does not already use it. Initialise the plugin with `$.cookieBar();` within your  `$(document).ready() { … }` block. A basic setup may look like the following:

```html
	<script src="/your-js-folder/jquery.js"></script>
	<script src="/your-js-folder/jquery.cookiebar.js"></script>
	<script>
		$(document).ready(function() {
			$.cookieBar();
		});
	</script>
```

Refresh your website and the cookie bar should appear!


## Responding to cookie consent status

The plugin on its own just displays the bar and sets a cookie based on the visitor's choice (or the settings you choose). To act on the visitor's choice, you must additionally disable any code that uses cookies or collects personal information such as analytics code. **This does not happen automatically**.


#### Checking for implied consent

Wrap your code in a simple if statement:

```js
	if (jQuery.cookieBar('cookies')) {
		// Google Analytics or other code here
	}
```

This runs the contained code if cookie consent is `enabled` or `accepted`.

#### Checking for explicit consent

As above but additionally pass in the value `accepted` like this:

```js
	if (jQuery.cookieBar('cookies','accepted')) {
		// Google Analytics or other code here
	}
```

This runs the contained code if cookie consent has been explicitly `accepted`.

In addition you should set the following options when initiating the cookie bar:

```js
$.cookieBar(
	autoEnable: false,    // Prevents automatic enabling of cookies
	declineButton: true   // Shows the option to decline cookies
);
```


## Honoring ‘Do Not Track’

To honor a user's ‘Do Not Track’ browser settings, set `honorDnt: true`:

```js
$.cookieBar(
	honorDnt: true
);
```

If the plugin detects that 'Do Not Track' is enabled in the browser settings, it:

* defaults to declining cookies automatically
* shows a different message on the first visit (defined in the setting `dntMessage`)

The cookie bar can be styled different if required by defining a class in the setting `dntCookieBarClass`. By default it sets an additional cookie (defined in `dntCookieName`) which is empty to begin with and contains `seen` once the message has been displayed.

A user can override this setting by explicitly allowing cookies, for example using a button on the privacy policy page.


#### Responding to 'Do Not Track' status

If you are happy with the standard behaviour where ‘Do Not Track’ means cookies are disabled, you need only respond to cookie consent status in your code. If you want more fine-grain control, you can additionally check whether 'Do Not Track' is enabled in your code:

```js
	if (jQuery.cookieBar('donottrack','enabled')) {
		// ‘Tracking has been disabled’ message
	}
```

or potentially more useful:

```js
	if (jQuery.cookieBar('donottrack','disabled')) {
		// Google Analytics or other code here
	}
```

The contained code runs if ’Do Not Track’ is not switched on.


## Setting cookie consent outside the cookiebar

To offer a means for users to opt-out or opt-in from your privacy policy page, for example to revert a previous decision, use the `set` method.

To allow cookies:

```html
	<a href="javascript:void(0);" onClick="jQuery.cookieBar('set','accepted');">Allow cookies</a>
```

To decline cookies:

```html
	<a href="javascript:void(0);" onClick="jQuery.cookieBar('set','declined');">Decline cookies</a>
```


## Options

There are a number of options for customising how the plugin works:

```js
	message: 'We use cookies to track usage and preferences.', // Message displayed on bar
	cookieName: 'cb-enabled', // Name of cookie
	cookieBarClass: '', // Optional class name for cookie bar
	buttonClass: 'cb-button', // Base class name for buttons
	acceptButton: true, // Set to true to show accept/enable button
	acceptText: 'I Understand', // Text on accept/enable button
	acceptFunction: function(cookieValue) {
		if (cookieValue != 'enabled' && cookieValue != 'accepted') window.location = window.location.href;
	}, // Function to run after accept
	declineButton: false, // Set to true to show decline/disable button
	declineText: 'Disable Cookies', // Text on decline/disable button
	declineFunction: function(cookieValue) {
		if (cookieValue == 'enabled' || cookieValue == 'accepted') window.location = window.location.href;
	}, // Function to run after decline
	policyButton: false, // Set to true to show Privacy Policy button
	policyText: 'Privacy Policy', // Text on Privacy Policy button
	policyURL: '/privacy-policy/', // URL of Privacy Policy
	autoEnable: true, // Set to true for cookies to be accepted automatically. Banner still shows
	acceptOnContinue: false, // Set to true to accept cookies when visitor moves to another page
	acceptOnScroll: false, // Set to true to accept cookies when visitor scrolls X pixels up or down
	acceptAnyClick: false, // Set to true to accept cookies when visitor clicks anywhere on the page
	expireDays: 365, // Number of days for cookieBar cookie to be stored for
	renewOnVisit: false, // Renew the cookie upon revisit to website
	forceShow: false, // Force cookieBar to show regardless of user cookie preference
	effect: 'slide', // Options: slide, fade, hide
	element: 'body', // Element to append/prepend cookieBar to. Remember "." for class or "#" for id.
	append: false, // Set to true for cookieBar HTML to be placed at base of website. Actual position may change according to CSS
	fixed: false, // Set to true to add the class "fixed" to the cookie bar. Default CSS should fix the position
	bottom: false, // Force CSS when fixed, so bar appears at bottom of website
	zindex: '', // Can be set in CSS, although some may prefer to set here
	honorDnt: false, // Set to true to respond to Do Not Track browser settings
	dntMessage: 'Your ‘Do Not Track’ browser settings were recognized. Tracking cookies will not be set. You can change your settings on our <a href="{policy_url}">Privacy Policy</a> page.', // Message that appears on browsers with "Do Not Track" on
	dntCookieName: 'donottrack-message', // Name of Do Not Track bar cookie
	dntCookieBarClass: 'cb-donottrack', // Optional additional class name for Do Not Track bar
	domain: String(window.location.hostname), // Location of privacy policy
	referrer: String(document.referrer) // Where visitor has come from
```


## Replacement strings in the message

To include a link to the policy URL as part of the message rather than as a separate button, include `{policy_url}` in the message text, for example:

```js
	$.cookieBar({
		message: 'We use cookies to track usage and preferences. <a href="{policy_url}">Learn more</a>',
		policyURL: '/cookie-policy'
	});
```

To include an accept cookies link or a decline cookies link in the text, insert `{accept_link}` or `{decline_link}` in the message text. The link text from the `acceptText` and `declineText` options will be used but the links will not be styled as buttons. Use the options `acceptButton: false` and `declineButton: false` to suppress the display of the buttons.


## Implied or explicit consent?

The EU General Data Protection Regulation (GDPR) requires that consent be requested before tracking personally identifiable information about website visitors. Opinion is divided on whether users should be given the ability to opt out of cookie usage (i.e. consent is implied but can be revoked), or whether explicit opt-in is required before setting cookies. Implied consent has been the de facto norm since 2012. In late April 2018, however, German data protection authorities suggested in a [Positionspapier](https://www.ldi.nrw.de/mainmenu_Datenschutz/submenu_Technik/Inhalt/TechnikundOrganisation/Inhalt/Zur-Anwendbarkeit-des-TMG-fuer-nicht-oeffentliche-Stellen-ab-dem-25_-Mai-2018/Positionsbestimmung-TMG.pdf) (PDF) that explicit opt-in will be required with the new EU GDPR.


## Troubleshooting

- If the cookiebar does not show, check for any javascript errors in your browser's inspector console.
- If the cookiebar continues to show after accepting or declining, make sure the option `forceShow` is not set in your code, or set it to `forceShow: false`.


## Changelog

* Reduced code duplication
* Added method for testing Do Not Track status separately for more fine-grained control
* Added optional support for “Do Not Track”, customisable message + cookiebar class
* Add a wrapper for the message and buttons for better styling
* User-definable cookie name
* Custom class names for buttons and wrapper for use with existing frameworks
* Add replacement strings for accept and decline links in the message body
* Add aria attributes
* Add stricter if-conditional for 'accepted' cookie state only
* More extensive help
