"use strict";
let Scene = function(gl) {
  this.texturevsIdle = new Shader(gl, gl.VERTEX_SHADER, "texture_idle_vs.essl");
  this.texturefsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "texture_fs.essl");
  this.texturefsShadow = new Shader(gl, gl.FRAGMENT_SHADER, "shadow_fs.essl");
  this.texturefsMarble = new Shader(gl, gl.FRAGMENT_SHADER, "marble_fs.essl");
  this.texturefsWood = new Shader(gl, gl.FRAGMENT_SHADER, "wood_fs.essl");
  this.textureProgram = new TexturedProgram(gl,this.texturevsIdle,this.texturefsSolid);
  this.shadowProgram = new TexturedProgram(gl,this.texturevsIdle,this.texturefsShadow);
  this.uvMarbleProgram = new TexturedProgram(gl,this.texturevsIdle,this.texturefsMarble);
  this.uvWoodProgram = new TexturedProgram(gl,this.texturevsIdle,this.texturefsWood);

  this.texturefsMap = new Shader(gl, gl.FRAGMENT_SHADER, "envirMap_fs.essl");
  this.envirvsIdle = new Shader(gl, gl.VERTEX_SHADER, "envir_idle_vs.essl");
  this.envirfsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "envir_fs.essl");
  this.mapProgram = new TexturedProgram(gl,this.texturevsIdle,this.texturefsMap);
  this.envirProgram = new TexturedProgram(gl,this.envirvsIdle,this.envirfsSolid);

  this.gameObjects = [];
  this.shadowMaterial = new Material(gl, this.shadowProgram);

  //envir
  this.TexturedQuadGeometry = new TexturedQuadGeometry(gl);
  this.envirMaterial = new Material(gl, this.envirProgram);
  this.envirTexture = new Texture2D(gl, 'envmaps/milkyway.jpg');
  this.envirMaterial.probeTexture.set(this.envirTexture.glTexture);
  this.envirMesh = new Mesh(this.TexturedQuadGeometry,this.envirMaterial); 
  this.envirObject = new GameObject(this.envirMesh);
  this.envirObject.orientation = 3.14/2;
  this.envirObject.rotateAxis.set(1, 0, 0);


  //ground object
  this.InfiniteGroundQuadGeometry = new InfiniteGroundQuadGeometry(gl);
  this.quadMaterial = new Material(gl, this.textureProgram);
  this.quadTexture = new Texture2D(gl, 'json/ground.png');
  this.quadMaterial.colorTexture.set(this.quadTexture.glTexture);
  this.quadMesh = new Mesh(this.InfiniteGroundQuadGeometry,this.quadMaterial); 
  this.quadObject = new GameObject(this.quadMesh);
  this.quadObject.ground = true;
  this.gameObjects.push(this.quadObject);



  //envirMapObject
  this.mapMaterial = new Material(gl,this.mapProgram);
   this.mapTexture = new Texture2D(gl, 'envmaps/probe2017fall1.png');
   this.mapMaterial.probeTexture.set(this.mapTexture.glTexture);
  this.mapMesh = new MultiMesh(gl,"json/Slowpoke.json",[this.mapMaterial, this.mapMaterial]);
   this.mapObject = new GameObject(this.mapMesh);
  this.mapObject.position.set(0,0,0);




  //balloon
  this.balloonMaterial = new Material(gl,this.textureProgram);
  this.balloonTexture = new Texture2D(gl, 'json/balloon.png');
  this.balloonMaterial.colorTexture.set(this.balloonTexture.glTexture);
  this.balloonMesh = new MultiMesh(gl,"json/balloon.json",[this.balloonMaterial]);
  for (var i=0; i < 20; i++){
    var balloon = new GameObject(this.balloonMesh);
    if (Math.random() < 0.25){
      balloon.position.set(Math.random()*10,0.5,Math.random()*10);
    } else if (Math.random() < 0.5){
      balloon.position.set(-Math.random()*10,0.5,-Math.random()*10);
    } else if (Math.random() < 0.75){
      balloon.position.set(-Math.random()*10,0.5,Math.random()*10);
    } else {
      balloon.position.set(Math.random()*10,0.5,-Math.random()*10);
    }
    this.gameObjects.push(balloon);
  }

  //slowpoke marble
  this.yadonMaterial1 = new Material(gl,this.uvMarbleProgram);
  this.yadonMaterial2 = new Material(gl,this.uvMarbleProgram);
  this.yadonMesh = new MultiMesh(gl,"json/Slowpoke.json",[this.yadonMaterial1, this.yadonMaterial2]);
  this.yadonObject = new GameObject(this.yadonMesh);
  this.yadonObject.position.set(-1,0.005,2.0);
  this.gameObjects.push(this.yadonObject);
  //wood
  // this.yadonMaterial3 = new Material(gl,this.uvWoodProgram);
  // this.yadonMaterial4 = new Material(gl,this.uvWoodProgram);
  // this.yadonMeshWood = new MultiMesh(gl,"json/Slowpoke.json",[this.yadonMaterial3, this.yadonMaterial4]);
  // this.yadonObject1 = new GameObject(this.yadonMeshWood);
  // this.yadonObject1.position.set(1,0.005,2.0);
  // this.gameObjects.push(this.yadonObject1);
  
  //car object
  this.carMaterial = new Material(gl,this.textureProgram);
  this.carTexture = new Texture2D(gl, 'json/chevy/chevy.png');
  this.carMaterial.colorTexture.set(this.carTexture.glTexture);
  this.carMesh = new MultiMesh(gl,"json/chevy/chassis.json",[this.carMaterial]);
  this.carObject = new GameObject(this.carMesh);
  this.carObject.position.set(0,0.07,4.0);
  this.carObject.orientation = 3.2;
  this.gameObjects.push(this.carObject);



  //car wheels
  this.wheelMesh = new MultiMesh(gl,"json/chevy/wheel.json",[this.carMaterial])
  this.wheel1Object = new GameObject(this.wheelMesh);  
  this.wheel1Object.parent = this.carObject;
  this.wheel1Object.position.set(6.5,-3.5,13.5);
  this.wheel1Object.scale.set(1,1,1);
  this.gameObjects.push(this.wheel1Object);

  this.wheel2Object = new GameObject(this.wheelMesh);  
  this.wheel2Object.parent = this.carObject;
  this.wheel2Object.position.set(6.5,-3.5,-11.5);
  this.wheel2Object.scale.set(1,1,1);
  this.gameObjects.push(this.wheel2Object);

  this.wheel3Object = new GameObject(this.wheelMesh);  
  this.wheel3Object.parent = this.carObject;
  this.wheel3Object.position.set(-6.5,-3.5,13.5);
  this.wheel3Object.scale.set(1,1,1);
  this.gameObjects.push(this.wheel3Object);

  this.wheel4Object = new GameObject(this.wheelMesh);  
  this.wheel4Object.parent = this.carObject;
  this.wheel4Object.position.set(-6.5,-3.5,-11.5);
  this.wheel4Object.scale.set(1,1,1);
  this.gameObjects.push(this.wheel4Object);

  //helicoptor
  this.heli1Material = new Material(gl,this.textureProgram);
  this.heli1Texture = new Texture2D(gl, 'json/heli/heli.png');
  this.heli1Material.colorTexture.set(this.heli1Texture.glTexture);
  this.heli1Mesh = new MultiMesh(gl,"json/heli/heli1.json",[this.heli1Material]);
  this.heli1Object = new GameObject(this.heli1Mesh); 
  this.heli1Object.position.set(0.5,0.5,3.0); 
  this.gameObjects.push(this.heli1Object);

  this.mainrotorMesh = new MultiMesh(gl,"json/heli/mainrotor.json",[this.heli1Material, this.heli1Material]);
  this.mainrotorObject = new GameObject(this.mainrotorMesh);  
  this.mainrotorObject.parent = this.heli1Object;
  this.mainrotorObject.position.set(0.5,15,0);
  this.gameObjects.push(this.mainrotorObject);

  // this.alrscrewMesh = new MultiMesh(gl,"json/thunderbolt_airscrew.json",[this.heli1Material]);
  // this.alrscrewObject = new GameObject(this.alrscrewMesh);
  // this.gameObjects.push(this.alrscrewObject);
  this.treeMaterial = new Material(gl,this.textureProgram);
  this.treeTexture = new Texture2D(gl, 'json/tree.png');
  this.treeMaterial.colorTexture.set(this.treeTexture.glTexture);
  this.treeMesh = new MultiMesh(gl,"json/tree.json",[this.treeMaterial]);
  for (var i=0; i < 200; i++){
    var tree = new GameObject(this.treeMesh);
    if (Math.random() < 0.25){
      tree.position.set(Math.random()*10,0,Math.random()*10);
    } else if (Math.random() < 0.5){
      tree.position.set(-Math.random()*10,0,-Math.random()*10);
    } else if (Math.random() < 0.75){
      tree.position.set(-Math.random()*10,0,Math.random()*10);
    } else {
      tree.position.set(Math.random()*10,0,-Math.random()*10);
    }
    
    this.gameObjects.push(tree);
  }
  


  this.lightSource = new LightSource();
  this.lightSource.lightPos = new Vec4Array(2);
  this.lightSource.lightPos.at(0).set(0,1,1,0); // the last 0 indicates that it's a directional light
  this.lightSource.lightPos.at(1).set(this.carObject.position.x,this.carObject.position.y,
    this.carObject.position.z, 1);
  this.lightSource.lightPowerDensity = new Vec4Array(2);
  this.lightSource.lightPowerDensity.at(0).set(0.9,0.9,0.9,1); 
  this.lightSource.lightPowerDensity.at(1).set(5,5,5,1);
  this.lightSource.mainDir = new Vec4(); 
  //powerDensity for directional light between 0 and 1
  //powerDensity for point light (10, 100, 1000,1), if white surface with this source, would be mostly blue, things that are close to it will be green, things really close will be white
  
  this.camera = new PerspectiveCamera();
  //this.camera.position.set(this.carObject.position.x,this.carObject.position.y+0.1, 1.0);
  this.camera.position.set(this.carObject.position.x,this.carObject.position.y+0.1, this.carObject.position.z+0.7);
  this.rotation = 0;
};


