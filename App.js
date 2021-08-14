import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./navigator/DrawerNavigator";
import { MenuProvider } from "react-native-popup-menu";

export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </MenuProvider>
  );
}
