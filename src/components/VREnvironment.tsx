import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Text, Html as DreiHtml, useTexture, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { Flame, FireExtinguisher } from 'lucide-react';

// Scene components for different environments
const OfficeEnvironment = ({ onCompleteTask }: { onCompleteTask: (taskId: string) => void }) => {
  const { scene, camera } = useThree();
  const playerRef = useRef<THREE.Group>(new THREE.Group());
  const [moveState, setMoveState] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  
  // Camera look direction state
  const [lookUpDown, setLookUpDown] = useState(0);
  
  // Create a flame effect using particles
  const flameRef = useRef<THREE.Group>(new THREE.Group());
  
  useEffect(() => {
    // Set initial position - even lower height (0.7) for a more realistic view
    playerRef.current.position.set(0, 0.7, 0);
    scene.add(playerRef.current);
    
    // Add camera to player with neutral angle
    playerRef.current.add(camera);
    camera.position.set(0, 0, 0);
    camera.rotation.x = 0; // Start with a neutral view
    
    // Handle keyboard events for movement
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'ArrowUp') setMoveState(prev => ({ ...prev, forward: true }));
      if (e.key === 's' || e.key === 'ArrowDown') setMoveState(prev => ({ ...prev, backward: true }));
      if (e.key === 'a' || e.key === 'ArrowLeft') setMoveState(prev => ({ ...prev, left: true }));
      if (e.key === 'd' || e.key === 'ArrowRight') setMoveState(prev => ({ ...prev, right: true }));
      
      // Look up and down with Q and E keys
      if (e.key === 'q') setLookUpDown(1); // Look up
      if (e.key === 'e') setLookUpDown(-1); // Look down
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'ArrowUp') setMoveState(prev => ({ ...prev, forward: false }));
      if (e.key === 's' || e.key === 'ArrowDown') setMoveState(prev => ({ ...prev, backward: false }));
      if (e.key === 'a' || e.key === 'ArrowLeft') setMoveState(prev => ({ ...prev, left: false }));
      if (e.key === 'd' || e.key === 'ArrowRight') setMoveState(prev => ({ ...prev, right: false }));
      
      // Stop looking when keys are released
      if (e.key === 'q' || e.key === 'e') setLookUpDown(0);
    };
    
    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      // Clean up event listeners and scene objects
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      scene.remove(playerRef.current);
    };
  }, [scene, camera]);
  
  // Movement and look system
  useFrame(({ clock }) => {
    const speed = 0.03; // Maintain reduced speed for realistic walking pace
    if (moveState.forward) playerRef.current.translateZ(-speed);
    if (moveState.backward) playerRef.current.translateZ(speed);
    if (moveState.left) playerRef.current.rotateY(0.02);
    if (moveState.right) playerRef.current.rotateY(-0.02);
    
    // Handle looking up/down with Q and E keys
    if (lookUpDown !== 0) {
      // Get current rotation
      const currentRotation = camera.rotation.x;
      const newRotation = currentRotation - lookUpDown * 0.02;
      // Limit vertical rotation to prevent flipping (approximately -85° to 85°)
      const maxRotation = Math.PI * 0.47;
      camera.rotation.x = Math.max(-maxRotation, Math.min(maxRotation, newRotation));
    }
    
    // Keep player at a consistent low height (no flying)
    playerRef.current.position.y = 0.7;
    
    // Make the flame flicker
    if (flameRef.current) {
      const time = clock.getElapsedTime();
      const flickerSpeed = 5;
      const flickerAmount = 0.1;
      flameRef.current.scale.x = 1 + Math.sin(time * flickerSpeed) * flickerAmount;
      flameRef.current.scale.y = 1 + Math.cos(time * flickerSpeed * 1.2) * flickerAmount;
    }
  });

  // Create office workers - Updated function with more vibrant colors
  const createOfficeWorker = (position: [number, number, number], rotation: number = 0) => {
    // More vibrant and visible clothing colors
    const clothingColors = ["#1e3a8a", "#5a189a", "#a4133c", "#004e89", "#386641", "#7b2cbf"];
    const randomClothingColor = clothingColors[Math.floor(Math.random() * clothingColors.length)];
    
    // Randomize skin tones slightly
    const skinTones = ["#ffdbac", "#f1c27d", "#e0ac69", "#c68642", "#8d5524"];
    const skinTone = skinTones[Math.floor(Math.random() * skinTones.length)];
    
    return (
      <group position={position} rotation={[0, rotation, 0]}>
        {/* Body - torso */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[0.4, 0.6, 0.2]} />
          <meshStandardMaterial color={randomClothingColor} />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
        
        {/* Arms */}
        <mesh position={[0.25, 0.7, 0]} rotation={[0, 0, -0.5]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color={randomClothingColor} />
        </mesh>
        
        <mesh position={[-0.25, 0.7, 0]} rotation={[0, 0, 0.5]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color={randomClothingColor} />
        </mesh>
        
        {/* Legs */}
        <mesh position={[0.1, 0.25, 0]} castShadow>
          <boxGeometry args={[0.13, 0.4, 0.1]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        
        <mesh position={[-0.1, 0.25, 0]} castShadow>
          <boxGeometry args={[0.13, 0.4, 0.1]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
      </group>
    );
  };
  
  return (
    <>
      {/* Blue sky */}
      <Sky 
        distance={450000} 
        sunPosition={[0, 1, 0]} 
        inclination={0.6}
        azimuth={0.25}
        turbidity={10}
        rayleigh={0.5}
      />
      
      {/* Floor - Brightened */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      
      {/* Walls - Changed colors to soft blue */}
      <mesh position={[0, 2, -10]} castShadow receiveShadow>
        <boxGeometry args={[20, 4, 0.2]} />
        <meshStandardMaterial color="#d3e4fd" />
      </mesh>
      
      <mesh position={[0, 2, 10]} castShadow receiveShadow>
        <boxGeometry args={[20, 4, 0.2]} />
        <meshStandardMaterial color="#d3e4fd" />
      </mesh>
      
      <mesh position={[-10, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 4, 20]} />
        <meshStandardMaterial color="#d3e4fd" />
      </mesh>
      
      <mesh position={[10, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 4, 20]} />
        <meshStandardMaterial color="#d3e4fd" />
      </mesh>
      
      {/* Interactive objects */}
      {/* Exit door */}
      <InteractiveObject
        position={[9.9, 1, -5]}
        geometry={[1.6, 2, 0.1]}
        color="#a56035"
        hoverColor="#c07946"
        taskId="4"
        onInteract={onCompleteTask}
        label="Exit Door"
      />
      
      {/* Fire extinguisher - Replace red block with a proper fire extinguisher */}
      <group position={[5, 0.7, 9.7]} castShadow>
        {/* Extinguisher body */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 1, 16]} />
          <meshStandardMaterial color="#ff3333" metalness={0.5} roughness={0.2} />
        </mesh>
        
        {/* Extinguisher top */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.08, 0.15, 0.2, 16]} />
          <meshStandardMaterial color="#bbbbbb" metalness={0.7} roughness={0.2} />
        </mesh>
        
        {/* Extinguisher nozzle */}
        <mesh position={[0.12, 1.1, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.03, 0.03, 0.25, 8]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        
        {/* Handle */}
        <mesh position={[0, 0.8, 0.15]}>
          <boxGeometry args={[0.04, 0.12, 0.08]} />
          <meshStandardMaterial color="#333333" />
        </mesh>

        {/* Make this interactive for task completion */}
        <InteractiveObject
          position={[0, 0.5, 0]}
          geometry={[0.4, 1.4, 0.4]}
          color="rgba(0,0,0,0)"
          hoverColor="rgba(255,255,255,0.2)"
          taskId="1"
          onInteract={onCompleteTask}
          label="Fire Extinguisher"
          transparent={true}
        />
      </group>

      {/* Evacuation sign */}
      <InteractiveObject
        position={[9.7, 2.5, -5]}
        geometry={[0.1, 0.5, 0.5]}
        color="#33ff33"
        hoverColor="#55ff55"
        taskId="3"
        onInteract={onCompleteTask}
        label="Evacuation Sign"
      />

      {/* Office furniture - Brightened */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial color="#7a7a7a" />
      </mesh>
      
      {/* Add multiple desks with computers and office workers */}
      {/* Desk 1 (main desk) */}
      <mesh position={[0, 0.4, 2]} castShadow>
        <boxGeometry args={[1.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#a56035" />
      </mesh>

      {/* Computer on main desk */}
      <mesh position={[0, 0.6, 2]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.05]} /> {/* Monitor */}
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>
      <mesh position={[0, 0.5, 2.1]} castShadow>
        <boxGeometry args={[0.3, 0.1, 0.2]} /> {/* Computer base */}
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Person sitting at main desk - Fixed position */}
      {createOfficeWorker([0, 0.4, 2.6], Math.PI)}

      {/* Second desk to the left */}
      <mesh position={[-2, 0.4, 2]} castShadow>
        <boxGeometry args={[1.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#a56035" />
      </mesh>

      {/* Computer on second desk */}
      <mesh position={[-2, 0.6, 2]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.05]} /> {/* Monitor */}
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>
      <mesh position={[-2, 0.5, 2.1]} castShadow>
        <boxGeometry args={[0.3, 0.1, 0.2]} /> {/* Computer base */}
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Person sitting at second desk - Fixed position */}
      {createOfficeWorker([-2, 0.4, 2.6], Math.PI)}

      {/* Third desk to the right */}
      <mesh position={[2, 0.4, 2]} castShadow>
        <boxGeometry args={[1.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#a56035" />
      </mesh>

      {/* Computer on third desk */}
      <mesh position={[2, 0.6, 2]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.05]} /> {/* Monitor */}
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>
      <mesh position={[2, 0.5, 2.1]} castShadow>
        <boxGeometry args={[0.3, 0.1, 0.2]} /> {/* Computer base */}
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Person sitting at third desk - Fixed position */}
      {createOfficeWorker([2, 0.4, 2.6], Math.PI)}
      
      {/* Desk row in the back */}
      <mesh position={[-3, 0.4, 4]} castShadow>
        <boxGeometry args={[1.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#a56035" />
      </mesh>

      {/* Computer on back desk */}
      <mesh position={[-3, 0.6, 4]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.05]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>
      
      {/* Person at back desk - Fixed position */}
      {createOfficeWorker([-3, 0.4, 4.6], Math.PI)}
      
      {/* Another back desk */}
      <mesh position={[0, 0.4, 4]} castShadow>
        <boxGeometry args={[1.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#a56035" />
      </mesh>

      {/* Computer on another back desk */}
      <mesh position={[0, 0.6, 4]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.05]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>
      
      {/* Person at another back desk - Fixed position */}
      {createOfficeWorker([0, 0.4, 4.6], Math.PI)}
      
      {/* One more back desk */}
      <mesh position={[3, 0.4, 4]} castShadow>
        <boxGeometry args={[1.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#a56035" />
      </mesh>

      {/* Computer on one more back desk */}
      <mesh position={[3, 0.6, 4]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.05]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>
      
      {/* Person at one more back desk - Fixed position */}
      {createOfficeWorker([3, 0.4, 4.6], Math.PI)}

      {/* Add more workers in the room - Additional standing workers */}
      {createOfficeWorker([-1, 0, -2], Math.PI / 4)}
      {createOfficeWorker([1.5, 0, -1], -Math.PI / 6)}
      {createOfficeWorker([-3, 0, 0], Math.PI / 2)}
      {createOfficeWorker([4, 0, 3], -Math.PI / 3)}

      {/* Animated Fire Image in place of the flame */}
      <AnimatedFireImage flameRef={flameRef} position={[0, 0.55, 2]} />
      
      {/* Enhanced Lighting */}
      <ambientLight intensity={1.2} /> 
      <hemisphereLight intensity={1.0} color="#ffffff" groundColor="#bbbbff" /> 
      <directionalLight
        position={[10, 10, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Additional light sources */}
      <pointLight position={[-5, 5, 0]} intensity={0.8} color="#fffaea" />
      <pointLight position={[5, 3, -5]} intensity={0.8} color="#eaffff" />
    </>
  );
};

// New component for the animated fire image
const AnimatedFireImage = ({ flameRef, position }: { flameRef: React.RefObject<THREE.Group>, position: [number, number, number] }) => {
  // Load the fire image texture
  const fireTexture = useTexture('/lovable-uploads/f0f134d6-f524-4ac9-8d77-4ccffd5283a5.png');
  
  useFrame(({ clock }) => {
    if (flameRef.current) {
      const time = clock.getElapsedTime();
      // Add more complex animation for the fire
      flameRef.current.rotation.y = Math.sin(time * 1.5) * 0.2;
      flameRef.current.position.y = position[1] + Math.sin(time * 3) * 0.05;
      
      // Make the fire sway slightly
      flameRef.current.rotation.z = Math.sin(time * 2) * 0.05;
    }
  });
  
  return (
    <group ref={flameRef} position={position}>
      {/* Create a billboarded plane that always faces the camera */}
      <Billboard>
        <mesh>
          <planeGeometry args={[1, 1.5]} />
          <meshStandardMaterial 
            map={fireTexture} 
            transparent={true} 
            emissive="#ff3300"
            emissiveIntensity={2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Billboard>
      
      {/* Light emitted by the fire */}
      <pointLight 
        color="#ff5500" 
        intensity={2} 
        distance={5}
        decay={2}
      />
      
      {/* Flickering light for ambience */}
      <FlickeringLight position={[0, 0.5, 0]} />
    </group>
  );
};

// Billboard component to always face the camera
const Billboard = ({ children }: { children: React.ReactNode }) => {
  const billboardRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  
  useFrame(() => {
    if (billboardRef.current) {
      billboardRef.current.quaternion.copy(camera.quaternion);
    }
  });
  
  return <group ref={billboardRef}>{children}</group>;
};

// Flickering light component
const FlickeringLight = ({ position }: { position: [number, number, number] }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame(({ clock }) => {
    if (lightRef.current) {
      const time = clock.getElapsedTime();
      // Create irregular flickering pattern
      const flicker = 0.8 + 
        0.2 * Math.sin(time * 10) + 
        0.15 * Math.sin(time * 7.3) + 
        0.1 * Math.sin(time * 18.7);
      
      lightRef.current.intensity = flicker * 2;
    }
  });
  
  return (
    <pointLight 
      ref={lightRef} 
      position={position} 
      color="#ff7700" 
      intensity={2} 
      distance={3}
      decay={2}
    />
  );
};

// Factory Environment for industrial scenarios - Enhanced lighting
const FactoryEnvironment = ({ onCompleteTask }: { onCompleteTask: (taskId: string) => void }) => {
  const { scene, camera } = useThree();
  const playerRef = useRef<THREE.Group>(new THREE.Group());
  const [moveState, setMoveState] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  
  // Camera look direction state
  const [lookUpDown, setLookUpDown] = useState(0);
  
  useEffect(() => {
    // Set initial position
    playerRef.current.position.set(0, 0.7, 0);
    scene.add(playerRef.current);
    
    // Add camera to player with neutral angle
    playerRef.current.add(camera);
    camera.position.set(0, 0, 0);
    camera.rotation.x = 0;
    
    // Handle keyboard events for movement
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'ArrowUp') setMoveState(prev => ({ ...prev, forward: true }));
      if (e.key === 's' || e.key === 'ArrowDown') setMoveState(prev => ({ ...prev, backward: true }));
      if (e.key === 'a' || e.key === 'ArrowLeft') setMoveState(prev => ({ ...prev, left: true }));
      if (e.key === 'd' || e.key === 'ArrowRight') setMoveState(prev => ({ ...prev, right: true }));
      
      // Look up and down with Q and E keys
      if (e.key === 'q') setLookUpDown(1);
      if (e.key === 'e') setLookUpDown(-1);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'ArrowUp') setMoveState(prev => ({ ...prev, forward: false }));
      if (e.key === 's' || e.key === 'ArrowDown') setMoveState(prev => ({ ...prev, backward: false }));
      if (e.key === 'a' || e.key === 'ArrowLeft') setMoveState(prev => ({ ...prev, left: false }));
      if (e.key === 'd' || e.key === 'ArrowRight') setMoveState(prev => ({ ...prev, right: false }));
      
      if (e.key === 'q' || e.key === 'e') setLookUpDown(0);
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      scene.remove(playerRef.current);
    };
  }, [scene, camera]);
  
  // Movement and look system
  useFrame(() => {
    const speed = 0.03;
    if (moveState.forward) playerRef.current.translateZ(-speed);
    if (moveState.backward) playerRef.current.translateZ(speed);
    if (moveState.left) playerRef.current.rotateY(0.02);
    if (moveState.right) playerRef.current.rotateY(-0.02);
    
    if (lookUpDown !== 0) {
      const currentRotation = camera.rotation.x;
      const newRotation = currentRotation - lookUpDown * 0.02;
      const maxRotation = Math.PI * 0.47;
      camera.rotation.x = Math.max(-maxRotation, Math.min(maxRotation, newRotation));
    }
    
    playerRef.current.position.y = 0.7;
  });
  
  return (
    <>
      {/* Add blue sky to factory environment */}
      <Sky 
        distance={450000} 
        sunPosition={[0, 1, 0]} 
        inclination={0.5}
        azimuth={0.25}
        turbidity={8}
        rayleigh={0.5}
      />
      
      {/* Factory floor - Brightened */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#777777" />
      </mesh>
      
      {/* Factory walls - Changed to light green */}
      <mesh position={[0, 3, -15]} castShadow receiveShadow>
        <boxGeometry args={[30, 6, 0.3]} />
        <meshStandardMaterial color="#f2fce2" />
      </mesh>
      
      <mesh position={[0, 3, 15]} castShadow receiveShadow>
        <boxGeometry args={[30, 6, 0.3]} />
        <meshStandardMaterial color="#f2fce2" />
      </mesh>
      
      <mesh position={[-15, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 6, 30]} />
        <meshStandardMaterial color="#f2fce2" />
      </mesh>
      
      <mesh position={[15, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 6, 30]} />
        <meshStandardMaterial color="#f2fce2" />
      </mesh>
      
      {/* Industrial machinery - Brightened */}
      <mesh position={[-5, 1.2, -5]} castShadow>
        <boxGeometry args={[3, 2.4, 2]} />
        <meshStandardMaterial color="#4b7eaf" />
      </mesh>
      
      <mesh position={[-5, 2.6, -5]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1, 16]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      
      {/* Assembly line - Brightened */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[15, 1, 2]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Small boxes on assembly line - Brightened */}
      <mesh position={[-4, 1.2, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#c89d5d" />
      </mesh>
      
      <mesh position={[-2, 1.2, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#c89d5d" />
      </mesh>
      
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#c89d5d" />
      </mesh>
      
      {/* Industrial hazards - Brightened */}
      <InteractiveObject
        position={[5, 0.3, -8]}
        geometry={[4, 0.1, 2]}
        color="#ffdd33"
        hoverColor="#ffee55"
        taskId="2"
        onInteract={onCompleteTask}
        label="Slippery Floor"
      />
      
      <InteractiveObject
        position={[-8, 1, 8]}
        geometry={[0.5, 1, 0.5]}
        color="#ff3333"
        hoverColor="#ff5555"
        taskId="1"
        onInteract={onCompleteTask}
        label="Fire Extinguisher"
      />
      
      <InteractiveObject
        position={[14.9, 2, -5]}
        geometry={[0.1, 1.5, 2]}
        color="#55dd55"
        hoverColor="#77ff77"
        taskId="3"
        onInteract={onCompleteTask}
        label="Emergency Exit"
      />
      
      <InteractiveObject
        position={[14.9, 1, -5]}
        geometry={[0.1, 2, 1.5]}
        color="#a56035"
        hoverColor="#c07946"
        taskId="4"
        onInteract={onCompleteTask}
        label="Exit Door"
      />
      
      {/* Enhanced Lighting */}
      {/* Doubled from 0.3 */}
      <ambientLight intensity={0.6} /> 
      {/* Increased from 0.8 */}
      <pointLight position={[0, 5, 0]} intensity={1.2} color="#ffffff" castShadow /> 
      {/* Increased from 0.5 */}
      <pointLight position={[-10, 5, -10]} intensity={0.8} color="#fffaea" castShadow /> 
      {/* Increased from 0.5 */}
      <pointLight position={[10, 5, 10]} intensity={0.8} color="#eaffff" castShadow /> 
      {/* Additional light sources */}
      <pointLight position={[0, 3, -10]} intensity={0.6} color="#fffdea" />
      <pointLight position={[-8, 3, 0]} intensity={0.5} color="#eaffff" />
    </>
  );
};

// Warehouse Environment - Enhanced lighting
const WarehouseEnvironment = ({ onCompleteTask }: { onCompleteTask: (taskId: string) => void }) => {
  const { scene, camera } = useThree();
  const playerRef = useRef<THREE.Group>(new THREE.Group());
  const [moveState, setMoveState] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  
  // Camera look direction state
  const [lookUpDown, setLookUpDown] = useState(0);
  
  useEffect(() => {
    // Set initial position
    playerRef.current.position.set(0, 0.7, 0);
    scene.add(playerRef.current);
    
    // Add camera to player with neutral angle
    playerRef.current.add(camera);
    camera.position.set(0, 0, 0);
    camera.rotation.x = 0;
    
    // Handle keyboard events for movement
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'ArrowUp') setMoveState(prev => ({ ...prev, forward: true }));
      if (e.key === 's' || e.key === 'ArrowDown') setMoveState(prev => ({ ...prev, backward: true }));
      if (e.key === 'a' || e.key === 'ArrowLeft') setMoveState(prev => ({ ...prev, left: true }));
      if (e.key === 'd' || e.key === 'ArrowRight') setMoveState(prev => ({ ...prev, right: true }));
      
      // Look up and down with Q and E keys
      if (e.key === 'q') setLookUpDown(1);
      if (e.key === 'e') setLookUpDown(-1);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'ArrowUp') setMoveState(prev => ({ ...prev, forward: false }));
      if (e.key === 's' || e.key === 'ArrowDown') setMoveState(prev => ({ ...prev, backward: false }));
      if (e.key === 'a' || e.key === 'ArrowLeft') setMoveState(prev => ({ ...prev, left: false }));
      if (e.key === 'd' || e.key === 'ArrowRight') setMoveState(prev => ({ ...prev, right: false }));
      
      if (e.key === 'q' || e.key === 'e') setLookUpDown(0);
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      scene.remove(playerRef.current);
    };
  }, [scene, camera]);
  
  // Movement and look system
  useFrame(() => {
    const speed = 0.03;
    if (moveState.forward) playerRef.current.translateZ(-speed);
    if (moveState.backward) playerRef.current.translateZ(speed);
    if (moveState.left) playerRef.current.rotateY(0.02);
    if (moveState.right) playerRef.current.rotateY(-0.02);
    
    if (lookUpDown !== 0) {
      const currentRotation = camera.rotation.x;
      const newRotation = currentRotation - lookUpDown * 0.02;
      const maxRotation = Math.PI * 0.47;
      camera.rotation.x = Math.max(-maxRotation, Math.min(maxRotation, newRotation));
    }
    
    playerRef.current.position.y = 0.7;
  });
  
  // Create shelving unit - Brightened colors
  const createShelf = (posX: number, posZ: number, rotation: number = 0) => {
    return (
      <group position={[posX, 0, posZ]} rotation={[0, rotation, 0]}>
        {/* Shelf structure */}
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[1, 4, 6]} />
          <meshStandardMaterial color="#777777" />
        </mesh>
        
        {/* Shelf levels */}
        {[0.5, 1.5, 2.5, 3.5].map((height, index) => (
          <mesh key={index} position={[0, height, 0]} castShadow>
            <boxGeometry args={[1.2, 0.1, 6.2]} />
            <meshStandardMaterial color="#555555" />
          </mesh>
        ))}
        
        {/* Boxes on shelves (randomly placed) - Brightened */}
        {Array.from({ length: 8 }).map((_, index) => {
          const level = Math.floor(index / 2);
          const xOffset = (index % 2) * 0.4 - 0.2;
          const zOffset = (Math.floor(Math.random() * 4) - 2) * 1.2;
          return (
            <mesh 
              key={`box-${index}`}
              position={[xOffset, level * 1 + 0.8, zOffset]}
              castShadow
            >
              <boxGeometry args={[0.8, 0.6, 0.8]} />
              <meshStandardMaterial color={["#c89d5d", "#b87a4b", "#855431"][index % 3]} />
            </mesh>
          );
        })}
      </group>
    );
  };
  
  return (
    <>
      {/* Add blue sky to warehouse environment */}
      <Sky 
        distance={450000} 
        sunPosition={[0, 1, 0]} 
        inclination={0.4}
        azimuth={0.3}
        turbidity={12}
        rayleigh={0.7}
      />
      
      {/* Warehouse floor - Brightened */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      
      {/* Warehouse walls - Changed to soft peach */}
      <mesh position={[0, 4, -15]} castShadow receiveShadow>
        <boxGeometry args={[30, 8, 0.3]} />
        <meshStandardMaterial color="#fde1d3" />
      </mesh>
      
      <mesh position={[0, 4, 15]} castShadow receiveShadow>
        <boxGeometry args={[30, 8, 0.3]} />
        <meshStandardMaterial color="#fde1d3" />
      </mesh>
      
      <mesh position={[-15, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 8, 30]} />
        <meshStandardMaterial color="#fde1d3" />
      </mesh>
      
      <mesh position={[15, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 8, 30]} />
        <meshStandardMaterial color="#fde1d3" />
      </mesh>
      
      {/* Shelving units */}
      {createShelf(-5, -8)}
      {createShelf(-5, 0)}
      {createShelf(-5, 8)}
      {createShelf(5, -8)}
      {createShelf(5, 0)}
      {createShelf(5, 8)}
      
      {/* Forklift - Brightened */}
      <group position={[0, 0, -5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.5, 1, 2.5]} />
          <meshStandardMaterial color="#ffeb00" />
        </mesh>
        
        <mesh position={[0, 1.3, -0.7]} castShadow>
          <boxGeometry args={[1.3, 0.6, 0.8]} />
          <meshStandardMaterial color="#ffeb00" />
        </mesh>
        
        <mesh position={[0, 0.3, 1.5]} castShadow>
          <boxGeometry args={[1.2, 0.2, 0.5]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
      </group>
      
      {/* Pallets - Brightened */}
      <mesh position={[0, 0.1, 5]} castShadow>
        <boxGeometry args={[1.2, 0.2, 1.2]} />
        <meshStandardMaterial color="#a56035" />
      </mesh>
      
      <mesh position={[2, 0.1, 5]} castShadow>
        <boxGeometry args={[1.2, 0.2, 1.2]} />
        <meshStandardMaterial color="#a56035" />
      </mesh>
      
      <mesh position={[2, 0.5, 5]} castShadow>
        <boxGeometry args={[1, 0.6, 1]} />
        <meshStandardMaterial color="#c89d5d" />
      </mesh>
      
      {/* Safety items - Brightened */}
      <InteractiveObject
        position={[-8, 1, -12]}
        geometry={[0.6, 1.6, 0.6]}
        color="#ff3333"
        hoverColor="#ff5555"
        taskId="1"
        onInteract={onCompleteTask}
        label="Fire Extinguisher"
      />
      
      <InteractiveObject
        position={[14.9, 2, -5]}
        geometry={[0.1, 1.5, 2]}
        color="#55dd55"
        hoverColor="#77ff77"
        taskId="3"
        onInteract={onCompleteTask}
        label="Emergency Exit"
      />
      
      <InteractiveObject
        position={[14.9, 1, -5]}
        geometry={[0.1, 2, 1.5]}
        color="#a56035"
        hoverColor="#c07946"
        taskId="4"
        onInteract={onCompleteTask}
        label="Exit Door"
      />
      
      <InteractiveObject
        position={[0, 0.2, -10]}
        geometry={[4, 0.05, 2]}
        color="#ffdd33"
        hoverColor="#ffee55"
        taskId="2"
        onInteract={onCompleteTask}
        label="Spill Hazard"
      />
      
      {/* Enhanced Lighting */}
      {/* Increased from 0.2 */}
      <ambientLight intensity={0.5} /> 
      {/* Increased from 0.8 */}
      <pointLight position={[0, 7, 0]} intensity={1.2} color="#ffffff" castShadow /> 
      {/* Increased from 0.5 */}
      <pointLight position={[-10, 7, -10]} intensity={0.8} color="#fffaea" castShadow /> 
      {/* Increased from 0.5 */}
      <pointLight position={[10, 7, 10]} intensity={0.8} color="#eaffff" castShadow /> 
      {/* Additional light sources */}
      <pointLight position={[0, 4, -5]} intensity={0.6} color="#fffaea" />
      <pointLight position={[0, 4, 5]} intensity={0.6} color="#eaffff" />
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
  transparent?: boolean;
  rotation?: [number, number, number];
}

const InteractiveObject = ({
  position,
  geometry,
  color,
  hoverColor,
  taskId,
  onInteract,
  label,
  transparent = false,
  rotation = [0, 0, 0],
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
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={geometry} />
      <meshStandardMaterial 
        color={interacted ? "#33cc33" : hovered ? hoverColor : color} 
        transparent={transparent}
        opacity={transparent ? 0.0 : 1.0}
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

// Html component for labels with fixed IDs to avoid selector issues
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
    
    // Use a sanitized ID that won't cause querySelector errors with periods
    const sanitizedPos = `${Math.floor(position[0] * 100)}_${Math.floor(position[1] * 100)}_${Math.floor(position[2] * 100)}`;
    const label = document.querySelector(`#label-${sanitizedPos}`);
    if (label) {
      (label as HTMLElement).style.transform = `translate(-50%, -100%) translate(${x}px,${y}px)`;
    }
  });
  
  useEffect(() => {
    // Create sanitized ID that won't cause querySelector errors
    const sanitizedPos = `${Math.floor(position[0] * 100)}_${Math.floor(position[1] * 100)}_${Math.floor(position[2] * 100)}`;
    
    const element = document.createElement('div');
    element.id = `label-${sanitizedPos}`;
    element.style.position = 'absolute';
    element.style.pointerEvents = 'none';
    document.body.appendChild(element);
    
    const root = document.getElementById(`label-${sanitizedPos}`);
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
      if (document.body.contains(element)) {
        document.body.removeChild(element);
      }
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
  // Choose environment based on scenario type
  const renderEnvironment = () => {
    switch (scenarioType) {
      case 'fire':
        return <OfficeEnvironment onCompleteTask={onCompleteTask} />;
      case 'evacuation':
        return <FactoryEnvironment onCompleteTask={onCompleteTask} />;
      case 'hazards':
        return <WarehouseEnvironment onCompleteTask={onCompleteTask} />;
      default:
        return <OfficeEnvironment onCompleteTask={onCompleteTask} />;
    }
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute bottom-4 left-4 z-10 bg-black bg-opacity-60 p-2 rounded text-white text-sm">
        <p>Movement: W/↑ (forward), S/↓ (backward), A/← (turn left), D/→ (turn right)</p>
        <p>Look: Q (look up), E (look down)</p>
        <p>Click on objects to interact with them</p>
      </div>
      
      <Canvas
        shadows
        camera={{ position: [0, 0.7, 5], fov: 70 }} 
        style={{ height: '100%', width: '100%' }}
      >
        {renderEnvironment()}
      </Canvas>
    </div>
  );
};

export default VREnvironment;
