var Utils = (function()
{
	function Utils(){}
	
	/**
	 * Helper function to extract the coordinates from an event, whether the
	 * event is a mouse or touch.
	 */
	Utils.getEventCoords = function(ev)
	{
		var first,
		coords = {};
		var origEv = ev; // get from jQuery

		if (origEv.changedTouches != undefined)
		{
			first = origEv.changedTouches[0];
			coords.pageX = first.pageX;
			coords.pageY = first.pageY;
		}
		else
		{
			coords.pageX = ev.pageX;
			coords.pageY = ev.pageY;
		}

		return coords;
	};

	/**
	 * Helper function to get the local coords of an event in an element,
	 * since offsetX/offsetY are apparently not entirely supported, but
	 * offsetLeft/offsetTop/pageX/pageY are!
	 *
	 * @param elem element in question
	 * @param ev the event
	 */
	Utils.getLocalCoords = function(elem, coords)
	{
		var ox = 0,
		oy = 0;

		// Walk back up the tree to calculate the total page offset of the
		// currentTarget element.  I can't tell you how happy this makes me.
		// Really.
		while (elem != null)
		{
			ox += elem.offsetLeft;
			oy += elem.offsetTop;
			elem = elem.offsetParent;
		}

		return {
			x : coords.pageX - ox,
			y : coords.pageY - oy
		};
	};
	
	return Utils;
})();