import { useGLTF } from "@react-three/drei";
import Agent from "./Agent";
import { useRef } from "react";
import { Mesh, Vector2 } from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Pathfinding, PathfindingHelper } from "three-pathfinding";

export function Level() {
  const { scene, camera, raycaster, clock } = useThree();
  const { nodes, materials }: any = useGLTF("/models/demo-level.glb");
  const agentRef = useRef<Mesh>(null);
  const clickMouse = new Vector2();

  const ZONE = "level1";
  const SPEED = 5;
  let navmesh;
  let groupID;
  let navpath;

  const pathfinding = new Pathfinding();
  const pathfindinghelper = new PathfindingHelper();
  scene.add(pathfindinghelper);

  const gltf: GLTF = useLoader(GLTFLoader, "/models/demo-level-navmesh.glb");
  gltf.scene.traverse((node: any) => {
    if (!navmesh && node.isMesh) {
      pathfinding.setZoneData(ZONE, Pathfinding.createZone(node.geometry));
    }
  });

  function intersect(pos: Vector2) {
    raycaster.setFromCamera(pos, camera);
    return raycaster.intersectObjects(scene.children);
  }

  const handleMouseClick = (event) => {
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const found = intersect(clickMouse);
    if (found.length > 0) {
      const target = found[0].point;
      const agentpos = agentRef.current.position;

      groupID = pathfinding.getGroup(ZONE, agentpos);
      const closest = pathfinding.getClosestNode(agentpos, ZONE, groupID);
      navpath = pathfinding.findPath(closest.centroid, target, ZONE, groupID);
      if (navpath) {
        // VIEWS
        pathfindinghelper.reset();
        pathfindinghelper.setPlayerPosition(agentpos);
        pathfindinghelper.setTargetPosition(target);
        pathfindinghelper.setPath(navpath);
      }
    }
  };

  function move(delta) {
    if (!navpath || navpath.length <= 0) return;

    let targetPosition = navpath[0];
    const distance = targetPosition.clone().sub(agentRef.current.position);

    if (distance.lengthSq() > 0.05 * 0.05) {
      distance.normalize();
      // Move player to target
      agentRef.current.position.add(distance.multiplyScalar(delta * SPEED));
    } else {
      // Remove node from the path we calculated
      navpath.shift();
    }
  }

  useFrame((state, delta) => {
    move(delta);
  });

  return (
    <group dispose={null}>
      <mesh
        onClick={handleMouseClick}
        geometry={nodes.Cube.geometry}
        material={materials.Material}
        scale={[10, 1, 10]}
      />
      <mesh ref={agentRef}>
        <Agent></Agent>
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/demo-level.glb");
