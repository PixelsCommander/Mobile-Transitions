(function (w) {
    w.mobileTransitions = {
        init: function (pageToSet) {
            mt.transitionTimeout = 300; //Just change to time in milliseconds you like to have
            mt.refreshPagesList();
            mt.setCurrentPage(pageToSet || mt.transitionPages[mt.transitionPages.length - 1]);
            mt.hideAllExceptActive();
            mt.initCSSPrefix();
            mt.initTransitionsSupport();
            mt.initEventName();
            mt.initContainer(mt.transitionPages[0].parentNode);
        },

        changePage: function (pageId) {
            mt.timeStarted = Date.now();
            if (mt.currentPage === undefined) {
                mt.init();
            }

            if (pageId === mt.currentPage.id) {
                return false;
            }

            mt.currentPage.oldOverflow = mt.currentPage.style.overflow;
            mt.currentPage.style.overflow = 'hidden';

            mt.pageTo = document.getElementById(pageId);
            mt.moveLeft();
        },

        moveLeft: function () {
            setTimeout(function () {
                mt.movePageRight(mt.pageTo);
                mt.showPage(mt.pageTo);
                mt.container.style[mt.cssPrefix + 'transform'] = "translateX(-100%)";
                setTimeout(mt.returnCenter, mt.transitionTimeout);
                mt.timeFinished = Date.now();
            }, 0);
        },

        returnCenter: function (e) {
            if (e === undefined || e.target === mt.pageTo.parentNode) {
                mt.hidePage(mt.currentPage);
                mt.setCurrentPage(mt.pageTo);
                mt.pageTo.parentNode.style[mt.cssPrefix + 'transition'] = 'none';
                mt.pageTo.parentNode.style[mt.cssPrefix + 'transform'] = "translateX(0)";
                mt.movePageLeft(mt.pageTo);
                setTimeout(function () {
                    mt.pageTo.parentNode.style[mt.cssPrefix + 'transition'] = mt.cssPrefix + 'transform ' + mt.transitionTimeout + 'ms ease-in-out';
                }, 0);
            }
        },

        refreshPagesList: function () {
            mt.transitionPages = document.querySelectorAll('.page');

            for (var i = 0; i < mt.transitionPages.length; i++) {
                mt.transitionPages[i].style.position = 'absolute';
                mt.transitionPages[i].style.left = '0px';
                mt.transitionPages[i].style.top = '0px';
                mt.transitionPages[i].style[mt.cssPrefix + 'backface-visibility'] = 'hidden';
            }
        },

        setCurrentPage: function (element) {
            if (mt.currentPage !== undefined) {
                mt.hidePage(mt.currentPage)
                mt.currentPage.dispatchEvent(mt.getEvent('pagehide'));
            }
            mt.currentPage = element;
            mt.currentPage.style.overflow = mt.currentPage.oldOverflow;
            mt.showPage(mt.currentPage);
            mt.currentPage.dispatchEvent(mt.getEvent('pageshow'));
            mt.currentPage.wasUsed = true;
        },

        hideAllExceptActive: function () {
            //mt.refreshPagesList();
            for (var i = 0; i < mt.transitionPages.length; i++) {
                if (mt.transitionPages[i] !== mt.currentPage) {
                    this.hidePage(mt.transitionPages[i]);
                } else {
                    this.showPage(mt.transitionPages[i]);
                }
            }
        },

        hidePage: function (page) {
            if (page.style.visibility !== 'hidden') {
                page.style.visibility = 'hidden';
                if (mt.currentPage !== undefined && mt.currentPage.onhide !== undefined && mt.currentPage.onhide !== null) {
                    mt.currentPage.onhide();
                }
            }
        },

        showPage: function (page) {
            if (page.style.visibility !== 'visible') {
                page.style.visibility = 'visible';
                if (mt.currentPage.onshow !== undefined && mt.currentPage.onshow !== null) {
                    mt.currentPage.onshow();
                }
            }
        },

        getEvent: function (type) {
            var evt = document.createEvent('Event');
            evt.initEvent(type, true, true);
            return evt;
        },

        movePageLeft: function (pageNode) {
            //console.log('moved left ' + pageNode.id);
            pageNode.style[mt.cssPrefix + 'transform'] = "translateX(0px)";
        },

        movePageRight: function (pageNode) {
            //console.log('moved right ' + pageNode.id);
            pageNode.style[mt.cssPrefix + 'transform'] = "translateX(100%)";
        },

        initEventName: function () {
            if (navigator.userAgent.toLowerCase().indexOf('webkit') !== -1) {
                mt.transitionEndEventName = 'webKitTransitionEnd';
            } else {
                mt.transitionEndEventName = 'transitionend';
            }
        },

        initContainer: function (node) {
            mt.container = node;
            node.style[mt.cssPrefix + 'backface-visibility'] = 'hidden';
            node.style[mt.cssPrefix + 'transform'] = 'translateX(0) translateZ(0)';
            node.style[mt.cssPrefix + 'transition'] = mt.cssPrefix + 'transform ' + mt.transitionTimeout + 'ms ease-in-out';
            node.style.position = 'relative';
            node.width = '100%';
        },

        initTransitionsSupport: function () {
            var ieVersion = (navigator.userAgent.indexOf('msie') !== -1) ? parseInt(navigator.userAgent.split('msie')[1], 10) : false;

            if (ieVersion !== false && ieVersion < 10) {
                mt.transitionTimeout = 0;
                mt.transitionsSupported = false;
            } else {
                mt.transitionsSupported = true;
            }
        },

        initCSSPrefix: function () {
            var styles = window.getComputedStyle(document.documentElement, ''),
                pre = (Array.prototype.slice
                    .call(styles)
                    .join('')
                    .match(/-(webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
                    )[1] || '',
                dom = ('WebKit|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1] || '';

            mt.cssPrefix = pre === '' ? '' : '-' + pre + '-';
        }
    }
    var mt = w.mobileTransitions;
    window.mt = w.mobileTransitions;
    window.initTransitions = mt.init;
    window.changePage = mt.changePage;
})(window)
