import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { commonStyles, spacing } from '../styles/commonStyles';
import { Ionicons, MaterialIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import { useThemedStyles } from '../hooks/useThemedStyles';

const CreateTask = ({ visible, onClose }) => {
  const { colors } = useThemedStyles();
  
  // Dynamic styles based on current theme
  const dynamicStyles = {
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    scrollViewContent: {
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    titleInput: {
      flex: 1,
      fontSize: 22,
      color: colors.textPrimary,
      paddingVertical: spacing.sm,
    },
    separator: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginHorizontal: spacing.md,
      marginVertical: spacing.sm,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      marginVertical: spacing.xs,
    },
    fieldContainer: { 
      flex: 1, 
      position: 'relative' 
    },
    fieldLabel: { 
      fontSize: 14, 
      color: colors.textSecondary, 
      marginBottom: spacing.xs,
      paddingHorizontal: spacing.md,
    },
    classPickerBox: {
      flexDirection: 'row', 
      alignItems: 'center', 
      borderWidth: 1, 
      borderColor: colors.borderLight,
      borderRadius: 8, 
      paddingHorizontal: spacing.md, 
      paddingVertical: spacing.sm,
      flex: 1, 
      marginLeft: spacing.md,
    },
    classPickerText: { 
      flex: 1, 
      color: colors.textPrimary, 
      fontSize: 16 
    },
    strictModeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: spacing.md,
    },
    strictModeText: {
      color: colors.textPrimary,
      fontSize: 16,
      marginRight: spacing.sm,
    },
    reminderContainer: {
      marginBottom: spacing.sm,
    },
    timePickerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    timePickerItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.xs,
    },
    timePickerLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    timePickerButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: 8,
    },
    timePickerText: {
      color: colors.textPrimary,
      fontSize: 16,
      textAlign: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: spacing.md,
      paddingVertical: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    cancelButton: {
      padding: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    cancelText: {
      color: colors.textPrimary,
      fontSize: 16,
    },
    saveButton: {
      padding: spacing.md,
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.primary,
      borderRadius: 8,
    },
    saveText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
  };
  
  const [title, setTitle] = useState('');
  const [strictMode, setStrictMode] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Travel');
  const [showClassList, setShowClassList] = useState(false);
  
  const [selectedReminder, setSelectedReminder] = useState('10 minutes before');
  const [showReminderList, setShowReminderList] = useState(false);
  const [selectedRepeat, setSelectedRepeat] = useState("Doesn't repeat");
  const [showRepeatList, setShowRepeatList] = useState(false);
  // Start and End date/time
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3600000)); // default +1h
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const now = new Date();
  

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView style={dynamicStyles.scrollViewContent}>
        {/* Title Input */}
        <View style={dynamicStyles.row}>            
          <TextInput
            style={dynamicStyles.titleInput}
            placeholder="Title"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />
          <TouchableOpacity>
            <Entypo name="emoji-happy" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={dynamicStyles.separator} />
        {/* Class & Strict Mode Row */}
        <View style={dynamicStyles.itemRow}>
          <View style={dynamicStyles.fieldContainer}>
            <Text style={dynamicStyles.fieldLabel}>Class</Text>
            <TouchableOpacity style={dynamicStyles.classPickerBox} onPress={() => setShowClassList(prev => !prev)}>
              <Text style={dynamicStyles.classPickerText}>{selectedClass}</Text>
              <Ionicons name={showClassList ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            {showClassList && (
              <View style={dynamicStyles.classList}>
                {['Travel','Work','Social'].map(item => (
                  <TouchableOpacity key={item} style={dynamicStyles.classListItem} onPress={() => { setSelectedClass(item); setShowClassList(false); }}>
                    <Text style={dynamicStyles.classListItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={dynamicStyles.fieldContainer}>
            <Text style={dynamicStyles.fieldLabel}>Strict mode</Text>
            <Switch
              value={strictMode}
              onValueChange={setStrictMode}
              thumbColor={strictMode ? colors.primary : colors.surface}
              trackColor={{ true: colors.primaryLight, false: colors.borderLight }}
            />
          </View>
        </View>
        <View style={dynamicStyles.separator} />
        {/* Date and Time Pickers */}
        <View style={dynamicStyles.fieldContainer}>
          <Text style={dynamicStyles.fieldLabel}>Date</Text>
        </View>
        <View style={dynamicStyles.rangeRow}>
          <TouchableOpacity style={dynamicStyles.rangeItem} onPress={() => setShowStartDatePicker(true)}>
            <Text style={dynamicStyles.itemText}>{startDate.toDateString()}</Text>
          </TouchableOpacity>
          <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
          <TouchableOpacity style={dynamicStyles.rangeItem} onPress={() => setShowEndDatePicker(true)}>
            <Text style={dynamicStyles.itemText}>{endDate.toDateString()}</Text>
          </TouchableOpacity>
        </View>
        {showStartDatePicker && (
          <DateTimePicker value={startDate} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(e, d) => { setShowStartDatePicker(false); if (d) { setStartDate(d); if (d > endDate) setEndDate(new Date(d.getTime() + 3600000)); } }} />
        )}
        {showEndDatePicker && (
          <DateTimePicker value={endDate} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(e, d) => { setShowEndDatePicker(false); if (d) { if (d < startDate) setEndDate(startDate); else setEndDate(d); } }} />
        )}
        <View style={dynamicStyles.separator} />
        <View style={dynamicStyles.fieldContainer}>
          <Text style={dynamicStyles.fieldLabel}>Time</Text>
        </View>
        <View style={dynamicStyles.rangeRow}>
          <TouchableOpacity style={dynamicStyles.rangeItem} onPress={() => setShowStartTimePicker(true)}>
            <Text style={dynamicStyles.timeText}>{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
          <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
          <TouchableOpacity style={dynamicStyles.rangeItem} onPress={() => setShowEndTimePicker(true)}>
            <Text style={dynamicStyles.timeText}>{endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
        </View>
        {showStartTimePicker && (
          <DateTimePicker value={startDate} mode="time" is24Hour display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(e, d) => { setShowStartTimePicker(false); if (d) { const newStart = new Date(startDate); newStart.setHours(d.getHours(), d.getMinutes()); setStartDate(newStart); if (newStart > endDate) setEndDate(new Date(newStart.getTime() + 3600000)); } }} />
        )}
        {showEndTimePicker && (
          <DateTimePicker value={endDate} mode="time" is24Hour display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(e, d) => { setShowEndTimePicker(false); if (d) { const newEnd = new Date(endDate); newEnd.setHours(d.getHours(), d.getMinutes()); if (newEnd < startDate) setEndDate(startDate); else setEndDate(newEnd); } }} />
        )}
        <View style={dynamicStyles.separator} />
        {/* Reminder Row with overlay dropdown */}
        <View style={dynamicStyles.itemRow}>
          <Text style={dynamicStyles.itemText}>Reminder</Text>
          <View style={dynamicStyles.fieldContainer}>
            <TouchableOpacity style={dynamicStyles.dropdownBox} onPress={() => setShowReminderList(prev => !prev)}>
              <Text style={dynamicStyles.dropdownText}>{selectedReminder}</Text>
              <Ionicons name={showReminderList ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            {showReminderList && (
              <View style={dynamicStyles.dropdownList}>
                {['10 minutes before','30 minutes before','1 hour before','1 day before'].map(rem => (
                  <TouchableOpacity key={rem} style={dynamicStyles.dropdownItem} onPress={() => { setSelectedReminder(rem); setShowReminderList(false); }}>
                    <Text style={dynamicStyles.dropdownItemText}>{rem}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        <View style={dynamicStyles.separator} />
        {/* Repeat Row with overlay dropdown */}
        <View style={dynamicStyles.itemRow}>
          <Text style={dynamicStyles.itemText}>Repeat</Text>
          <View style={dynamicStyles.fieldContainer}>
            <TouchableOpacity style={dynamicStyles.dropdownBox} onPress={() => setShowRepeatList(prev => !prev)}>
              <Text style={dynamicStyles.dropdownText}>{selectedRepeat}</Text>
              <Ionicons name={showRepeatList ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            {showRepeatList && (
              <View style={dynamicStyles.dropdownList}>
                {[`Doesn't repeat`,'Daily','Weekly','Monthly','Yearly'].map(rep => (
                  <TouchableOpacity key={rep} style={dynamicStyles.dropdownItem} onPress={() => { setSelectedRepeat(rep); setShowRepeatList(false); }}>
                    <Text style={dynamicStyles.dropdownItemText}>{rep}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        <View style={dynamicStyles.separator} />
      </ScrollView>
      {/* Action Buttons */}
      <View style={dynamicStyles.buttonRow}>
        <TouchableOpacity style={dynamicStyles.cancelButton} onPress={onClose}>
          <Text style={dynamicStyles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.saveButton} onPress={onClose}>
          <Text style={dynamicStyles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default CreateTask;
