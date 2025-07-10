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
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  Alert,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { colors, spacing } from '../../../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { useCalendarContext } from '../../../context/CalendarContext';
import CreateEvent from '../../../components/CreateEvent';

const EditEvent = ({ 
  visible, 
  onClose, 
  event = null,
  events = [] // For bulk operations
}) => {
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
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {bulkMode ? `${selectedEvents.length} Selected` : 'Event Options'}
            </Text>
            {events.length > 1 && (
              <TouchableOpacity onPress={handleToggleBulkMode} style={styles.bulkButton}>
                <Text style={styles.bulkButtonText}>
                  {bulkMode ? 'Done' : 'Select'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.content}>
            {/* Event Info Section */}
            {!bulkMode && event && (
              <View style={styles.eventInfoSection}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                {event.description && (
                  <Text style={styles.eventDescription}>{event.description}</Text>
                )}
                <View style={styles.eventMeta}>
                  <Text style={styles.eventMetaText}>
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </Text>
                  <Text style={styles.eventMetaText}>
                    Category: {event.category} • Priority: {event.priority}
                  </Text>
                </View>
              </View>
            )}

            {/* Bulk Selection Mode */}
            {bulkMode && (
              <View style={styles.bulkSection}>
                <View style={styles.bulkControls}>
                  <TouchableOpacity onPress={handleSelectAll} style={styles.bulkControlButton}>
                    <Text style={styles.bulkControlText}>Select All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleClearSelection} style={styles.bulkControlButton}>
                    <Text style={styles.bulkControlText}>Clear</Text>
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
                style={styles.actionButton} 
                onPress={handleEditEvent}
                disabled={bulkMode && selectedEvents.length !== 1}
              >
                <Ionicons name="create-outline" size={20} color={colors.primary} />
                <Text style={styles.actionButtonText}>Edit Event</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Duplicate Event */}
              {!bulkMode && (
                <TouchableOpacity style={styles.actionButton} onPress={handleDuplicateEvent}>
                  <Ionicons name="copy-outline" size={20} color={colors.primary} />
                  <Text style={styles.actionButtonText}>Duplicate Event</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              )}

              {/* Move Event */}
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleMoveEvent}
                disabled={bulkMode && selectedEvents.length > 1}
              >
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                <Text style={styles.actionButtonText}>
                  {bulkMode && selectedEvents.length > 1 ? 'Move Events' : 'Move Event'}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Separator */}
              <View style={styles.separator} />

              {/* Delete Event */}
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]} 
                onPress={handleDeleteEvent}
                disabled={selectedEvents.length === 0}
              >
                <Ionicons name="trash-outline" size={20} color={colors.semanticRed} />
                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                  Delete {selectedEvents.length > 1 ? 'Events' : 'Event'}
                </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '30',
  },
  closeButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  bulkButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  bulkButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  eventInfoSection: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '30',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  eventDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  eventMeta: {
    marginTop: spacing.sm,
  },
  eventMetaText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  bulkSection: {
    padding: spacing.md,
  },
  bulkControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  bulkControlButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  bulkControlText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  eventRowContent: {
    flex: 1,
  },
  eventRowTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  eventRowMeta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  actionsSection: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: spacing.md,
  },
  deleteButton: {
    backgroundColor: colors.semanticRed + '10',
  },
  deleteButtonText: {
    color: colors.semanticRed,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border + '30',
    marginVertical: spacing.md,
  },
});

export default EditEvent;
