var GUIManager = (function ()
{
    var settings    = null;

    function GUIManager(_settings)
    {
        Object.call(this);
        settings    = _settings;

        this.addListeners();
    }

    GUIManager.prototype = Object.create(Object.prototype);
    GUIManager.prototype.constructor = GUIManager;
	
    GUIManager.prototype.redirect = function ( url, e )
    {
        window.location.href = url;
    };
	
    GUIManager.prototype.addListeners = function ()
    {
        $( "#goToEditor" ).click( this.redirect.bind( this, "views/editor.html") );
        $( "#goToSimulations" ).click( this.redirect.bind( this, "views/simultaions.html") );
    };

    return GUIManager;

})();

var GUI = new GUIManager(); 