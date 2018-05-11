# jQuery CookieBar Plugin

**A lightweight (4kb minified) customisable and freely stylable jQuery cookie consent bar that can be used for implied and explicit opt-in and opt-out scenarios. It includes a jQuery wrapper function for consent-dependent functionality and methods for resetting cookie consent options, e.g. from a privacy policy page.**

*Note: jQuery Cookiebar is for simple universal consent situations and does not provide any means for more granular control of different kinds of cookie usage.*

## Background

The EU General Data Protection Regulation (GDRP) requires that consent be requested before tracking personally identifiable information about website visitors. Invariably, this entails clearly requesting permission to set cookies and informing visitors of cookies used and why. Website visitors must be given the option to allow or disable cookies.

Opinion is divided on whether users should be given the ability to opt out of cookie usage (i.e. consent is implied but can be revoked), or whether an explicit opt-in is required before setting cookies. Since 2012, implied consent has been the de facto norm. However, in late April 2018 German data protection authorities suggested in a [Positionspapier](https://www.ldi.nrw.de/mainmenu_Datenschutz/submenu_Technik/Inhalt/TechnikundOrganisation/Inhalt/Zur-Anwendbarkeit-des-TMG-fuer-nicht-oeffentliche-Stellen-ab-dem-25_-Mai-2018/Positionsbestimmung-TMG.pdf) (PDF) that explicit opt-in is required.

jQuery CookieBar can be used for opt-in, opt-out or partial opt-in/opt-out (e.g. vital cookies active but no tracking) scenarios. On it's own, the plugin just displays a cookie consent message and a corresponding cookie (yes, a cookie is required to store this setting!) with the values `accepted`, `declined` and `enabled`. To disable the use of cookies, you must additionally wrap any javascript dependent on cookie consent in an `if`-statement as described below.


## Introduction

The cookie bar plugin creates a small bar at the top or bottom of the website with a short message about cookies and accept, decline, and privacy policy buttons. Once a user has made the decision to either accept or decline, the cookie bar slides up and disappears.

The cookie bar can be set up to work in a variety of ways. By default, it uses assumed consent. This means that when a user visits the website, cookies can be set as normal with no interruption. The cookie bar is still displayed to provide the user with options for cookies.

It can also be set up to assume refusal. In this case no cookies are set when a user visits the website until the user clicks the accept button on the cookie bar.

You can specify which buttons show on the cookie bar. The default is to show the accept and privacy policy buttons and no decline button. The accept, decline and privacy policy buttons can alternatively be incorporated as text links in the text message.

The cookie bar is very easy to style. There are just a few CSS selectors in total. Changing the heights, widths, background colours, etc. is very quick and easy meaning it can fit in with the website design and colour scheme. Own class names can be applied to the cookiebar wrapper and buttons to style them as part of a larger library.

## Installing

To start, download the zip file containing the cookie bar plugin, a CSS file and example HTML document. Upload the javascript and CSS files to your website and add them between your head tags. Make sure to download the latest version of jQuery if your website does not already include it.

You will also need to initialise the cookie bar, which can be done with the following code (Make sure if you already use `$(document).ready()` that you only copy what you need of below so you don't have too many `$(document).ready()`'s).

```js
	$(document).ready(function() {
		$.cookieBar();
	});
```

Refresh your website and the cookie bar should appear!

A basic setup may look like the following:

```html
	<script src="/your-js-folder/jquery.js"></script>
	<script src="/your-js-folder/jquery.cookiebar.js"></script>
	<script>
		$(document).ready(function() {
			$.cookieBar();
		});
	</script>
```

**If the cookiebar does not show, check for any javascript errors.**

**If the cookiebar continues to show after accepting/declining, make sure to remove the option "forceShow" from your code, or set it to "false".**

## Disabling Google Analytics and other cookies

If a user chooses to disable cookies (if you give them that option), you need to make sure that scripts such as Google Analytics need to be disabled.

This can be done by wrapping the code in a simple if statement.

```js
	if (jQuery.cookieBar('cookies')) {
		// Google Analytics or other code here
	}
```

## Options

There are a number of options allowing you to customise how the plugin works:

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
	domain: String(window.location.hostname), // Location of privacy policy
	referrer: String(document.referrer) // Where visitor has come from
```

## Replacement strings

To include a link to the policy URL as part of the message rather than as a separate button, include `{policy_url}` in the message text, for example:

```js
	$.cookieBar({
		message: 'We use cookies to track usage and preferences. <a href="{policy_url}">Learn more</a>.',
		policyURL: '/cookie-policy'
	});
```

To include an accept cookies link or a decline cookies link in the text, insert `{accept_link}` or `{decline_link}` in the message text. The link text from the `acceptText` and `declineText` options will be used but the links will not be styled as buttons. Use the options `acceptButton: false` and `declineButton: false` to suppress the display of the buttons.

## Additional methods

To offer a means for users to opt out or opt in from your privacy policy page, for example to revert a previous decision, use the `set` method.

To allow cookies:

```html
	<a href="javascript:void(0);" onClick="jQuery.cookieBar('set','accepted');">Allow cookies</a>
```

To decline cookies:

```html
	<a href="javascript:void(0);" onClick="jQuery.cookieBar('set','declined');">Decline cookies</a>
```

To reset to implied consent state and make the bar reappear:

```html
	<a href="javascript:void(0);" onClick="jQuery.cookieBar('set','enabled');">Reset cookie consent</a>
```

To reset cookie consent entirely:

```html
	<a href="javascript:void(0);" onClick="jQuery.cookieBar('set','');">Reset cookie consent</a>
```

## Changelog

* Add a wrapper for the message and buttons for better styling
* User-definable cookie name
* Custom class names for buttons and wrapper for use with existing frameworks
* Add replacement strings for accept and decline links in the message body
* Add aria attributes
* More extensive help
