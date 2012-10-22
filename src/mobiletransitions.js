(function(w){
	w.mobileTransitions = {
		init: function(){
			mt.refreshPages();
			mt.setCurrentPage(mt.transitionPages[0]);
			mt.hideAllExceptActive();
			mt.body = document.querySelector('body');
			mt.body.style['-webkit-transform'] = 'translateX(0)';
			mt.body.style['-webkit-backface-visibility'] = 'hidden';
			mt.body.style['-webkit-transition'] = 'all .2s ease';
			mt.body.style['position'] = 'relative';

		},

		changePage: function(pageId){
			if (mt.currentPage === undefined){
				mt.init();
			}

			if (pageId === mt.currentPage.id) {
				return;
			}
			mt.pageTo = document.getElementById(pageId);
			mt.moveLeft();
		},

		refreshPages: function(){
			mt.transitionPages = document.getElementsByClassName('page');
		},

		setCurrentPage: function (element){
			mt.currentPage = element;
			mt.hideAllExceptActive();
		},

		hideAllExceptActive: function(){
			mt.refreshPages();
			for(var i = 0; i < mt.transitionPages.length; i++){
				if (mt.transitionPages[i] !== mt.currentPage){
					mt.transitionPages[i].style['display'] = 'none';
				} else {
					mt.transitionPages[i].style['display'] = 'block';
				}
			}
		},

		moveLeft: function(element){
			mt.body.addEventListener( 'webkitTransitionEnd', mt.returnCenter, false);
			mt.body.style['-webkit-transform'] = "translateX(-100%)";
		},

		returnCenter: function (){
			mt.currentPage.dispatchEvent(mt.getEvent('pagehide'));
			mt.body.removeEventListener( 'webkitTransitionEnd', mt.returnCenter, false);
			mt.body.style['-webkit-transition-property'] = 'none';
			mt.body.style['-webkit-transform'] = "translateX(100%)";
			mt.setCurrentPage(mt.pageTo);
			setTimeout(function(){
				mt.currentPage.dispatchEvent(mt.getEvent('pageshow'));
				mt.body.style['-webkit-transition'] = 'all .2s ease';
				mt.body.style['-webkit-transform'] = "translateX(0%)";
			},1);
		},

		getEvent: function(type){
			var evt = document.createEvent('Event');
			evt.initEvent(type, true, true);
			return evt;
		}
	}
	var mt = w.mobileTransitions;
	window.mt = w.mobileTransitions;
	window.initTransitions = mt.init;
	window.changePage = mt.changePage;
})(window)
