import { AppConfig } from './app.config';
import renderer from './components/Renderer';
import { MainScene } from './scenes/Main';
import { PerspectiveCamera } from 'three';

window.addEventListener('load', () => {
  AppConfig();

  let mainScene: MainScene = new MainScene();
  mainScene.Init();
  mainScene.Start();

  window.addEventListener('resize', () => {
    let camera = mainScene.mainCamera;
    // 以下三行保证 resize 时场景保持不变形
    camera instanceof PerspectiveCamera && (camera.aspect = window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, false)
})
