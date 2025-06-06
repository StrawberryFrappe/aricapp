import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { commonStyles, colors, spacing } from '../styles/commonStyles';
import { Ionicons, MaterialIcons, FontAwesome5, Entypo } from '@expo/vector-icons';

const CreateTask = ({ visible, onClose }) => {
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollViewContent}>
        {/* Title Input */}
        <View style={styles.row}>            
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />
          <TouchableOpacity>
            <Entypo name="emoji-happy" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        {/* Class & Strict Mode Row */}
        <View style={styles.itemRow}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Class</Text>
            <TouchableOpacity style={styles.classPickerBox} onPress={() => setShowClassList(prev => !prev)}>
              <Text style={styles.classPickerText}>{selectedClass}</Text>
              <Ionicons name={showClassList ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            {showClassList && (
              <View style={styles.classList}>
                {['Travel','Work','Social'].map(item => (
                  <TouchableOpacity key={item} style={styles.classListItem} onPress={() => { setSelectedClass(item); setShowClassList(false); }}>
                    <Text style={styles.classListItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Strict mode</Text>
            <Switch
              value={strictMode}
              onValueChange={setStrictMode}
              thumbColor={strictMode ? colors.primary : colors.surface}
              trackColor={{ true: colors.primaryLight, false: colors.borderLight }}
            />
          </View>
        </View>
        <View style={styles.separator} />
        {/* Date and Time Pickers */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Date</Text>
        </View>
        <View style={styles.rangeRow}>
          <TouchableOpacity style={styles.rangeItem} onPress={() => setShowStartDatePicker(true)}>
            <Text style={styles.itemText}>{startDate.toDateString()}</Text>
          </TouchableOpacity>
          <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
          <TouchableOpacity style={styles.rangeItem} onPress={() => setShowEndDatePicker(true)}>
            <Text style={styles.itemText}>{endDate.toDateString()}</Text>
          </TouchableOpacity>
        </View>
        {showStartDatePicker && (
          <DateTimePicker value={startDate} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(e, d) => { setShowStartDatePicker(false); if (d) { setStartDate(d); if (d > endDate) setEndDate(new Date(d.getTime() + 3600000)); } }} />
        )}
        {showEndDatePicker && (
          <DateTimePicker value={endDate} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(e, d) => { setShowEndDatePicker(false); if (d) { if (d < startDate) setEndDate(startDate); else setEndDate(d); } }} />
        )}
        <View style={styles.separator} />
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Time</Text>
        </View>
        <View style={styles.rangeRow}>
          <TouchableOpacity style={styles.rangeItem} onPress={() => setShowStartTimePicker(true)}>
            <Text style={styles.timeText}>{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
          <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
          <TouchableOpacity style={styles.rangeItem} onPress={() => setShowEndTimePicker(true)}>
            <Text style={styles.timeText}>{endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
        </View>
        {showStartTimePicker && (
          <DateTimePicker value={startDate} mode="time" is24Hour display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(e, d) => { setShowStartTimePicker(false); if (d) { const newStart = new Date(startDate); newStart.setHours(d.getHours(), d.getMinutes()); setStartDate(newStart); if (newStart > endDate) setEndDate(new Date(newStart.getTime() + 3600000)); } }} />
        )}
        {showEndTimePicker && (
          <DateTimePicker value={endDate} mode="time" is24Hour display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(e, d) => { setShowEndTimePicker(false); if (d) { const newEnd = new Date(endDate); newEnd.setHours(d.getHours(), d.getMinutes()); if (newEnd < startDate) setEndDate(startDate); else setEndDate(newEnd); } }} />
        )}
        <View style={styles.separator} />
        {/* Reminder Row with overlay dropdown */}
        <View style={styles.itemRow}>
          <Text style={styles.itemText}>Reminder</Text>
          <View style={styles.fieldContainer}>
            <TouchableOpacity style={styles.dropdownBox} onPress={() => setShowReminderList(prev => !prev)}>
              <Text style={styles.dropdownText}>{selectedReminder}</Text>
              <Ionicons name={showReminderList ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            {showReminderList && (
              <View style={styles.dropdownList}>
                {['10 minutes before','30 minutes before','1 hour before','1 day before'].map(rem => (
                  <TouchableOpacity key={rem} style={styles.dropdownItem} onPress={() => { setSelectedReminder(rem); setShowReminderList(false); }}>
                    <Text style={styles.dropdownItemText}>{rem}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        <View style={styles.separator} />
        {/* Repeat Row with overlay dropdown */}
        <View style={styles.itemRow}>
          <Text style={styles.itemText}>Repeat</Text>
          <View style={styles.fieldContainer}>
            <TouchableOpacity style={styles.dropdownBox} onPress={() => setShowRepeatList(prev => !prev)}>
              <Text style={styles.dropdownText}>{selectedRepeat}</Text>
              <Ionicons name={showRepeatList ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            {showRepeatList && (
              <View style={styles.dropdownList}>
                {[`Doesn't repeat`,'Daily','Weekly','Monthly','Yearly'].map(rep => (
                  <TouchableOpacity key={rep} style={styles.dropdownItem} onPress={() => { setSelectedRepeat(rep); setShowRepeatList(false); }}>
                    <Text style={styles.dropdownItemText}>{rep}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        <View style={styles.separator} />
      </ScrollView>
      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={onClose}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingTop: spacing.md,
  },
  scrollViewContent: {
    flex: 1,
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
    marginRight: spacing.md,
  },
  classPickerText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
  },
  classList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    overflow: 'hidden',
  },
  classListItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  classListItemText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  titleInput: {
    flex: 1,
    fontSize: 22,
    color: colors.textPrimary,
    marginVertical: spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,   // reduced spacing
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,  // reduced spacing
    paddingHorizontal: spacing.md,
    marginVertical: spacing.xs,   // reduced spacing
  },
  itemText: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.textPrimary,
    fontSize: 16,
  },
  timeText: {
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    paddingVertical: spacing.md,
  },
  cancelButton: {
    padding: spacing.md,
  },
  cancelText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  saveButton: {
    padding: spacing.md,
  },
  saveText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  classRowRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  strictModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    alignItems: 'flex-end',
  },
  strictModeText: {
    color: colors.textPrimary,
    marginRight: spacing.sm,
    fontSize: 16,
  },
  dropdownBox: {
    flexDirection: 'row', alignItems: 'center', borderWidth:1, borderColor:colors.borderLight,
    borderRadius:8, paddingHorizontal:spacing.md, paddingVertical:spacing.sm,
    flex:1, marginLeft:spacing.md
  },
  dropdownText: { flex:1, color:colors.textPrimary, fontSize:16 },
  dropdownList: {
    position: 'absolute',
    zIndex: 999,
    backgroundColor: colors.surfaceLight,
    marginHorizontal: spacing.md,
    borderRadius: 8,
    overflow: 'hidden',
  },
  dropdownItem: { paddingVertical:spacing.sm, paddingHorizontal:spacing.md },
  dropdownItemText: { fontSize:16, color:colors.textPrimary },
  fieldContainer: { flex:1, position: 'relative' },
  fieldLabel: { fontSize:14, color:colors.textSecondary, marginBottom:spacing.xs },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,    // reduced spacing
  },
  rangeItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,  // slight vertical padding
  },
});

export default CreateTask;