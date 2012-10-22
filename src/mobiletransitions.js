(function(w){
	w.mobileTransitions = {
		init: function(){
			mt.refreshPages();
			mt.setCurrentPage(mt.transitionPages[0]);
			mt.hideAllExceptActive();
			mt.body = document.querySelector('body');
			mt.body.style['-webkit-transition'] = 'left .2s ease';
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
			mt.body.style['left'] = "-100%"
		},

		returnCenter: function (){
			mt.body.removeEventListener( 'webkitTransitionEnd', mt.returnCenter, false);
			mt.body.style['-webkit-transition-property'] = 'none';
			mt.body.style['left'] = "100%";
			mt.setCurrentPage(mt.pageTo);
			setTimeout(function(){
				mt.body.style['-webkit-transition'] = 'left .2s ease';
				mt.body.style.left = 0;
			},1);
		}
	}
	var mt = w.mobileTransitions;
	window.mt = w.mobileTransitions;
	window.initTransitions = mt.init;
	window.changePage = mt.changePage;
})(window)
