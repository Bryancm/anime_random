import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Dimensions,
  StatusBar,
} from "react-native";

import Card from "../components/Card";
import AddBanner from "../components/AdBanner";
import TopBar from "../components/TopBar";
import Loading from "../components/Loading";
import CheckMark from "../components/CheckMark";
import { AntDesign } from "@expo/vector-icons";
import {
  PanGestureHandler,
  State,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Animated, { and } from "react-native-reanimated";
import { runSpring, runTiming } from "../animations/animations";
import { LinearGradient } from "expo-linear-gradient";
import {
  getRandomAnime,
  addMyListAnime,
  createDummyDb,
  initDb,
} from "../db/AnimeDB";
import { Asset } from "expo-asset";
import * as FS from "expo-file-system";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const {
  defined,
  cond,
  eq,
  lessThan,
  greaterThan,
  call,
  set,
  stopClock,
  Clock,
  Value,
  interpolateNode,
} = Animated;

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.db = null;
    this.state = {
      loadingRecommendation: 0,
      initAnimation: 0,
      loadingAddList: 0,
      loadingImage: 0,
      complete: 0,
      randomAnime: null,
      selectedType: { label: "All", value: "all" },
      selectedGenre: { label: "All", value: "all" },
    };
    this.loadingRecommendation = 0;
    this.beforeLoading = 0;
    this.loadingRecom = new Value(0);
    this.transY = new Value(0);
    const dragY = new Value(0);
    const dragX = new Value(0);
    const state = new Value(-1);
    const dragVY = new Value(0);
    const dragVX = new Value(0);
    this.clockY = new Clock();
    const clockX = new Clock();
    const transX = new Value(0);
    const clocky2 = new Clock();

    this.translateY2 = runTiming(clocky2, -screenHeight, 0, 100);

    this.onGestureEvent = Animated.event([
      {
        nativeEvent: {
          translationX: dragX,
          translationY: dragY,
          velocity: dragVY,
          state: state,
        },
      },
    ]);

    this.translateY = cond(
      eq(state, State.ACTIVE),
      [stopClock(this.clockY), set(this.transY, dragY), this.transY],
      [
        cond(
          lessThan(this.transY, -100),
          [
            cond(eq(this.loadingRecom, 0), [
              stopClock(this.clockY),
              set(this.loadingRecom, 1),
              call([], async () => {
                this.setState({ loadingRecommendation: 1, loadingImage: 1 });
                await this.delay(300);
                var randomAnime = await getRandomAnime(
                  this.state.selectedType,
                  this.state.selectedGenre,
                  this.db
                );
                if (!randomAnime) {
                  randomAnime = { title: "Anime not found" };
                }

                this.setState({ randomAnime });
                this.setState({ loadingRecommendation: 0 });
                this.transY.setValue(0);
                this.loadingRecom.setValue(0);
              }),
            ]),
            set(this.transY, runTiming(this.clockY, this.transY, -900, 400)),
          ],
          [
            cond(
              greaterThan(this.transY, 100),
              [
                cond(eq(this.loadingRecom, 0), [
                  stopClock(this.clockY),
                  set(this.loadingRecom, 1),
                  call([], async () => {
                    this.setState({ loadingAddList: 1, loadingImage: 1 });

                    const beforeAnime = this.state.randomAnime;
                    if (beforeAnime.title !== "Anime not found") {
                      await addMyListAnime(this.state.randomAnime.id, this.db);
                    }
                    var randomAnime = await getRandomAnime(
                      this.state.selectedType,
                      this.state.selectedGenre,
                      this.db
                    );
                    if (!randomAnime) {
                      randomAnime = { title: "Anime not found" };
                    }
                    if (beforeAnime.title !== "Anime not found") {
                      this.setState({ complete: 1 });
                    }
                    await this.delay(300);
                    this.setState({ randomAnime });
                    this.setState({ complete: 0 });
                    this.setState({ loadingAddList: 0 });
                    this.transY.setValue(0);
                    this.loadingRecom.setValue(0);
                  }),
                ]),
                set(this.transY, runTiming(this.clockY, this.transY, 900, 400)),
              ],
              [
                set(
                  this.transY,
                  cond(
                    defined(this.transY),
                    runSpring(this.clockY, this.transY, dragVY, 0),
                    0
                  )
                ),
              ]
            ),
          ]
        ),
      ]
    );

    this.translateX = cond(
      eq(state, State.ACTIVE),
      [stopClock(clockX), set(transX, dragX), transX],
      [
        set(
          transX,
          cond(defined(transX), runSpring(clockX, transX, dragVX, 0), 0)
        ),
      ]
    );

    this.addListOpacity = cond(
      lessThan(this.translateY, -screenHeight),
      [0],
      interpolateNode(this.translateY, {
        inputRange: [-150, 0],
        outputRange: [0.85, 0],
      })
    );

    this.nextOpacity = cond(
      greaterThan(this.translateY, screenHeight),
      [0],
      interpolateNode(this.translateY, {
        inputRange: [0, 150],
        outputRange: [0, 0.85],
      })
    );
  }

  initAnime = async () => {
    this.setState({ loadingRecommendation: 1 });
    const file = await FS.getInfoAsync(
      `${FS.documentDirectory}SQLite/anime.db`
    );

    if (!file.exists) {
      await createDummyDb();
      FS.downloadAsync(
        Asset.fromModule(require("../assets/db/anime.db")).uri,
        `${FS.documentDirectory}SQLite/anime.db`
      )
        .then(async ({ uri }) => {
          this.db = await initDb();
          var randomAnime = await getRandomAnime(
            this.state.selectedType,
            this.state.selectedGenre,
            this.db
          );
          this.setState({ randomAnime, loadingRecommendation: 0 });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      this.db = await initDb();
      var randomAnime = await getRandomAnime(
        this.state.selectedType,
        this.state.selectedGenre,
        this.db
      );
      this.setState({ randomAnime, loadingRecommendation: 0 });
    }
  };

  delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  onCardPress = () => {
    this.props.navigation.push("CardDetail", {
      anime: this.state.randomAnime,
      from: "Home",
    });
  };

  componentDidMount() {
    this.initAnime();
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  onTypeChange = (selectedType) => {
    this.setState({ selectedType });
  };

  onGenreChange = (selectedGenre) => {
    this.setState({ selectedGenre });
  };

  imageLoaded = () => {
    this.setState({ loadingImage: 0 });
  };

  render() {
    const { navigation } = this.props;
    if (navigation.isFocused() && !this.props.isDrawerOpen) {
      StatusBar.setBarStyle("dark-content", true);
    }

    return (
      <SafeAreaView style={styles.container}>
        <TopBar
          navigation={navigation}
          onGenreChange={this.onGenreChange}
          onTypeChange={this.onTypeChange}
          selectedGenre={this.state.selectedGenre}
          selectedType={this.state.selectedType}
        />

        {this.state.loadingRecommendation === 1 && (
          <Loading text="Getting recommendation" />
        )}
        {this.state.loadingAddList === 1 && (
          <CheckMark text="Adding to your list" />
        )}

        <PanGestureHandler
          onGestureEvent={this.onGestureEvent}
          onHandlerStateChange={this.onGestureEvent}
        >
          <Animated.View
            style={[
              { width: screenWidth * 0.85, height: screenHeight * 0.7 },
              {
                transform: [
                  {
                    translateY: this.translateY,
                    translateX: this.translateX,
                  },
                ],
              },
            ]}
          >
            <View style={{ width: "100%", height: "100%", borderRadius: 16 }}>
              <View style={{ width: "100%", height: "100%", zIndex: 10 }}>
                {this.state.randomAnime && (
                  <Card
                    loadingImage={this.state.loadingImage}
                    navigation={navigation}
                    anime={this.state.randomAnime}
                    imageLoaded={this.imageLoaded}
                  />
                )}
              </View>

              <Animated.View
                style={[
                  {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    zIndex: 122,
                  },
                  { opacity: this.nextOpacity },
                ]}
              >
                <TouchableWithoutFeedback onPress={this.onCardPress}>
                  <LinearGradient
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 16,
                    }}
                    colors={["#FE5858", "#EE9617"]}
                    start={[0.8, 0]}
                    end={[0, 1]}
                  >
                    <Text
                      style={{
                        ...styles.gradientText,
                        marginTop: "10%",
                        marginBottom: "5%",
                      }}
                    >
                      ADD
                    </Text>
                    <AntDesign
                      name="plus"
                      size={260}
                      color="#fff"
                      style={{
                        textAlign: "center",
                      }}
                    />
                  </LinearGradient>
                </TouchableWithoutFeedback>
              </Animated.View>

              <Animated.View
                style={[
                  {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    zIndex: 120,
                  },
                  { opacity: this.addListOpacity },
                ]}
              >
                <LinearGradient
                  style={styles.gradientMask}
                  colors={["#FE5858", "#EE9617"]}
                  start={[0, 0.8]}
                  end={[1, 0]}
                >
                  <AntDesign
                    name="question"
                    size={320}
                    color="#fff"
                    style={{
                      textAlign: "center",
                    }}
                  />
                  <Text style={{ ...styles.gradientText }}>NEXT</Text>
                </LinearGradient>
              </Animated.View>
            </View>
          </Animated.View>
        </PanGestureHandler>
        <View style={{ position: "absolute", bottom: 20 }}>
          <AddBanner bottom={screenHeight > 890 ? 30 : 10} />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  textShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    textAlign: "center",
  },
  addListButton: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 10,
    textAlign: "center",
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
});
