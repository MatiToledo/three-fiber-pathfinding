import { CylinderGeometry } from "three";

export default function Agent() {
  return (
    <mesh position={[0, 0.5, 0]}>
      <cylinderGeometry args={[0.25, 0.25, 1]}></cylinderGeometry>
      <meshPhongMaterial color="green"></meshPhongMaterial>
    </mesh>
  );
}
