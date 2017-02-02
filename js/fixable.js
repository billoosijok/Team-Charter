
window.addEventListener('load', function() {

  var el = document.querySelector('.fixable');
 
  MakeFixable(el);

});

function MakeFixable(el) {

	var elPosition = elPositionInPage(el);
  var elContainer = el.parentNode;
  var elContainerPosition = elPositionInPage(elContainer);

  var lastYPos = 0;

	window.addEventListener('scroll', function() {

    if(window.innerWidth > 600) {
      if(elPosition.y - 20 <= pageYOffset) {
      if(pageYOffset > lastYPos) {
        el.style.position = 'fixed';
        // el.style.top = (pageYOffset - elContainerPosition.y) + "px";
      } else {
        // el.style.top = Math.max(0, pageYOffset - elContainerPosition.y) + "px";
      }
    } else {
      el.style.top = 0;
      el.style.position = '';
    }
    lastYPos = pageYOffset;
    }
		
	});

}

function elPositionInPage(el) {
  // Getting the offset of the el in relation to the top
  // of the page ..
  // getBoundingClientRect().top only gets the position of
  // the element in relation to the window. So we calculate
  //  the difference
  var bodyCords = document.body.getBoundingClientRect();
  var elCords = el.getBoundingClientRect();

  var bodyYOffset = bodyCords.top;
  var bodyXOffset = bodyCords.left;
  var elYOffset = elCords.top;
  var elXOffset = elCords.left;

  var elYPosition =  elYOffset - bodyYOffset;
  var elXPosition =  elXOffset - bodyXOffset;

  return {x: elXPosition, y: elYPosition, height: elCords.height, with: elCords.width};
}