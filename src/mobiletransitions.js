(function(w){
    w.mobileTransitions = {
        init: function(){
            mt.refreshPages();
            mt.setCurrentPage(mt.transitionPages[mt.transitionPages.length - 1]);
            mt.hideAllExceptActive();
            mt.body = document.querySelector('body');
            mt.transitionPages[0].parentNode.style['-webkit-backface-visibility'] = 'hidden';
            mt.transitionPages[0].parentNode.style['-webkit-perspective'] = '1000';
            mt.transitionPages[0].parentNode.style['-webkit-transform'] = 'translateX(0) translateZ(0)';
            mt.transitionPages[0].parentNode.style['-webkit-transition'] = 'all .3s ease';
            mt.transitionPages[0].parentNode.style['position'] = 'relative';

            //For mobile setting left works faster, for desktop translate wins
            if (mt.isMobile.any() === true) {
                mt.movePageRight = mt.movePageRightWithLeft;
                mt.movePageLeft = mt.movePageLeftWithLeft;
            } else {
                mt.movePageRight = mt.movePageRightWithTransform;
                mt.movePageLeft = mt.movePageLeftWithTransform;
            }
        },

        changePage: function(pageId){
            mt.timeStarted = Date.now();
            if (mt.currentPage === undefined){
                mt.init();
            }

            if (pageId === mt.currentPage.id) {
                return;
            }

            mt.pageTo = document.getElementById(pageId);
            mt.pageTo.style['-webkit-backface-visibility'] = 'hidden';
            mt.pageTo.style['-webkit-perspective'] = '1000';
            mt.pageTo.style['-webkit-transform'] = 'translateZ(0)';
            mt.moveLeft();
        },

        refreshPages: function(){
            mt.transitionPages = document.getElementsByClassName('page');
        },

        setCurrentPage: function (element){
            if (mt.currentPage !== undefined){
                mt.currentPage.dispatchEvent(mt.getEvent('pagehide'));
            }

            mt.currentPage = element;
            mt.currentPage.style.visibility = 'visible';
            mt.currentPage.dispatchEvent(mt.getEvent('pageshow'));
            mt.hideAllExceptActive();
            mt.currentPage.wasUsed = true;
        },

        moveLeft: function(){
            setTimeout(function(){
                mt.movePageRight(mt.pageTo);
                mt.pageTo.style.visibility = 'visible';
                mt.body.addEventListener( 'webkitTransitionEnd', mt.returnCenter, false);
                mt.pageTo.parentNode.style['-webkit-transform'] = "translateX(-100%)";
                mt.timeFinished = Date.now();
            },1);
        },

        returnCenter: function (){
            mt.setCurrentPage(mt.pageTo);
            mt.body.removeEventListener( 'webkitTransitionEnd', mt.returnCenter, false);
            mt.pageTo.parentNode.style['-webkit-transition'] = 'none';
            mt.pageTo.parentNode.style['-webkit-transform'] = "translateX(0)";
            mt.movePageLeft(mt.pageTo);

            setTimeout(function(){
                mt.pageTo.parentNode.style['-webkit-transition'] = 'all .3s ease';
            },1);
        },

        hideAllExceptActive: function(){
            mt.refreshPages();
            for(var i = 0; i < mt.transitionPages.length; i++){
                if (mt.transitionPages[i] !== mt.currentPage){
                    mt.transitionPages[i].style.visibility = 'hidden';
                } else {
                    mt.transitionPages[i].style.visibility = 'visible';
                }
            }
        },

        getEvent: function(type){
            var evt = document.createEvent('Event');
            evt.initEvent(type, true, true);
            return evt;
        },

        movePageLeftWithLeft: function(pageNode){
            pageNode.style['left'] = "0";
        },

        movePageLeftWithTransform: function(pageNode){
            pageNode.style['-webkit-transform'] = "translateX(0)";
        },

        movePageRightWithLeft: function(pageNode){
            pageNode.style['left'] = "100%";
        },

        movePageRightWithTransform: function(pageNode){
            console.log('moved right ' + pageNode .id);
            pageNode.style['-webkit-transform'] = "translateX(100%)";
        },

        isMobile: {
            Android: function() {
                return navigator.userAgent.toLowerCase().match(/android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.toLowerCase().match(/blackberry/i);
            },
            iOS: function() {
                return navigator.userAgent.toLowerCase().match(/iphone|ipad|ipod/i);
            },
            Opera: function() {
                return navigator.userAgent.toLowerCase().match(/opera mini/i);
            },
            Windows: function() {
                return navigator.userAgent.toLowerCase().match(/iemobile/i);
            },
            any: function() {
                return (mt.isMobile.Android() || mt.isMobile.BlackBerry() || mt.isMobile.iOS() || mt.isMobile.Opera() || mt.isMobile.Windows());
            }
        }
    }
    var mt = w.mobileTransitions;
    window.mt = w.mobileTransitions;
    window.initTransitions = mt.init;
    window.changePage = mt.changePage;
})(window)
