"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Item = { image: string; text: string };

const CARD_W = 1.55;
const CARD_H = 2.25;
const SLOT_GAP = 1.55;

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uImg;
  uniform vec2 uPlane;
  uniform float uRadius;
  uniform float uActive;
  uniform float uOpacity;

  float sdRound(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
  }

  void main() {
    vec2 ratio = vec2(
      min((uPlane.x / uPlane.y) / (uImg.x / uImg.y), 1.0),
      min((uPlane.y / uPlane.x) / (uImg.y / uImg.x), 1.0)
    );
    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
    vec3 col = texture2D(uTex, uv).rgb;

    // gradient gelap di bawah supaya teks ovrlay terbaca
    float bottomFade = smoothstep(0.0, 0.42, vUv.y);
    col *= mix(0.42, 1.0, bottomFade);

    // dim non-active cards
    col *= mix(0.55, 1.0, uActive);

    // gold inner border glow (active only)
    float borderDist = abs(sdRound(vUv - 0.5, vec2(0.5 - uRadius), uRadius));
    float borderGlow = (1.0 - smoothstep(0.0, 0.045, borderDist)) * uActive * 0.55;
    col += vec3(0.94, 0.75, 0.25) * borderGlow;

    // rounded mask
    float d = sdRound(vUv - 0.5, vec2(0.5 - uRadius), uRadius);
    float mask = 1.0 - smoothstep(-0.003, 0.003, d);

    gl_FragColor = vec4(col, mask * uOpacity);
  }
