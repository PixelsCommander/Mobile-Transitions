(function (w) {
    w.mobileTransitions = {
        init: function (pageToSet) {
            mt.counter = 0;

            if (navigator.userAgent.toLowerCase().indexOf('webkit') !== -1) {
                mt.transitionEndEventName = 'webKitTransitionEnd';
            } else {
                mt.transitionEndEventName = 'transitionend';
            }

            mt.refreshPages();
            mt.setCurrentPage(pageToSet || mt.transitionPages[mt.transitionPages.length - 1]);
            mt.hideAllExceptActive();
            mt.body =  mt.transitionPages[0].parentNode;

            mt.transitionPages[0].parentNode.style[this.prefix.css + 'backface-visibility'] = 'hidden';
            mt.transitionPages[0].parentNode.style[this.prefix.css + 'transform'] = 'translateX(0) translateZ(0)';
            mt.transitionPages[0].parentNode.style[this.prefix.css + 'transition'] = mt.prefix.css + 'transform .3s ease-in-out';
            mt.transitionPages[0].parentNode.style.position = 'relative';
            mt.transitionPages[0].parentNode.width = '100%';

            mt.movePageRight = mt.movePageRightWithTransform;
            mt.movePageLeft = mt.movePageLeftWithTransform;
        },

        changePage: function (pageId) {
            mt.counter++;

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
            mt.pageTo.style[mt.prefix.css + 'backface-visibility'] = 'hidden';
            mt.moveLeft();
        },

        moveLeft: function () {
            setTimeout(function () {
                mt.movePageRight(mt.pageTo);
                mt.showPage(mt.pageTo);
                mt.body.style[mt.prefix.css + 'transform'] = "translateX(-100%)";
                setTimeout(mt.returnCenter, 300);
                mt.timeFinished = Date.now();
            }, 1);
        },

        returnCenter: function (e) {
            if (e === undefined || e.target === mt.pageTo.parentNode) {
                mt.hidePage(mt.currentPage);
                mt.setCurrentPage(mt.pageTo);
                mt.pageTo.parentNode.style[mt.prefix.css + 'transition'] = 'none';
                mt.pageTo.parentNode.style[mt.prefix.css + 'transform'] = "translateX(0)";
                mt.movePageLeft(mt.pageTo);

                setTimeout(function () {
                    mt.pageTo.parentNode.style[mt.prefix.css + 'transition'] = mt.prefix.css + 'transform .3s ease-in-out';
                }, 1);
            }
        },

        refreshPages: function () {
            mt.transitionPages = document.querySelectorAll('.page');

            for (var i = 0; i < mt.transitionPages.length; i++) {
                mt.transitionPages[i].style.position = 'absolute';
                mt.transitionPages[i].style.left = '0px';
                mt.transitionPages[i].style.top = '0px';
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
            mt.refreshPages();
            for (var i = 0; i < mt.transitionPages.length; i++) {
                if (mt.transitionPages[i] !== mt.currentPage) {
                    this.hidePage(mt.transitionPages[i]);
                } else {
                    this.showPage(mt.transitionPages[i]);
                }
            }
        },

        hidePage: function (page) {
            page.style.visibility = 'hidden';
            if (mt.currentPage.onhide !== undefined && mt.currentPage.onhide !== null) {
                mt.currentPage.onhide();
            }
        },

        showPage: function (page) {
            page.style.visibility = 'visible';
            if (mt.currentPage.onshow !== undefined && mt.currentPage.onshow !== null) {
                mt.currentPage.onshow();
            }
        },

        getEvent: function (type) {
            var evt = document.createEvent('Event');
            evt.initEvent(type, true, true);
            return evt;
        },

        movePageLeftWithTransform: function (pageNode) {
            console.log('moved left ' + pageNode.id);
            pageNode.style[mt.prefix.css + 'transform'] = "translateX(0px)";
        },

        movePageRightWithTransform: function (pageNode) {
            console.log('moved right ' + pageNode.id);
            pageNode.style[mt.prefix.css + 'transform'] = "translateX(100%)";
        },

        prefix: (function () {
            var styles = window.getComputedStyle(document.documentElement, ''),
                pre = (Array.prototype.slice
                    .call(styles)
                    .join('')
                    .match(/-(webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
                    )[1] || '',
                dom = ('WebKit|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1] || '';

            var cssPrefix = pre === '' ? '' : '-' + pre + '-';
            var jsPrefix = pre.length === 0 ? '' : pre[0].toUpperCase() + pre.substr(1);

            var result = {
                dom: dom,
                lowercase: pre,
                css: cssPrefix,
                js: jsPrefix
            }

            return result;
        })()
    }
    var mt = w.mobileTransitions;
    window.mt = w.mobileTransitions;
    window.initTransitions = mt.init;
    window.changePage = mt.changePage;
})(window)
