import { StyleSheet } from 'react-native';

/**
 * Common Styles
 * This file contains reusable styles that are used across multiple components and screens.
 * It helps maintain consistency and reduces code duplication.
 */

// Color palette - Dark Theme with Techie Vibes (Base Palette Preserved)
export const colors = {
  // Base Palette (Flag-Derived) - Adapted for Dark Theme
  primary: '#7BCFF3',          // Cyber Blue - Main interactive elements (was Sky Blue)
  secondary: '#FFDB17',        // Electric Yellow - Secondary actions or highlights
  accent: '#4D3089',           // Deep Purple - Accents, buttons, highlights (was primary)
  highlight: '#F7AEC4',        // Neon Pink - Special highlights, notifications
  background: '#0A0A0F',       // Deep Space Black - Main app background

  // Adapted Primary & Related - Dark Theme
  primaryLight: '#A3E0FF',     // Light Cyber Blue - For tags, less emphasized primary elements
  primaryDark: '#2B8CB8',      // Darker Blue - For pressed states, depth

  // Dark Theme Text Colors
  surface: '#1A1A2E',          // Dark Navy Surface - Background for cards, inputs
  surfaceLight: '#16213E',     // Lighter Surface - Alternative card backgrounds
  textPrimary: '#E8E8E8',      // Light Gray - Default text color (high contrast)
  textSecondary: '#B0B0B0',    // Medium Gray - Subdued text, placeholders
  textMuted: '#6A6A6A',        // Darker Gray - More subdued text, disabled text
  white: '#FFFFFF',            // Pure white - For high emphasis text
  black: '#000000',            // Pure black - For shadows, deep backgrounds

  // Dark Theme Border & Separator Colors
  borderLight: '#2A2A3E',      // Dark Purple-Gray - Subtle borders, dividers
  borderDefault: '#3A3A5E',    // Medium Purple-Gray - More prominent borders
  borderBright: '#4A4A7E',     // Brighter Border - For focus states, active elements

  // Dark Theme State & Semantic Colors
  disabledBackground: '#1E1E1E', // Very Dark Gray - Background for disabled elements
  disabledText: '#4A4A4A',     // Dark Gray - Text color for disabled elements
  error: '#FF4444',            // Bright Red - Error messages, destructive actions
  success: '#00FF88',          // Bright Green - Success states, confirmations
  warning: '#FFAA00',          // Orange Warning - Warning states
  
  // Semantic Colors - Enhanced for Dark Theme
  semanticBlue: '#4A90E2',     // Tech Blue - Specific use (e.g., public mediation cards)
  semanticOrange: '#FF8C42',   // Tech Orange - Specific use (e.g., private mediation cards)
  semanticPurple: '#8B5CF6',   // Tech Purple - Additional semantic color
  
  // Matrix/Hacker Theme Accents
  matrix: '#00FF41',           // Matrix Green - For special tech indicators
  neon: '#FF0080',            // Hot Pink - For ultra-bright highlights
  
  // Legacy aliases - Updated for dark theme
  border: '#3A3A5E',           // Alias for borderDefault
  tagBackground: '#A3E0FF',    // Alias for primaryLight
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
