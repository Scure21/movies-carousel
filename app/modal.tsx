import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { getMovieDetails } from "@/api";
import Rating from "@/components/Rating";
import Genres from "@/components/Genres";
import Cast from "@/components/Cast";
import { LinearGradient } from "expo-linear-gradient";
const { width, height } = Dimensions.get("window");

const ITEM_SIZE = width * 0.72;

const Modal = () => {
  const { key } = useLocalSearchParams();
  const parsedKey = JSON.parse(key as string);

  const slideAnim = useRef(new Animated.Value(height)).current;

  const [details, setDetails] = React.useState<any>(null);

  useEffect(() => {
    const modeDetails = async () => {
      try {
        const details = await getMovieDetails(parsedKey);
        console.log("details", details);
        setDetails(details);
      } catch (error) {
        console.log("error", error);
      }
    };
    modeDetails();

    // Run animations in parallel
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 30,
        friction: 7,
      }),
    ]).start();
  }, [parsedKey]);

  if (!details) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { title, backdrop, rating, genres, description, directors, cast } =
    details;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Backdrop with linear gradient */}
        <View
          style={{
            flex: 1,
            width: "100%",
            height: ITEM_SIZE * 1.2,
            position: "absolute",
            top: 0,
          }}
        >
          <Image
            source={{
              uri: backdrop,
            }}
            style={[styles.posterImage]}
          />
          <LinearGradient
            colors={["rgba(0, 0, 0, 0)", "white"]}
            style={{
              height: ITEM_SIZE * 1.2,
              width,
              position: "absolute",
              top: 0,
            }}
          />
        </View>

        {/* Content */}
        <Animated.View
          style={{
            padding: 18,
            alignItems: "center",
            flex: 1,
            marginBottom: 200,
            position: "relative",
            top: 200,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Title */}
          <Text style={{ fontSize: 24 }} numberOfLines={3}>
            {title}
          </Text>

          {/* Genres */}
          {genres && <Genres genres={genres} borderColor="#ffff" />}

          {/* Rating */}
          {rating && <Rating rating={rating} />}

          {/* Director */}
          <Text style={{ fontSize: 12, marginVertical: 10 }}>
            Director / {directors}
          </Text>

          {/* Cast */}
          <Cast cast={cast} />

          {/* Description */}
          <View style={{ marginTop: 20 }}>
            <Text style={styles.heading}>Description</Text>
            <Text style={{ fontSize: 12 }}>{description}</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default Modal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingBottom: 100,
  },
  posterImage: {
    width: "100%",
    height: ITEM_SIZE * 1.2,
    resizeMode: "cover",
    margin: 0,
    marginBottom: 10,
  },
});
