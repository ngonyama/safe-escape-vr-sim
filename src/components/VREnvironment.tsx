
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Scene components
const OfficeEnvironment = ({ onCompleteTask }: { onCompleteTask: (taskId: string) => void }) => {
  const { scene, camera } = useThree();
  const playerRef = useRef<THREE.Group>(new THREE.Group());
  
  useEffect(() => {
    // Set initial position
    playerRef.current.position.set(0, 1.6, 0);
    scene.add(playerRef.current);
    
    // Add camera to player
    playerRef.current.add(camera);
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, -1);
    
    return () => {
      scene.remove(playerRef.current);
    };
  }, [scene, camera]);
  
  // Simple keyboard movement system
  useFrame(({ clock }) => {
    const keyboard = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };
    
    // Check keyboard input
    document.addEventListener('keydown', (e) => {
      if (e.key === 'w' || e.key === 'ArrowUp') keyboard.forward = true;
      if (e.key === 's' || e.key === 'ArrowDown') keyboard.backward = true;
      if (e.key === 'a' || e.key === 'ArrowLeft') keyboard.left = true;
      if (e.key === 'd' || e.key === 'ArrowRight') keyboard.right = true;
    });
    
    document.addEventListener('keyup', (e) => {
      if (e.key === 'w' || e.key === 'ArrowUp') keyboard.forward = false;
      if (e.key === 's' || e.key === 'ArrowDown') keyboard.backward = false;
      if (e.key === 'a' || e.key === 'ArrowLeft') keyboard.left = false;
      if (e.key === 'd' || e.key === 'ArrowRight') keyboard.right = false;
    });
    
    // Move player
    const speed = 0.05;
    if (keyboard.forward) playerRef.current.translateZ(-speed);
    if (keyboard.backward) playerRef.current.translateZ(speed);
    if (keyboard.left) playerRef.current.rotateY(0.02);
    if (keyboard.right) playerRef.current.rotateY(-0.02);
  });
  
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 2, -10]} castShadow receiveShadow>
        <boxGeometry args={[20, 4, 0.2]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      <mesh position={[0, 2, 10]} castShadow receiveShadow>
        <boxGeometry args={[20, 4, 0.2]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      <mesh position={[-10, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 4, 20]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      <mesh position={[10, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 4, 20]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      {/* Exit door */}
      <InteractiveObject
        position={[9.9, 1, -5]}
        geometry={[1.6, 2, 0.1]}
        color="#8b4513"
        hoverColor="#a56035"
        taskId="4"
        onInteract={onCompleteTask}
        label="Exit Door"
      />
      
      {/* Fire extinguisher */}
      <InteractiveObject
        position={[5, 0.7, 9.7]}
        geometry={[0.4, 1.4, 0.4]}
        color="#ff0000"
        hoverColor="#ff3333"
        taskId="1"
        onInteract={onCompleteTask}
        label="Fire Extinguisher"
      />

      {/* Evacuation sign */}
      <InteractiveObject
        position={[9.7, 2.5, -5]}
        geometry={[0.1, 0.5, 0.5]}
        color="#00cc00"
        hoverColor="#33ff33"
        taskId="3"
        onInteract={onCompleteTask}
        label="Evacuation Sign"
      />

      {/* Office furniture */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial color="#5c5c5c" />
      </mesh>
      
      <mesh position={[0, 0.1, 2]} castShadow>
        <boxGeometry args={[1.2, 0.2, 1.2]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      <mesh position={[0, 0.55, 2]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.5]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <hemisphereLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
};

// Interactive object component
interface InteractiveObjectProps {
  position: [number, number, number];
  geometry: [number, number, number];
  color: string;
  hoverColor: string;
  taskId: string;
  onInteract: (taskId: string) => void;
  label: string;
}

const InteractiveObject = ({
  position,
  geometry,
  color,
  hoverColor,
  taskId,
  onInteract,
  label,
}: InteractiveObjectProps) => {
  const [hovered, setHovered] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  
  const handleClick = () => {
    if (!interacted) {
      setInteracted(true);
      onInteract(taskId);
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={geometry} />
      <meshStandardMaterial 
        color={interacted ? "#33cc33" : hovered ? hoverColor : color} 
      />
      {hovered && (
        <Html position={[0, geometry[1] / 2 + 0.3, 0]}>
          <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
            {label}
          </div>
        </Html>
      )}
    </mesh>
  );
};

// Html component for labels
const Html = ({ children, position }: { 
  children: React.ReactNode;
  position: [number, number, number]; 
}) => {
  const { camera } = useThree();
  const [pos] = useState(() => new THREE.Vector3());
  
  useFrame(() => {
    pos.set(position[0], position[1], position[2]);
    pos.project(camera);
    const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;
    
    const label = document.querySelector(`#label-${position.join('-')}`);
    if (label) {
      (label as HTMLElement).style.transform = `translate(-50%, -100%) translate(${x}px,${y}px)`;
    }
  });
  
  useEffect(() => {
    const element = document.createElement('div');
    element.id = `label-${position.join('-')}`;
    element.style.position = 'absolute';
    element.style.pointerEvents = 'none';
    document.body.appendChild(element);
    
    const root = document.getElementById(`label-${position.join('-')}`);
    if (root) {
      const div = document.createElement('div');
      root.appendChild(div);
      div.innerHTML = '';
      
      // Insert children
      if (typeof children === 'string') {
        div.textContent = children;
      } else if (React.isValidElement(children)) {
        div.innerHTML = (children.props as any).children;
      }
    }
    
    return () => {
      document.body.removeChild(element);
    };
  }, [children, position]);
  
  return null;
};

// Main VR environment component
interface VREnvironmentProps {
  environmentType: string;
  scenarioType: string;
  onCompleteTask: (taskId: string) => void;
}

const VREnvironment = ({ environmentType, scenarioType, onCompleteTask }: VREnvironmentProps) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.6, 5], fov: 70 }}
      style={{ height: '100vh', width: '100vw' }}
    >
      {/* For now we're only supporting office environment */}
      <OfficeEnvironment onCompleteTask={onCompleteTask} />
    </Canvas>
  );
};

export default VREnvironment;
