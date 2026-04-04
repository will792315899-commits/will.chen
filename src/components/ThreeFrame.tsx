import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeFrameProps {
  imageUrl?: string;
  onClick: () => void;
}

export function ThreeFrame({ imageUrl, onClick }: ThreeFrameProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    photo?: THREE.Mesh;
    photoMat?: THREE.MeshBasicMaterial;
  }>({});

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const w = el.clientWidth, h = el.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xaaddff, 0.8);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);
    const rimLight = new THREE.DirectionalLight(0x7ec8e3, 0.4);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    const group = new THREE.Group();

    // Back glass panel
    const backMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4eef7, transparent: true, opacity: 0.35,
      roughness: 0.1, metalness: 0.05, clearcoat: 1.0,
      clearcoatRoughness: 0.05, side: THREE.DoubleSide,
    });
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.2, 0.08), backMat);
    back.position.z = -0.06;
    group.add(back);

    // Frame border bars
    const frameMat = new THREE.MeshPhysicalMaterial({
      color: 0xa8d8ea, transparent: true, opacity: 0.6,
      roughness: 0.15, metalness: 0.1, clearcoat: 0.8,
    });
    const bw = 0.12;
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(2.8, bw, 0.18), frameMat);
    topBar.position.y = 1.64; group.add(topBar);
    const botBar = new THREE.Mesh(new THREE.BoxGeometry(2.8, bw, 0.18), frameMat);
    botBar.position.y = -1.64; group.add(botBar);
    const leftBar = new THREE.Mesh(new THREE.BoxGeometry(bw, 3.16, 0.18), frameMat);
    leftBar.position.x = -1.34; group.add(leftBar);
    const rightBar = new THREE.Mesh(new THREE.BoxGeometry(bw, 3.16, 0.18), frameMat);
    rightBar.position.x = 1.34; group.add(rightBar);

    // Placeholder canvas texture
    const canvas = document.createElement('canvas');
    canvas.width = 480; canvas.height = 600;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, 600);
    grad.addColorStop(0, '#d4eef7');
    grad.addColorStop(0.5, '#e8f4f8');
    grad.addColorStop(1, '#d4eef7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 480, 600);
    ctx.strokeStyle = 'rgba(126,200,227,0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    (ctx as CanvasRenderingContext2D & { roundRect: (x: number, y: number, w: number, h: number, r: number) => void })
      .roundRect(180, 240, 120, 80, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(240, 280, 25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(58,107,124,0.4)';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('点击上传照片', 240, 360);
    ctx.fillStyle = 'rgba(58,107,124,0.2)';
    ctx.font = '12px sans-serif';
    ctx.fillText('JPEG / PNG / WEBP', 240, 385);

    const defaultTex = new THREE.CanvasTexture(canvas);
    const photoMat = new THREE.MeshBasicMaterial({ map: defaultTex, transparent: true, opacity: 0.95 });
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 3.0), photoMat);
    photo.position.z = 0.01;
    group.add(photo);

    // Corner accent spheres
    const cornerMat = new THREE.MeshPhysicalMaterial({
      color: 0x7ec8e3, transparent: true, opacity: 0.5,
      roughness: 0.2, clearcoat: 1,
    });
    const cornerGeo = new THREE.SphereGeometry(0.06, 16, 16);
    [[-1.3, 1.6], [1.3, 1.6], [-1.3, -1.6], [1.3, -1.6]].forEach(([cx, cy]) => {
      const c = new THREE.Mesh(cornerGeo, cornerMat);
      c.position.set(cx, cy, 0.1);
      group.add(c);
    });

    group.rotation.y = -0.25;
    group.rotation.x = 0.08;
    scene.add(group);

    sceneRef.current = { photo, photoMat };

    let frame: number;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      group.rotation.y = -0.25 + Math.sin(t * 0.5) * 0.04;
      group.rotation.x = 0.08 + Math.cos(t * 0.4) * 0.02;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const nw = el.clientWidth, nh = el.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  // Update texture when imageUrl changes
  useEffect(() => {
    if (!imageUrl || !sceneRef.current.photo) return;
    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const mat = sceneRef.current.photoMat!;
      mat.map = tex;
      mat.opacity = 1;
      mat.needsUpdate = true;
    });
  }, [imageUrl]);

  return (
    <div
      ref={mountRef}
      onClick={onClick}
      style={{ width: '100%', height: '100%', cursor: 'pointer', borderRadius: '16px', overflow: 'hidden' }}
    />
  );
}
