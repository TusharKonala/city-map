import { useFrame } from "@react-three/fiber";
import { useState, useRef, useEffect } from "react";

export function RotatingControls({
  targetRotation,
  controlsRef,
  onComplete,
}: {
  targetRotation: number;
  controlsRef: React.RefObject<any>;
  onComplete: () => void;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const startTimeRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const MIN_ANIMATION_DURATION = 20;

  // keep ref updated without breaking deps
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useFrame((state) => {
    if (!controlsRef.current || !isAnimating) return;

    const currentAzimuthal = controlsRef.current.getAzimuthalAngle?.();
    if (currentAzimuthal === undefined) return;

    const diff = targetRotation - currentAzimuthal;
    const normalizedDiff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
    const elapsed = state.clock.elapsedTime * 1000 - startTimeRef.current;

    if (Math.abs(normalizedDiff) > 0.01 && elapsed < MIN_ANIMATION_DURATION) {
      const easeFactor = 0.4;
      controlsRef.current.setAzimuthalAngle(
        currentAzimuthal + normalizedDiff * easeFactor,
      );
    } else {
      setIsAnimating(false);
      onCompleteRef.current();
    }
  });

  useEffect(() => {
    startTimeRef.current = performance.now();
    setIsAnimating(true);
  }, [targetRotation]);

  return null;
}
