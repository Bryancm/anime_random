import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import ImageLoading from "../components/ImageLoading";
import NetInfo from "@react-native-community/netinfo";
import NoConnection from "../components/NoConnection";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
    };
  }

  componentDidMount() {
    NetInfo.fetch().then((state) => {
      this.setState({ isConnected: state.isConnected });
    });
  }

  onCardPress = () => {
    const { anime } = this.props;
    if (anime.title !== "Anime not found") {
      this.props.navigation.push("CardDetail", {
        anime: this.props.anime,
        from: "Home",
      });
    }
  };
  render() {
    const { anime, loadingImage, imageLoaded } = this.props;
    const ratings = anime.ratings ? JSON.parse(anime.ratings) : null;
    const genres = anime.genres ? JSON.parse(anime.genres) : [];
    const images = anime.picture ? JSON.parse(anime.picture) : null;
    const imageUrl = Array.isArray(images)
      ? images[images.length - 1].src
      : images
      ? images.src
      : null;

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={this.onCardPress}
          style={{ width: screenWidth * 0.85, height: screenHeight * 0.7 }}
        >
          <View style={styles.card}>
            {!this.state.isConnected && <NoConnection size={90} />}
            {loadingImage == 1 && <ImageLoading />}
            <Image
              resizeMode={imageUrl ? "cover" : "center"}
              source={
                imageUrl ? { uri: imageUrl } : require("../assets/noimage.jpg")
              }
              onLoad={imageLoaded}
              style={styles.image}
            />
            <View style={styles.textView}>
              <Text
                numberOfLines={1}
                style={{
                  width: "100%",
                  fontWeight: "bold",
                  fontSize: 18,
                  // marginBottom: 20,
                }}
              >
                {anime.title}
              </Text>
              <View style={styles.genresView}>
                <View style={styles.genreTagView}>
                  <Text
                    style={{ ...styles.genreTag, color: "tomato" }}
                    numberOfLines={1}
                  >
                    {anime.type}
                  </Text>
                </View>
                <View style={styles.genreTagView}>
                  <Text
                    style={{ ...styles.genreTag, color: "tomato" }}
                    numberOfLines={1}
                  >
                    {anime.year}
                  </Text>
                </View>
                <View style={styles.genreTagView}>
                  <Text style={styles.genreTag} numberOfLines={1}>
                    {genres.length > 0 && genres[0]}
                  </Text>
                </View>
                <View style={styles.genreTagView}>
                  <Text style={styles.genreTag} numberOfLines={1}>
                    {genres.length > 1 && genres[1]}
                  </Text>
                </View>
                <View style={styles.genreTagView}>
                  <Text
                    style={{
                      ...styles.genreTag,
                      fontSize: 10,
                    }}
                    numberOfLines={1}
                  >
                    {genres.length > 2 && `+${genres.length - 2} genres`}
                  </Text>
                </View>
                {anime.title !== "Anime not found" && (
                  <View
                    style={{
                      position: "absolute",
                      flexDirection: "row",
                      right: 0,
                      height: "100%",
                      alignItems: "center",
                    }}
                  >
                    <AntDesign name="star" size={16} color="#EE9617" />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 14,
                        marginLeft: 5,
                        color: "#EE9617",
                      }}
                    >
                      {ratings ? ratings.weighted_score.substring(0, 3) : "NR"}
                    </Text>
                  </View>
                )}
              </View>
              {anime.title !== "Anime not found" && (
                <Text style={styles.text} numberOfLines={3}>
                  {anime.description
                    ? anime.description
                    : "No description, you can help by adding one on Anime News Network"}
                </Text>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default Card;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "tomato",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  gradientMask: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    zIndex: 8,
    position: "absolute",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  gradientText: {
    color: "white",
    textAlign: "center",
    alignSelf: "center",
    marginBottom: "10%",
    fontSize: 30,
    fontWeight: "bold",
    borderWidth: 5,
    width: "60%",
    borderRadius: 10,
    borderColor: "white",
    paddingTop: 8,
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  mask: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 5,
  },
  rateIcon: {
    display: "flex",
    position: "absolute",
    backgroundColor: "white",
    width: 35,
    height: 35,
    borderRadius: 17.5,
    top: 10,
    right: 10,
    zIndex: 6,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    opacity: 0.9,
    overflow: "visible",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    position: "absolute",
    top: 2,
    left: 10,
    zIndex: 6,
    width: "85%",
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  infoButton: {
    backgroundColor: "#fff",
    display: "flex",
    position: "absolute",
    width: 35,
    height: 35,
    borderRadius: 17.5,
    bottom: "18%",
    left: 10,
    zIndex: 7,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    opacity: 0.9,
    overflow: "visible",
  },
  trailerButton: {
    backgroundColor: "#fff",
    display: "flex",
    position: "absolute",
    width: 35,
    height: 35,
    borderRadius: 17.5,
    bottom: "18%",
    left: 54,
    zIndex: 7,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    opacity: 0.9,
    overflow: "visible",
    // borderWidth: 2,
    // padding: 5,
  },
  genresView: {
    backgroundColor: "transparent",
    width: "100%",
    height: 15,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
  },
  genreTagView: {
    marginRight: 12,
    backgroundColor: "transparent",
    opacity: 0.9,
    zIndex: 6,
  },
  genreTag: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#EE9617",
  },
  textView: {
    width: "100%",
    height: screenHeight > 890 ? "20%" : "23.5%",
    backgroundColor: "white",
    padding: 10,
    position: "absolute",
    bottom: 0,
    opacity: 0.9,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    // marginTop: 10,
    zIndex: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.27,
    elevation: 24,
  },
  text: {
    color: "black",
    fontSize: 12,
    textAlign: "justify",
    lineHeight: 18,
  },
});
