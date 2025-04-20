function ModelScene({ url }) {
  const [modelUrl, setModelUrl] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    let objectUrl = null;

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

    const extractModelFromZip = async (zip) => {
      const files = [];
      zip.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir) {
          files.push(zipEntry);
        }
      });

      for (const file of files) {
        const ext = file.name.split(".").pop().toLowerCase();

        // If it's another ZIP, unzip it recursively
        if (ext === "zip") {
          const nestedBlob = await file.async("blob");
          const nestedZip = await JSZip.loadAsync(nestedBlob);
          const result = await extractModelFromZip(nestedZip);
          if (result) return result;
        }

        // If it's a supported model file, return it
        if (modelExtensions.includes(ext)) {
          return file;
        }
      }

      return null;
    };

    const loadFromZip = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const blob = await res.blob();
        const zip = await JSZip.loadAsync(blob);

        const modelFile = await extractModelFromZip(zip);

        if (!modelFile) {
          throw new Error("No supported model found in nested ZIP files.");
        }

        console.log("✅ Model file found:", modelFile.name);

        const modelBlob = await modelFile.async("blob");
        objectUrl = URL.createObjectURL(modelBlob);
        setModelUrl(objectUrl);
      } catch (err) {
        console.error("❌ ZIP Load Failed:", err.message);
        setHasError(true);
      }
    };

    if (url && url.endsWith(".zip")) {
      loadFromZip();
    } else if (url) {
      setModelUrl(url);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url]);

  if (hasError) {
    return (
      <Html center>
        <div className="p-4 text-white bg-red-600 rounded shadow">
          Failed to load model from ZIP. Check console for details.
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