Scene.prototype.update = function(gl, keysPressed) {  
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  let speed = 0.5;

  // clear the screen
  gl.clearColor(223/255, 208/255, 159/255, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  this.rotation += 0.03;
  this.mainrotorObject.orientation = this.rotation;
  this.mainrotorObject.rotateAxis.set(0, 1, 0);
  this.carObject.rotateAxis.set(0,1,0);

  if(keysPressed.L){
    this.yadonObject.position.add(dt * speed, 0, 0);
  }

  if(keysPressed.J){
    this.yadonObject.position.add(-dt * speed, 0, 0);
  }

  if(keysPressed.I){
    this.yadonObject.position.add(0, 0, dt * speed);
  }

  if(keysPressed.K){
    this.yadonObject.position.add(0, 0, -dt * speed);
  }
 
  if(keysPressed.LEFT) { 
    this.camera.isDragging = true;
    this.camera.yaw = 0.0;
    this.carObject.orientation += 0.03;
    var x = new Mat4();
    x.set().rotate(this.carObject.orientation,this.carObject.rotateAxis);
    this.carObject.direction.set(0,0,1,0).mul(x);
    this.camera.position.set(this.carObject.position.x,this.carObject.position.y+0.1, this.carObject.position.z+0.7);
  } 
  if(keysPressed.RIGHT) { 
    this.camera.isDragging = true;
    this.camera.yaw = 0.0;
    this.carObject.orientation -= 0.03;
    var y = new Mat4();
    y.set().rotate(this.carObject.orientation,this.carObject.rotateAxis);
    this.carObject.direction.set(0,0,1,0).mul(y);
    this.camera.position.set(this.carObject.position.x,this.carObject.position.y+0.1, this.carObject.position.z+0.7);
  } 
  if(keysPressed.UP) { 
    this.camera.isDragging = true;
    this.camera.yaw = 0.0;
    this.carObject.position.add(this.carObject.direction.x * 0.02,this.carObject.direction.y,this.carObject.direction.z * 0.02); 
    this.camera.position.set(this.carObject.position.x,this.carObject.position.y+0.1, this.carObject.position.z+0.7);
  } 
  if(keysPressed.DOWN) { 
    this.camera.isDragging = true;
    this.camera.yaw = 0.0;
    this.carObject.position.add(-this.carObject.direction.x * 0.02,-this.carObject.direction.y,-this.carObject.direction.z * 0.02); 
    this.camera.position.set(this.carObject.position.x,this.carObject.position.y+0.1, this.carObject.position.z+0.7);
  }

  this.camera.move(dt, keysPressed);


  if(keysPressed.T) {
    this.camera.isDragging = true;
    this.camera.yaw += 0.05;
    this.camera.move(dt, keysPressed);
    this.camera.isDragging = false;
    this.camera.position.add(dt, 0, dt);
  }


  this.lightSource.lightPos.at(1).set(this.carObject.position.x+this.carObject.direction.x * 0.2,
  this.carObject.position.y + this.carObject.direction.y * 0.2,
  this.carObject.position.z + this.carObject.direction.z * 0.2,1);
  this.lightSource.mainDir.set(this.carObject.direction);


  for (var i = 0; i < this.gameObjects.length; i++){
      
      if(this.gameObjects[i].parent == null){
        this.gameObjects[i].scale.set(0.01,0.01,0.01);
      }
      this.yadonObject.scale.set(0.05,0.05,0.05);
      this.gameObjects[i].draw(this.camera, this.lightSource);
      if (!this.gameObjects[i].ground){
        this.gameObjects[i].drawShadow(this.camera, this.shadowMaterial, this.lightSource.lightPos.at(0));
      }
  }

      this.mapObject.scale.set(0.03,0.03,0.03);
      this.mapObject.draw(this.camera, this.lightSource);
      this.envirObject.draw(this.camera, this.lightSource);


}




