import { Html, useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import {
  AnimationClip,
  Camera,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SkinnedMesh,
} from "three";

import useAITeacher from "@/libs/stores/aiJapaneseStore";
import { useFrame } from "@react-three/fiber";
import { GLTFParser } from "three/examples/jsm/Addons.js";
import { randInt } from "three/src/math/MathUtils.js";

const ANIMATION_FADE_TIME = 0.5;
export interface GLTF {
  animations: AnimationClip[];
  scene: Group;
  scenes: Group[];
  cameras: Camera[];
  asset: {
    copyright?: string;
    generator?: string;
    version?: string;
    minVersion?: string;
    extensions?: any;
    extras?: any;
  };
  parser: GLTFParser;
  userData: any;
}

export function Teacher({ ...props }) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(`/models/Teacher.glb`);

  useEffect(() => {
    scene.traverse((child: Object3D) => {
      if (child instanceof Mesh) {
        child.material = new MeshStandardMaterial({
          map: child.material.map,
        });
      }
    });
  }, [scene]);

  const currentMessage = useAITeacher((state) => state.currentMessage);
  const loading = useAITeacher((state) => state.loading);
  const { animations } = useGLTF("/models/animations_Teacher.glb");
  const { actions, mixer } = useAnimations(animations, group);
  const [animation, setAnimation] = useState<string>("Idle");

  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 100);
      }, randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  useEffect(() => {
    if (loading) {
      setAnimation("Thinking");
    } else if (currentMessage) {
      setAnimation(randInt(0, 1) ? "Talking" : "Talking2");
    } else {
      setAnimation("Idle");
    }
  }, [currentMessage, loading]);

  useFrame(({ camera }) => {
    // Smile
    lerpMorphTarget("mouthSmile", 0.2, 0.5);
    // Blinking
    lerpMorphTarget("eye_close", blink ? 1 : 0, 0.5);

    // Talking
    for (let i = 0; i <= 21; i++) {
      lerpMorphTarget(i.toString(), 0, 0.1); // reset morph targets
    }

    if (
      currentMessage &&
      currentMessage.visemes &&
      currentMessage.audioPlayer
    ) {
      for (let i = currentMessage.visemes.length - 1; i >= 0; i--) {
        const viseme = currentMessage.visemes[i];
        if (currentMessage.audioPlayer.currentTime * 1000 >= viseme[0]) {
          lerpMorphTarget(viseme[1], 1, 0.2);
          break;
        }
      }
      // 옵셔널 체이닝을 사용하여 `null`이나 `undefined` 체크
      const action = actions[animation];
      if (
        action &&
        action.time > action.getClip().duration - ANIMATION_FADE_TIME
      ) {
        setAnimation((prevAnimation) =>
          prevAnimation === "Talking" ? "Talking2" : "Talking"
        );
      }
    }
  });

  useEffect(() => {
    actions[animation]
      ?.reset()
      .fadeIn(mixer.time > 0 ? ANIMATION_FADE_TIME : 0)
      .play();
    return () => {
      actions[animation]?.fadeOut(ANIMATION_FADE_TIME);
    };
  }, [animation, actions, mixer.time]);

  const lerpMorphTarget = (
    target: string,
    value: number,
    speed: number = 0.1
  ) => {
    scene.traverse((child: Object3D) => {
      if (child instanceof SkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        // `morphTargetInfluences` 배열과 인덱스 값이 존재하는지 확인
        if (
          index !== undefined &&
          child.morphTargetInfluences &&
          child.morphTargetInfluences[index] !== undefined
        ) {
          child.morphTargetInfluences[index] = MathUtils.lerp(
            child.morphTargetInfluences[index],
            value,
            speed
          );
        }
      }
    });
  };

  const [thinkingText, setThinkingText] = useState(".");

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setThinkingText((thinkingText) => {
          if (thinkingText.length === 3) {
            return ".";
          }
          return thinkingText + ".";
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <group {...props} dispose={null} ref={group}>
      {loading && (
        <Html position-y={1.6}>
          <div className="flex justify-center items-center -translate-x-1/2">
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex items-center justify-center duration-75 rounded-full h-8 w-8 bg-white/80">
                {thinkingText}
              </span>
            </span>
          </div>
        </Html>
      )}
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(`/models/Teacher.glb`);
useGLTF.preload(`/models/animations_Teacher.glb`);
