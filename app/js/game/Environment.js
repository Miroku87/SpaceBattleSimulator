/**
 * Created by Miroku on 25/02/2015.
 */
var Environment = (function()
{

    function Environment()
    {
        Object.call(this);

        _this = this;

        _this.createRenderer();
        _this.createScene();
        _this.setupCamera();
        _this.addLights();
        _this.addDAE();
        _this.addListeners();
        //_this.setControls(camera);
        _this.setOrthoControls();
        _this.setPerspControls();

        _this.animate();
    }

    Environment.prototype = Object.create(Object.prototype);
    Environment.prototype.constructor = Environment;

    return Environment;
})();