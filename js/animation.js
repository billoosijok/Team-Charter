function animate(el, property, value, duration, callback, easeOption) {

    var frameRate = 60;
    duration = duration || 200;
    callback = callback || function() {};
    value = parseValue(String(value));

    var currentValue = parseValue(getComputedStyle(el,null).getPropertyValue(property));

    var targetValue = value - currentValue;
    var changeFactor = targetValue / frameRate;

    el.style[property] = parseValue(getComputedStyle(el,null).getPropertyValue(property));

    var queueDelay = duration/frameRate;
    var velocity = 1;
    var easeEffectAdditionFactor = velocity/frameRate;
    var ease = easeOption || 'ease-in';
    switch(ease) {
        case 'ease-in':
            easeEffectAdditionFactor *= -1;
            animator(1, 1+(velocity/2));
            break;
        case 'ease-out':
            easeEffectAdditionFactor *= 1;
            animator(1, 1-(velocity/2));
            break;
        default:
            easeEffectAdditionFactor = 0;
            animator(1, 1);
    }

    function animator(frameNum, easeFactor) {
        
        el.style[property] = parseValue(el.style[property]) + (changeFactor * easeFactor) ;

        if(frameNum < frameRate) {
            setTimeout(function() {animator(frameNum+1, easeFactor+easeEffectAdditionFactor)}, queueDelay)
            
        } else if(frameNum == frameRate) {
            el.style[property] = Number(value);
            callback();
        }
        
        
    }
    
}


function parseValue(value) {
    var unit = value.slice(value.length - 1);

    if(isNaN(unit)) {
        return Number(value.slice(0, value.length - 2));
    }

    else {
        return Number(value);
    }
}

function hide(el) {
    // el.style.opacity = 0;

    animate(el,'opacity', '0', 500);
}

function show(el) {
    // el.style.opacity = 1;
    animate(el,'opacity', '1', 500);
}

function updateTextContent(el, newContent) { 
    
    el.style.position = 'relative';
    animate(el, 'top', '-10', 100, null, 'ease-out');
    animate(el, 'opacity', '0', 100, function(){

        el.innerHTML = (Boolean(newContent)) ? newContent : "&nbsp;" ;
        el.style.top = '10';
        animate(el, 'top', '0', 100, null, 'ease-in');
        animate(el, 'opacity', '1', 100, null, 'ease-in');
    }, 'ease-out');
}

function popUpMessage(el, text) {
    updateTextContent(el, text);
    setTimeout(function() {updateTextContent(el, '')}, 2000);
}

function moveElement(el, destinationParent, duration, callback) {

    var elOriginalStyles = window.getComputedStyle(el,null);
    var destOriginalStyles = window.getComputedStyle(destinationParent,null);

    elPosition = el.getBoundingClientRect();
    destPosition = destinationParent.getBoundingClientRect();

    originalElementPosition = elOriginalStyles.getPropertyValue('position');
    originalElementYPosition = elOriginalStyles.getPropertyValue('top');
    originalElementXPosition = elOriginalStyles.getPropertyValue('left');

    moveY = destPosition.top - elPosition.top;
    moveX = destPosition.left - elPosition.left;

    
    var destHeight = parseValue(destOriginalStyles.getPropertyValue("height"));
    animate(destinationParent, 'height',  destHeight + 30, duration);
    
    el.style.position = 'relative';
    animate(el, 'zoom', '0.5', duration);
    animate(el, 'top', moveY, duration, null, 'ease-out');
    animate(el, 'left', moveX, duration, function() {
        el.style.opacity = 0;

        var newContent = el.cloneNode();
        
    
        destinationParent.style.height = 'auto';

        // Resetting the moved object to avoid messing up the dom;
        // Which means if it needs to be removed, it has to be removed in the callback; 
        el.style.position = originalElementPosition;
        el.style.top = originalElementYPosition;
        el.style.left = originalElementXPosition;
       animate(el, 'zoom', '1', duration);

        callback = callback() || (function() {})();
    }, 'ease-out');
}

function wrapChildren(el) {
    var tempWrapper = document.createElement('span');
    tempWrapper.innerHTML = el.innerHTML;
    tempWrapper.style.display = 'inherit';
    tempWrapper.style.width = '100%';
    tempWrapper.style.margin = '0';
    tempWrapper.style.padding = '0';

    el.innerHTML = "";
    el.appendChild(tempWrapper);

    return tempWrapper;
}