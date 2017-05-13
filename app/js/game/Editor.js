/**
 * Created by Miroku on 25/02/2015.
 */
var Editor = (function()
{
    var _this               = null,
        container           = null,
        stats               = null,
        camera              = null,
        cameraOrtho         = null,
        cameraPersp         = null,
        scene               = null,
        renderer            = null,
        objects             = [],
        mouseX              = 0,
        mouseY              = 0,
        mouseRightClicked   = false,
        mouseLeftClicked    = false,
        mouseWheelClicked   = false,
        canvas_container    = null,
        canvas_width        = -1,
        canvas_height       = -1,
        canvas_half_x       = -1,
        canvas_half_y       = -1,
        controls            = null,
        controlsOrtho       = null,
        controlsPersp       = null,
        currentView         = "perspective",
        currentSelection    = null,
        boundingBox         = null,

        TO_RADIANS          = Math.PI / 180,
        DEFAULT_CAMERA_DIST = 500;

    function Editor()
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

    Editor.prototype = Object.create(Object.prototype);
    Editor.prototype.constructor = Editor;

    Editor.prototype.onLoadComplete = function ( collada )
    {
        //object.position.y = -80;
        var dae = collada.scene;

        /*dae.traverse( function ( child )
         {
         if ( child instanceof THREE.SkinnedMesh )
         {
         var animation = new THREE.Animation( child, child.geometry.animation );
         animation.play();
         }
         } );
         dae.updateMatrix();*/

        dae.scale.x = dae.scale.y = dae.scale.z = 50;
        dae.rotateX(-90 * TO_RADIANS);

        objects.push(dae.children[0].children[0]);
        scene.add( dae );
    };

    Editor.prototype.onLoadProgress = function ( info )
    {
        var percentComplete = info.loaded / info.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
    };

    Editor.prototype.onLoadError = function ( xhr )
    {
    };

    Editor.prototype.addDAE = function ( )
    {
        var loader = new THREE.ColladaLoader();
        loader.load(
            '../assets/models/star_destroyer/my_stardestroyer_merged.dae',
            //'./assets/models/cannons/star_destroyer_heavy_cannon.dae',
            _this.onLoadComplete,
            _this.onLoadProgress
        );
    };

    Editor.prototype.createRenderer = function ( )
    {
		canvas_container = document.getElementById("canvasContainer");
		
		canvas_width     = canvas_container.getBoundingClientRect().width;
		canvas_height    = canvas_container.getBoundingClientRect().height;
        canvas_half_x    = canvas_width / 2;
        canvas_half_y    = canvas_height / 2;
		
		console.log( canvas_width, canvas_height  );
		
        renderer = new THREE.WebGLRenderer({
			canvas    : document.getElementById("editorCanvas"),
			antialias : true
		});
        renderer.setClearColor( 0xAAAAAA, 1);
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( canvas_width, canvas_height );
    };

    Editor.prototype.setControls = function ( actualCamera )
    {
        controls = new THREE.OrbitControls( actualCamera, renderer.domElement );
        controls.enableKeys = false;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
    };

    Editor.prototype.setOrthoControls = function ( )
    {
        controlsOrtho = new THREE.OrbitControls( cameraOrtho, renderer.domElement );
        controlsOrtho.enableKeys = false;
        controlsOrtho.dampingFactor = 0.25;
        controlsOrtho.enableZoom = true;
        controlsOrtho.enableRotate = false;
    };

    Editor.prototype.setPerspControls = function ( )
    {
        controlsPersp = new THREE.OrbitControls( cameraPersp, renderer.domElement );
        controlsPersp.enableKeys = false;
        controlsPersp.dampingFactor = 0.25;
        controlsPersp.enableZoom = true;
        controlsPersp.enableRotate = true;
    };

    Editor.prototype.createScene = function ( )
    {
        scene = new THREE.Scene();
    };

    Editor.prototype.setupCamera = function ( _view )
    {
        var view = _view || currentView;
        currentView = view;

        if(controlsOrtho && currentSelection) controlsOrtho.target = currentSelection.parent.position;
        if(controlsPersp && currentSelection) controlsPersp.target = currentSelection.parent.position;

        if(!cameraOrtho)
            cameraOrtho = new THREE.OrthographicCamera( canvas_width / - 2, canvas_width / 2, canvas_height / 2, canvas_height / - 2, 1, 2000 );

        if(!cameraPersp)
            cameraPersp = new THREE.PerspectiveCamera( 45, canvas_width / canvas_height, 1, 2000 );

        if(view === "perspective")
        {
            camera = cameraPersp;
            camera.position.x = camera.position.y = camera.position.z = DEFAULT_CAMERA_DIST;
        }
        else
            camera = cameraOrtho;

        switch (view)
        {
            case "left":
                camera.position.y = camera.position.z = 0;
                camera.position.x = -DEFAULT_CAMERA_DIST;
                break;
            case "right":
                camera.position.y = camera.position.z = 0;
                camera.position.x = DEFAULT_CAMERA_DIST;
                break;
            case "top":
                camera.position.x = camera.position.z = 0;
                camera.position.y = DEFAULT_CAMERA_DIST;
                break;
            case "bottom":
                camera.position.x = camera.position.z = 0;
                camera.position.y = -DEFAULT_CAMERA_DIST;
                break;
            case "front":
                camera.position.x = camera.position.y = 0;
                camera.position.z = DEFAULT_CAMERA_DIST;
                break;
            case "back":
                camera.position.x = camera.position.y = 0;
                camera.position.z = -DEFAULT_CAMERA_DIST;
                break;
        }

        camera.lookAt(new THREE.Vector3(0,0,0));
    };

    Editor.prototype.addLights = function ( )
    {
        var ambient = new THREE.AmbientLight( 0xffffff );
        scene.add( ambient );

        var directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( 0, 0, 1 ).normalize();
        scene.add( directionalLight );
    };

    Editor.prototype.addBoundingBox = function ( mesh )
    {
        boundingBox = new THREE.BoundingBoxHelper( mesh, 0x00ff00 );
        boundingBox.update();
        scene.add( boundingBox );
    };

    Editor.prototype.addListeners = function ( )
    {
        canvas_container.addEventListener( 'mousemove', _this.onDocumentMouseMove, false );
        canvas_container.addEventListener( 'mousedown', _this.onMouseDown, false );
        canvas_container.addEventListener( 'mouseup', _this.onMouseUp, false );
        //document.body.addEventListener( 'mousewheel', _this.onMousewheel, false );
        //document.body.addEventListener( 'DOMMouseScroll',_this.onMousewheel, false ); // firefox
        window.addEventListener( 'resize', _this.onWindowResize, false );
    };

    Editor.prototype.meshClicked = function(mesh)
    {
        if (currentSelection === mesh)
        {
            currentSelection = null;
            scene.remove(boundingBox);
        }
        else
        {
            currentSelection = mesh;
            _this.addBoundingBox(currentSelection);

            controlsOrtho.target = currentSelection.parent.position;
            controlsPersp.target = currentSelection.parent.position;
        }

        _this.setupCamera(currentView);
    };

    Editor.prototype.checkClickedMesh = function(event)
    {
        event.preventDefault();

        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();

        mouse.x = ( event.clientX / canvas_width ) * 2 - 1;
        mouse.y = - ( event.clientY / canvas_height ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObjects( objects );

        if ( intersects.length > 0 )
        {
            _this.meshClicked(intersects[0].object);
        }
    };

    Editor.prototype.onMouseDown = function(evt)
    {
        switch ( evt.button )
        {
            case 0: // left
                mouseLeftClicked = true;
                _this.checkClickedMesh(evt);
                break;
            case 1: // middle
                mouseWheelClicked = true;
                break;
            case 2: // right
                mouseRightClicked = true;
                break;
        }
    }

    Editor.prototype.onMouseUp = function(evt)
    {
        switch ( evt.button )
        {
            case 0: // left
                mouseLeftClicked = false;
                break;
            case 1: // middle
                mouseWheelClicked = false;
                break;
            case 2: // right
                mouseRightClicked = false;
                break;
        }
    }

    Editor.prototype.onWindowResize = function()
    {
		canvas_width  = canvas_container.getBoundingClientRect().width;
		canvas_height = canvas_container.getBoundingClientRect().height;
        canvas_half_x = canvas_width / 2;
        canvas_half_y = canvas_height / 2;
		console.log(canvas_width);

        camera.aspect = canvas_width / canvas_height;
        camera.updateProjectionMatrix();

        renderer.setSize( canvas_width, canvas_height );
    };

    Editor.prototype.onDocumentMouseMove = function( event )
    {
        mouseX = ( event.clientX - canvas_half_x ) / 2;
        mouseY = ( event.clientY - canvas_half_y ) / 2;
    };

    Editor.prototype.cameraMove = function()
    {
        //camera.position.x += ( mouseX - camera.position.x ) * .05;
        //camera.position.y += ( - mouseY - camera.position.y ) * .05;
    };

    Editor.prototype.animate = function()
    {
        requestAnimationFrame( _this.animate );

        _this.cameraMove();
        if(controlsOrtho) controlsOrtho.update();
        if(controlsPersp) controlsPersp.update();

        _this.render();
    };

    Editor.prototype.render = function()
    {
        renderer.render( scene, camera );
    };

    return Editor;
})();