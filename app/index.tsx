/**
 * Inspiration: https://dribbble.com/shots/8257559-Movie-2-0
 *
 */
import { Image, StyleSheet } from "react-native";
import * as React from "react";
import {
  StatusBar,
  Text,
  View,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
import { getMovies } from "../api";
import Genres from "@/components/Genres";
import Rating from "@/components/Rating";
import MaskedView from "@react-native-masked-view/masked-view";
import Svg, { Rect } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
const { width, height } = Dimensions.get("window");

const SPACING = 10;
const ITEM_SIZE = width * 0.72;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const Loading = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.paragraph}>Loading...</Text>
  </View>
);

interface BarPropProps {
  movies: any;
  scrollX: any;
}

const Backdrop = ({ movies, scrollX }: BarPropProps) => {
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

interface Movie {
  key: string;
  title?: string;
  poster?: string;
  backdrop?: string;
  rating?: number;
  description?: string;
  releaseDate?: string;
  genres?: string[];
}

export default function App() {
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const fetchData = async () => {
      const movies = await getMovies();
      // Add empty items to create fake space
      // [empty_item, ...movies, empty_item]
      setMovies([{ key: "empty-left" }, ...movies, { key: "empty-right" }]);
    };

    if (movies.length === 0) {
      fetchData();
    }
  }, [movies]);

  if (movies.length === 0) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Backdrop movies={movies} scrollX={scrollX} />
      <StatusBar hidden />
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={(item) => item.key}
        horizontal
        bounces={false}
        decelerationRate={0.2}
        contentContainerStyle={{ alignItems: "center" }}
        snapToInterval={ITEM_SIZE}
        snapToAlignment="start"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          if (!item.poster) {
            return <View style={{ width: EMPTY_ITEM_SIZE }} />;
          }

          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
          });

          return (
            <View style={{ width: ITEM_SIZE }}>
              <Animated.View
                style={{
                  marginHorizontal: SPACING,
                  padding: SPACING * 2,
                  alignItems: "center",
                  transform: [{ translateY }],
                  backgroundColor: "white",
                  borderRadius: 34,
                }}
              >
                <Image
                  source={{ uri: item.poster }}
                  style={styles.posterImage}
                />
                <Text style={{ fontSize: 24 }} numberOfLines={1}>
                  {item.title}
                </Text>
                <Rating rating={item.rating} />
                <Genres genres={item.genres} />
                <Text style={{ fontSize: 12 }} numberOfLines={3}>
                  {item.description}
                </Text>
              </Animated.View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  posterImage: {
    width: "100%",
    height: ITEM_SIZE * 1.2,
    resizeMode: "cover",
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
});
