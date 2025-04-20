// Imports
import React, {
  useState,
  useEffect,
  useContext,
  Suspense,
  useRef,
} from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Environment } from "@react-three/drei";
import * as THREE from "three";
import JSZip from "jszip";
import { FiX, FiMaximize, FiHeart, FiShare2 } from "react-icons/fi";
import { DarkContext } from "./Mode/DarkContext";

// Extra Loaders
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";

// Register DDS
THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

// Helpers
function centerCameraToObject(object, camera) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();

  object.position.sub(center);
  camera.position.set(0, size * 0.5, size);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
}

// Model Components
const loaders = {
  glb: GLTFLoader,
  gltf: GLTFLoader,
  fbx: FBXLoader,
  obj: OBJLoader,
  stl: STLLoader,
  "3ds": TDSLoader,
  dae: ColladaLoader,
  ply: PLYLoader,
};

const DynamicModel = React.memo(({ url }) => {
  const ext = url.split(".").pop().toLowerCase();
  const { camera } = useThree();

  if (!url || !loaders[ext]) return null;

  const Model = () => {
    const loader = loaders[ext];
    const loaded = useLoader(loader, url);

    if (ext === "gltf" || ext === "glb") {
      useEffect(() => {
        centerCameraToObject(loaded.scene, camera);
      }, [loaded, camera]);
      return <primitive object={loaded.scene} />;
    }

    if (ext === "dae") {
      useEffect(() => {
        centerCameraToObject(loaded.scene, camera);
      }, [loaded, camera]);
      return <primitive object={loaded.scene} />;
    }

    if (ext === "stl") {
      const ref = useRef();
      useEffect(() => {
        if (ref.current) {
          loaded.computeBoundingBox();
          const center = loaded.boundingBox.getCenter(new THREE.Vector3());
          ref.current.position.sub(center);
          centerCameraToObject(ref.current, camera);
        }
      }, [loaded, camera]);
      return (
        <mesh ref={ref}>
          <bufferGeometry attach="geometry" {...loaded} />
          <meshStandardMaterial color="#999" />
        </mesh>
      );
    }

    useEffect(() => {
      centerCameraToObject(loaded, camera);
    }, [loaded, camera]);
    return <primitive object={loaded} />;
  };

  return <Model />;
});

// ZIP Loader
function ModelScene({ url }) {
  const [modelUrl, setModelUrl] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    let objectUrl = null;

    const loadFromZip = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const blob = await res.blob();
        const zip = await JSZip.loadAsync(blob);

        // Get all files in the archive
        const files = [];
        zip.forEach((relativePath, zipEntry) => {
          // Only push files, not directories
          if (!zipEntry.dir) {
            files.push(zipEntry);
          }
        });

        // Find the first model file that matches any of our supported extensions
        const modelExtensions = [
          "glb",
          "gltf",
          "fbx",
          "obj",
          "stl",
          "3ds",
          "dae",
          "ply",
        ];
        const modelFile = files.find((file) => {
          const extension = file.name.split(".").pop().toLowerCase();
          return modelExtensions.includes(extension);
        });

        if (!modelFile) {
          throw new Error(
            "No supported model found in ZIP file. Supported formats: " +
              modelExtensions.join(", ")
          );
        }

        console.log("Found model file:", modelFile.name);

        // Extract the model file content
        const modelBlob = await modelFile.async("blob");
        objectUrl = URL.createObjectURL(modelBlob);
        setModelUrl(objectUrl);
      } catch (err) {
        console.error("ZIP Load Failed:", err.message);
        setHasError(true);
      }
    };

    if (url && url.endsWith(".zip")) {
      loadFromZip();
    } else if (url) {
      setModelUrl(url);
    }

    return () => {
      // Clean up object URL when component unmounts or url changes
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url]);

  if (hasError) {
    return (
      <Html center>
        <div className="p-4 text-white bg-red-600 rounded shadow">
          Failed to load model from ZIP file. Check console for details.
        </div>
      </Html>
    );
  }

  return (
    <ErrorBoundary
      onError={() => setHasError(true)}
      fallback={
        <Html center>
          <div className="p-4 text-white bg-red-600 rounded shadow">
            Error rendering 3D model
          </div>
        </Html>
      }
    >
      <Suspense fallback={<LoadingFallback />}>
        {modelUrl && <DynamicModel url={modelUrl} />}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />
      </Suspense>
    </ErrorBoundary>
  );
}

// Error + Loader
function LoadingFallback() {
  return (
    <Html center>
      <div className="p-4 text-white bg-blue-600 rounded shadow animate-pulse">
        Loading 3D model...
      </div>
    </Html>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err, info) {
    console.error("3D Error:", err, info);
    if (this.props.onError) this.props.onError(err);
  }
  render() {
    return this.state.hasError
      ? this.props.fallback || null
      : this.props.children;
  }
}

// Main Modal
const ArtDetailModal3D = ({ artwork, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { darkMode } = useContext(DarkContext);
  const [modelUrl, setModelUrl] = useState("");

  useEffect(() => {
    if (artwork?.modelFile) {
      setModelUrl(`http://localhost:5000/${artwork.modelFile}`);
    }

    return () => {
      // Clean up previous model URL if needed
      if (modelUrl && modelUrl.startsWith("blob:")) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [artwork]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const bgClass = darkMode ? "bg-gray-800 text-white" : "bg-white text-black";
  const viewerBgClass = darkMode ? "bg-gray-900" : "bg-gray-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center mt-20 bg-black/80 backdrop-blur-sm">
      <div
        className={`relative flex flex-col md:flex-row w-11/12 h-5/6 shadow-xl rounded-lg overflow-hidden ${bgClass}`}
      >
        <button
          onClick={onClose}
          className="absolute z-10 p-2 rounded-full top-4 right-4 hover:bg-gray-200/20"
          aria-label="Close"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* 3D Viewer */}
        <div className={`relative flex-1 ${viewerBgClass}`}>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="absolute z-10 flex items-center gap-1 px-3 py-2 text-gray-800 rounded shadow bottom-4 right-4 bg-white/90 hover:bg-white"
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            <FiMaximize className="w-4 h-4" />
            <span className="text-sm">
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </span>
          </button>

          <Canvas
            shadows
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ background: darkMode ? "#1a1a1a" : "#f5f5f5" }}
            gl={{ antialias: true }}
          >
            <ModelScene url={modelUrl} />
            <OrbitControls enableDamping dampingFactor={0.05} />
          </Canvas>
        </div>

        {/* Info */}
        <div className="w-full p-6 overflow-y-auto md:w-96">
          <h2 className="mb-1 text-2xl font-bold">
            {artwork?.title || "Untitled Artwork"}
          </h2>
          <p
            className={`mb-4 text-sm ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            By {artwork?.artist || "Unknown Artist"}
          </p>

          {artwork?.description && (
            <div className="mb-6">
              <h3 className="mb-2 font-semibold">About this piece</h3>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                {artwork.description}
              </p>
            </div>
          )}

          <div className="flex gap-4 mb-6">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
              aria-label="Like"
            >
              <FiHeart className="w-5 h-5" />
              <span>Like</span>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
              aria-label="Share"
            >
              <FiShare2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>

          {artwork?.price && (
            <div className="pt-4 border-t border-gray-300">
              <div className="mb-2 text-xl font-bold">₹{artwork.price}</div>
              <button className="w-full py-3 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
                Purchase
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtDetailModal3D;
