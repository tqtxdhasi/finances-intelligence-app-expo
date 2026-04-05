// components/add/DateField.tsx
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DatePickerModal from "./DatePickerModal";

interface Props {
  date: string;
  onDateChange: (date: string) => void;
}

export default function DateField({ date, onDateChange }: Props) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const onDatePickerChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) setSelectedDate(selectedDate);
  };

  const confirmDate = () => {
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = selectedDate.getDate().toString().padStart(2, "0");
    onDateChange(`${year}-${month}-${day}`);
    setModalVisible(false);
  };

  const cancelDate = () => setModalVisible(false);

  return (
    <>
      <View>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          Date *
        </Text>
        <TouchableOpacity
          style={[styles.selector, { backgroundColor: colors.surfaceLight }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.selectorText, { color: colors.text }]}>
            {date}
          </Text>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <DatePickerModal
        visible={modalVisible}
        selectedDate={selectedDate}
        onDateChange={onDatePickerChange}
        onConfirm={confirmDate}
        onCancel={cancelDate}
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
