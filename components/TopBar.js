import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { types, genres } from "../db/utilData";

class ListButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      selectedType,
      selectedGenre,
      onGenreChange,
      onTypeChange,
    } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.openDrawer();
          }}
        >
          <View style={styles.ListButton}>
            <Ionicons name="md-list" size={30} color="#000" />
          </View>
        </TouchableOpacity>
        <View style={styles.searchView}>
          <Menu>
            <MenuTrigger
              children={
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "#fff",
                    borderRadius: 5,
                    padding: 5,
                    marginRight: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      marginRight: 5,
                    }}
                  >
                    Type:
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {selectedType.label}
                  </Text>
                </View>
              }
            />
            <MenuOptions optionsContainerStyle={{ width: 90, borderRadius: 5 }}>
              {types.map((type, index) => {
                return (
                  <MenuOption
                    key={index}
                    onSelect={() => {
                      onTypeChange(type);
                    }}
                  >
                    <Text
                      style={{
                        fontWeight:
                          selectedType.value == type.value ? "bold" : "normal",
                      }}
                    >
                      {type.label}
                    </Text>
                  </MenuOption>
                );
              })}
            </MenuOptions>
          </Menu>
          <Menu>
            <MenuTrigger
              children={
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "#fff",
                    borderRadius: 5,
                    padding: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      marginRight: 5,
                    }}
                  >
                    Genre:
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {selectedGenre.label}
                  </Text>
                </View>
              }
            />
            <MenuOptions
              optionsContainerStyle={{ width: 120, borderRadius: 5 }}
            >
              {genres.map((genre, index) => {
                return (
                  <MenuOption
                    key={index}
                    onSelect={() => {
                      onGenreChange(genre);
                    }}
                  >
                    <Text
                      style={{
                        fontWeight:
                          selectedGenre.value == genre.value
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {genre.label}
                    </Text>
                  </MenuOption>
                );
              })}
            </MenuOptions>
          </Menu>
        </View>
      </View>
    );
  }
}

export default ListButton;

const styles = StyleSheet.create({
  container: {
    width: "85%",
    height: "15%",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    flexDirection: "row",
    paddingTop: 15,
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
  },
  searchView: {
    width: "85%",
    height: 30,
    // backgroundColor: "#fff",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    // zIndex: 20,
  },
});
