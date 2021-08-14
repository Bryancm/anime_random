import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { AdMobBanner } from "expo-ads-admob";

class AdBanner extends React.Component {
  constructor(props) {
    super(props);
    this.bannerId = Platform.OS === "ios" ? "IOS-BANNER-ID" : "ANDROID-BANNER-ID";
  }

  render() {
    return (
      <View style={{ ...styles.container, bottom: this.props.bottom }}>
        <AdMobBanner bannerSize="banner" adUnitID={this.bannerId} servePersonalizedAds={false} />
      </View>
    );
  }
}

export default AdBanner;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
