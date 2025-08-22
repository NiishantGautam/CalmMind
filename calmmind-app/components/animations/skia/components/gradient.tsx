import { StyleSheet, View, Dimensions } from "react-native";
import {
  Canvas,
  Rect,
  RadialGradient,
  vec,
  Blur,
} from "@shopify/react-native-skia";
import { theme } from "@/theme";
import {
  useSharedValue,
  useDerivedValue,
  withSpring,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import { useEffect } from "react";

const { width, height } = Dimensions.get("screen");

const VISUAL_CONFIG = {
  blur: 10,
  center: {
    x: width / 2,
    y: width / 2,
  },
} as const;

// Animation Constants
const ANIMATION_CONFIG = {
  spring: {
    damping: 10,
    stiffness: 50,
  },
  durations: {
    MOUNT: 2000,
    SPEAKING_TRANSITION: 600,
    QUICK_TRANSITION: 400,
    PULSE: 1000,
  },
} as const;

// Radius Scaling Constants
const RADIUS_CONFIG = {
  minScale: 0.5,
  maxScale: 1.5,
  speakingScale: 1.2,
  quietScale: 0.6,
  baseRadius: {
    default: width,
    speaking: width / 4,
  },
};

type GradientPosition = "top" | "bottom" | "left" | "right" | "center";

interface GradientProps {
  position: GradientPosition;
  isSpeaking: boolean; // When the agent is speaking, we will animate it.
}

const getTargetY = (position: GradientPosition): number => {
  switch (position) {
    case "top":
      return 0; // This is beacuse we want to start from the top of the screen.
    case "bottom":
      return height; // This is beacuse we want to start from the bottom of the screen.
    case "left":
      return 0; // This is beacuse we want to start from the left of the screen.
    case "right":
      return width; // This is beacuse we want to start from the right of the screen.
    case "center":
      return VISUAL_CONFIG.center.y / 2; // This is beacuse we want to start from the center of the screen.
    default:
      return VISUAL_CONFIG.center.y;
  }
};

// Helper functions to calculate the radius

const calculateRadiusBounds = (baseRadius: number) => {
  "worklet";
  return {
    min: baseRadius * RADIUS_CONFIG.minScale,
    max: baseRadius * RADIUS_CONFIG.maxScale,
  };
};

const calculateTargetRadius = (baseRadius: number, isSpeaking: boolean) => {
  "worklet";
  const { min, max } = calculateRadiusBounds(baseRadius);
  // We only want to tranisiton from min to max, when the agent is speaking.
  const scale = isSpeaking
    ? RADIUS_CONFIG.speakingScale
    : RADIUS_CONFIG.quietScale;

  return min + (max - min) * scale;
};

export default function Gradient({ position, isSpeaking }: GradientProps) {
  const animatedY = useSharedValue(0);
  const radiusScale = useSharedValue(1);
  const baseRadiusValue = useSharedValue(RADIUS_CONFIG.baseRadius.default);
  const mountRadius = useSharedValue(0); // When mounted start at 0,

  const center = useDerivedValue(() => {
    return vec(VISUAL_CONFIG.center.x, animatedY.value);
  });

  const animatedRadius = useDerivedValue(() => {
    const { min, max } = calculateRadiusBounds(baseRadiusValue.value);
    const calculatedRadius = min + (max - min) * radiusScale.value;
    return mountRadius.value < calculatedRadius
      ? mountRadius.value
      : calculatedRadius;
  });

  useEffect(() => {
    const targetY = getTargetY(position);

    animatedY.value = withSpring(targetY, ANIMATION_CONFIG.spring);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  useEffect(() => {
    animatedY.value = getTargetY(position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  useEffect(() => {
    const targetRadius = calculateTargetRadius(
      RADIUS_CONFIG.baseRadius.default,
      isSpeaking,
    );
    mountRadius.value = withTiming(targetRadius, {
      duration: ANIMATION_CONFIG.durations.MOUNT,
    });
  }, [isSpeaking, mountRadius]);

  // When the agent is Speaking, we want to change the radius Scale.

  useEffect(() => {
    const duration = ANIMATION_CONFIG.durations.SPEAKING_TRANSITION;
    if (isSpeaking) {
      baseRadiusValue.value = withTiming(RADIUS_CONFIG.baseRadius.speaking, {
        duration,
      });
      animatedY.value = withTiming(getTargetY("center"), { duration });
    } else {
      baseRadiusValue.value = withTiming(RADIUS_CONFIG.baseRadius.default, {
        duration,
      });
      animatedY.value = withTiming(getTargetY(position), { duration });
    }
  }, [isSpeaking, position, animatedY, baseRadiusValue]);

  // Repeat the pulse animation, with a delay of 1 second.
  useEffect(() => {
    if (isSpeaking) {
      radiusScale.value = withRepeat(
        withTiming(RADIUS_CONFIG.speakingScale, {
          duration: ANIMATION_CONFIG.durations.PULSE,
        }),
        -1,
        true,
      ); 
    } else {
      radiusScale.value = withTiming(RADIUS_CONFIG.quietScale, {
        duration: ANIMATION_CONFIG.durations.QUICK_TRANSITION,
      });
    }
  }, [isSpeaking, radiusScale]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={center}
            r={animatedRadius}
            colors={[
              theme.colorMediumBlue,
              theme.colorLightBlue,
              theme.colorTeal,
              theme.colorIceBlue,
              theme.colorWhite,
            ]}
          />
          <Blur blur={VISUAL_CONFIG.blur} mode={"clamp"} />
        </Rect>
      </Canvas>
    </View>
  );
}
