const ColorsCableCar = {
  orange: 0xdf1209,
  red: 0xb60909,
  black: 0x0c0d0b,
  gray: 0x110e14,
  light: 0xf2c572,
  moonLight: 0xb38014
};

let scene,
  camera,
  controls,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  renderer,
  container,
  hemisphereLight,
  spotLight,
  ambientLight,
  HEIGHT,
  WIDTH;

const createScene = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x1816eb, 10, 1500);

  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  camera.position.x = 0;
  camera.position.z = 300;
  camera.position.y = 100;
  camera.rotation.x = 50;

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(WIDTH, HEIGHT);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container = document.getElementById("canvas");
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", handleWindowResize, false);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  var loader = new THREE.GLTFLoader();
  loader.load(
    "https://www.stivaliserna.com/assets/cable-car/env3.gltf",
    (gltf) => {
      gltf.scene.position.y = -100;
      gltf.scene.children.forEach((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(gltf.scene);
    }
  );
};

const handleWindowResize = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
};

const createLights = () => {
  ambientLight = new THREE.AmbientLight(0x111111, 4);

  const houseLight = new THREE.PointLight(ColorsCableCar.light, 25, 25, 4);
  houseLight.position.set(-113, 10, 47);

  hemisphereLight = new THREE.HemisphereLight(0x0c0733, 5);

  spotLight = new THREE.SpotLight(0xc79461, 0.3);
  spotLight.castShadow = true;
  spotLight.shadow.bias = -0.0001;
  spotLight.shadow.mapSize.width = 1024 * 4;
  spotLight.shadow.mapSize.height = 1024 * 4;

  scene.add(ambientLight, houseLight, spotLight, hemisphereLight);
};

function CableCar() {
  this.mesh = new THREE.Group();

  let geomBox1 = new THREE.BoxGeometry(10, 4.5, 10, 1, 1, 1);
  geomBox1.vertices[7].y += 0.5;
  geomBox1.vertices[7].z -= 1;
  geomBox1.vertices[2].z -= 1;
  geomBox1.vertices[2].y += 0.5;
  geomBox1.vertices[3].y += 0.5;
  geomBox1.vertices[3].z += 1;
  geomBox1.vertices[6].y += 0.5;
  geomBox1.vertices[6].z += 1;

  let matBox1 = new THREE.MeshPhongMaterial({
    color: ColorsCableCar.orange,
    flatShading: true
  });
  let box1 = new THREE.Mesh(geomBox1, matBox1);
  box1.castShadow = true;
  box1.receiveShadow = true;

  let geomBox2 = new THREE.BoxGeometry(10.1, 5.5, 10, 1, 1, 1);
  let matBox2 = new THREE.MeshPhongMaterial({
    color: ColorsCableCar.red,
    flatShading: true
  });
  let box2 = new THREE.Mesh(geomBox2, matBox2);
  box2.position.y = 3.8;
  box2.castShadow = true;
  box2.receiveShadow = true;

  let geomBox3 = new THREE.BoxGeometry(7, 2, 7, 1, 1, 1);
  let matBox3 = new THREE.MeshPhongMaterial({
    color: ColorsCableCar.black,
    flatShading: true
  });
  let box3 = new THREE.Mesh(geomBox3, matBox3);
  box3.position.y = 7;
  box3.castShadow = true;
  box3.receiveShadow = true;

  let geomWindow = new THREE.BoxGeometry(3, 2, 7, 1, 1, 1);
  let matWindow = new THREE.MeshPhongMaterial({
    color: ColorsCableCar.light,
    flatShading: true
  });
  let window = new THREE.Mesh(geomWindow, matWindow);
  window.rotation.z = 1.6;
  window.position.y = 4;
  window.position.x = 4.5;

  const cableCarLight1 = new THREE.PointLight(ColorsCableCar.light, 20, 15, 2);
  cableCarLight1.position.x = 7;
  cableCarLight1.position.y = 4;
  this.mesh.add(cableCarLight1);

  let window2 = window.clone();
  window2.position.x = -4.5;

  const cableCarLight2 = new THREE.PointLight(ColorsCableCar.light, 20, 15, 2);
  cableCarLight2.position.x = -7;
  cableCarLight2.position.y = 4;
  this.mesh.add(cableCarLight2);

  let geomLever = new THREE.BoxGeometry(1, 15, 1, 1, 1, 1);
  let lever = new THREE.Mesh(geomLever, matBox3);
  lever.position.y = 13;
  lever.castShadow = true;
  lever.receiveShadow = true;

  var cabin = new THREE.Group();
  cabin.add(box1);
  cabin.add(box2);
  cabin.add(box3);
  cabin.add(lever);
  cabin.add(window);
  cabin.add(window2);

  this.mesh.add(cabin);
}

const cableCarOne = new CableCar();

const cableCarTwo = new CableCar();

function Moon() {
  this.mesh = new THREE.Group();

  const geomMoon = new THREE.SphereGeometry(16, 32, 16);

  let matMoon = new THREE.MeshPhongMaterial({
    color: 0xe3d1af,
    emissive: 0xffffff
  });

  let moon = new THREE.Mesh(geomMoon, matMoon);
  moon.scale.x = moon.scale.y = moon.scale.z = 3;
  moon.position.y = 180;
  moon.position.z = -250;
  moon.position.x = -50;

  // Taken from https://codepen.io/tr13ze/pen/QpNbNd?editors=1010
  var geomHalo = new THREE.SphereGeometry(16, 32, 16);
  var matHalo = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  var halo = new THREE.Mesh(geomHalo, matHalo);
  halo.position.y = 180;
  halo.position.z = -250;
  halo.position.x = -50;
  halo.scale.x = halo.scale.y = halo.scale.z = 4;

  const moonLight = new THREE.PointLight(ColorsCableCar.moonLight, 8, 300, 5);
  moonLight.position.x = -50;
  moonLight.position.y = 180;
  moonLight.position.z = -200;

  this.mesh.add(moon, halo, moonLight);
}

