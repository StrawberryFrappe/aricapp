/**
 * Date Picker Component
 * 
 * Quick date selection with year/month dropdowns and calendar integration.
 * Allows rapid navigation to specific dates without month-by-month navigation.
 * 
 * @component DatePicker
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { colors, spacing } from '../../../styles/commonStyles';
import { useCalendar } from '../../../hooks/useCalendar';

const DatePicker = ({ 
  isVisible, 
  onClose, 
  onDateSelect,
  initialDate = null 
}) => {
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
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Date</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Date Display */}
          <View style={styles.dateDisplay}>
            <Text style={styles.selectedDateText}>
              {formatSelectedDate()}
            </Text>
          </View>

          {/* Year and Month Selectors */}
          <View style={styles.selectors}>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowYearPicker(true)}
            >
              <Text style={styles.selectorLabel}>Year</Text>
              <Text style={styles.selectorValue}>{selectedDate.getFullYear()}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowMonthPicker(true)}
            >
              <Text style={styles.selectorLabel}>Month</Text>
              <Text style={styles.selectorValue}>
                {monthNames[selectedDate.getMonth()]}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.todayButton]}
              onPress={handleToday}
            >
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Go to Date</Text>
            </TouchableOpacity>
          </View>

          {/* Year Picker Modal */}
          {showYearPicker && (
            <View style={styles.pickerOverlay}>
              <View style={styles.pickerContent}>
                <Text style={styles.pickerTitle}>Select Year</Text>
                <ScrollView style={styles.pickerScroll}>
                  {yearRange.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.pickerItem,
                        year === selectedDate.getFullYear() && styles.selectedPickerItem
                      ]}
                      onPress={() => handleYearSelect(year)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        year === selectedDate.getFullYear() && styles.selectedPickerItemText
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.pickerCloseButton}
                  onPress={() => setShowYearPicker(false)}
                >
                  <Text style={styles.pickerCloseText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Month Picker Modal */}
          {showMonthPicker && (
            <View style={styles.pickerOverlay}>
              <View style={styles.pickerContent}>
                <Text style={styles.pickerTitle}>Select Month</Text>
                <ScrollView style={styles.pickerScroll}>
                  {monthNames.map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.pickerItem,
                        index === selectedDate.getMonth() && styles.selectedPickerItem
                      ]}
                      onPress={() => handleMonthSelect(index)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        index === selectedDate.getMonth() && styles.selectedPickerItemText
                      ]}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.pickerCloseButton}
                  onPress={() => setShowMonthPicker(false)}
                >
                  <Text style={styles.pickerCloseText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.lg,
    margin: spacing.lg,
    width: '85%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  dateDisplay: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
  },
  selectedDateText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectors: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  selector: {
    flex: 1,
    backgroundColor: colors.border + '20',
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
  },
  selectorLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  selectorValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  todayButton: {
    backgroundColor: colors.border + '30',
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  todayButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  confirmButtonText: {
    fontSize: 16,
    color: colors.background,
    fontWeight: '600',
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContent: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.lg,
    width: '80%',
    maxHeight: '60%',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  pickerScroll: {
    maxHeight: 200,
  },
  pickerItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    marginVertical: spacing.xs,
  },
  selectedPickerItem: {
    backgroundColor: colors.primary + '20',
  },
  pickerItemText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  selectedPickerItemText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  pickerCloseButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  pickerCloseText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});

export default DatePicker;
