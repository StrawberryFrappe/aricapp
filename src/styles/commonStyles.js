import { StyleSheet } from 'react-native';

/**
 * Common Styles
 * This file contains reusable styles that are used across multiple components and screens.
 * It helps maintain consistency and reduces code duplication.
 */

// Color palette - Updated with Flag-Derived Palette
export const colors = {
  // Base Palette (Flag-Derived)
  primary: '#4D3089',          // Deep Purple - Main interactive elements
  secondary: '#FFDB17',        // Yellow - Secondary actions or highlights
  accent: '#7BCFF3',           // Sky Blue - Accents, informational elements
  highlight: '#F7AEC4',        // Pastel Pink - Special highlights (replaces old highlight)
  background: '#FFFFFF',        // White - Main app background (unchanged)

  // Adapted Primary & Related
  primaryLight: '#9B85C7',      // Lighter Purple - For tags, less emphasized primary elements

  // Adapted Neutral & Text Colors
  surface: '#F5F3F9',           // Very Light Lavender Gray - Background for cards, inputs
  textPrimary: '#212121',       // Near Black - Default text color
  textSecondary: '#757575',     // Medium Gray - Subdued text, placeholders
  textMuted: '#BDBDBD',         // Light Gray - More subdued text
  white: '#FFFFFF',             // Pure white (unchanged)
  black: '#000000',             // Pure black (unchanged for shadows or strong emphasis)

  // Adapted Border & Separator Colors
  borderLight: '#DCDAE3',       // Light Purple-Gray - Standard light borders, dividers
  borderDefault: '#BDB0D6',     // Muted Purple-Gray - More prominent borders

  // Adapted State & Semantic Colors
  disabledBackground: '#EEEEEE',// Light Gray - Background for disabled elements
  disabledText: '#BDBDBD',      // Medium Gray - Text color for disabled elements
  error: '#E53935',             // Material Design Red 600 - Destructive actions, error messages
  
  semanticBlue: '#A9D9F5',      // Harmonizing Blue - Specific use (e.g., public mediation cards)
  semanticOrange: '#FFB74D',   // Harmonizing Orange - Specific use (e.g., private mediation cards)
  
  // Legacy aliases - values will reflect the new definitions above
  border: '#BDB0D6',            // Alias for new borderDefault
  tagBackground: '#9B85C7',     // Alias for new primaryLight
  // Note: The original 'highlight: #007AFF' is now part of the base palette.
};

// Common style objects
export const commonStyles = StyleSheet.create({
  // Container styles
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Card styles
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 15,
    margin: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  // Shadow styles
  shadowSmall: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },

  shadowMedium: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Text styles
  titleText: {
    fontSize: 20,
    color: colors.textPrimary,
  },

  bodyText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },

  smallText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  boldText: {
    fontWeight: 'bold',
  },

  // Icon styles
  iconSmall: {
    fontSize: 16,
  },

  iconMedium: {
    fontSize: 20,
    color: colors.black,
  },

  iconLarge: {
    fontSize: 30,
    color: colors.black,
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
    backgroundColor: colors.primary,
    borderRadius: 15,
  },

  // Border styles
  topBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
    backgroundColor: colors.tagBackground,
  },

  tagText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 12,
  },

  // Navigation styles
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 80,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    backgroundColor: colors.primary,
  },
});

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

export default commonStyles;