let moon;

const createMoon = () => {
  moon = new Moon();
  scene.add(moon.mesh);
};

// Particle system taken from https://codepen.io/SaschaSigl/pen/gpVKOa?editors=0010
function createParticles() {
  const particles = new THREE.Geometry();
  const particlesMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.8,
    transparent: true,
    opacity: 0.7
  });
  for (let i = 0; i < 500; i++) {
    const x = (Math.random() - 0.5) * Math.sin(i) * 600;
    const y = (Math.random() - 0.5) * Math.cos(i) * 600;
    const z = (Math.random() - 0.5) * Math.sin(i) * 600;
    particles.vertices.push(new THREE.Vector3(x, y, z));
  }
  var particleSystem = new THREE.Points(particles, particlesMat);
  scene.add(particleSystem);
}

const animationDuration = 10000;

const EASE_OUT = (t) => t * (2 - t);

const CABLE_CAR_ONE_TRACK = {
  object: cableCarOne,
  keyframes: {
    0: {
      position: {
        x: 40,
        y: 98,
        z: -35
      }
    },
    25: {
      easeFunction: EASE_OUT,
      position: {
        x: -7,
        y: 43,
        z: 10
      }
    },
    50: {
      position: {
        x: -45,
        y: 15,
        z: 95
      }
    },
    75: {
      easeFunction: EASE_OUT,
      position: {
        x: -7,
        y: 43,
        z: 10
      }
    },
    100: {
      position: {
        x: 40,
        y: 98,
        z: -35
      }
    }
  }
};

const CABLE_CAR_TWO_TRACK = {
  object: cableCarTwo,
  keyframes: {
    0: {
      position: {
        x: -60,
        y: 16,
        z: 80
      }
    },
    25: {
      easeFunction: EASE_OUT,
      position: {
        x: -21,
        y: 45,
        z: -5
      }
    },
    50: {
      position: {
        x: 26,
        y: 100,
        z: -50
      }
    },
    75: {
      easeFunction: EASE_OUT,
      position: {
        x: -21,
        y: 45,
        z: -5
      }
    },
    100: {
      position: {
        x: -60,
        y: 16,
        z: 80
      }
    }
  }
};

const ANIMATION_CLIP = [CABLE_CAR_ONE_TRACK, CABLE_CAR_TWO_TRACK].map(
  (track) => {
    return {
      ...track,
      keyframes: Object.keys(track.keyframes)
        .map((key) => ({ ...track.keyframes[key], percentage: Number(key) }))
        .sort((a, b) => a.percentage - b.percentage)
    };
  }
);

const interpolate = (n0, n1, progress) => {
  return n0 + (n1 - n0) * progress;
};

const applyFrame = ({ keyframes, progress, mesh }) => {
  const segmentEnd =
    keyframes.find((x) => x.percentage > progress) ?? keyframes[1];
  const segmentStart = keyframes[keyframes.indexOf(segmentEnd) - 1];

  const segmentDelta = progress - segmentStart.percentage;
  const segmentLenght = segmentEnd.percentage - segmentStart.percentage;
  const segmentProgress = segmentDelta / segmentLenght;

  if (segmentStart.position) {
    const newPosition = Object.keys(segmentStart.position).reduce(
      (acc, key) => {
        acc[key] = interpolate(
          segmentStart.position[key],
          segmentEnd.position[key],
          segmentStart.easeFunction
            ? segmentStart.easeFunction(segmentProgress)
            : segmentProgress
        );
        return acc;
      },
      {}
    );
    Object.assign(mesh.position, newPosition);
  }

  if (segmentStart.rotation) {
    console.log("kekeke");
    const newRotation = Object.keys(segmentStart.rotation).reduce(
      (acc, key) => {
        acc[key] = interpolate(
          segmentStart.rotation[key],
          segmentEnd.rotation[key],
          segmentStart.easeFunction
            ? segmentStart.easeFunction(segmentProgress)
            : segmentProgress
        );
        return acc;
      },
      {}
    );

    Object.assign(mesh.rotation, newRotation);
  }
};

const loop = () => {
  const t = Date.now() % animationDuration;
  const progress = (t / animationDuration) * 100;

  ANIMATION_CLIP.forEach((track) => {
    const { keyframes, object } = track;
    const { mesh } = object;
    applyFrame({ keyframes, progress, mesh });
  });

  moon.mesh.rotation.y -= 0.002;
  scene.rotation.y += 0.001;

  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
};

const main = () => {
  createScene();
  createLights();
  createParticles();
  createMoon();

  scene.position.y = -30;
  scene.position.z = -50;

  cableCarOne.mesh.rotation.y = -45 * (Math.PI / 180);
  scene.add(cableCarOne.mesh);

  cableCarTwo.mesh.rotation.y = -45 * (Math.PI / 180);
  scene.add(cableCarTwo.mesh);

  spotLight.position.set(
    camera.position.x + -20,
    camera.position.y + 40,
    camera.position.z + 70
  );

  renderer.render(scene, camera);
  loop();
};

window.addEventListener("load", main, false);
