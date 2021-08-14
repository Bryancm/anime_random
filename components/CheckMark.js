import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import Animated from "react-native-reanimated";

export default class Loading extends React.Component {
  componentDidMount() {
    this.animation.play();
  }
  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={styles.animationContainer}>
          <LottieView
            style={{ width: 400, height: 400 }}
            source={require("../assets/4149-check.json")}
            autoPlay={false}
            loop={false}
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
    width: "50%",
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    position: "absolute",
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
