/**
 * Edit Event Component
 * 
 * Full event editing modal with bulk operations support.
 * Provides comprehensive editing capabilities for calendar events.
 * 
 * @component EditEvent
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal,
  Alert,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';
import { useCalendarContext } from '../../../context/CalendarContext';
import CreateEvent from '../../../components/CreateEvent';

const EditEvent = ({ 
  visible, 
  onClose, 
  event = null,
  events = [] // For bulk operations
}) => {
  const { styles, colors } = useThemedStyles();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);

  const { updateEvent, deleteEvent } = useCalendarContext();

  useEffect(() => {
    if (visible && event) {
      setSelectedEvents([event.id]);
    } else {
      setSelectedEvents([]);
      setBulkMode(false);
    }
  }, [visible, event]);

  /**
   * Handle single event edit
   */
  const handleEditEvent = () => {
    setShowEditModal(true);
  };

  /**
   * Handle event deletion with confirmation
   */
  const handleDeleteEvent = () => {
    const eventCount = selectedEvents.length;
    const message = eventCount === 1 
      ? `Delete "${event?.title}"?`
      : `Delete ${eventCount} selected events?`;

    Alert.alert(
      'Delete Event' + (eventCount > 1 ? 's' : ''),
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: handleConfirmDelete
        }
      ]
    );
  };

  /**
   * Confirm deletion
   */
  const handleConfirmDelete = async () => {
    try {
      if (selectedEvents.length === 1) {
        await deleteEvent(selectedEvents[0]);
      } else {
        // Bulk delete
        await Promise.all(selectedEvents.map(id => deleteEvent(id)));
      }
      onClose();
    } catch (error) {
      console.error('Error deleting event(s):', error);
      Alert.alert('Error', 'Failed to delete event(s). Please try again.');
    }
  };

  /**
   * Handle event duplication
   */
  const handleDuplicateEvent = async () => {
    if (!event) return;

    try {
      const duplicatedEvent = {
        ...event,
        title: `${event.title} (Copy)`,
        id: undefined, // Will be auto-generated
        createdAt: undefined,
        updatedAt: undefined
      };

      // Use CreateEvent context method
      const { createEvent } = useCalendarContext();
      await createEvent(duplicatedEvent);
      
      onClose();
    } catch (error) {
      console.error('Error duplicating event:', error);
      Alert.alert('Error', 'Failed to duplicate event. Please try again.');
    }
  };

  /**
   * Handle moving event to different date
   */
  const handleMoveEvent = () => {
    // TODO: Implement date picker for moving events
    Alert.alert('Move Event', 'Date picker for moving events will be implemented in next phase.');
  };

  /**
   * Toggle bulk selection mode
   */
  const handleToggleBulkMode = () => {
    setBulkMode(!bulkMode);
    if (!bulkMode) {
      setSelectedEvents(event ? [event.id] : []);
    }
  };

  /**
   * Toggle event selection in bulk mode
   */
  const handleToggleEventSelection = (eventId) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  /**
   * Select all events
   */
  const handleSelectAll = () => {
    setSelectedEvents(events.map(e => e.id));
  };

  /**
   * Clear selection
   */
  const handleClearSelection = () => {
    setSelectedEvents([]);
  };

  if (!visible) return null;

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.row, styles.spaceBetween, styles.editEventHeader]}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.text, styles.headerTitle]}>
              {bulkMode ? `${selectedEvents.length} Selected` : 'Event Options'}
            </Text>
            {events.length > 1 && (
              <TouchableOpacity onPress={handleToggleBulkMode} style={styles.button}>
                <Text style={[styles.text, { color: colors.primary }]}>
                  {bulkMode ? 'Done' : 'Select'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.editEventContent}>
            {/* Event Info Section */}
            {!bulkMode && event && (
              <View style={styles.eventInfoSection}>
                <Text style={[styles.text, styles.eventTitle]}>{event.title}</Text>
                {event.description && (
                  <Text style={[styles.smallText, styles.eventDescription]}>{event.description}</Text>
                )}
                <View style={styles.eventMeta}>
                  <Text style={[styles.smallText, styles.eventMetaText]}>
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </Text>
                  <Text style={[styles.smallText, styles.eventMetaText]}>
                    Category: {event.category} • Priority: {event.priority}
                  </Text>
                </View>
              </View>
            )}

            {/* Bulk Selection Mode */}
            {bulkMode && (
              <View style={styles.bulkSection}>
                <View style={[styles.row, styles.bulkControls]}>
                  <TouchableOpacity onPress={handleSelectAll} style={[styles.button, styles.bulkControlButton]}>
                    <Text style={[styles.text, { color: colors.primary }]}>Select All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleClearSelection} style={[styles.button, styles.bulkControlButton]}>
                    <Text style={[styles.text, { color: colors.primary }]}>Clear</Text>
                  </TouchableOpacity>
                </View>

                {events.map(evt => (
                  <TouchableOpacity
                    key={evt.id}
                    style={[
                      styles.eventRow,
                      { backgroundColor: selectedEvents.includes(evt.id) ? colors.primary + '20' : 'transparent' }
                    ]}
                    onPress={() => handleToggleEventSelection(evt.id)}
                  >
                    <View style={styles.eventRowContent}>
                      <Text style={styles.eventRowTitle}>{evt.title}</Text>
                      <Text style={styles.eventRowMeta}>{evt.time}</Text>
                    </View>
                    {selectedEvents.includes(evt.id) && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Action Options */}
            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Actions</Text>

              {/* Edit Event */}
              <TouchableOpacity 
                style={[styles.row, styles.spaceBetween, styles.actionButton]} 
                onPress={handleEditEvent}
                disabled={bulkMode && selectedEvents.length !== 1}
              >
                <View style={[styles.row, styles.actionButtonContent]}>
                  <Ionicons name="create-outline" size={20} color={colors.primary} />
                  <Text style={[styles.text, styles.actionButtonText]}>Edit Event</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Duplicate Event */}
              {!bulkMode && (
                <TouchableOpacity style={[styles.row, styles.spaceBetween, styles.actionButton]} onPress={handleDuplicateEvent}>
                  <View style={[styles.row, styles.actionButtonContent]}>
                    <Ionicons name="copy-outline" size={20} color={colors.primary} />
                    <Text style={[styles.text, styles.actionButtonText]}>Duplicate Event</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              )}

              {/* Move Event */}
              <TouchableOpacity 
                style={[styles.row, styles.spaceBetween, styles.actionButton]} 
                onPress={handleMoveEvent}
                disabled={bulkMode && selectedEvents.length > 1}
              >
                <View style={[styles.row, styles.actionButtonContent]}>
                  <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                  <Text style={[styles.text, styles.actionButtonText]}>
                    {bulkMode && selectedEvents.length > 1 ? 'Move Events' : 'Move Event'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Separator */}
              <View style={[{ borderBottomWidth: 1, borderBottomColor: colors.borderDefault + '30' }, styles.separator]} />

              {/* Delete Event */}
              <TouchableOpacity 
                style={[styles.row, styles.spaceBetween, styles.actionButton]} 
                onPress={handleDeleteEvent}
                disabled={selectedEvents.length === 0}
              >
                <View style={[styles.row, styles.actionButtonContent]}>
                  <Ionicons name="trash-outline" size={20} color={colors.error} />
                  <Text style={[styles.text, { color: colors.error }]}>
                    Delete {selectedEvents.length > 1 ? 'Events' : 'Event'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowEditModal(false)}
      >
        <CreateEvent
          visible={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            onClose(); // Close parent modal too
          }}
          eventToEdit={event}
        />
      </Modal>
    </>
  );
};

export default EditEvent;
