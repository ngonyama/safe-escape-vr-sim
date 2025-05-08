import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { useRef, useState, useEffect, Suspense } from 'react';
import { Environment, Html, OrbitControls, Stats, Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface VREnvironmentProps {
  environmentType: string;
  scenarioType: string;
  onCompleteTask: (taskId: string) => void;
}

interface InteractiveObjectProps {
  position: [number, number, number];
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  taskId: string;
  onInteract: (taskId: string) => void;
  label: string;
  children?: React.ReactNode;
}

const InteractiveObject = ({
  position,
  geometry,
  material,
  taskId,
  onInteract,
  label,
  children
}: InteractiveObjectProps) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    onInteract(taskId);
  };

  return (
    <>
      <mesh
        ref={mesh}
        position={position}
        geometry={geometry}
        material={material}
        castShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        {children}
      </mesh>
      {(hovered || clicked) && (
        <Html position={[0, 1, 0]} distanceFactor={5}>
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '0.5em',
              borderRadius: '0.2em',
              fontSize: '0.7em',
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </>
  );
};

const VREnvironment = ({ 
  environmentType, 
  scenarioType,
  onCompleteTask 
}: VREnvironmentProps) => {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const handleTaskCompletion = (taskId: string) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
      onCompleteTask(taskId);
    }
  };
  
  return (
    <Canvas shadows camera={{ position: [0, 2, 10], fov: 60 }}>
      <Stats />
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Office environment */}
      {environmentType === 'office' && (
        <Office scenarioType={scenarioType} onCompleteTask={onCompleteTask} />
      )}
      
      {/* Assembly point outside with people, trees and scenery */}
      <OutdoorAssemblyPoint />
      
      {/* Environment skybox */}
      <Environment preset="city" />
    </Canvas>
  );
};

