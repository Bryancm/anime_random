import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import Animated from "react-native-reanimated";

export default class Loading extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={styles.animationContainer}>
          <LottieView
            style={{ width: "100%", height: "100%" }}
            source={require("../assets/2705-image-loading.json")}
            autoPlay={true}
            loop={true}
            ref={(animation) => {
              this.animation = animation;
            }}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    position: "absolute",
    zIndex: 5,
  },
  animationContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    position: "absolute",
  },
});
