import { GenresProps } from "@/types";
import * as React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Genres({
  genres,
  borderColor,
  textColor,
}: GenresProps) {
  const borderColorStyle = borderColor || "#ccc";
  const textColorStyle = textColor || "#212529";

  return (
    <View style={styles.genres}>
      {genres.map((genre, i) => {
        return (
          <View
            key={genre}
            style={[styles.genre, { borderColor: borderColorStyle }]}
          >
            <Text style={[styles.genreText, { color: textColorStyle }]}>
              {genre}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 4,
  },
  genre: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "#ccc",
    marginRight: 4,
    marginBottom: 4,
  },
  genreText: {
    fontSize: 9,
    fontFamily: "Montserrat",
  },
});