const Office = ({ scenarioType, onCompleteTask }: { scenarioType: string, onCompleteTask: (taskId: string) => void }) => {
  const [isExtinguisherUsed, setIsExtinguisherUsed] = useState(false);
  const [isDoorFound, setIsDoorFound] = useState(false);
  const [isEvacuationRouteFound, setIsEvacuationRouteFound] = useState(false);

  const handleExtinguisherInteraction = () => {
    setIsExtinguisherUsed(true);
    onCompleteTask("1");
  };

  const handleDoorInteraction = () => {
    setIsDoorFound(true);
    onCompleteTask("3");
  };

  const handleEvacuationRouteInteraction = () => {
    setIsEvacuationRouteFound(true);
    onCompleteTask("3");
  };
  
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      
      {/* Walls */}
      {/* Back wall */}
      <mesh position={[0, 2, -10]} castShadow receiveShadow>
        <boxGeometry args={[20, 4, 0.2]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-10, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 4, 20]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[10, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 4, 20]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      {/* Front wall with door opening */}
      <mesh position={[0, 2, 10]} castShadow receiveShadow>
        <boxGeometry args={[20, 4, 0.2]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Door opening - create a hole in the front wall */}
      <mesh position={[0, 1, 9.9]} castShadow>
        <boxGeometry args={[2, 2, 0.4]} />
        <meshStandardMaterial color="#f0f0f0" opacity={0} transparent />
      </mesh>
      
      {/* Door frame */}
      <mesh position={[1, 1, 9.8]} castShadow>
        <boxGeometry args={[0.1, 2, 0.3]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[-1, 1, 9.8]} castShadow>
        <boxGeometry args={[0.1, 2, 0.3]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 2, 9.8]} castShadow>
        <boxGeometry args={[2, 0.1, 0.3]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Door */}
      <InteractiveObject
        position={[0, 1, 9.7]}
        geometry={new THREE.BoxGeometry(1.8, 1.9, 0.1)}
        material={new THREE.MeshStandardMaterial({ color: "#a0522d" })}
        taskId="3"
        onInteract={onCompleteTask}
        label="Exit Door"
      />
      
      {/* Exit Sign - New realistic implementation */}
      <ExitSign position={[0, 2.65, 9.9]} />
      
      {/* Fire extinguisher - Replace red block with a proper fire extinguisher */}
      <group position={[5, 0.7, 9.7]} castShadow>
        <InteractiveObject
          position={[0, 0, 0]}
          geometry={new THREE.CylinderGeometry(0.15, 0.15, 0.6, 16)}
          material={new THREE.MeshStandardMaterial({ color: "#ff0000", metalness: 0.7 })}
          taskId="1"
          onInteract={onCompleteTask}
          label="Fire Extinguisher"
        />
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[0, 0.38, 0]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
        <mesh position={[0, -0.3, 0.1]} castShadow rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.2, 16]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      </group>
      
      {/* Windows on back wall */}
      <mesh position={[-5, 2, -9.9]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="#aacfff" opacity={0.7} transparent />
      </mesh>
      <mesh position={[5, 2, -9.9]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="#aacfff" opacity={0.7} transparent />
      </mesh>

      {/* Office desks */}
      <OfficeDesk position={[-5, 0, -5]} />
      <OfficeDesk position={[-5, 0, 0]} />
      <OfficeDesk position={[-5, 0, 5]} />
      <OfficeDesk position={[5, 0, -5]} />
      <OfficeDesk position={[5, 0, 0]} />
      <OfficeDesk position={[5, 0, 5]} />

      {/* Office workers */}
      {/* Left side workers */}
      <OfficeWorker 
        position={[-5.5, 1, -5]} 
        rotation={[0, -Math.PI / 4, 0]} 
        color="#3366cc" 
        hairColor="#3a3a3a"
        skinColor="#e8beac"
      />
      <OfficeWorker 
        position={[-5.5, 1, 0]} 
        rotation={[0, -Math.PI / 4, 0]} 
        color="#cc6633" 
        hairColor="#5c3c10"
        skinColor="#d3a186"
      />
      <OfficeWorker 
        position={[-5.5, 1, 5]} 
        rotation={[0, -Math.PI / 4, 0]} 
        color="#336633" 
        hairColor="#1a1a1a"
        skinColor="#ebcba7"
      />
      
      {/* Right side workers */}
      <OfficeWorker 
        position={[5.5, 1, -5]} 
        rotation={[0, Math.PI / 4, 0]} 
        color="#993366" 
        hairColor="#6c4b20"
        skinColor="#e6c6af"
      />
      <OfficeWorker 
        position={[5.5, 1, 0]} 
        rotation={[0, Math.PI / 4, 0]} 
        color="#333366" 
        hairColor="#1c1c1c"
        skinColor="#d7b297"
      />
      <OfficeWorker 
        position={[5.5, 1, 5]} 
        rotation={[0, Math.PI / 4, 0]} 
        color="#666633" 
        hairColor="#472e0f"
        skinColor="#e4c1a5"
      />

      {/* Main escape route - Interactive arrows on floor */}
      <InteractiveObject
        position={[0, 0.02, 5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        geometry={new THREE.PlaneGeometry(1, 2)}
        material={
          new THREE.MeshStandardMaterial({
            color: "#33cc33",
            emissive: "#33cc33",
            emissiveIntensity: 0.5,
            opacity: 0.7,
            transparent: true,
          })
        }
        taskId="3"
        onInteract={onCompleteTask}
        label="Follow Evacuation Route"
      >
        <Text
          position={[0, 0.4, 0.01]}
          rotation={[0, 0, Math.PI / 2]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          →
        </Text>
      </InteractiveObject>

      {/* Additional lighting */}
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-5, 5, 0]} intensity={0.8} color="#fffaea" />
      <pointLight position={[5, 3, -5]} intensity={0.8} color="#eaffff" />
    </>
  );
};

// New component for realistic exit sign
const ExitSign = ({ position }: { position: [number, number, number] }) => {
  const { scene } = useGLTF('/models/exit_sign/scene.gltf');
  return <primitive object={scene} position={position} scale={0.02} />;
};

// Office desk component
const OfficeDesk = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Desk base */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[3, 1.4, 1.5]} />
        <meshStandardMaterial color="#a0522d" />
      </mesh>
      
      {/* Desk top */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <boxGeometry args={[3.1, 0.1, 1.6]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>
      
      {/* Computer monitor */}
      <mesh position={[0, 2.1, -0.3]} castShadow>
        <boxGeometry args={[0.8, 0.6, 0.1]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      
      {/* Keyboard */}
      <mesh position={[0, 1.5, 0.3]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.2]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
};

// Office worker component
const OfficeWorker = ({ 
  position, 
  rotation = [0, 0, 0], 
  color = "#3366cc", 
  hairColor = "#1a1a1a", 
  skinColor = "#e8beac" 
}: { 
  position: [number, number, number], 
  rotation?: [number, number, number], 
  color?: string,
  hairColor?: string,
  skinColor?: string
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Body */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.75, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color={hairColor} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[0.4, 1.1, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.4, 1.1, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[0.15, 0.4, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.7, 8, 16]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      <mesh position={[-0.15, 0.4, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.7, 8, 16]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
    </group>
  );
};

// New component for outdoor assembly point with people, trees and scenery
const OutdoorAssemblyPoint = () => {
  return (
    <group position={[0, -0.1, 30]}>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#7cba7c" />
      </mesh>
      
      {/* Assembly point sign */}
      <group position={[0, 2, -5]}>
        <mesh castShadow>
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial color="#38b638" />
        </mesh>
        <Text
          position={[0, 0, 0.06]}
          color="white"
          fontSize={0.3}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
        >
          ASSEMBLY POINT
        </Text>
      </group>
      
      {/* People gathered at assembly point - using simplified figures */}
      {/* Group 1 - left side */}
      <group position={[-5, 0, 0]}>
        <EmergencyPerson position={[0, 0, 0]} color="#3366cc" />
        <EmergencyPerson position={[1, 0, 0.5]} color="#cc6633" />
        <EmergencyPerson position={[-0.8, 0, -0.3]} color="#336633" />
        <EmergencyPerson position={[0.5, 0, -1]} color="#993366" />
      </group>
      
      {/* Group 2 - right side */}
      <group position={[5, 0, -2]}>
        <EmergencyPerson position={[0, 0, 0]} color="#333366" />
        <EmergencyPerson position={[-1, 0, 0.7]} color="#666633" />
        <EmergencyPerson position={[0.7, 0, 0.8]} color="#663333" />
        <EmergencyPerson position={[0.4, 0, -0.6]} color="#336666" />
        <EmergencyPerson position={[-0.8, 0, -0.5]} color="#663366" />
      </group>
      
      {/* Safety officer with clipboard */}
      <group position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <EmergencyPerson position={[0, 0, 0]} color="#ff9900" />
        <mesh position={[0.3, 1.2, 0]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 0.4, 0.05]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      </group>
      
      {/* Trees scattered around - using simple tree models */}
      <Tree position={[-10, 0, -10]} scale={[1.2, 1.2, 1.2]} />
      <Tree position={[-15, 0, -5]} scale={[0.8, 1, 0.8]} />
      <Tree position={[-12, 0, 5]} scale={[1, 1.3, 1]} />
      <Tree position={[-8, 0, 10]} scale={[1.4, 1.1, 1.4]} />
      <Tree position={[10, 0, -12]} scale={[1.2, 1.2, 1.2]} />
      <Tree position={[15, 0, -7]} scale={[0.9, 1.1, 0.9]} />
      <Tree position={[12, 0, 8]} scale={[1.3, 1.2, 1.3]} />
      <Tree position={[8, 0, 12]} scale={[1, 1, 1]} />
      
      {/* Distant mountains */}
      <group position={[0, 0, -40]}>
        <mesh position={[-20, 6, 0]} castShadow>
          <coneGeometry args={[15, 12, 16]} />
          <meshStandardMaterial color="#6a8caf" />
        </mesh>
        <mesh position={[0, 8, -5]} castShadow>
          <coneGeometry args={[18, 16, 16]} />
          <meshStandardMaterial color="#5d7d9a" />
        </mesh>
        <mesh position={[25, 5, 0]} castShadow>
          <coneGeometry args={[12, 10, 16]} />
          <meshStandardMaterial color="#7a9cbf" />
        </mesh>
      </group>
      
      {/* Clouds */}
      <Cloud position={[-30, 15, -20]} />
      <Cloud position={[20, 18, -25]} />
      <Cloud position={[-10, 20, -30]} />
      <Cloud position={[40, 17, -15]} />
      
      {/* Path leading back to building */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -20]} receiveShadow>
        <planeGeometry args={[5, 30]} />
        <meshStandardMaterial color="#c2b280" />
      </mesh>
    </group>
  );
};

// Simple person for assembly point
const EmergencyPerson = ({ position = [0, 0, 0], color = "#3366cc" }: { position?: [number, number, number], color?: string }) => {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.8, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.75, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#e8beac" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[0.3, 1.1, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <capsuleGeometry args={[0.08, 0.5, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.3, 1.1, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <capsuleGeometry args={[0.08, 0.5, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[0.1, 0.4, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.6, 8, 16]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      <mesh position={[-0.1, 0.4, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.6, 8, 16]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
    </group>
  );
};

// Simple tree component
const Tree = ({ position = [0, 0, 0], scale = [1, 1, 1] }: { position?: [number, number, number], scale?: [number, number, number] }) => {
  return (
    <group position={position} scale={scale}>
      {/* Tree trunk */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.4, 3, 8]} />
        <meshStandardMaterial color="#6b4226" />
      </mesh>
      
      {/* Tree foliage */}
      <mesh position={[0, 4, 0]} castShadow>
        <coneGeometry args={[2, 4, 8]} />
        <meshStandardMaterial color="#2d5f2d" />
      </mesh>
      <mesh position={[0, 5, 0]} castShadow>
        <coneGeometry args={[1.6, 3, 8]} />
        <meshStandardMaterial color="#3a7a3a" />
      </mesh>
      <mesh position={[0, 6, 0]} castShadow>
        <coneGeometry args={[1.2, 2.5, 8]} />
        <meshStandardMaterial color="#47944a" />
      </mesh>
    </group>
  );
};

// Simple cloud component
const Cloud = ({ position = [0, 10, 0] }: { position?: [number, number, number] }) => {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial color="white" opacity={0.9} transparent />
      </mesh>
      <mesh position={[1.5, 0.5, 0]} castShadow>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial color="white" opacity={0.9} transparent />
      </mesh>
      <mesh position={[-1.5, 0.3, 0]} castShadow>
        <sphereGeometry args={[1.7, 16, 16]} />
        <meshStandardMaterial color="white" opacity={0.9} transparent />
      </mesh>
      <mesh position={[0, 0.8, 1]} castShadow>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshStandardMaterial color="white" opacity={0.9} transparent />
      </mesh>
    </group>
  );
};

export default VREnvironment;
