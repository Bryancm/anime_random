import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

const screenHeight = Dimensions.get("window").height;

export default class ItemList extends React.PureComponent {
  render() {
    const { onCardPress, y, index, item } = this.props;
    const ratings = item.ratings ? JSON.parse(item.ratings) : null;
    const genres = JSON.parse(item.genres);
    const images = JSON.parse(item.picture);
    const imageUrl = Array.isArray(images)
      ? images[images.length - 1].src
      : images
      ? images.src
      : null;
    const position = Animated.subtract(index * 240, y);
    const isDisappearing = -240;
    const isTop = 0;
    const isBottom = screenHeight - 60 - 240;
    const isAppearing = screenHeight - 60;

    const scale = position.interpolate({
      inputRange: [isDisappearing, isTop, isBottom, isAppearing],
      outputRange: [0.5, 1, 1, 0.5],
      extrapolate: "clamp",
    });

    const opacity = position.interpolate({
      inputRange: [isDisappearing, isTop, isBottom, isAppearing],
      outputRange: [0.5, 1, 1, 0.5],
    });

    const translateY = Animated.add(
      Animated.add(
        y,
        y.interpolate({
          inputRange: [0, 1 + index * 240],
          outputRange: [1, -index * 240],
          extrapolateRight: "clamp",
        })
      ),
      position.interpolate({
        inputRange: [isBottom, isAppearing],
        outputRange: [0, -240 / 4],
        extrapolate: "clamp",
      })
    );

    return (
      <Animated.View
        key={item.id}
        style={[
          styles.item,
          { opacity, transform: [{ translateY }, { scale }] },
        ]}
      >
        <TouchableOpacity
          onPress={onCardPress}
          activeOpacity={0.8}
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 16,
            paddingHorizontal: 20,
            flexDirection: "row",
          }}
        >
          <View style={styles.imageContainer}>
            <Image
              resizeMode={imageUrl ? "cover" : "stretch"}
              source={
                imageUrl ? { uri: imageUrl } : require("../assets/noimage.jpg")
              }
              style={styles.image}
            />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <View style={styles.genresContainer}>
              <Text style={{ ...styles.tagText, color: "#FE5858" }}>
                {item.type}
              </Text>
              <Text style={{ ...styles.tagText, color: "#FE5858" }}>
                {item.year}
              </Text>
              <Text style={styles.tagText}>{genres[0]}</Text>
              <Text style={styles.tagText}>{genres[1]}</Text>
              <View style={styles.ratingContainer}>
                <AntDesign name="star" size={12} color="#EE9617" />
                <Text
                  style={{
                    color: "#EE9617",
                    marginLeft: 5,
                    fontSize: 10,
                  }}
                >
                  {ratings ? ratings.weighted_score.substring(0, 3) : "NR"}
                </Text>
              </View>
            </View>
            <Text style={styles.itemText} numberOfLines={5}>
              {item.description
                ? item.description
                : "No description, you can help by adding one on Anime News Network"}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  coverImageContainer: {
    width: "100%",
    height: 200,
  },
  gradientMask: {
    width: "100%",
    height: "100%",
    opacity: 1,
    zIndex: 8,
    position: "absolute",
  },
  headerText: {
    color: "#f5f5f5",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
    zIndex: 10,
    textAlign: "center",
    marginTop: 30,
  },
  item: {
    width: "100%",
    height: 220,
    marginBottom: 20,
  },
  imageContainer: {
    width: 110,
    height: 180,
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
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  listContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 12,
  },
  itemContent: {
    width: "60%",
    height: 180,
    // backgroundColor: "tomato",
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
    letterSpacing: 0.5,
  },
  genresContainer: {
    width: "100%",
    height: 20,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  tagText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#EE9617",
    marginRight: 5,
  },
  ratingContainer: {
    width: "20%",
    height: "100%",
    flexDirection: "row",
    position: "absolute",
    right: 0,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  itemText: {
    width: "100%",
    color: "#595959",
    fontSize: 12,
    textAlign: "justify",
    lineHeight: 18,
  },
});
