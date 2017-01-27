/* This script overwrites the functionality of the One-Page Navigation Links. Simply to add scrolling animation */

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
			var bodyOffset = document.body.getBoundingClientRect().top;
			var targetOffset = scrollTarget.getBoundingClientRect().top;
			var positionY =  targetOffset - bodyOffset;

			// Finally calling the glorious function the does the scrolling.
			scrollY(positionY, 400);

			// Just to update the address bar.
			window.location.hash = scrollTargetId;
		}
	});


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
			var newOffset = currentOffset + (Math.pow(progress/duration, 0.5) * distance)
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
