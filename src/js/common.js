import * as PIXI from 'pixi.js'
import {setSize} from './modules/func'
// import {Assets} from '@pixi/assets'
import {shaderVert} from './shaders/vert'
import {shaderFrag} from './shaders/frag'
// import { AnimatedSprite } from 'pixi.js';


let width = document.documentElement.clientWidth,
  height = document.documentElement.clientHeight;

class Canvas {
  constructor() {
    this.container = document.getElementById("canvas");
    this.w = width;
    this.h = height;
    this.parent = {
      w: width,
      h: height,
    }
    this.prevMouse = new PIXI.Point(0, 0);
    this.mouse = new PIXI.Point(0, 0);
    this.followMouse = new PIXI.Point(0, 0);
    this.time = 0;
    this.speed = 0;
    this.targetSpeed = 0;
    this.loader = new PIXI.Loader;  //** Warning: Loader is being replaced with Assets
    this.loadAssets();
  }
  loadAssets() {
    this.loader.reset(); 
    this.loader.add([
      { name: 'bg', url: '../img/2.JPG' },
    ]);
    this.loader.load();
    this.loader.onComplete.add(() => {this.init();});
  }
  init() {
    this.app = new PIXI.Application({ width: this.w, height: this.h });
    this.container.appendChild(this.app.view);
    this.addSprite();
  }
  addSprite() {
    this.texture = PIXI.Texture.from(this.loader.resources['bg'].url);
    this.sprite = PIXI.Sprite.from(this.texture);
    this.setCoverSpriteOpt(this.sprite);
    this.app.stage.addChild(this.sprite);
    this.addShader();
  }
  setCoverSpriteOpt(s) {
    let child = {
      w: s.texture.orig.width,
      h: s.texture.orig.height,
    }
    let coverSizes = setSize(child, this.parent, 'cover', 'bottom', 'center');
    s.width = coverSizes.width;
    s.height = coverSizes.height;
    s.position.set( coverSizes.left, coverSizes.top );
    s.scale.set(coverSizes.scale, coverSizes.scale);
  }
  addShader() {
      this.filterBG = new PIXI.Filter( shaderVert, shaderFrag );
      this.filterBG.uniforms.distort = 0;
      this.filterBG.uniforms.resolutionX = 1.0;
      this.filterBG.uniforms.resolutionY = window.innerHeight/window.innerWidth;
      this.filterBG.uniforms.uMouseX = 0,
      this.filterBG.uniforms.uMouseY = 0,
      this.filterBG.uniforms.uVelo = 0;
      this.filterBG.uniforms.uScale = 0;
      this.filterBG.uniforms.uType = 0;
      this.filterBG.uniforms.time = 0;
      this.eventMouse();
      this.sprite.filters = [this.filterBG];
      this.animate();
  }
  getSpeed() {
    this.speed = Math.sqrt( (this.prevMouse.x- this.mouse.x)**2 + (this.prevMouse.y- this.mouse.y)**2 );

    this.targetSpeed -= 0.1*(this.targetSpeed - this.speed);
    this.followMouse.x -= 0.1*(this.followMouse.x - this.mouse.x);
    this.followMouse.y -= 0.1*(this.followMouse.y - this.mouse.y);

    this.prevMouse.x = this.mouse.x;
    this.prevMouse.y = this.mouse.y;
  }
  eventMouse() {
    this.container.addEventListener('mousemove', (e)=>{
      this.mouse.set(e.clientX / this.w, e.clientY/ this.h );
    });
  }

  animate() {
    let time = 0;
    this.app.ticker.add((delta) => {
      time += 0.05;
      this.getSpeed();
      this.filterBG.uniforms.time = time;
      this.filterBG.uniforms.uMouseX = this.followMouse.x;
      this.filterBG.uniforms.uMouseY = this.followMouse.y;
      this.filterBG.uniforms.uVelo = Math.max(Math.min(this.targetSpeed, 0.05), 0.0000001);
      this.targetSpeed *= 0.999;
    });
  }
}
new Canvas();
