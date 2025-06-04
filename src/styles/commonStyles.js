import { StyleSheet } from 'react-native';

/**
 * Common Styles
 * This file contains reusable styles that are used across multiple components and screens.
 * It helps maintain consistency and reduces code duplication.
 */

// Color palette - Dark Theme with Techie Vibes (Base Palette Preserved)
export const colors = {
  // Sober, Elegant, Modern, Non-Binary Coded Palette
  primary: '#6C5DD3',          // Muted Violet (modern, non-binary, elegant)
  secondary: '#F5A623',        // Muted Amber (warm, inclusive, not gendered)
  accent: '#2D9CDB',           // Muted Blue (modern, fresh, not gendered)
  highlight: '#F2994A',        // Muted Orange (for highlights, not too flashy)
  background: '#181A20',       // Deep Charcoal (sober, elegant, modern)

  // Light and dark variants
  primaryLight: '#A393F7',     // Light Violet
  primaryDark: '#4834A6',      // Deep Violet

  // Text and surface
  surface: '#23242B',          // Slightly lighter than background for cards
  surfaceLight: '#262833',     // For subtle contrast
  textPrimary: '#F2F2F2',      // Almost white, high contrast
  textSecondary: '#BDBDBD',    // Muted gray for secondary text
  textMuted: '#828282',        // Even more muted for placeholders
  white: '#FFFFFF',            // For icons, highlights
  black: '#000000',            // For shadows

  // Borders and separators
  borderLight: '#35363C',      // Subtle border
  borderDefault: '#44454B',    // More prominent border
  borderBright: '#6C5DD3',     // Use primary for focus/active

  // State & semantic
  disabledBackground: '#23242B', // Slightly lighter than bg
  disabledText: '#828282',     // Muted gray
  error: '#EB5757',            // Muted red
  success: '#27AE60',          // Muted green
  warning: '#F2C94C',          // Muted yellow

  // Semantic (for cards, tags, etc.)
  semanticBlue: '#56CCF2',     // Soft blue
  semanticOrange: '#F2994A',   // Soft orange
  semanticPurple: '#BB6BD9',   // Soft purple

  // Modern accent
  teal: '#43E6C2',             // Modern teal accent
  pink: '#EB6F92',             // Muted pink accent

  // Legacy aliases
  border: '#44454B',           // Alias for borderDefault
  tagBackground: '#A393F7',    // Alias for primaryLight
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
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 15,
    margin: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  // Enhanced card for dark theme
  cardTech: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 15,
    margin: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: colors.borderBright,
  },
  // Shadow styles - Enhanced for dark theme
  shadowSmall: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },

  shadowMedium: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },

  shadowLarge: {
    shadowColor: colors.accent,
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
    shadowColor: colors.matrix,
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
  // Icon styles - Enhanced for dark theme
  iconSmall: {
    fontSize: 16,
    color: colors.textSecondary,
  },

  iconMedium: {
    fontSize: 20,
    color: colors.textPrimary,
  },

  iconLarge: {
    fontSize: 30,
    color: colors.primary,
  },

  // Tech-style icons
  iconTech: {
    fontSize: 24,
    color: colors.matrix,
  },

  iconNeon: {
    fontSize: 28,
    color: colors.neon,
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
  // Navigation styles - Dark theme
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopWidth: 2,
    borderTopColor: colors.borderBright,
    height: 80,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: colors.primary,
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
    backgroundColor: colors.primary,
  },

  // Tech-themed additions for dark theme
  techContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  glassEffect: {
    backgroundColor: 'rgba(123, 207, 243, 0.1)', // Semi-transparent primary
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(123, 207, 243, 0.3)',
    backdropFilter: 'blur(10px)',
  },

  matrixText: {
    color: colors.matrix,
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },

  neonBorder: {
    borderWidth: 2,
    borderColor: colors.neon,
    borderRadius: 8,
  },

  techButton: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },

  techButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
