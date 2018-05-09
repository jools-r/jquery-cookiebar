# jQuery CookieBar Plugin

The EU General Data Protection Regulation (GDRP) requires that consent be requested before tracking personally identifiable information about website visitors. Invariably, this entails clearly requesting permission to set cookies and informing visitors of cookies used and why. Website visitors must be given the option to allow or disable cookies.

Opinion is divided on whether users should be given the ability to opt out of cookie usage (i.e. consent is implied but can be revoked), or whether an explicit opt-in is required before setting cookies. Since 2012, implied consent has been the de facto norm. However, in late April 2018 German data protection authorities suggested in a [Positionspapier](https://www.ldi.nrw.de/mainmenu_Datenschutz/submenu_Technik/Inhalt/TechnikundOrganisation/Inhalt/Zur-Anwendbarkeit-des-TMG-fuer-nicht-oeffentliche-Stellen-ab-dem-25_-Mai-2018/Positionsbestimmung-TMG.pdf) (PDF) that explicit opt-in is required.

The jQuery CookieBar plugin can be used for opt-in, opt-out or partial opt-in/opt-out (e.g. vital cookies active but no tracking) scenarios. On it's own, the plugin just displays a cookie consent message and a corresponding cookie (yes, a cookie is required to store this setting!) with the values `accepted`, `declined` and `enabled`. To disable the use of cookies, you must additionally wrap any javascript dependent on cookie consent in an `if`-statement as described below.

Note: jQuery CookieBar is for simple universal consent situations and does not provide any means for more granular control of different kinds of cookie usage.


## Introduction

The cookie bar plugin creates a small bar at the top or bottom of the website with a short message about cookies and accept, decline, and privacy policy buttons. Once a user has made the decision to either accept or decline, the cookie bar slides up and disappears.

The cookie bar can be set up to work in a variety of ways. By default, it uses assumed consent. This means that when a user visits the website, cookies can be set as normal with no interruption. The cookie bar is still displayed to provide the user with options for cookies.

It can also be set up to assume refusal. So when a user visits the website, no cookies should be set until they press the accept button on the cookie bar.

You can specify which buttons show on the cookie bar. The default is to show the accept and privacy policy buttons and no decline button. This way, assumed consent is used, and the user cannot opt out of cookies. If the user is unhappy about the use of cookies, they can simply leave the website.

The cookie bar is also very easy to style. There are just 9 lines of CSS code in total. Changing the heights, widths, background colours, etc. is very quick and easy meaning it can fit in with the website design and colour scheme.

## Installing

To start, download the zip file containing the cookie bar plugin, a CSS file and example HTML document. Upload the javascript and CSS files to your website and add them between your head tags. Make sure to download the latest version of jQuery if your website does not already include it.

You will also need to initialise the cookie bar, which can be done with the following code (Make sure if you already use $(document).ready() that you only copy what you need of below so you don't have too many $(document).ready()'s).

	$(document).ready(function(){
	  $.cookieBar();
	});

Refresh your website, and the cookie bar should appear!

A basic setup may look like the following:

	<script src="/your-js-folder/jquery.js"></script>
	<script src="/your-js-folder/jquery.cookiebar.js"></script>
	<script>
	  $(document).ready(function(){
	     $.cookieBar();
	  });
	</script>

**If the cookiebar does not show, check for any javascript errors.**

**If the cookiebar continues to show after accepting/declining, make sure to remove the option "forceShow" from your code, or set it to "false".**

## Disabling Google Analytics and other cookies

If a user chooses to disable cookies (if you give them that option), you need to make sure that scripts such as Google Analytics need to be disabled.

This can be done by wrapping the code in a simple if statement.

	if(jQuery.cookieBar('cookies')){
	  //Google Analytics or other code here
	}

## Options

There are a number of options allowing you to customise how the plugin works:

	message: 'We use cookies to track usage and preferences',
	acceptButton: true,
	acceptText: 'I Understand',
	acceptFunction: null,
	cookieName: 'cb-enabled',
	declineButton: false,
	declineText: 'Disable Cookies',
	declineFunction: null,
	policyButton: true,
	policyText: 'Privacy Policy',
	policyURL: '/privacy-policy/',
	autoEnable: true,
	acceptOnContinue: false,
	acceptOnScroll: false,
	acceptAnyClick: false,
	expireDays: 365,
	renewOnVisit: false,
	forceShow: false,
	effect: 'slide',
	element: 'body',
	append: false,
	fixed: false,
	bottom: false,
	zindex: '',
	domain: 'www.example.com',
	referrer: 'www.example.com'

To include a link to the policy URL as part of the message rather than as a separate button, include `{policy_url}` in the message text, for example:

	$.cookieBar({
		message: 'We use cookies to track usage and preferences. <a href="{policy_url}">Learn more</a>.',
		policyURL: '/cookie-policy'
	});

## Additional methods

To offer a means for users to opt out or opt in from your privacy policy page, for example to revert a previous decision, use the `set` method.

To allow cookies:

	<a href="javascript:void(0);" onClick="jQuery.cookieBar('set','accepted');">Allow cookies</a>

To decline cookies:

	<a href="javascript:void(0);" onClick="jQuery.cookieBar('set','declined');">decline cookies</a>

To simply reset and make the bar reappear:

	<a href="javascript:void(0);" onClick="jQuery.cookieBar('set','enabled');">Reset cookie consent</a>
