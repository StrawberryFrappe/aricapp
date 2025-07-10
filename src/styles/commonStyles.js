import { StyleSheet } from 'react-native';
import { colors } from './themes';

/**
 * Common Styles
 * This file contains reusable styles that are used across multiple components and screens.
 * It helps maintain consistency and reduces code duplication.
 */

// Function to create styles with custom colors
export const createStyles = (themeColors) => StyleSheet.create({
  // Container styles
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    // Card styles
  card: {
    backgroundColor: themeColors.surface,
    borderRadius: 8,
    padding: 15,
    margin: 10,
    shadowColor: themeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
    borderColor: themeColors.borderLight,
  },

  // Enhanced card for dark theme
  cardTech: {
    backgroundColor: themeColors.surfaceLight,
    borderRadius: 12,
    padding: 15,
    margin: 10,
    shadowColor: themeColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: themeColors.borderBright,
  },

  // Shadow styles - Enhanced for dark theme
  shadowSmall: {
    shadowColor: themeColors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },

  shadowMedium: {
    shadowColor: themeColors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },

  shadowLarge: {
    shadowColor: themeColors.accent,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
  },

  // Neon glow effect for techie vibes
  neonGlow: {
    shadowColor: themeColors.matrix || themeColors.accent,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 15,
  },

  // Text styles
  titleText: {
    fontSize: 20,
    color: themeColors.textPrimary,
  },

  bodyText: {
    fontSize: 14,
    color: themeColors.textPrimary,
    lineHeight: 20,
  },

  smallText: {
    fontSize: 12,
    color: themeColors.textSecondary,
  },

  boldText: {
    fontWeight: 'bold',
  },

  // Icon styles - Enhanced for dark theme
  iconSmall: {
    fontSize: 16,
    color: themeColors.textSecondary,
  },

  iconMedium: {
    fontSize: 20,
    color: themeColors.textPrimary,
  },

  iconLarge: {
    fontSize: 30,
    color: themeColors.primary,
  },

  // Tech-style icons
  iconTech: {
    fontSize: 24,
    color: themeColors.matrix || themeColors.primary,
  },

  iconNeon: {
    fontSize: 28,
    color: themeColors.neon || themeColors.accent,
  },

  // Avatar styles
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  avatarBig: {
    width: 150,
    height: 150,
    borderRadius: 200,
  },

  // Button and interactive elements
  activeBackground: {
    backgroundColor: themeColors.primary,
    borderRadius: 15,
  },

  // Border styles
  topBorder: {
    borderTopWidth: 1,
    borderTopColor: themeColors.border,
  },

  // Layout helpers
  row: {
    flexDirection: 'row',
  },

  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spaceBetween: {
    justifyContent: 'space-between',
  },

  spaceAround: {
    justifyContent: 'space-around',
  },

  // Margin and padding helpers
  marginSmall: {
    margin: 5,
  },

  marginMedium: {
    margin: 10,
  },

  paddingSmall: {
    padding: 5,
  },

  paddingMedium: {
    padding: 10,
  },

  paddingLarge: {
    padding: 15,
  },

  // Tag styles
  tag: {
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    backgroundColor: themeColors.tagBackground,
  },

  tagText: {
    color: themeColors.textPrimary,
    fontWeight: 'bold',
    fontSize: 12,
  },

  // Navigation styles - Dark theme
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: themeColors.surface,
    borderTopWidth: 2,
    borderTopColor: themeColors.borderBright,
    height: 80,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: themeColors.primary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },

  // Icon container styles
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },

  iconContainerSmall: {
    width: 50,
    height: 30,
    marginBottom: 2,
  },

  iconContainerLarge: {
    width: 60,
    height: 60,
    backgroundColor: themeColors.primary,
  },

  // Tech-themed additions for dark theme
  techContainer: {
    backgroundColor: themeColors.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: themeColors.primary,
  },

  glassEffect: {
    backgroundColor: 'rgba(123, 207, 243, 0.1)', // Semi-transparent primary
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(123, 207, 243, 0.3)',
    backdropFilter: 'blur(10px)',
  },

  matrixText: {
    color: themeColors.matrix || themeColors.primary,
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },

  neonBorder: {
    borderWidth: 2,
    borderColor: themeColors.neon || themeColors.accent,
    borderRadius: 8,
  },

  techButton: {
    backgroundColor: themeColors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: themeColors.primary,
    shadowColor: themeColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },

  techButtonText: {
    color: themeColors.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Container styles
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },

  // Calendar Header styles
  headerContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  navButton: {
    padding: 10,
    minWidth: 44,
    alignItems: 'center',
    borderRadius: 8,
  },
  navText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleButton: {
    alignItems: 'center',
    marginBottom: 2,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themeColors.textPrimary,
  },
  actionButtons: {
    alignItems: 'center',
    gap: 5,
  },

  // Common button styles
  button: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Text styles
  text: {
    color: themeColors.textPrimary,
  },

  // MonthGrid styles
  monthGridHeader: {
    marginBottom: 5,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.borderDefault + '30',
  },
  dayOfWeekContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
  },
  dayOfWeekText: {
    fontSize: 14,
    color: themeColors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flexDirection: 'column',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: themeColors.borderDefault,
    paddingVertical: 5,
    alignSelf: 'stretch',
  },
  weekRow: {
    marginBottom: 2,
    paddingHorizontal: 2,
  },
  gridInfo: {
    alignItems: 'center',
    paddingVertical: 2,
  },

  // DayCell styles
  dayContainer: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
    margin: 1,
    borderRadius: 8,
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    color: themeColors.textPrimary,
    fontWeight: '500',
  },
  eventIndicatorContainer: {
    position: 'absolute',
    bottom: 4,
    alignItems: 'center',
  },
  eventIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  multipleEventsIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventCount: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  // EventsList styles
  eventsHeader: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.borderDefault + '30',
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  categorySection: {
    marginBottom: 15,
  },
  categoryHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: themeColors.textSecondary,
    marginHorizontal: 10,
    marginVertical: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventsSection: {
    paddingTop: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },

  // EventCard styles
  eventCardContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIndicator: {
    width: 4,
  },
  eventCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  mainContent: {
    flex: 1,
  },
  timeSection: {
    alignItems: 'center',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: themeColors.textSecondary,
    fontWeight: '600',
    marginRight: 5,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventDetails: {
    marginBottom: 2,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  descriptionText: {
    fontSize: 12,
    lineHeight: 16,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  quickActions: {
    marginLeft: 5,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  // EditEvent styles
  editEventHeader: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.borderDefault + '30',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  editEventContent: {
    flex: 1,
  },
  eventInfoSection: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.borderDefault + '30',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  eventDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 5,
  },
  eventMeta: {
    marginTop: 5,
  },
  eventMetaText: {
    fontSize: 14,
    marginBottom: 2,
  },
  bulkSection: {
    padding: 10,
  },
  bulkControls: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bulkControlButton: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: themeColors.surface,
    borderRadius: 8,
  },
  actionsSection: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: themeColors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: themeColors.surface,
    borderRadius: 12,
    marginBottom: 5,
  },
  actionButtonContent: {
    alignItems: 'center',
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  separator: {
    height: 1,
    marginVertical: 10,
  },

  // DatePicker styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerModal: {
    borderRadius: 16,
    padding: 15,
    margin: 15,
    width: '85%',
    maxHeight: '80%',
  },
  datePickerHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateDisplay: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: themeColors.primary + '10',
    borderRadius: 12,
  },
  selectedDateText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectors: {
    marginBottom: 20,
    gap: 10,
  },
  selector: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  selectorLabel: {
    fontSize: 12,
    color: themeColors.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  selectorValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActions: {
    gap: 10,
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
    borderRadius: 12,
    padding: 15,
    width: '80%',
    maxHeight: '60%',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  pickerScroll: {
    maxHeight: 200,
  },
  pickerItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 2,
  },
});

// Create backward-compatible commonStyles using default colors
export const commonStyles = createStyles(colors);

// Commonly used spacing values
export const spacing = {
  xs: 2,
  sm: 5,
  md: 10,
  lg: 15,
  xl: 20,
  xxl: 30,
};

// Commonly used border radius values
export const borderRadius = {
  small: 8,
  medium: 15,
  large: 20,
};

// Re-export colors for backward compatibility
export { colors };
