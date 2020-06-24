// @flow

import { Platform } from "react-native";

import variable from "./../variables/platform";

export default (variables /*: * */ = variable) => {
  const titleTheme = {
    fontSize: variables.titleFontSize,
    color: variables.titleFontColor,
    fontFamily: Platform.OS === "ios" ? "Roboto-Bold" : undefined,
    textAlign: "center",
    paddingLeft: Platform.OS === "ios" ? 4 : 0,
    marginLeft: Platform.OS === "ios" ? undefined : -3,
    paddingTop: 1
  };

  return titleTheme;
};
