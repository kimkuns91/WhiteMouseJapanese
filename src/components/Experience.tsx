"use client";

import {
  Environment,
  Float,
  Gltf,
  Html,
  Loader,
  useGLTF,
} from "@react-three/drei";

import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Suspense } from "react";
import { degToRad } from "three/src/math/MathUtils.js";
import { MessagesList } from "./MessagesList";
import { Teacher } from "./Teacher";
import { TypingBox } from "./TypingBox";

export const Experience: React.FC = () => {
  return (
    <>
      <div className="z-10 md:justify-center fixed bottom-10 left-4 right-4 flex gap-3 flex-wrap justify-stretch">
        <TypingBox />
      </div>
      <Leva hidden />
      <Loader />
      <Canvas
        camera={{
          position: [0, 0, 0.0001],
        }}
      >
        <Suspense>
          <Float speed={0.5} floatIntensity={0.2} rotationIntensity={0.1}>
            <Html transform distanceFactor={1} position={[0.45, 0.382, -6]}>
              <MessagesList />
            </Html>
            <Environment preset="sunset" />
            <ambientLight intensity={0.8} color="pink" />
            <Gltf src={`/models/classroom.glb`} position={[0.2, -1.7, -2]} />
            <Teacher
              position={[-1, -1.7, -3]}
              scale={1.5}
              rotation-y={degToRad(20)}
            />
          </Float>
        </Suspense>
      </Canvas>
    </>
  );
};

useGLTF.preload("/models/classroom.glb");
