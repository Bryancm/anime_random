import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Linking,
  Platform,
} from "react-native";
import AboutAnimation from "../components/AboutAnimation";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AddBanner from "../components/AdBanner";
const screenHeight = Dimensions.get("window").height;
export default class About extends React.Component {
  render() {
    const { navigation } = this.props;
    if (navigation.isFocused() && !this.props.isDrawerOpen) {
      StatusBar.setBarStyle("dark-content", true);
    }
    return (
      <View style={styles.container}>
        <View
          style={{
            width: "90%",
            height: 40,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.openDrawer();
            }}
          >
            <View style={styles.ListButton}>
              <Ionicons name="md-list" size={30} color="#000" />
            </View>
          </TouchableOpacity>

          <Text style={{ ...styles.title, height: 40 }}>About</Text>
        </View>
        <View
          style={{
            width: "90%",
            height: 200,
            marginTop: "20%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.subTitle}>Anime Source</Text>
          <Text style={styles.text}>Anime News Network</Text>
          <Text style={styles.subTitle}>Dog Animations</Text>
          <Text style={styles.text}>Margarita Ivanchikova</Text>
          <Text style={styles.subTitle}>Checkmark Animation</Text>
          <Text style={styles.text}>Eduardo Ribeiro</Text>
          <Text style={styles.subTitle}>Image Loading Animation</Text>
          <Text style={styles.text}>Sin Xiang Yi</Text>
          <Text style={styles.subTitle}>Developed by</Text>
          <Text style={styles.text}>Bryan Mtz</Text>
        </View>
        <View
          style={{
            width: "90%",
            height: 180,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AboutAnimation />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() =>
            Linking.openURL(
              Platform.OS === "ios"
                ? "https://apps.apple.com/us/app/anime-random/id1522807424"
                : "https://play.google.com/store/apps/details?id=com.bryanmtz.randomanime"
            )
          }
        >
          <LinearGradient
            style={{ ...styles.mask, borderRadius: 16 }}
            colors={["#EE9617", "#FE5858"]}
            start={[0.5, 1]}
            end={[1, 0]}
          ></LinearGradient>
          <Text style={styles.buttonText}>Rate Us</Text>
        </TouchableOpacity>
        <View
          style={{
            width: "100%",
            position: "absolute",
            bottom: screenHeight > 890 ? 30 : 10,
            zIndex: 20,
          }}
        >
          <AddBanner bottom={0} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#f5f5f5",
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 0,
  },
  text: {
    color: "#595959",
    fontSize: 14,
    textAlign: "justify",
    lineHeight: 22,
    marginBottom: 10,
  },
  ListButton: {
    backgroundColor: "#fff",
    display: "flex",
    width: 30,
    height: 30,
    borderRadius: 5,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  mask: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 1,
  },
  addButton: {
    width: "86%",
    height: 56,
    // backgroundColor: "tomato",
    marginHorizontal: "7%",
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  buttonText: {
    zIndex: 2,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
