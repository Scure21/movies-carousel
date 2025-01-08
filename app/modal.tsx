import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { getMovieDetails } from "@/api";
import Rating from "@/components/Rating";
import Genres from "@/components/Genres";

const Modal = () => {
  const { key } = useLocalSearchParams();
  const parsedKey = JSON.parse(key as string);

  const [details, setDetails] = React.useState<any>(null);

  useEffect(() => {
    const modeDetails = async () => {
      try {
        const details = await getMovieDetails(parsedKey);
        setDetails(details);
      } catch (error) {
        console.log("error", error);
      }
    };
    modeDetails();
  }, [parsedKey]);

  if (!details) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { title, backdrop, rating, genres, description } = details;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{
          uri: backdrop,
        }}
        style={styles.posterImage}
      />
      <View
        style={{
          padding: 18,
          alignItems: "center",
          flex: 1,
        }}
      >
        <Text style={{ fontSize: 24 }} numberOfLines={3}>
          {title}
        </Text>
        {rating && <Rating rating={rating} />}
        {genres && <Genres genres={genres} />}
        <Text style={{ fontSize: 12 }}>{description}</Text>
      </View>
    </ScrollView>
  );
};

export default Modal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  posterImage: {
    backgroundColor: "red",
    width: "100%",
    height: "50%",
    resizeMode: "cover",
    margin: 0,
    marginBottom: 10,
  },
});
