// components/add/TimeField.tsx
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TimePickerModal from "./TimePickerModal";

interface Props {
  time: string;
  onTimeChange: (time: string) => void;
}

export default function TimeField({ time, onTimeChange }: Props) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  const onTimePickerChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) setSelectedTime(selectedDate);
  };

  const confirmTime = () => {
    const hours = selectedTime.getHours().toString().padStart(2, "0");
    const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
    onTimeChange(`${hours}:${minutes}`);
    setModalVisible(false);
  };

  const cancelTime = () => setModalVisible(false);

  return (
    <>
      <View>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          Time *
        </Text>
        <TouchableOpacity
          style={[styles.selector, { backgroundColor: colors.surfaceLight }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.selectorText, { color: colors.text }]}>
            {time || "Select time"}
          </Text>
          <Ionicons
            name="time-outline"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <TimePickerModal
        visible={modalVisible}
        selectedTime={selectedTime}
        onTimeChange={onTimePickerChange}
        onConfirm={confirmTime}
        onCancel={cancelTime}
      />
    </>
  );
}

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 12,
  },
  selector: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorText: {
    fontSize: 16,
  },
});
