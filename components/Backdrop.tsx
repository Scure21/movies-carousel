import { Image } from "react-native";
import * as React from "react";
import { View, FlatList, Dimensions, Animated } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import Svg, { Rect } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
const { width, height } = Dimensions.get("window");

const ITEM_SIZE = width * 0.72;
const BACKDROP_HEIGHT = height * 0.65;
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface BarPropProps {
  movies: any;
  scrollX: any;
}

export const Backdrop = ({ movies, scrollX }: BarPropProps) => {
  return (
    <View
      style={{ height: BACKDROP_HEIGHT, width, position: "absolute" }}
      renderToHardwareTextureAndroid
    >
      <FlatList
        data={movies.reverse()}
        keyExtractor={(item) => item.key}
        removeClippedSubviews={false}
        renderToHardwareTextureAndroid
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        renderItem={({ item, index }) => {
          if (!item.backdrop) {
            return null;
          }
          const translateX = scrollX.interpolate({
            inputRange: [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
            outputRange: [-width, 0],
          });

          return (
            <MaskedView
              style={{
                width,
                height,
                position: "absolute",
              }}
              maskElement={
                <AnimatedSvg
                  width={width}
                  height={height}
                  style={{
                    backgroundColor: "transparent",
                    transform: [{ translateX }],
                  }}
                >
                  <Rect x="0" y="0" width={width} height={height} fill="red" />
                </AnimatedSvg>
              }
            >
              <Image
                source={{ uri: item.backdrop }}
                style={{
                  width: width,
                  height: BACKDROP_HEIGHT,
                  resizeMode: "cover",
                }}
              />
            </MaskedView>
          );
        }}
      />
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "white"]}
        style={{
          height: BACKDROP_HEIGHT,
          width,
          position: "absolute",
          bottom: 0,
        }}
      />
    </View>
  );
};
