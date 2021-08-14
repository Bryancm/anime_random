import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  Dimensions,
  BackHandler,
  Linking,
} from "react-native";
import moment from "moment";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import AddBanner from "../components/AdBanner";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";
import NoConnection from "../components/NoConnection";
import {
  getRelatedAnime,
  addMyListAnime,
  removeMyListAnime,
  initDb,
} from "../db/AnimeDB";

const screenWidth = Dimensions.get("window").width;

function Item({ title = "", image = "", goToDetail, anime }) {
  return (
    <View style={styles.relatedItem}>
      <TouchableOpacity
        style={{ width: "100%", height: "100%" }}
        onPress={() => {
          goToDetail(anime);
        }}
        activeOpacity={0.8}
      >
        <Image
          resizeMode={image ? "cover" : "center"}
          source={image ? { uri: image } : require("../assets/noimage.jpg")}
          style={styles.relatedImage}
        />
        <View style={styles.relatedMask}>
          <Text style={styles.relatedTitle} numberOfLines={2}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default class MyListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.db = null;
    this.state = {
      headerOpacity: 0,
      relatedAnime: [],
      anime: this.props.route.params.anime,
      initialAdd: this.props.route.params.anime.added,
      doUpdate: false,
      isConnected: true,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  async componentDidMount() {
    this.db = await initDb();
    const { anime } = this.state;
    const related = JSON.parse(anime.related);
    if (related.length > 0) {
      const result = getRelatedAnime(related, this.db);
      result
        .then((relatedAnime) => {
          this.setState({ relatedAnime });
        })
        .catch((error) => {
          console.log("ERROR RELATED", error);
        });
    }
    NetInfo.fetch().then((state) => {
      this.setState({ isConnected: state.isConnected });
    });
    StatusBar.setBarStyle("light-content", true);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    this.setState = (state, callback) => {
      return;
    };
  }
  handleBackButtonClick() {
    const { from } = this.props.route.params;
    if (from == "MyList") {
      this.props.navigation.navigate({
        name: "MyList",
        params: { doUpdate: this.state.doUpdate },
      });
    } else {
      this.props.navigation.goBack(null);
    }
    // this.props.navigation.goBack(null);
    return true;
  }

  onScroll = ({ nativeEvent }) => {
    if (nativeEvent.contentOffset.y > 120) {
      this.setState({ headerOpacity: 1 });
    } else {
      this.setState({ headerOpacity: 0 });
    }
  };
  goToDetail = (anime) => {
    this.props.navigation.push("CardDetail", {
      anime,
      from: "Detail",
    });
  };
  onAddAnime = async () => {
    const { anime, initialAdd } = this.state;
    if (anime.added) {
      await removeMyListAnime(anime.id, this.db);
      anime.added = false;
    } else {
      await addMyListAnime(anime.id, this.db);
      anime.added = true;
    }
    if (initialAdd !== anime.added) {
      this.setState({ doUpdate: true });
    } else {
      this.setState({ doUpdate: false });
    }
    this.setState({ anime });
  };

  render() {
    const { relatedAnime, anime, doUpdate } = this.state;
    // const relatedAnimeFiltered = this.filterRelated(relatedAnime);
    const related = anime ? JSON.parse(anime.related) : null;
    const themes = anime ? JSON.parse(anime.themes) : [];
    const ratings = anime && anime.ratings ? JSON.parse(anime.ratings) : null;
    const genres = anime ? JSON.parse(anime.genres) : [];
    const images = anime && anime.picture ? JSON.parse(anime.picture) : null;
    const imageUrl = Array.isArray(images)
      ? images[images.length - 1].src
      : images
      ? images.src
      : null;

    var containerHeight = 780;
    var openings = [],
      endings = [],
      populars = [];
    if (themes.length > 0) {
      openings = themes.filter((theme) => theme.type == "opening");
      endings = themes.filter((theme) => theme.type == "ending");
      populars = themes.filter((theme) => theme.type == "popular");

      if (openings.length > 0) {
        containerHeight = containerHeight + 50;
      }
      if (endings.length > 0) {
        containerHeight = containerHeight + 50;
      }
      if (populars.length > 0) {
        containerHeight = containerHeight + 50;
      }

      for (const theme of themes) {
        containerHeight = containerHeight + 50;
        // if (themes.length > 10 && themes.length < 20) {
        //   containerHeight = containerHeight + 30;
        // } else if (themes.length >= 20) {
        //   containerHeight = containerHeight + 30;
        // } else {
        //   containerHeight = containerHeight + 130;
        // }
      }
    }
    if (anime.description && anime.description.length > 400) {
      containerHeight = containerHeight + 130;
    }
    if (related.length > 0) {
      containerHeight = containerHeight + 260;
      if (themes.length <= 4) {
        containerHeight = containerHeight + 80;
      }
    }

    return (
      <View style={styles.container}>
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: 35,
            zIndex: 12,
            top: 0,
            opacity: this.state.headerOpacity,
          }}
        >
          <LinearGradient
            style={styles.mask}
            colors={["#EE9617", "#FE5858"]}
            start={[0.3, 1]}
            end={[1, 0]}
          ></LinearGradient>
        </View>

        <ScrollView
          onScroll={this.onScroll}
          scrollEventThrottle={2}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              width: screenWidth,
              height: containerHeight,
              // backgroundColor: "green",
            }}
          >
            <View style={styles.imageContainer}>
              {!this.state.isConnected && <NoConnection size={30} />}
              <Image
                resizeMode={imageUrl ? "cover" : "stretch"}
                source={
                  imageUrl
                    ? { uri: imageUrl }
                    : require("../assets/noimage.jpg")
                }
                style={styles.image}
              />
            </View>

            <View style={styles.coverImageContainer}>
              <View
                style={{
                  position: "absolute",
                  top: 35,
                  left: "7%",
                  zIndex: 10,
                  width: 40,
                  height: 40,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    const { from } = this.props.route.params;
                    if (from == "MyList") {
                      this.props.navigation.navigate({
                        name: "MyList",
                        params: { doUpdate },
                      });
                    } else {
                      this.props.navigation.goBack();
                    }

                    StatusBar.setBarStyle("light-content", true);
                  }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Ionicons name="arrow-back" size={36} color="#F5F5F5" />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  position: "absolute",
                  right: "7%",
                  top: 35,
                  zIndex: 10,
                  width: 60,
                  height: 40,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <AntDesign name="star" size={18} color="#f5f5f5" />
                <Text
                  style={{
                    color: "#f5f5f5",
                    marginLeft: 5,
                    fontSize: 14,
                  }}
                >
                  {ratings ? ratings.weighted_score.substring(0, 3) : "NR"}
                </Text>
              </View>
              <LinearGradient
                style={styles.gradientMask}
                colors={["#EE9617", "#FE5858"]}
                start={[0.5, 1]}
                end={[1, 0]}
              ></LinearGradient>
              {!this.state.isConnected && <NoConnection size={30} />}
              {imageUrl && (
                <Image source={{ uri: imageUrl }} style={styles.coverImage} />
              )}
            </View>
            <View style={styles.contentView}>
              <View style={styles.contentHeader}>
                <Text style={styles.title} numberOfLines={2}>
                  {anime && anime.title}
                </Text>
                {anime && anime.studio && (
                  <Text style={styles.headerText}>{anime.studio}</Text>
                )}
                {anime && anime.date && anime.date !== "Invalid date" && (
                  <Text style={styles.headerText}>
                    {moment(anime.date).format("MMMM Do YYYY")}
                  </Text>
                )}
                {anime && anime.type && (
                  <Text style={styles.headerText}>{anime.type}</Text>
                )}
              </View>

              {genres.length > 0 && (
                <View
                  style={{
                    ...styles.tagContainer,
                    marginBottom: 0,
                    marginTop: 30,
                  }}
                >
                  {genres.map((genre, index) => {
                    return (
                      index <= 3 && (
                        <Text
                          key={index}
                          style={styles.tagText}
                          numberOfLines={1}
                        >
                          {genre}
                        </Text>
                      )
                    );
                  })}
                </View>
              )}

              {genres.length > 4 && (
                <View
                  style={{
                    ...styles.tagContainer,
                    marginTop: 18,
                  }}
                >
                  {genres.map((genre, index) => {
                    return (
                      index >= 4 &&
                      index <= 7 && (
                        <Text
                          key={index}
                          style={styles.tagText}
                          numberOfLines={1}
                        >
                          {genre}
                        </Text>
                      )
                    );
                  })}
                </View>
              )}

              <View
                style={{
                  ...styles.descriptionContainer,
                  marginTop: 20,
                }}
              >
                <Text style={styles.subTitle}>What is it about ?</Text>
                <Text style={styles.text}>
                  {anime && anime.description
                    ? anime.description
                    : "No description, you can help by adding one on Anime News Network"}
                </Text>
              </View>
              {/* <View style={styles.addButton}> */}

              <TouchableOpacity
                style={styles.addButton}
                activeOpacity={0.8}
                onPress={this.onAddAnime}
              >
                <LinearGradient
                  style={{ ...styles.mask, borderRadius: 16 }}
                  colors={["#EE9617", "#FE5858"]}
                  start={[0.5, 1]}
                  end={[1, 0]}
                ></LinearGradient>
                <Text style={styles.buttonText}>
                  {anime && anime.added
                    ? "Remove from my list"
                    : "Add to my list"}
                </Text>
              </TouchableOpacity>
              {/* </View> */}
              {openings.length > 0 && (
                <View style={styles.songsContainer}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.subTitle}>Opening</Text>
                    <Ionicons
                      name="ios-musical-notes"
                      size={14}
                      color="#000"
                      style={{ marginLeft: 5, marginBottom: 4 }}
                    />
                  </View>
                  {openings.map((op, index) => (
                    <Text key={index} style={styles.text}>
                      {op.name}
                    </Text>
                  ))}
                </View>
              )}
              {}
              {endings.length > 0 && (
                <View style={styles.songsContainer}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ ...styles.subTitle, marginTop: 12 }}>
                      Ending
                    </Text>
                    <Ionicons
                      name="ios-musical-notes"
                      size={14}
                      color="#000"
                      style={{
                        marginLeft: 5,
                        marginTop: 10,
                      }}
                    />
                  </View>
                  {endings.map((ed, index) => (
                    <Text key={index} style={styles.text}>
                      {ed.name}
                    </Text>
                  ))}
                </View>
              )}
              {populars.length > 0 && (
                <View style={styles.songsContainer}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ ...styles.subTitle, marginTop: 12 }}>
                      Popular themes
                    </Text>
                    <Ionicons
                      name="ios-musical-notes"
                      size={14}
                      color="#000"
                      style={{ marginLeft: 5, marginTop: 10 }}
                    />
                  </View>
                  {populars.map((p, index) => (
                    <Text key={index} style={styles.text}>
                      {p.name}
                    </Text>
                  ))}
                </View>
              )}
              <Text
                style={{
                  ...styles.text,
                  textAlign: "left",
                  marginTop: 15,
                  marginLeft: "7%",
                  fontSize: 11,
                  fontStyle: "italic",
                  textDecorationLine: "underline",
                }}
                onPress={() =>
                  Linking.openURL(
                    `https://www.animenewsnetwork.com/encyclopedia/anime.php?id=${anime.id}`
                  )
                }
              >
                You can view full details at Anime News Network
              </Text>

              <View style={{ width: "100%", height: 50, marginTop: 20 }}>
                <AddBanner bottom={0} />
              </View>
              {relatedAnime.length > 0 && (
                <View style={styles.relatedContainer}>
                  <Text
                    style={{
                      ...styles.title,
                      marginLeft: "7%",
                    }}
                  >
                    Related
                  </Text>
                  <FlatList
                    horizontal
                    data={relatedAnime}
                    renderItem={({ item }) => (
                      <Item
                        image={item.image}
                        title={item.title}
                        goToDetail={this.goToDetail}
                        anime={item}
                      />
                    )}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      padding: "4%",
                    }}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: 130,
    height: 200,
    position: "absolute",
    zIndex: 10,
    // backgroundColor: "tomato",
    borderRadius: 16,
    left: "7%",
    top: 150,
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
    // resizeMode: "stretch",
    borderRadius: 16,
  },
  coverImageContainer: {
    width: "100%",
    height: 300,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    backgroundColor: "#F5F5F5",
    width: "100%",
    height: 1000,
    position: "absolute",
    top: "50%",
    borderRadius: 16,
  },
  gradientMask: {
    width: "100%",
    height: "100%",
    opacity: 0.95,
    zIndex: 8,
    position: "absolute",
  },
  mask: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 1,
  },
  contentView: {
    width: "100%",
    height: "100%",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    backgroundColor: "white",
    position: "absolute",
    zIndex: 9,
    top: 220,
    backgroundColor: "#f5f5f5",
    // justifyContent: "flex-start",
  },
  contentHeader: {
    width: "53%",
    height: 140,
    alignSelf: "flex-end",
    marginRight: "3.5%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  headerText: {
    fontSize: 12,
    color: "#8c8c8c",
    // fontWeight: "bold",
    marginTop: 5,
  },
  tagContainer: {
    width: "86%",
    height: 25,
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "7%",
    // marginVertical: "10%",
    justifyContent: "space-evenly",
    // backgroundColor: "tomato",
  },
  tagText: {
    fontSize: 11,
    color: "#EE9617",
    fontWeight: "bold",
    // width: 70,
    height: 25,
    borderWidth: 1,
    borderColor: "#EE9617",
    textAlign: "center",
    borderRadius: 12,
    paddingTop: 3.5,
    paddingHorizontal: 10,
  },
  descriptionContainer: {
    width: "86%",
    // height: "40%",
    marginHorizontal: "7%",
  },
  text: {
    color: "#595959",
    fontSize: 12,
    textAlign: "justify",
    lineHeight: 22,
  },
  addButton: {
    width: "86%",
    height: 56,
    // backgroundColor: "tomato",
    marginHorizontal: "7%",
    marginTop: 24,
    marginBottom: 24,
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
  songsContainer: {
    width: "86%",
    marginHorizontal: "7%",
    flexDirection: "column",
  },
  relatedContainer: {
    width: "100%",
    height: "25%",
    marginTop: 8,
    position: "relative",
  },
  relatedItem: {
    width: 130,
    height: 200,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    margin: 10,
  },
  relatedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  relatedMask: {
    position: "absolute",
    width: "100%",
    height: "20%",
    backgroundColor: "white",
    opacity: 0.8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 10,
    bottom: 0,
    padding: 2,
  },
  relatedTitle: {
    fontSize: 11,
    fontWeight: "bold",
  },
});
