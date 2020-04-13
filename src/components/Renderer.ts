import { WebGLRenderer } from "three";

// 渲染器
const renderer: WebGLRenderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

export default renderer;
