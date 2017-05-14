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
		var purpose = $( e.target ).attr("id").replace("goTo","").toLowerCase();
        window.location.href = url + "?purpose=" + purpose;
    };
	
    GUIManager.prototype.addListeners = function ()
    {
        $( "#goToShipEditor, #goToEnginesEditor, #goToWeaponsEditor, #goToFieldObjsEditor, #goToFieldsEditor" ).click( this.redirect.bind( this, "models_editor.html") );
        $( "#goToInterfacesEditor" ).click( this.redirect.bind( this, "interfaces_editor.html") );
    };

    return GUIManager;

})();

var GUI = new GUIManager(); 