import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const CAST_ITEM_SIZE = width * 0.3;

interface CastMember {
  name: string;
  image: string;
  character: string;
}

interface CastProps {
  cast: CastMember[];
}

const Cast = ({ cast }: CastProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Cast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cast.map((person, index) => (
          <View key={index} style={styles.castItem}>
            {person.image ? (
              <Image source={{ uri: person.image }} style={styles.castImage} />
            ) : (
              <Image
                source={require("../assets/avatar-placeholder.png")}
                style={styles.castImage}
              />
            )}
            <Text style={styles.actorName} numberOfLines={2}>
              {person.name}
            </Text>
            <Text style={styles.characterName} numberOfLines={2}>
              {person.character}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
  },
  castItem: {
    width: CAST_ITEM_SIZE,
    marginRight: 10,
    alignItems: "center",
  },
  castImage: {
    width: CAST_ITEM_SIZE,
    height: CAST_ITEM_SIZE,
    borderRadius: 10,
    marginBottom: 5,
  },
  actorName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  characterName: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
  },
});

export default Cast;
