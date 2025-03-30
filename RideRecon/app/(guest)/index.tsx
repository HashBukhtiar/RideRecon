import BackButton from "@/components/BackButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Typo from "@/components/Typo";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ImageUpload from "@/components/ImageUpload";
import * as ImagePicker from "expo-image-picker";
import { IdentificationType } from "@/types";
import Button from "@/components/Button";
import { router } from "expo-router";
import { uploadImageToFirebase } from "@/components/FirebaseStorage";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const Home = () => {
  const [identification, setIdentification] = useState<IdentificationType>({
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 0.5,
    });
  };

  const onSubmit = async () => {
    const { name, image } = identification;

    // Validate form
    if (!name.trim() && !image) {
      Alert.alert("User", "Please enter a description or upload an image.");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = null;

      // Upload image to Firebase Storage
      if (image) {
        imageUrl = await uploadImageToFirebase(image);
        console.log("Image uploaded:", imageUrl);
      }

      //this is important, this is how we add data to firestore with name, image and timestamp
      const docRef = await addDoc(collection(db, "identifications"), {
        name: name.trim(),
        imageUrl: imageUrl || null,
        createdAt: Timestamp.now(),
      });

      console.log("Firestore doc ID:", docRef.id);

      Alert.alert("Success", "Your identification has been submitted!");
      setIdentification({ name: "", image: null }); // Reset form
    } catch (err) {
      console.error(err);
      Alert.alert("Upload failed", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header
          title="Fill out information below to proceed with identification"
          style={{
            marginVertical: spacingY._30,
            paddingHorizontal: spacingY._30,
          }}
        />

        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Collection Icon</Typo>
            <ImageUpload
              file={identification.image}
              onClear={() =>
                setIdentification({ ...identification, image: null })
              }
              onSelect={(file) =>
                setIdentification({ ...identification, image: file })
              }
              placeholder="Upload Image"
            />
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Relevant Information</Typo>
            <Input
              placeholder="Description"
              value={identification.name}
              onChangeText={(value) =>
                setIdentification({ ...identification, name: value })
              }
            />
          </View>
        </ScrollView>
      </View>

      {/* footer */}
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <Button onPress={onSubmit}>
            <Typo size={20} color={colors.neutral900} fontWeight={"600"}>
              Identify
            </Typo>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._15,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: verticalScale(110),
    gap: spacingY._20,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
});
