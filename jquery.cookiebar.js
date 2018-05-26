/*
 * Copyright (C) 2012 PrimeBox (info@primebox.co.uk)
 *
 * This work is licensed under the Creative Commons
 * Attribution 3.0 Unported License. To view a copy
 * of this license, visit
 * http://creativecommons.org/licenses/by/3.0/.
 *
 * Documentation available at:
 * http://www.primebox.co.uk/projects/cookie-bar/
 *
 * When using this software you use it at your own risk. We hold
 * no responsibility for any damage caused by using this plugin
 * or the documentation provided.
 */
(function($) {
    $.cookieBar = function(options, val) {
        if (options == 'cookies') {
            var doReturn = 'cookies';
        } else if (options == 'set') {
            var doReturn = 'set';
        } else {
            var doReturn = false;
        }
        var defaults = {
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
            dntMessage: 'Your ‘Do Not Track’ browser settings were recognized. Tracking cookies will not be set. You can change your settings on our <a href="{policy_url}">Privacy Policy</a> page.',
            dntCookieName: 'donottrack-message', // Name of Do Not Track bar cookie
            dntCookieBarClass: 'cb-donottrack', // Optional additional class name for Do Not Track bar
            domain: String(window.location.hostname), // Location of privacy policy
            referrer: String(document.referrer) // Where visitor has come from
        };
        var options = $.extend(defaults, options);

        // Sets expiration date for cookie
        var expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + (options.expireDays * 86400000));
        expireDate = expireDate.toGMTString();

        var cookieEntry = options.cookieName + '={value}; expires=' + expireDate + '; path=/';

        // Retrieves current cookie preference
        var i, cookieValue = '', dntValue = '',
            aCookie, aCookies = document.cookie.split('; ');
        for (i = 0; i < aCookies.length; i++) {
            aCookie = aCookies[i].split('=');
            if (aCookie[0] == options.cookieName) {
                cookieValue = aCookie[1];
            }
            if (aCookie[0] == options.dntCookieName) {
                dntValue = aCookie[1];
            }
        }

        // Test for Do Not Track setting in browser
        var dntEnabled = function() {
            if (typeof window.navigator.doNotTrack !== "undefined") {
                var result = window.navigator.doNotTrack;
                // Mozilla: https://bugzilla.mozilla.org/show_bug.cgi?id=887703
                if (result === "yes") result = "1";
                if (result === "no") result = "0";
                dntStatus = result;
            } else if (typeof window.navigator.msDoNotTrack !== "undefined") {
                // IE9, IE10
                dntStatus = window.navigator.msDoNotTrack;
            } else if (typeof window.doNotTrack !== "undefined") {
                // Safari 7.1.3+, IE11
                dntStatus = window.doNotTrack;
            } else {
                dntStatus = "unspecified";
            }
            dntStatus = { '0': 'Disabled', '1': 'Enabled' }[dntStatus] || 'Unspecified';

            return dntStatus === 'Enabled' ? true : false;
        };

        // Sets up default cookie preference if not already set
        if (options.honorDnt && dntEnabled() && dntValue == '') {
            // Do Not Track is set and detected for the first time -> decline cookies
            cookieValue = 'declined';
            document.cookie = cookieEntry.replace('{value}', 'declined');
        } else if (cookieValue == '' && doReturn != 'cookies' && options.autoEnable) {
            // Autoenable is on -> enable cookies
            cookieValue = 'enabled';
            document.cookie = cookieEntry.replace('{value}', 'enabled');
        } else if ((cookieValue == 'accepted' || cookieValue == 'declined') && doReturn != 'cookies' && options.renewOnVisit) {
            // Renew cookie value on each visit
            document.cookie = cookieEntry.replace('{value}', cookieValue);
        }
        if (options.acceptOnContinue) {
            if (options.referrer.indexOf(options.domain) >= 0 && String(window.location.href).indexOf(options.policyURL) == -1 && doReturn != 'cookies' && doReturn != 'set' && cookieValue != 'accepted' && cookieValue != 'declined') {
                doReturn = 'set';
                val = 'accepted';
            }
        }

        // Test cookie values
        if (doReturn == 'cookies') {
            // STRICT: Returns true if cookies are accepted and 'accepted' is additionally passed as a condition
            if (val == 'accepted' && cookieValue == 'accepted') {
                return true;
            // IMPLIED: Returns true if cookies are enabled or accepted, false otherwise
            } else if (val != 'accepted' && (cookieValue == 'enabled' || cookieValue == 'accepted')) {
                return true;
            } else {
                return false;
            }
        }

        // Set cookie values
        else if (doReturn == 'set' && (val == 'accepted' || val == 'declined')) {
            // Sets value of cookie to 'accepted' or 'declined'
            document.cookie = cookieEntry.replace('{value}', val);
            if (val == 'accepted') {
                return true;
            } else {
                return false;
            }
        }

        // Show cookie bar
        else {

            // If Do Not Track is set and DNT message has not yet been displayed
            if (options.honorDnt && dntEnabled() && dntValue == '') {
                var message = options.dntMessage;
                // set Do Not Track message cookie to 'seen'
                document.cookie = options.dntCookieName + '=seen; expires=' + expireDate + '; path=/';
            } else {
                var message = options.message;
            }

            // Sets up message with drop-in replacements for text-linking policy url
            // and for accept and decline links if preferred instead of buttons
            message = message.replace('{policy_url}', options.policyURL).replace('{accept_link}', '<a href="" class="cb-enable">' + options.acceptText + '</a>').replace('{decline_link}', '<a href="" class="cb-disable">' + options.declineText + '</a>');

            // Sets up enable/accept button if required
            if (options.acceptButton) {
                var acceptButton = '<a href="" class="cb-enable ' + options.buttonClass + '" aria-label="accept cookies" role="button">' + options.acceptText + '</a>';
            } else {
                var acceptButton = '';
            }
            // Sets up disable/decline button if required
            if (options.declineButton) {
                var declineButton = '<a href="" class="cb-disable ' + options.buttonClass + '" aria-label="decline cookies" role="button">' + options.declineText + '</a>';
            } else {
                var declineButton = '';
            }
            // Sets up privacy policy button if required
            if (options.policyButton) {
                var policyButton = '<a href="' + options.policyURL + '" class="cb-policy ' + options.buttonClass + '" aria-label="privacy policy" role="button">' + options.policyText + '</a>';
            } else {
                var policyButton = '';
            }
            // Custom class name for cookie bar if set
            var cbClass = '';
            if (options.cookieBarClass != '') {
                cbClass = ' ' + options.cookieBarClass;
            }
            if (options.honorDnt && (options.dntCookieBarClass != '')) {
                cbClass = cbClass + ' ' + options.dntCookieBarClass;
            }
            // Whether to add "fixed" class to cookie bar
            if (options.fixed) {
                if (options.bottom) {
                    var fixed = ' class="fixed bottom' + cbClass + '"';
                } else {
                    var fixed = ' class="fixed' + cbClass + '"';
                }
            } else {
                if (cbClass != '') {
                    var fixed = ' class="' + cbClass.trim() + '"';
                } else {
                    var fixed = '';
                }
            }
            if (options.zindex != '') {
                var zindex = ' style="z-index:' + options.zindex + ';"';
            } else {
                var zindex = '';
            }

            // If Do Not Track is set and DNT message has not yet been shown
            if (options.honorDnt && dntEnabled() && dntValue == '') {
                if (options.append) {
                    $(options.element).append('<div id="cookie-bar"' + fixed + zindex + ' aria-live="polite" aria-label="cookie-consent-bar" aria-describedby="cb-message"><p><span id="cb-message" class="cb-message">' + message + '</span>');
                } else {
                    $(options.element).prepend('<div id="cookie-bar"' + fixed + zindex + ' aria-live="polite" aria-label="cookie-consent-bar" aria-describedby="cb-message"><p><span id="cb-message" class="cb-message">' + message + '</span>');
                }
            }
            // Displays the cookie bar if arguments met
            else if (options.forceShow || cookieValue == 'enabled' || cookieValue == '') {
                if (options.append) {
                    $(options.element).append('<div id="cookie-bar"' + fixed + zindex + ' aria-live="polite" aria-label="cookie-consent-bar" aria-describedby="cb-message"><p><span id="cb-message" class="cb-message">' + message + '</span><span class="cb-buttons">' + acceptButton + declineButton + policyButton + '</span></p></div>');
                } else {
                    $(options.element).prepend('<div id="cookie-bar"' + fixed + zindex + ' aria-live="polite" aria-label="cookie-consent-bar" aria-describedby="cb-message"><p><span id="cb-message" class="cb-message">' + message + '</span><span class="cb-buttons">' + acceptButton + declineButton + policyButton + '</span></p></div>');
                }
            }

            var removeBar = function(func) {
                if (options.acceptOnScroll) $(document).off('scroll');
                if (typeof(func) === 'function') func(cookieValue);
                if (options.effect == 'slide') {
                    $('#cookie-bar').slideUp(300, function() {
                        $('#cookie-bar').remove();
                    });
                } else if (options.effect == 'fade') {
                    $('#cookie-bar').fadeOut(300, function() {
                        $('#cookie-bar').remove();
                    });
                } else {
                    $('#cookie-bar').hide(0, function() {
                        $('#cookie-bar').remove();
                    });
                }
                $(document).unbind('click', anyClick);
            };
            var cookieAccept = function() {
                document.cookie = cookieEntry.replace('{value}', 'accepted');
                removeBar(options.acceptFunction);
            };
            var cookieDecline = function() {
                var deleteDate = new Date();
                deleteDate.setTime(deleteDate.getTime() - (864000000));
                deleteDate = deleteDate.toGMTString();
                aCookies = document.cookie.split('; ');
                for (i = 0; i < aCookies.length; i++) {
                    aCookie = aCookies[i].split('=');
                    if (aCookie[0].indexOf('_') >= 0) {
                        document.cookie = aCookie[0] + '=0; expires=' + deleteDate + '; domain=' + options.domain.replace('www', '') + '; path=/';
                    } else {
                        document.cookie = aCookie[0] + '=0; expires=' + deleteDate + '; path=/';
                    }
                }
                document.cookie = cookieEntry.replace('{value}', 'declined');
                removeBar(options.declineFunction);
            };
            var anyClick = function(e) {
                if (!$(e.target).hasClass('cb-policy')) cookieAccept();
            };

            $(document).on('click touchstart', '#cookie-bar .cb-enable', function($event) {
                $event.preventDefault();
                cookieAccept();
                return false;
            });
            $(document).on('click touchstart', '#cookie-bar .cb-disable', function($event) {
                $event.preventDefault();
                cookieDecline();
                return false;
            });

            if (options.acceptOnScroll) {
                var scrollStart = $(document).scrollTop(),
                    scrollNew, scrollDiff;
                $(document).on('scroll', function() {
                    scrollNew = $(document).scrollTop();
                    if (scrollNew > scrollStart) {
                        scrollDiff = scrollNew - scrollStart;
                    } else {
                        scrollDiff = scrollStart - scrollNew;
                    }
                    if (scrollDiff >= Math.round(options.acceptOnScroll)) cookieAccept();
                });
            }
            if (options.acceptAnyClick) {
                $(document).bind('click', anyClick);
            }
        }
    };
})(jQuery);
