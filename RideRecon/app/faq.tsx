import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "What is RideRecon?",
      answer:
        "RideRecon is a platform that helps identify cars using both images and text inputs.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can reach our support team by emailing support@riderecon.com.",
    },
    {
      question: "How does RideRecon identify vehicles?",
      answer:
        "RideRecon leverages multiple ‘expert’ modules (including a trained machine learning model, a reverse image search, and two language models). Each module contributes to identifying the vehicle, and the results are combined to form a final consensus.",
    },
    {
      question: "Can RideRecon identify multiple cars in a single image?",
      answer:
        "Currently, RideRecon focuses on identifying one primary vehicle per image. Future enhancements might extend support for multiple cars, but the present system is optimized for single-car identification.",
    },
    {
      question: "Which ‘experts’ does RideRecon use?",
      answer:
        "RideRecon integrates four experts: RIS (reverse image search), G8M (a specialized ML model trained on car images), 4oE (an LLM that uses both image and text), and vAI (another LLM hosted on Google Cloud Vertex AI).",
    },
    {
      question: "Is my data and personal information secure?",
      answer:
        "Yes. We store your login and upload information securely, and only authorized modules in the blackboard architecture can access your data to perform identification. Refer to our Privacy Policy for more details on data handling and encryption.",
    },
    {
      question: "Are there any guidelines for uploading images?",
      answer:
        "We recommend clear, well-lit images showing as much of the vehicle as possible. Avoid blurry or obstructed images so our experts can analyze important features accurately.",
    },
    {
      question: "Will RideRecon work offline?",
      answer:
        "No. RideRecon needs to connect to our servers and external APIs to process your images and queries, so an internet connection is required.",
    },
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        <View style={styles.faqContent}>
          <View style={styles.headerRow}>
            <Typo size={22} fontWeight="500">
              Frequently Asked Questions
            </Typo>
          </View>

          <ScrollView style={styles.listStyle}>
            {faqData.map((item, index) => (
              <View key={index} style={styles.faqItem}>
                <TouchableOpacity
                  onPress={() => toggleExpand(index)}
                  style={styles.questionContainer}
                >
                  <Typo size={16} fontWeight="500" style={styles.question}>
                    {item.question}
                  </Typo>
                  <Icons.CaretDown
                    weight="bold"
                    color={colors.primary}
                    size={verticalScale(20)}
                    style={{
                      transform: [
                        { rotate: expandedIndex === index ? "180deg" : "0deg" },
                      ],
                    }}
                  />
                </TouchableOpacity>

                {expandedIndex === index && (
                  <View style={styles.answerContainer}>
                    <Typo size={14} style={styles.answer}>
                      {item.answer}
                    </Typo>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacingX._20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  faqContent: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,
  },
  listStyle: {
    paddingVertical: spacingY._10,
  },
  faqItem: {
    marginBottom: spacingY._15,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.neutral800,
    padding: spacingX._15,
    borderRadius: radius._10,
  },
  question: {
    flex: 1,
  },
  answerContainer: {
    backgroundColor: colors.neutral50,
    padding: spacingX._15,
    marginTop: spacingY._3,
    borderBottomLeftRadius: radius._10,
    borderBottomRightRadius: radius._10,
  },
  answer: {
    color: colors.neutral800,
  },
});

export default FAQ;
