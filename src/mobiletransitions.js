(function(w){
	w.mobileTransitions = {
		init: function(){
			mt.refreshPages();
			mt.setCurrentPage(mt.transitionPages[0]);
			mt.hideAllExceptActive();
			mt.body = document.querySelector('body');			
			mt.body.style['-webkit-backface-visibility'] = 'hidden';
			mt.body.style['-webkit-perspective'] = '1000';
			mt.body.style['-webkit-transform'] = 'translateX(0) translateZ(0)';
			mt.body.style['-webkit-transition'] = 'all .3s ease';
			mt.body.style['position'] = 'relative';
			if (mt.isMobile.any() === true) {
				mt.moveNextPageRight = mt.moveNextPageRightWithLeft;
				mt.moveNextPageLeft = mt.moveNextPageLeftWithLeft;
			} else {
				mt.moveNextPageRight = mt.moveNextPageRightWithTransform;
				mt.moveNextPageLeft = mt.moveNextPageLeftWithTransform;
			}
		},

		changePage: function(pageId){
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
		},

		moveLeft: function(element){
			mt.startDate = new Date().getTime();
			setTimeout(function(){
				mt.moveNextPageRight();
                mt.pageTo.style.visibility = 'visible';
				mt.body.addEventListener( 'webkitTransitionEnd', mt.returnCenter, false);
				mt.body.style['-webkit-transform'] = "translateX(-100%)";
			},1);
		},

		returnCenter: function (){
			mt.setCurrentPage(mt.pageTo);
			mt.body.removeEventListener( 'webkitTransitionEnd', mt.returnCenter, false);
			mt.body.style['-webkit-transition'] = 'none';
			mt.body.style['-webkit-transform'] = "translateX(0)";
			mt.moveNextPageLeft();
			setTimeout(function(){
				mt.body.style['-webkit-transition'] = 'all .3s ease';
				mt.finishDate = new Date().getTime();
				console.log('Time spent: ' + (mt.finishDate - mt.startDate));
			},1);
		},

		hideAllExceptActive: function(){
			mt.refreshPages();
			for(var i = 0; i < mt.transitionPages.length; i++){
				if (mt.transitionPages[i] !== mt.currentPage){
					//mt.transitionPages[i].style['display'] = 'none';
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

		moveNextPageLeftWithLeft: function(){
			mt.pageTo.style['left'] = "0";
		},

		moveNextPageLeftWithTransform: function(){
			mt.pageTo.style['-webkit-transform'] = "translateX(0%)";
		},

		moveNextPageRightWithLeft: function(){
			mt.pageTo.style['left'] = "100%";
		},

		moveNextPageRightWithTransform: function(){
			mt.pageTo.style['-webkit-transform'] = "translateX(100%)";
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
