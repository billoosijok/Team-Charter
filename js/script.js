$(function() {
  HTMLElement.prototype.hasClass = function(className) {
    var classes = this.className;
    var regEx = new RegExp("\\b"+className+"\\b");
    return regEx.test(classes);
  }

  MakeCardFlippable('.card.two-sided')
  
  lockRatio('.lock-ratio', 1);
});

function lockRatio(selector, ratio) {
  var elements = $(selector);
  
  elements.height(elements.width() * ratio);
  elements.height(elements.width() * ratio);
  $(window).resize(function() {
    elements.height(elements.width() * ratio);
    elements.height(elements.width() * ratio);
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
          // height: "+=50px",
          // width: "+=50px",
          // 'margin-left': -25,
          // 'top': -10
        }, 200);

        currentCard = card;
      } else if(card.hasClass('flippedToBack')) {

        card.toggleClass('flippedToFront flippedToBack');

        cardWrapperPosition = card[0].parentNode.getBoundingClientRect();

        card.animate({
          'z-index': '',
          // height: "-=50px",
          // width: "-=50px",
          // 'margin-left': 0,
          'top': 0

        }, 200, function(){
          card.css({
            'width': ''
          });
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
