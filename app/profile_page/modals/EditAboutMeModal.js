// EditAboutMeModal.js
import { Modal, View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";

export default function EditAboutMeModal({ visible, onClose }) {
  const [text, setText] = useState(
    "I'm a UX researcher with 5+ years of experience..."
  );

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>About Me</Text>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            multiline
            placeholder="Tell us about yourself..."
          />
          <Button title="Save" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    textAlignVertical: "top",
    minHeight: 100,
  },
});
