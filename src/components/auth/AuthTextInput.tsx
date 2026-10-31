import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type Props = TextInputProps & {
  label?: string;
  errorText?: string;
  description?: string;
};

export default function AuthTextInput({
  label,
  errorText,
  description,
  style,
  ...props
}: Props) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[
          styles.input,
          Boolean(errorText) && styles.inputError,
          style,
        ]}
        placeholderTextColor="#9A8F8A"
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3D3531",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#E8DCD6",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: "#FFFFFF",
    color: "#1A1A1A",
  },
  inputError: {
    borderColor: "#C93B2B",
  },
  description: {
    fontSize: 12,
    color: "#7A6F6A",
    paddingTop: 4,
  },
  error: {
    fontSize: 12,
    color: "#C93B2B",
    paddingTop: 4,
  },
});
