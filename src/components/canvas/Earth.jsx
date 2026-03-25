import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Earth = () => {
  const earth = useGLTF("./planet/scene.gltf");
  return (
    <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
  );
};

const WindSound = ({ controlsRef, isVisibleRef }) => {
  const audioCtxRef = useRef(null);
  const gainRef = useRef(null);
  const filterRef = useRef(null);
  const lastAzimuthRef = useRef(null);

  useEffect(() => {
    const ctx = new window.AudioContext();
    audioCtxRef.current = ctx;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 400;
    filter.Q.value = 0.7;
    filterRef.current = filter;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gainRef.current = gain;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    return () => {
      try { source.stop(); ctx.close(); } catch (e) { }
    };
  }, []);

  useFrame(() => {
    if (!controlsRef.current || !gainRef.current || !audioCtxRef.current) return;

    if (!isVisibleRef.current) {
      gainRef.current.gain.value = 0;
      lastAzimuthRef.current = null;
      return;
    }

    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();

    const azimuth = controlsRef.current.getAzimuthalAngle();

    if (lastAzimuthRef.current !== null) {
      const speed = Math.abs(azimuth - lastAzimuthRef.current);
      const targetGain = Math.min(speed * 30, 0.12);
      const targetFreq = Math.min(300 + speed * 5000, 1400);

      const currGain = gainRef.current.gain.value;
      gainRef.current.gain.value = currGain + (targetGain - currGain) * 0.12;

      const currFreq = filterRef.current.frequency.value;
      filterRef.current.frequency.value = currFreq + (targetFreq - currFreq) * 0.1;
    }

    lastAzimuthRef.current = azimuth;
  });

  return null;
};

// Transparent overlay on mobile — sits on top of canvas, forwards vertical
// touches to the page so the canvas never blocks scrolling
const MobileScrollOverlay = () => {
  const touchStartY = useRef(0);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
      }}
      onTouchStart={(e) => {
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchMove={(e) => {
        const deltaY = touchStartY.current - e.touches[0].clientY;
        touchStartY.current = e.touches[0].clientY;
        window.scrollBy({ top: deltaY, behavior: "instant" });
      }}
    />
  );
};

const EarthCanvas = () => {
  const controlsRef = useRef();
  const isVisibleRef = useRef(false);
  const wrapperRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.2 }
    );
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "70%", height: "70%" }}>
      {isMobile && <MobileScrollOverlay />}
      <Canvas
        shadows
        frameloop='demand'
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            ref={controlsRef}
            autoRotate
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Earth />
          <Preload all />
        </Suspense>
        <WindSound controlsRef={controlsRef} isVisibleRef={isVisibleRef} />
      </Canvas>
    </div>
  );
};

export default EarthCanvas;