`;

interface CardProps {
  idx: number;
  total: number;
  texture: THREE.Texture;
  imgRes: [number, number];
  progressRef: React.MutableRefObject<number>;
}

function Card({ idx, total, texture, imgRes, progressRef }: CardProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      uTex: { value: texture },
      uImg: { value: new THREE.Vector2(imgRes[0], imgRes[1]) },
      uPlane: { value: new THREE.Vector2(CARD_W, CARD_H) },
      uRadius: { value: 0.07 },
      uActive: { value: 0 },
      uOpacity: { value: 1 },
    }),
    [texture, imgRes],
  );

  useFrame((state) => {
    const m = meshRef.current;
    if (!m) return;

    // Wrap offset ke range [-total/2, total/2] — pakai modulo proper
    // supaya tahan terhadap progress berapapun (momentum jauh, swipe terus, dst)
    const half = total / 2;
    const raw = idx - progressRef.current;
    const off = ((raw + half) % total + total) % total - half;

    const absO = Math.abs(off);

    const activeAmount = Math.max(0, 1 - absO * 0.55);

    const tx = off * SLOT_GAP;
    const bob =
      activeAmount > 0.7
        ? Math.sin(state.clock.elapsedTime * 1.4) * 0.035 * activeAmount
        : 0;
    const ty = bob - absO * 0.04;
    const tz = -absO * 0.85;
    const trY = -off * 0.55;
    const ts = absO < 0.5 ? 1.08 : 0.86 - Math.min(absO * 0.04, 0.16);

    // Assign langsung — progressRef sudah di-lerp di SceneController,
    // sehingga transisinya halus tanpa double-lerp yang bikin kartu
    // "terbang lewat tengah" saat wrap.
    m.position.x = tx;
    m.position.y = ty;
    m.position.z = tz;
    m.rotation.y = trY;
    m.scale.x = m.scale.y = ts;

    const mat = matRef.current;
    if (mat) {
      mat.uniforms.uActive.value = activeAmount;
      // Fade rapat di dekat batas wrap (half - 0.3 .. half) supaya teleport
      // posisi pas wrap nggak terlihat. Untuk total=5, fade dari 2.2 → 2.5.
      const fadeStart = Math.max(half - 0.3, 1.6);
      const fadeRange = half - fadeStart;
      const targetOpacity =
        fadeRange > 0
          ? THREE.MathUtils.clamp(1 - (absO - fadeStart) / fadeRange, 0, 1)
          : 1;
      mat.uniforms.uOpacity.value = targetOpacity;
    }

    m.renderOrder = -Math.round(absO * 10);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[CARD_W, CARD_H]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function GoldDust({ count = 55 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  // Lazy init — Math.random() hanya boleh dipanggil sekali di luar render path.
  const [positions] = useState(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 2] = -Math.random() * 4 - 0.4;
    }
    return arr;
  });

  useFrame((_, dt) => {
    const p = ref.current;
    if (!p) return;
    const arr = p.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += dt * 0.06;
      arr[i * 3] += Math.sin(arr[i * 3 + 2] + i + dt) * dt * 0.015;
      if (arr[i * 3 + 1] > 2.7) {
        arr[i * 3 + 1] = -2.7;
        arr[i * 3] = (Math.random() - 0.5) * 7;
      }
    }
    p.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} renderOrder={-100}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#f0c040"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

interface SceneCtrlProps {
  progressRef: React.MutableRefObject<number>;
  targetRef: React.MutableRefObject<number>;
  dragActiveRef: React.MutableRefObject<boolean>;
  lastInteractionRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
}

function SceneController({
  progressRef,
  targetRef,
  dragActiveRef,
  lastInteractionRef,
  reducedMotion,
}: SceneCtrlProps) {
  useFrame((_, dt) => {
    if (
      !reducedMotion &&
      !dragActiveRef.current &&
      Date.now() - lastInteractionRef.current > 3200
    ) {
      targetRef.current += dt * 0.07;
    }
    const k = 1 - Math.exp(-dt * 7);
    progressRef.current = THREE.MathUtils.lerp(
      progressRef.current,
      targetRef.current,
      k,
    );
  });
  return null;
}

interface DragState {
  active: boolean;
  startX: number;
  startTarget: number;
  lastX: number;
  lastT: number;
  vel: number;
  totalDist: number;
  startTime: number;
  pointerId: number | null;
}

export default function MobileGallery3D({ items }: { items: Item[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const lastInteractionRef = useRef(0);
  const dragRef = useRef<DragState>({
    active: false,
    startX: 0,
    startTarget: 0,
    lastX: 0,
    lastT: 0,
    vel: 0,
    totalDist: 0,
    startTime: 0,
    pointerId: null,
  });
  const dragActiveProxyRef = useRef(false);

  const [textures, setTextures] = useState<THREE.Texture[]>([]);
  const [imgResolutions, setImgResolutions] = useState<[number, number][]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Lazy init — baca preference langsung saat mount, hindari setState dalam effect body.
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Preload semua tekstur sekali
  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    Promise.all(
      items.map(
        (item) =>
          new Promise<{ tex: THREE.Texture; res: [number, number] }>(
            (resolve, reject) => {
              loader.load(
                item.image,
                (t) => {
                  t.colorSpace = THREE.SRGBColorSpace;
                  t.minFilter = THREE.LinearMipMapLinearFilter;
                  t.magFilter = THREE.LinearFilter;
                  t.anisotropy = 4;
                  resolve({
                    tex: t,
                    res: [
                      (t.image as HTMLImageElement).naturalWidth || 1,
                      (t.image as HTMLImageElement).naturalHeight || 1,
                    ],
                  });
                },
                undefined,
                reject,
              );
            },
          ),
      ),
    ).then((results) => {
      if (cancelled) return;
      setTextures(results.map((r) => r.tex));
      setImgResolutions(results.map((r) => r.res));
    });
    return () => {
      cancelled = true;
    };
  }, [items]);

  // Sinkronisasi state aktif untuk overlay DOM (throttled)
  useEffect(() => {
    let prev = -1;
    const id = window.setInterval(() => {
      const n = items.length;
      if (n === 0) return;
      const i = ((Math.round(progressRef.current) % n) + n) % n;
      if (i !== prev) {
        prev = i;
        setActiveIndex(i);
        if ("vibrate" in navigator) {
          navigator.vibrate?.(8);
        }
      }
    }, 90);
    return () => window.clearInterval(id);
  }, [items.length]);

  const goBy = (delta: number) => {
    targetRef.current = Math.round(targetRef.current) + delta;
    lastInteractionRef.current = Date.now();
  };

  // Pointer-based handlers (single source untuk mouse + touch + pen)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const now = performance.now();
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startTarget: targetRef.current,
      lastX: e.clientX,
      lastT: now,
      vel: 0,
      totalDist: 0,
      startTime: now,
      pointerId: e.pointerId,
    };
    dragActiveProxyRef.current = true;
    lastInteractionRef.current = Date.now();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = dragRef.current;
    if (!s.active || s.pointerId !== e.pointerId) return;
    const w = wrapperRef.current?.clientWidth ?? 360;
    const slotPx = Math.max(120, w * 0.55);
    const delta = (s.startX - e.clientX) / slotPx;
    targetRef.current = s.startTarget + delta;

    const now = performance.now();
    const dt = Math.max(now - s.lastT, 1);
    s.vel = (e.clientX - s.lastX) / dt;
    s.totalDist += Math.abs(e.clientX - s.lastX);
    s.lastX = e.clientX;
    s.lastT = now;
    lastInteractionRef.current = Date.now();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const s = dragRef.current;
    if (!s.active) return;
    if (s.pointerId !== null && s.pointerId !== e.pointerId) return;
    s.active = false;
    dragActiveProxyRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);

    const duration = performance.now() - s.startTime;
    const w = wrapperRef.current?.clientWidth ?? 360;
    const slotPx = Math.max(120, w * 0.55);

    // Tap detection — pendek & hampir tanpa pergerakan
    if (s.totalDist < 8 && duration < 260) {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (rect) {
        const tapX = s.lastX - rect.left;
        const center = rect.width / 2;
        const sideZone = rect.width * 0.22;
        if (tapX < center - sideZone) goBy(-1);
        else if (tapX > center + sideZone) goBy(1);
      }
      return;
    }

    // Momentum dari kecepatan akhir (px/ms → slot)
    const flick = (-s.vel * 220) / slotPx;
    targetRef.current = Math.round(targetRef.current + flick);
    lastInteractionRef.current = Date.now();
  };

  const ready = textures.length === items.length && items.length > 0;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full select-none"
      style={{
        touchAction: "pan-y",
        userSelect: "none",
        WebkitUserSelect: "none",
        cursor: "grab",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={1} />
        <SceneController
          progressRef={progressRef}
          targetRef={targetRef}
          dragActiveRef={dragActiveProxyRef}
          lastInteractionRef={lastInteractionRef}
          reducedMotion={reducedMotion}
        />
        {!reducedMotion && <GoldDust count={50} />}
        {ready &&
          items.map((_, i) => (
            <Card
              key={i}
              idx={i}
              total={items.length}
              texture={textures[i]}
              imgRes={imgResolutions[i]}
              progressRef={progressRef}
            />
          ))}
      </Canvas>

      {/* Overlay: judul aktif + dots + hint */}
      <div
        className="absolute left-0 right-0 pointer-events-none flex flex-col items-center"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 5.5rem)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-lato)",
            color: "rgba(212,160,23,0.55)",
            fontSize: "0.55rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            marginBottom: "0.4rem",
          }}
        >
          {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <h3
          key={activeIndex}
          className="mg3d-active-title"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.5rem",
            color: "#f0d080",
            textShadow: "0 2px 14px rgba(0,0,0,0.85), 0 0 28px rgba(212,160,23,0.18)",
            margin: 0,
            textAlign: "center",
          }}
        >
          {items[activeIndex]?.text}
        </h3>
        <div className="flex gap-2 mt-3">
          {items.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === activeIndex ? "22px" : "6px",
                height: "6px",
                borderRadius: "999px",
                background:
                  i === activeIndex
                    ? "var(--color-emas-muda)"
                    : "rgba(255,255,255,0.28)",
                transition: "all 0.35s ease",
                boxShadow:
                  i === activeIndex
                    ? "0 0 10px rgba(240,192,64,0.55)"
                    : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
