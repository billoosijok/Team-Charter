$(function() {
  HTMLElement.prototype.hasClass = function(className) {
    var classes = this.className;
    var regEx = new RegExp("\\b"+className+"\\b");
    return regEx.test(classes);
  }

  MakeCardFlippable('.card.two-sided');

  lockRatio('.lock-ratio', 1);

  var el = $('.side-bar nav');
  var content = $('.rules main');
  MakeFixableAlongSide(el, content, 600);

  makeScrollLinksAnimated();

  $('body').css({
    position: 'relative',
    top: 100,
    opacity: 0
  }).animate({
    top: 0,
    opacity: 1
  });
});

function makeScrollLinksAnimated() {

	// This shall select any anchor tag that presumably is trying to
	// link to an element in the same page, because it starts with '#'


	var scrollLink = document.querySelectorAll("a[href^='#']");
	// Modifying the click event of each of them.
	for (var i = 0; i < scrollLink.length; i++) {
		scrollLink[i].addEventListener('click', function(e) {
			// This is to prevent paganation
			if(e.target.nodeName == "A") {
				e.preventDefault();

				// Selecting the scroll target element based on the
				// link that is in the clicked 'a' element.
				var scrollTargetId = e.target.getAttribute('href');
				var scrollTarget = document.querySelector(scrollTargetId);



				// Getting the offset of the target-element in relation to the top
				// of the page ..
				// getBoundingClientRect().top only gets the position of
				// the element in relation to the window. So we calculate
				//  the difference

				var bodyMargin = window.getComputedStyle(document.body, null).getPropertyValue('margin-top');
				var bodyOffset = document.body.getBoundingClientRect().top;
				var targetOffset = scrollTarget.getBoundingClientRect().top;
				var positionY =  targetOffset - bodyOffset;

				// Finally calling the glorious function the does the scrolling.
				scrollY(positionY, 300);

				// Just to update the address bar.
				window.location.hash = scrollTargetId;
			}
		});

	}

}

function scrollY(targetOffset, duration) {

	// Giving it a default value, in case it wasn't present.

	duration = duration || 500;

	// The distance between the target pageOffset and the current
	// pageOffset of the page/scrollbar

	var currentOffset = window.pageYOffset;
	var distance = targetOffset - currentOffset;

	// The start time of the animation .. Needed to calculate the progress
	// in the animator function;

	var start = null;

	function animator(timestamp) {

		if(!start) start = timestamp;

		var progress = timestamp - start;

		if (progress < duration) {

			// Eplaining what's happening here:
			// if {progress} = 500, {duration} = 1000.
			// (progress/duration) = 0.5 * distance = half_the_distance.
			//
			// So eventually progress = 1000. and (progress/duration) = 1.
			// so the distance will eventually be {distance * 1} .. Get it?

			var newOffset = currentOffset + (Math.sqrt((progress/duration),0.6) * distance)
			window.scrollTo(0, newOffset);

			// This will call the animator function 30 times per second (Sometimes 60)
			// also it passes the current timestamp everytime. So you can see how
			// {progress} updates.
			requestAnimationFrame(animator);
		} else {
			// If the progress goes over the duration, it means we're done
			// so we jst jump to the target. Just in case!
			window.scrollTo(0, targetOffset)
		}
	}

	// Initial call
	requestAnimationFrame(animator)

}


function MakeFixableAlongSide(el,content, untilWidth) {


  untilWidth = untilWidth || 0;
	var elPosition = elPositionInPage(el[0]);
  var elContainer = el[0].parentNode;
  var elContainerPosition = elPositionInPage(elContainer);
  var contentDimensions = elPositionInPage(content[0]);

  var lastYPos = 0;


	window.addEventListener('scroll', function() {

    if(Math.max(window.innerWidth, document.documentElement.clientWidth) > untilWidth) {

      if(elPosition.y - 20 <= pageYOffset) {

        if(pageYOffset > lastYPos) {
          el.addClass('fixable');
          el[0].style.top = ((pageYOffset / contentDimensions.height) * elPosition.height) + "px";
        } else {
          el[0].style.top = Math.max(0, (pageYOffset / contentDimensions.height) * elPosition.height + 10) + "px";
        }

      } else {
          el.removeClass('fixable');
      }
    }

    lastYPos = pageYOffset;


	});
  window.addEventListener('resize', function() {
    if(Math.max(window.innerWidth, document.documentElement.clientWidth) < untilWidth) {
      el.removeClass('fixable');
      el[0].style.position = '';
      // console.log('works');
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


function lockRatio(selector, ratio) {
  var elements = $(selector);

  elements.each(function (index, el) {
      $(this).height(window.getComputedStyle(el, null).getPropertyValue('width'));
    });

  $(window).resize(function() {

    elements.each(function (index, el) {
      $(this).height(window.getComputedStyle(el, null).getPropertyValue('width'));
    });
  });
}

function MakeCardFlippable(cardSelector) {
    var twoSidedCards = $(cardSelector);

    var flippedCardSize = {
      height: 350,
      width: 300
    }
    var currentCard;

  twoSidedCards.on('click', function(e) {
    var card = $(this);

    if(e.target.hasClass('flipper') || $(this).hasClass('flipper')) {

      var toggleButton = e.target;

      if (card.hasClass('flippedToFront'))  {

        // Only if you wanna make the other cards flip back when a new
        // card flips up.
        // if(currentCard) currentCard.click();

        card.toggleClass('flippedToFront flippedToBack');

        if(!card.parent().hasClass('tempWrapper')) {
          // wrapElement(card[0]);
        }

        card.css({
          position: 'relative',
          'z-index': 10
        });

        card.animate({
          'top': -10
        }, 200);

        currentCard = card;
      } else if(card.hasClass('flippedToBack')) {

        card.toggleClass('flippedToFront flippedToBack');

        cardWrapperPosition = card[0].parentNode.getBoundingClientRect();

        card.animate({
          'top': 0

        }, 200, function(){
          card.css({'width': '', 'z-index': '' });
        });
        currentCard = undefined;
      } else {
        console.log('card error');
      }
    }

  });
}

function wrapElement(el) {
    var tempWrapper = document.createElement('span');
    tempWrapper.setAttribute('class', 'tempWrapper');

    elStyles = window.getComputedStyle(el, null);

    tempWrapper.style.display = elStyles.getPropertyValue('display');
    tempWrapper.style.width = elStyles.getPropertyValue('width');
    tempWrapper.style.height = elStyles.getPropertyValue('height');
    el.parentNode.insertBefore(tempWrapper, el);
  tempWrapper.appendChild(el);
    return tempWrapper;
}

function unwrapElement(el, wrapperTag) {
  var wrapper = el.parentNode;

  if(wrapper.nodeName == wrapperTag.toUpperCase()) {
    wrapper.parentNode.replaceChild(el,wrapper);

  }
}

function elPositionInBody(el) {
  // Getting the offset of the target-element in relation to the top
  // of the page ..
  // getBoundingClientRect().top only gets the position of
  // the element in relation to the window. So we calculate
  //  the difference
  var bodyYOffset = document.body.getBoundingClientRect().top;
  var bodyXOffset = document.body.getBoundingClientRect().left;
  var elYOffset = el.getBoundingClientRect().top;
  var elXOffset = el.getBoundingClientRect().left;

  var elYPosition =  elYOffset - bodyYOffset;
  var elXPosition =  elXOffset - bodyXOffset;

  return [elXPosition, elYPosition];
}
