// @flow

import variable from "./../variables/platform";

export default (variables /*: * */ = variable) => {
  const tabBarTheme = {
    ".tabIcon": {
      height: undefined
    },
    ".vertical": {
      height: 60
    },
    "NativeBase.Button": {
      ".transparent": {
        "NativeBase.Text": {
          fontSize: variables.tabFontSize,
          fontFamily: 'Roboto-Regular',
          color: variables.sTabBarActiveTextColor,
          fontFamily: 'Roboto-Regular',
        },
        "NativeBase.IconNB": {
          color: variables.sTabBarActiveTextColor
        }
      },
      "NativeBase.IconNB": {
        color: variables.sTabBarActiveTextColor
      },
      "NativeBase.Text": {
        fontSize: variables.tabFontSize,
        fontFamily: 'Roboto-Regular',
        color: variables.sTabBarActiveTextColor,
        fontFamily: 'Roboto-Regular',
      },
      ".isTabActive": {
        "NativeBase.Text": {
          fontFamily: 'Roboto-Bold',
        }
      },
      flex: 1,
      alignSelf: "stretch",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: null,
      borderBottomColor: "transparent",
      backgroundColor: variables.tabBgColor
    },
    height: 45,
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: "#ccc",
    backgroundColor: variables.tabBgColor
  };

  return tabBarTheme;
};
