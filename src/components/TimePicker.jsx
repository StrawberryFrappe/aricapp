import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../styles/commonStyles';

/**
 * A small time picker for hours, minutes, and seconds.
 * props:
 *  - hours, minutes, seconds: number
 *  - onChange: ({ hours, minutes, seconds }) => void
 */
const TimePicker = ({ hours, minutes, seconds, onChange }) => {
  const hourItems = Array.from({ length: 100 }, (_, i) => i);
  const minuteItems = Array.from({ length: 60 }, (_, i) => i);
  const secondItems = Array.from({ length: 60 }, (_, i) => i);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={hours}
        style={styles.picker}
        onValueChange={(h) => onChange({ hours: h, minutes, seconds })}
        itemStyle={styles.item}
      >
        {hourItems.map((h) => (
          <Picker.Item key={h} label={String(h).padStart(2, '0')} value={h} />
        ))}
      </Picker>
      <Picker
        selectedValue={minutes}
        style={styles.picker}
        onValueChange={(m) => onChange({ hours, minutes: m, seconds })}
        itemStyle={styles.item}
      >
        {minuteItems.map((m) => (
          <Picker.Item key={m} label={String(m).padStart(2, '0')} value={m} />
        ))}
      </Picker>
      <Picker
        selectedValue={seconds}
        style={styles.picker}
        onValueChange={(s) => onChange({ hours, minutes, seconds: s })}
        itemStyle={styles.item}
      >
        {secondItems.map((s) => (
          <Picker.Item key={s} label={String(s).padStart(2, '0')} value={s} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.semanticPink,
  },
  picker: {
    width: 60,
    height: 120,
    color: colors.textPrimary,
  },
  item: {
    fontSize: 18,
  },
});

export default TimePicker;
