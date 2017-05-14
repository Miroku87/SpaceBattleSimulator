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

    GUIManager.prototype.changeCameraView = function ( )
    {
        settings.editor.setupCamera( $( this ).find("option:selected").val().toLowerCase() );
    };

    GUIManager.prototype.addListeners = function ()
    {
        $( "#selectView" ).change( this.changeCameraView );
    };

    return GUIManager;

})();

var GUI = new GUIManager({
    editor: editor
});