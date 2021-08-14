import React from "react";
import { View, StatusBar } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  useIsDrawerOpen,
} from "@react-navigation/drawer";

import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import Animated from "react-native-reanimated";
import HomeScreen from "../screens/HomeScreen";
import MyListScreen from "../screens/MyListSreen";
import CardDetailScreen from "../screens/CardDetailScreen";
import AboutScreen from "../screens/About";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function StackNavigator({ style }) {
  const isDrawerOpen = useIsDrawerOpen();
  if (isDrawerOpen) {
    StatusBar.setBarStyle("light-content", true);
  }
  return (
    <Animated.View style={[{ flex: 1, overflow: "hidden", ...style }]}>
      <Stack.Navigator
        headerMode={false}
        mode="card"
        screenOptions={{
          gestureEnabled: false,
          gestureDirection: "horizontal",
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen name="Home">
          {(props) => <HomeScreen isDrawerOpen={isDrawerOpen} {...props} />}
        </Stack.Screen>
        <Stack.Screen name="MyList">
          {(props) => <MyListScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="CardDetail">
          {(props) => <CardDetailScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="About">
          {(props) => <AboutScreen isDrawerOpen={isDrawerOpen} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </Animated.View>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={{ flex: 0.98, marginTop: "20%" }}>
        <DrawerItem
          label="Random"
          labelStyle={{ color: "#fff", marginLeft: -16 }}
          onPress={() => props.navigation.navigate("Home")}
          icon={() => <FontAwesome name="random" size={20} color="#fff" />}
        />
        <DrawerItem
          label="My List"
          labelStyle={{ color: "#fff", marginLeft: -16 }}
          onPress={() => props.navigation.navigate("MyList")}
          icon={() => <Ionicons name="ios-list" size={20} color="#fff" />}
        />
      </View>
      <View style={{ flex: 0 }}>
        <DrawerItem
          label="About"
          labelStyle={{ color: "#fff", marginLeft: -16 }}
          onPress={() => props.navigation.navigate("About")}
          icon={() => (
            <Ionicons
              name="ios-information-circle-outline"
              size={20}
              color="#fff"
            />
          )}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  const [progress, setProgress] = React.useState(new Animated.Value(0));

  const scale = Animated.interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });
  const borderRadius = Animated.interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [1, 10],
  });
  const screenStyles = { borderRadius, transform: [{ scale }] };
  return (
    <LinearGradient
      style={{
        flex: 1,
      }}
      colors={["#FE5858", "#EE9617"]}
      start={[0, 1]}
      end={[1, 1]}
    >
      <Drawer.Navigator
        screenOptions={{ swipeEnabled: false }}
        drawerType="slide"
        overlayColor="transparent"
        drawerStyle={{ width: "50%", backgroundColor: "transparent" }}
        drawerContentOptions={{
          activeBackgroundColor: "transparent",
          activeTintColor: "green",
          inactiveTintColor: "green",
        }}
        sceneContainerStyle={{ backgroundColor: "transparent" }}
        initialRouteName="Screens"
        drawerContent={(props) => {
          setProgress(props.progress);
          return <CustomDrawerContent {...props} />;
        }}
      >
        <Drawer.Screen name="Screens">
          {(props) => <StackNavigator {...props} style={screenStyles} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </LinearGradient>
  );
}
