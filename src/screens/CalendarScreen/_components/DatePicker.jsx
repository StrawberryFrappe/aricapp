/**
 * Date Picker Component
 * 
 * Quick date selection with year/month dropdowns and calendar integration.
 * Allows rapid navigation to specific dates without month-by-month navigation.
 * 
 * @component DatePicker
 */

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useCalendar } from '../../../hooks/useCalendar';

const DatePicker = ({ 
  isVisible, 
  onClose, 
  onDateSelect,
  initialDate = null 
}) => {
  const { styles, colors } = useThemedStyles();
  const { navigateToDate, viewState, dateUtils } = useCalendar();
  
  // Parse initial date or use current view date
  const getCurrentDate = () => {
    const dateStr = initialDate || viewState.currentDate;
    return new Date(dateStr.split('T')[0]);
  };

  const [selectedDate, setSelectedDate] = useState(getCurrentDate);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Generate year range (current year ± 10 years)
  const yearRange = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
      years.push(year);
    }
    return years;
  }, []);

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleYearSelect = (year) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    setSelectedDate(newDate);
    setShowYearPicker(false);
  };

  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(monthIndex);
    setSelectedDate(newDate);
    setShowMonthPicker(false);
  };

  const handleConfirm = () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    
    if (onDateSelect) {
      onDateSelect(dateString);
    }
    
    navigateToDate(dateString);
    onClose();
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    
    const todayString = today.toISOString().split('T')[0];
    if (onDateSelect) {
      onDateSelect(todayString);
    }
    
    navigateToDate(todayString);
    onClose();
  };

  const formatSelectedDate = () => {
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.card, styles.datePickerModal]}>
          {/* Header */}
          <View style={[styles.row, styles.spaceBetween, styles.datePickerHeader]}>
            <Text style={[styles.text, styles.datePickerTitle]}>Select Date</Text>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={[styles.text, { fontSize: 24 }]}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Date Display */}
          <View style={styles.dateDisplay}>
            <Text style={[styles.text, styles.selectedDateText]}>
              {formatSelectedDate()}
            </Text>
          </View>

          {/* Year and Month Selectors */}
          <View style={[styles.row, styles.selectors]}>
            <TouchableOpacity
              style={[styles.card, styles.selector]}
              onPress={() => setShowYearPicker(true)}
            >
              <Text style={[styles.smallText, styles.selectorLabel]}>Year</Text>
              <Text style={[styles.text, styles.selectorValue]}>{selectedDate.getFullYear()}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, styles.selector]}
              onPress={() => setShowMonthPicker(true)}
            >
              <Text style={[styles.smallText, styles.selectorLabel]}>Month</Text>
              <Text style={[styles.text, styles.selectorValue]}>
                {monthNames[selectedDate.getMonth()]}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={[styles.row, styles.quickActions]}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.borderDefault + '30' }]}
              onPress={handleToday}
            >
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Today</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleConfirm}
            >
              <Text style={[styles.buttonText, { color: colors.white }]}>Go to Date</Text>
            </TouchableOpacity>
          </View>

          {/* Year Picker Modal */}
          {showYearPicker && (
            <View style={styles.pickerOverlay}>
              <View style={[styles.card, styles.pickerContent]}>
                <Text style={[styles.text, styles.pickerTitle]}>Select Year</Text>
                <ScrollView style={styles.pickerScroll}>
                  {yearRange.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.pickerItem,
                        year === selectedDate.getFullYear() && { backgroundColor: colors.primary + '20' }
                      ]}
                      onPress={() => handleYearSelect(year)}
                    >
                      <Text style={[
                        styles.text,
                        year === selectedDate.getFullYear() && { color: colors.primary, fontWeight: 'bold' }
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.borderDefault + '30' }]}
                  onPress={() => setShowYearPicker(false)}
                >
                  <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Month Picker Modal */}
          {showMonthPicker && (
            <View style={styles.pickerOverlay}>
              <View style={[styles.card, styles.pickerContent]}>
                <Text style={[styles.text, styles.pickerTitle]}>Select Month</Text>
                <ScrollView style={styles.pickerScroll}>
                  {monthNames.map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.pickerItem,
                        index === selectedDate.getMonth() && { backgroundColor: colors.primary + '20' }
                      ]}
                      onPress={() => handleMonthSelect(index)}
                    >
                      <Text style={[
                        styles.text,
                        index === selectedDate.getMonth() && { color: colors.primary, fontWeight: 'bold' }
                      ]}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.borderDefault + '30' }]}
                  onPress={() => setShowMonthPicker(false)}
                >
                  <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default DatePicker;
