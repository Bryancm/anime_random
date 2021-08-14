import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export default class NoConnection extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.animationContainer}>
          <Feather name="wifi-off" size={this.props.size} color="#EE9617" />
        </View>
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
    // backgroundColor: "transparent",
    position: "absolute",
    zIndex: 6,
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
