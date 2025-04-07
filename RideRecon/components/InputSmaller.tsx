import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { colors, radius, spacingX } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';

interface InputSmallerProps {
  placeholder: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  icon?: React.ReactNode;
  value?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const InputSmaller = ({
  placeholder,
  onChangeText,
  secureTextEntry = false,
  icon,
  value,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: InputSmallerProps) => {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral400}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        value={value}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
};

export default InputSmaller;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral800,
    borderRadius: radius._10,
    borderCurve: 'continuous',
    paddingVertical: verticalScale(5),
    height: verticalScale(60),
  },
  iconContainer: {
    paddingHorizontal: spacingX._15,
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors.white,
    fontSize: verticalScale(16),
    paddingRight: spacingX._15,
  },
});