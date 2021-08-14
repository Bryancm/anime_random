import React from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Animated,
  Dimensions,
  TextInput,
  RefreshControl,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AddBanner from "../components/AdBanner";
import { getMyListAnime, initDb } from "../db/AnimeDB";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Loading from "../components/Loading";
import NoItems from "../components/noItems";
import Item from "../components/MyListItem";

const screenHeight = Dimensions.get("window").height;

export default class MyListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.db = null;
    this.state = {
      animeList: [],
      searchText: "",
      order: "",
      loading: true,
      isFetching: false,
    };
  }
  async componentDidMount() {
    this.db = await initDb();
    this.getAnime();
    StatusBar.setBarStyle("light-content", true);
  }

  getAnime = () => {
    getMyListAnime(this.db)
      .then((animeList) => {
        this.setState({ animeList, loading: false, isFetching: false });
      })
      .catch((error) => {
        this.setState({ loading: false, isFetching: false });
        console.log(error);
      });
  };

  onCardPress = (item) => {
    this.props.navigation.push("CardDetail", {
      anime: item,
      from: "MyList",
    });
  };
  componentDidUpdate(prevProps) {
    if (this.props.route.params && this.props.route.params.doUpdate) {
      this.getAnime();
    }
    // this.getAnime();
  }
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  y = new Animated.Value(0);
  onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: this.y } } }],
    {
      useNativeDriver: true,
    }
  );
  onChangeText = (searchText) => {
    this.setState({ searchText });
  };

  filterAnime = (animeList, searchText, order) => {
    if (searchText !== "") {
      const search = searchText.toLowerCase();
      animeList = this.filterBySearch(animeList, search);
    }
    if (order !== "") {
      animeList = this.orderBy(animeList, order);
    }

    return animeList;
  };

  orderBy = (animeList, order) => {
    if (order == "rating") {
      animeList = animeList.sort(this.ratingSort);
    }
    if (order == "name") {
      animeList = animeList.sort(this.nameSort);
    }
    if (order == "year") {
      animeList = animeList.sort(this.yearSort);
    }
    return animeList;
  };

  ratingSort = (a, b) => {
    const ratingsA = a.ratings ? JSON.parse(a.ratings) : { weighted_score: 0 };
    const ratingsB = b.ratings ? JSON.parse(b.ratings) : { weighted_score: 0 };
    if (ratingsA.weighted_score > ratingsB.weighted_score) {
      return -1;
    }
    if (ratingsA.weighted_score < ratingsB.weighted_score) {
      return 1;
    }
    return 0;
  };

  nameSort = (a, b) => {
    const titleA = a.title ? a.title : "";
    const titleB = b.title ? b.title : "";
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  };

  yearSort = (a, b) => {
    const yearA = a.year ? a.year : 0;
    const yearB = b.year ? b.year : 0;

    if (yearA > yearB) {
      return -1;
    }
    if (yearB < yearA) {
      return 1;
    }
    return 0;
  };

  filterBySearch = (animeList, searchText) => {
    animeList = animeList.filter((anime) =>
      anime.title.toLowerCase().includes(searchText)
    );
    return animeList;
  };

  onRefresh() {
    this.setState({ isFetching: true }, () => {
      this.getAnime();
    });
  }

  render() {
    const { searchText, animeList, order, loading } = this.state;
    const animeFiltered = this.filterAnime(animeList, searchText, order);

    return (
      <View style={styles.container}>
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: 30,
            zIndex: 15,
            top: 0,
            opacity: 0,
          }}
        >
          <LinearGradient
            style={styles.gradientMask}
            colors={["#EE9617", "#FE5858"]}
            start={[0.5, 1]}
            end={[1, 0]}
          ></LinearGradient>
        </View>

        <View
          style={{
            position: "absolute",
            top: 35,
            left: "7%",
            width: 30,
            height: 30,
            zIndex: 25,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.openDrawer();
            }}
          >
            <Ionicons
              name="md-list"
              size={30}
              color="#F5F5F5"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            position: "absolute",
            top: 35,
            right: "6.5%",
            width: 30,
            height: 30,
            zIndex: 25,
          }}
        >
          <Menu>
            <MenuTrigger
              children={
                <TouchableOpacity>
                  <MaterialIcons
                    name="filter-list"
                    size={30}
                    color="#F5F5F5"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </TouchableOpacity>
              }
            />
            <MenuOptions optionsContainerStyle={{ width: 90, borderRadius: 5 }}>
              <MenuOption
                onSelect={() => {
                  this.setState({ order: "rating" });
                }}
              >
                <TouchableOpacity>
                  <Text
                    style={{
                      fontWeight: order == "rating" ? "bold" : "normal",
                    }}
                  >
                    Rating
                  </Text>
                </TouchableOpacity>
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  this.setState({ order: "name" });
                }}
              >
                <TouchableOpacity style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontWeight: order == "name" ? "bold" : "normal",
                    }}
                  >
                    Name
                  </Text>
                </TouchableOpacity>
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  this.setState({ order: "year" });
                }}
              >
                <TouchableOpacity>
                  <Text
                    style={{
                      fontWeight: order == "year" ? "bold" : "normal",
                    }}
                  >
                    Year
                  </Text>
                </TouchableOpacity>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>

        <View
          style={{
            position: "absolute",
            top: 35,
            width: "100%",
            height: 30,
            zIndex: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextInput
            style={{
              height: 30,
              width: "60%",
              borderRadius: 10,
              backgroundColor: "#F5F5F5",
              paddingLeft: 5,
            }}
            onChangeText={(text) => this.onChangeText(text)}
            value={searchText}
            placeholder="Search by name"
          />
        </View>

        <View style={styles.coverImageContainer}>
          {/* <Text style={styles.headerText}>MY LIST</Text> */}

          <LinearGradient
            style={styles.gradientMask}
            colors={["#EE9617", "#FE5858"]}
            start={[0.5, 1]}
            end={[1, 0]}
          ></LinearGradient>
        </View>

        {animeFiltered.length > 0 ? (
          <View style={styles.listContainer}>
            <Animated.FlatList
              bounces={true}
              data={animeFiltered}
              renderItem={({ index, item }) => {
                return (
                  <Item
                    index={index}
                    onCardPress={() => {
                      this.onCardPress(item);
                    }}
                    y={this.y}
                    item={item}
                  />
                );
              }}
              // keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{
                paddingHorizontal: "7%",
                paddingTop: 20,
              }}
              style={{
                zIndex: 12,
                marginTop: 60,
                marginBottom: screenHeight > 890 ? 60 : 0,
              }}
              // getItemLayout={getItemLayout}
              scrollEventThrottle={2}
              onScroll={this.onScroll}
              // removeClippedSubviews={true} // Unmount components when outside of window
              initialNumToRender={4} // Reduce initial render amount
              maxToRenderPerBatch={10} // Reduce number in each render batch
              // maxToRenderPerBatch={100} // Increase time between renders
              windowSize={7}
              refreshControl={
                <RefreshControl
                  onRefresh={() => this.onRefresh()}
                  refreshing={this.state.isFetching}
                />
              }
            />
          </View>
        ) : (
          <View
            style={{
              width: "100%",
              height: "25%",
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: "15%",
            }}
          >
            {loading ? (
              <Loading transparentBackground={true} text="_" />
            ) : (
              <NoItems
                transparentBackground={true}
                text="Nothing yet, how about adding an anime ?
              "
              />
            )}
          </View>
        )}
      </View>
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
