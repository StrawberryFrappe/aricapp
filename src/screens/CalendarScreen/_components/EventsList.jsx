/**
 * Events List Component
 * 
 * Daily events list with time sorting and category grouping.
 * Shows events for the selected date with filtering and organization.
 * 
 * @component EventsList
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing } from '../../../styles/commonStyles';
import { useCalendar } from '../../../hooks/useCalendar';
import EventCard from './EventCard';

const EventsList = ({ selectedDate = null, maxEvents = null }) => {
  const { 
    getEventsByDate, 
    viewState, 
    eventUtils,
    dateUtils 
  } = useCalendar();

  // Get events for the selected date or current selected date
  const targetDate = selectedDate || viewState.selectedDate || dateUtils.getToday();
  
  const events = useMemo(() => {
    if (!targetDate) return [];
    
    const dayEvents = getEventsByDate(targetDate);
    const sortedEvents = eventUtils.sortByDateTime(dayEvents);
    
    return maxEvents ? sortedEvents.slice(0, maxEvents) : sortedEvents;
  }, [targetDate, getEventsByDate, eventUtils, maxEvents]);

  // Group events by category
  const eventsByCategory = useMemo(() => {
    return eventUtils.groupByCategory(events);
  }, [events, eventUtils]);

  // Format the display date
  const displayDate = useMemo(() => {
    if (!targetDate) return '';
    
    const today = dateUtils.getToday();
    if (targetDate === today) return 'Today';
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    if (targetDate === tomorrowStr) return 'Tomorrow';
    
    return dateUtils.formatDate(targetDate);
  }, [targetDate, dateUtils]);

  const renderCategorySection = (category, categoryEvents) => (
    <View key={category} style={styles.categorySection}>
      <Text style={styles.categoryHeader}>{category}</Text>
      {categoryEvents.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          showDate={false} // Don't show date since we're in a date-specific list
        />
      ))}
    </View>
  );

  const renderAllEvents = () => (
    <View style={styles.eventsSection}>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          showDate={false}
        />
      ))}
    </View>
  );

  if (events.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.dateTitle}>{displayDate}</Text>
          <Text style={styles.eventCount}>No events</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No events scheduled</Text>
          <Text style={styles.emptyStateSubtext}>
            Tap + to add your first event
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dateTitle}>{displayDate}</Text>
        <Text style={styles.eventCount}>
          {events.length} event{events.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Events */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {Object.keys(eventsByCategory).length > 1 
          ? Object.entries(eventsByCategory).map(([category, categoryEvents]) =>
              renderCategorySection(category, categoryEvents)
            )
          : renderAllEvents()
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '30',
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  eventCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  categorySection: {
    marginBottom: spacing.lg,
  },
  categoryHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventsSection: {
    paddingTop: spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default EventsList;
