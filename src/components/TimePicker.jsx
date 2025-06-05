import React, { useEffect, useRef, memo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

/**
 * A time picker with wheel scrollers and text inputs for hours, minutes, and seconds.
 * props:
 *  - hours, minutes, seconds: number
 *  - onChange: ({ hours, minutes, seconds }) => void
 */
const TimePicker = ({ hours = 0, minutes = 0, seconds = 0, onChange = () => {} }) => {
  const safeH = Math.max(0, Math.min(99, Number(hours) || 0));
  const safeM = Math.max(0, Math.min(59, Number(minutes) || 0));
  const safeS = Math.max(0, Math.min(59, Number(seconds) || 0));
  
  // Wheel component for individual time units
  const WheelPicker = memo(({ items, selectedValue, onValueChange, label }) => {
    const itemHeight = 40;
    const visibleItems = 5;
    const containerHeight = itemHeight * visibleItems;
    const scrollRef = useRef(null);

    // restore scroll pos on value change
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: selectedValue * itemHeight, animated: false });
      }
    }, [selectedValue]);

    // common snap logic
    const handleSnap = e => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const idx = Math.round(offsetY / itemHeight);
      const clamped = Math.max(0, Math.min(idx, items.length - 1));
      const v = items[clamped];
      if (v !== selectedValue) onValueChange(v);
    };

    return (
      <View style={styles.wheelContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.wheel, { height: containerHeight }]}>
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={itemHeight}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingVertical: containerHeight / 2 - itemHeight / 2,
            }}
            // only snap once momentum truly ends:
            onMomentumScrollEnd={handleSnap}
            // remove your onScrollEndDrag entirely
          >
            {items.map(i => (
              <TouchableOpacity
                key={i}
                style={[styles.wheelItem, { height: itemHeight }, i === selectedValue && styles.selectedItem]}
                onPress={() => onValueChange(i)}
              >
                <Text style={[styles.wheelItemText, i === selectedValue && styles.selectedItemText]}>
                  {String(i).padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.selectionIndicator}/>
        </View>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <WheelPicker
        items={Array.from({ length: 100 }, (_, i) => i)}
        selectedValue={safeH}
        onValueChange={h => onChange({ hours: h, minutes: safeM, seconds: safeS })}
        label="Hours"
      />
      <Text style={styles.sep}>:</Text>
      <WheelPicker
        items={Array.from({ length: 60 }, (_, i) => i)}
        selectedValue={safeM}
        onValueChange={m => onChange({ hours: safeH, minutes: m, seconds: safeS })}
        label="Minutes"
      />
      <Text style={styles.sep}>:</Text>
      <WheelPicker
        items={Array.from({ length: 60 }, (_, i) => i)}
        selectedValue={safeS}
        onValueChange={s => onChange({ hours: safeH, minutes: safeM, seconds: s })}
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
  },
  sep: {
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
});

export default TimePicker;
