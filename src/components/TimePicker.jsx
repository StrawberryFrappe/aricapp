import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';

/**
 * A time picker with wheel scrollers and text inputs for hours, minutes, and seconds.
 * props:
 *  - hours, minutes, seconds: number
 *  - onChange: ({ hours, minutes, seconds }) => void
 */
const TimePicker = ({ hours = 0, minutes = 0, seconds = 0, onChange = () => {} }) => {
  // Ensure props are valid numbers
  const safeHours = Math.max(0, Math.min(99, Number(hours) || 0));
  const safeMinutes = Math.max(0, Math.min(59, Number(minutes) || 0));
  const safeSeconds = Math.max(0, Math.min(59, Number(seconds) || 0));
  const hourItems = Array.from({ length: 100 }, (_, i) => i);
  const minuteItems = Array.from({ length: 60 }, (_, i) => i);
  const secondItems = Array.from({ length: 60 }, (_, i) => i);

  // Wheel component for individual time units
  const WheelPicker = ({ items, selectedValue, onValueChange, label }) => {
    const itemHeight = 40;
    const visibleItems = 5;
    const containerHeight = itemHeight * visibleItems;
    
    return (
      <View style={styles.wheelContainer}>
        <Text style={styles.label}>{label}</Text>
        
        {/* Wheel picker */}
        <View style={[styles.wheel, { height: containerHeight }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            snapToInterval={itemHeight}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingVertical: containerHeight / 2 - itemHeight / 2,
            }}            onMomentumScrollEnd={(event) => {
              if (event?.nativeEvent?.contentOffset) {
                const index = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
                const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
                const value = items[clampedIndex];
                if (value !== undefined && value !== selectedValue) {
                  onValueChange(value);
                }
              }
            }}
          >
            {items.map((item, index) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.wheelItem,
                  { height: itemHeight },
                  item === selectedValue && styles.selectedItem
                ]}
                onPress={() => onValueChange(item)}
              >
                <Text style={[
                  styles.wheelItemText,
                  item === selectedValue && styles.selectedItemText
                ]}>
                  {String(item).padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Selection indicator */}
          <View style={styles.selectionIndicator} />
        </View>
        
        {/* Text input */}
        <TextInput
          style={styles.textInput}
          value={String(selectedValue).padStart(2, '0')}          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '');
            const value = parseInt(numericText) || 0;
            const maxValue = items.length - 1;
            if (value >= 0 && value <= maxValue) {
              onValueChange(value);
            }
          }}
          keyboardType="numeric"
          maxLength={2}
        />
      </View>
    );
  };

  return (    <View style={styles.container}>
      <WheelPicker
        items={hourItems}
        selectedValue={safeHours}
        onValueChange={(h) => onChange({ hours: h, minutes: safeMinutes, seconds: safeSeconds })}
        label="Hours"
      />
      
      <View style={styles.separator}>
        <Text style={styles.separatorText}>:</Text>
      </View>
      
      <WheelPicker
        items={minuteItems}
        selectedValue={safeMinutes}
        onValueChange={(m) => onChange({ hours: safeHours, minutes: m, seconds: safeSeconds })}
        label="Minutes"
      />
      
      <View style={styles.separator}>
        <Text style={styles.separatorText}>:</Text>
      </View>
      
      <WheelPicker
        items={secondItems}
        selectedValue={safeSeconds}
        onValueChange={(s) => onChange({ hours: safeHours, minutes: safeMinutes, seconds: s })}
        label="Seconds"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  wheelContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  wheel: {
    width: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  wheelItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelItemText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  selectedItem: {
    backgroundColor: 'transparent',
  },
  selectedItemText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  selectionIndicator: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    height: 40,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    pointerEvents: 'none',
  },
  textInput: {
    marginTop: 8,
    width: 50,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    textAlign: 'center',
    color: colors.textPrimary,
    fontSize: 14,
  },
  separator: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    marginTop: 30, // Align with wheel pickers
  },
  separatorText: {
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
});

export default TimePicker;
