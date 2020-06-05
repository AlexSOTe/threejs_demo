import { PerspectiveCamera, Vector3 } from 'three'
import { mainScene } from "../scenes/main"

const camera: PerspectiveCamera = new PerspectiveCamera(103, window.innerWidth / window.innerHeight, 0.1, 10000)
camera.position.set(380, 380, 380)
camera.lookAt(new Vector3(0, 0, 0))
mainScene.add(camera)

export default camera;
