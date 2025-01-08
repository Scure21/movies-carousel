/**
 * Inspiration: https://dribbble.com/shots/8257559-Movie-2-0
 *
 */
import { Image, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import * as React from "react";
import { Text, View, Dimensions, Animated } from "react-native";
import { getMovies } from "../api";
import Genres from "@/components/Genres";
import Rating from "@/components/Rating";
import { Loading } from "@/components/Loading";
import { Backdrop } from "@/components/Backdrop";
import {
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import { colors } from "@/theme/colors";
import { Movie } from "@/types";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const SPACING = 10;
const ITEM_SIZE = width * 0.72;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const scrollX = useRef(new Animated.Value(0)).current;
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  useEffect(() => {
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

  // FlatList renderItem callback
  const renderItem = ({ item, index }: { item: Movie; index: number }) => {
    const { key, title, poster, genres, description, rating } = item;

    if (!poster) {
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

    // TODO: Make this items pressable to open a modal with more details. Move the image to the background.
    return (
      <Pressable
        onPress={() => {
          router.navigate({
            pathname: "/modal",
            params: { key: JSON.stringify(key) },
          });
        }}
      >
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
            <Image source={{ uri: poster }} style={styles.posterImage} />
            <Text
              style={{ fontSize: 24, fontFamily: "Montserrat" }}
              numberOfLines={1}
            >
              {title}
            </Text>
            {rating && <Rating rating={rating} />}
            {genres && <Genres genres={genres} />}
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Montserrat",
              }}
              numberOfLines={3}
            >
              {description}
            </Text>
          </Animated.View>
        </View>
      </Pressable>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
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
          renderItem={renderItem}
        />
      </View>

      {/* Bottom Sheet Modal */}
      <BottomSheetModalProvider>
        <View
          style={{
            width: "60%",
            height: 48,
            marginBottom: 36,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 24,
            backgroundColor: colors.charcoal,
          }}
        >
          <TouchableOpacity onPress={handlePresentModalPress}>
            <Text style={{ color: colors.white, fontWeight: 600 }}>
              Buy Ticket
            </Text>
          </TouchableOpacity>
        </View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text>Awesome 🎉</Text>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
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
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});
