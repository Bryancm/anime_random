import React from "react";
import { StyleSheet, View, Text } from "react-native";
import LottieView from "lottie-react-native";
import Animated from "react-native-reanimated";

export default class Loading extends React.Component {
  componentDidMount() {
    this.animation.play();
  }
  render() {
    const { transparentBackground } = this.props;
    return (
      <View style={styles.container}>
        <Animated.View
          style={
            transparentBackground
              ? styles.animationContainer2
              : styles.animationContainer
          }
        >
          <LottieView
            source={require("../assets/flirting-dog.json")}
            autoPlay={true}
            loop={true}
            ref={(animation) => {
              this.animation = animation;
            }}
          />
        </Animated.View>
        <Text
          style={{
            position: "absolute",
            width: "50%",
            left: "14%",
            top: 0,
            color: transparentBackground ? "black" : "#8c8c8c",
            fontSize: 16,
            fontWeight: "bold",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 8,
          }}
        >
          {this.props.text ? this.props.text : "Loading"}
        </Text>
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
    position: "absolute",
    flexDirection: "row",
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
  animationContainer2: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    position: "absolute",
    right: 0,
  },
});
