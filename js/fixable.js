

window.addEventListener('load', function() {



  var el = $('.side-bar nav');
  var content = $('.rules main');


  MakeFixableWith(el, content, 600);



});



function MakeFixableWith(el,content, untilWidth) {


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
          // el.style.position = 'fixed';
          console.log(pageYOffset / contentDimensions.height);
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
    } else {

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
