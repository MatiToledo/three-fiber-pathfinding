import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import Agent from "./components/Agent";
import { Level } from "./components/Level";

function App() {
  return (
    <Canvas>
      <directionalLight
        position={[-50, 50, 50]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <ambientLight></ambientLight>
      <OrbitControls minDistance={20}></OrbitControls>
      <Sky></Sky>
      <Level></Level>
    </Canvas>
  );
}

export default App;
