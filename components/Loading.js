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
            source={require("../assets/happy-dog.json")}
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
            bottom: "1%",
            color: transparentBackground ? "white" : "#8c8c8c",
            fontSize: 11,
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
  animationContainer2: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    position: "absolute",
  },
});
