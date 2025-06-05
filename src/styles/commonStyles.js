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
    lineHeight: 20,  },

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
    padding: 15,  },

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
