
'use strict';

function Tipster(elements, opts) {

	var base = this;

	base.options = {
		direction: 'up', // yo, tell me where to go
		margin: 5, // I don't really like being too close to my target, so I will keep my distance (in pixels :youdontsay:) 
		html: false, // can I have HTML in my insides?
		delay: 0, // when I do have to be shown? (in ms please)
		manually: false, // should I be shown on hover by default or you'll say me to appear?
		context: document // if you are brave enough to use my default `querySelectorAll`, can you please tell me the context where I'am? I already know I'm in the document, thanks
	};

	base.tooltips = [];

	function Tooltip(parent) {
		this.node = document.createElement('div');

		this.target = parent;

		this.node.className = 'tipster tooltip';
	}

	Tooltip.extend = function(element) {
		element.tooltip = new Tooltip(element);
	};

	Tooltip.prototype.attach = function() {
		this.target.parentNode.appendChild(this.node);
	};

	Tooltip.prototype.remove = function() {
		this.node.remove ? this.node.remove() : this.node.parentNode.removeChild(this.node);
	}

	Tooltip.prototype.update = function() {
		var title = this.target.getAttribute('data-tooltip');

		var direction = this.target.getAttribute('data-direction') || base.options.direction;

		this.node.classList.add(direction);

		if ( ! title) {
			this.target.setAttribute('data-tooltip', title = this.target.title);
		}

		this.target.removeAttribute('title');

		if (base.options.html || this.target.getAttribute('data-html')) {
			this.node.innerHTML = title;
		}
		else {
			this.node.innerText = title;
		}

		this.posisionate(direction);
	}

	Tooltip.prototype.posisionate = function(direction) {
		var margin = base.options.margin, x, y;

		if (direction == 'left' || direction == 'right') {
			y = (this.target.offsetTop+(this.target.offsetHeight/2))-(this.node.offsetHeight/2);
					
			if (direction == 'left') {
				x = this.target.offsetLeft-(this.node.offsetWidth+margin);
			}
			else {
				x = this.target.offsetLeft+this.target.offsetWidth+margin;
			}
		}
		else {
			x = (this.target.offsetLeft+this.target.offsetWidth/2)-(this.node.offsetWidth/2);

			if (direction == 'up') {
				y = this.target.offsetTop-(this.node.offsetHeight+margin);
			}
			else {
				y = (this.target.offsetTop+this.target.offsetHeight)+margin;
			}
		}
		this.node.style.left = x+'px';
		this.node.style.top = y+'px';
	}

	Tooltip.prototype.show = function() {
		var tooltip = this;

		if (this.dissapear) {
			clearTimeout(this.dissapear);
		}

		this.appear = setTimeout(function(){
			tooltip.update();
			tooltip.node.classList.add('visible');
		}, base.options.delay);
	};

	Tooltip.prototype.hide = function() {
		var tooltip = this;

		if (this.appear) {
			clearTimeout(this.appear);
		}

		this.dissapear = setTimeout(function(){
			tooltip.update();
			tooltip.node.classList.remove('visible');
		}, base.options.delay);
	};

	Tooltip.prototype.toggle = function() {
		this.update();
		this.node.classList.toggle('visible');
	}

	base.defaults = function(opts) {
		for (var property in opts) {
			opts.hasOwnProperty(property) && (base.options[property] = opts[property]);
		}
	}

	base.defaults(opts);

	if (elements instanceof Node) {
		elements = [elements];
	}
	else if (typeof elements == 'string') {

	}

	if (! (elements instanceof NodeList)) {
		if (elements instanceof Element) {
			elements = [elements];
		}
		else {
			elements = base.options.context.querySelectorAll(elements);
		}
	}

	for (var i = 0, len = elements.length; i < len; i++) {
		var element = elements[i];

		if ((! element.title) && (! element.getAttribute('data-tooltip'))) {
			continue;
		}
			
		Tooltip.extend(element);

		base.tooltips.push(element.tooltip);

		element.tooltip.attach();

		if (base.options.manually == false) {
			element.addEventListener('mouseover', function() {
				this.tooltip.show();
			});

			element.addEventListener('mouseout', function() {
				this.tooltip.hide();
			});
		}
	}
}

Tipster.prototype.show = function() {
	for (var i = 0, len = this.tooltips.length; i < len; i++) {
		this.tooltips[i].show();
	}
};

Tipster.prototype.hide = function() {
	for (var i = 0, len = this.tooltips.length; i < len; i++) {
		this.tooltips[i].hide();
	}
};

Tipster.prototype.toggle = function() {
	for (var i = 0, len = this.tooltips.length; i < len; i++) {
		this.tooltips[i].toggle();
	}
};