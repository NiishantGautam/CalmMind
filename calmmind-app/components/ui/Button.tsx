import { Pressable, PressableProps, Text, StyleSheet } from "react-native";
import { theme } from "@/theme.ts";
import React from "react";

export default function Button({ children, ...props }: PressableProps) {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <Pressable
      style={[styles.button, isPressed && styles.buttonPressed]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() =>setIsPressed(false)}
      {...props}
    >
      {typeof children === "string" ? (
        <Text style={styles.text}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colorPrimary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 20,
  },
  text: {
    color: theme.colorWhite,
  },
  buttonPressed: {
    backgroundColor: theme.colorBlue,
    opacity: 0.8,
  }

});
