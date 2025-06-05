/**
 * Themes Configuration
 * This file contains multiple color palettes for the application.
 * Each theme represents a complete color scheme with consistent styling.
 */

export const themes = {
  default: {
    name: 'Techie Dark',
    colors: {
      // Sober, Elegant, Modern, Non-Binary & Pansexual Coded Palette
      primary: '#6C5DD3',          // Muted Violet (modern, non-binary, elegant)
      secondary: '#F5A623',        // Muted Amber (warm, inclusive)
      accent: '#2D9CDB',           // Muted Blue (modern, fresh)
      highlight: '#F2994A',        // Muted Orange (for highlights)
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

      // Pansexual-coded semantic colors
      semanticPink: '#FF6CB7',     // Pansexual Pink (for cards, tags, etc.)
      semanticYellow: '#FFD952',   // Pansexual Yellow (for cards, tags, etc.)
      semanticBlue: '#3ECFFF',     // Pansexual Blue (for cards, tags, etc.)
      semanticPurple: '#BB6BD9',   // Soft purple (for harmony)

      // Modern accent
      teal: '#43E6C2',             // Modern teal accent
      pink: '#EB6F92',             // Muted pink accent

      // Legacy aliases
      border: '#44454B',           // Alias for borderDefault
      tagBackground: '#A393F7',    // Alias for primaryLight
    }
  },
  
  oceanic: {
    name: 'Ocean Breeze',
    colors: {
      primary: '#0077BE',          // Deep Ocean Blue
      secondary: '#00A8CC',        // Bright Cyan
      accent: '#40E0D0',           // Turquoise
      highlight: '#20B2AA',        // Light Sea Green
      background: '#0B1426',       // Deep Navy

      primaryLight: '#339FD1',     // Lighter Ocean Blue
      primaryDark: '#005A8B',      // Darker Ocean Blue

      surface: '#1A2F42',          // Dark Blue Surface
      surfaceLight: '#264359',     // Lighter Blue Surface
      textPrimary: '#E8F4F8',      // Light Cyan
      textSecondary: '#B8D4E3',    // Muted Cyan
      textMuted: '#7A9FB8',        // Muted Blue
      white: '#FFFFFF',
      black: '#000000',

      borderLight: '#2A4B5C',      // Subtle Blue Border
      borderDefault: '#3A5B7C',    // Blue Border
      borderBright: '#0077BE',     // Primary Border

      disabledBackground: '#1A2F42',
      disabledText: '#7A9FB8',
      error: '#E74C3C',
      success: '#2ECC71',
      warning: '#F39C12',

      semanticPink: '#FF69B4',
      semanticYellow: '#FFD700',
      semanticBlue: '#40E0D0',
      semanticPurple: '#9370DB',

      teal: '#40E0D0',
      pink: '#FF69B4',

      border: '#3A5B7C',
      tagBackground: '#339FD1',
    }
  },

  sunset: {
    name: 'Sunset Glow',
    colors: {
      primary: '#FF6B6B',          // Coral Red
      secondary: '#FFD93D',        // Golden Yellow
      accent: '#6BCF7F',           // Mint Green
      highlight: '#FF8E53',        // Orange
      background: '#2D1B1B',       // Dark Burgundy

      primaryLight: '#FF9999',     // Light Coral
      primaryDark: '#E74C3C',      // Dark Red

      surface: '#3D2A2A',          // Dark Brown Surface
      surfaceLight: '#4A3333',     // Lighter Brown
      textPrimary: '#FFF5F5',      // Warm White
      textSecondary: '#E8C5C5',    // Warm Gray
      textMuted: '#B8A0A0',        // Muted Brown
      white: '#FFFFFF',
      black: '#000000',

      borderLight: '#4A3333',      // Subtle Brown Border
      borderDefault: '#5A4040',    // Brown Border
      borderBright: '#FF6B6B',     // Primary Border

      disabledBackground: '#3D2A2A',
      disabledText: '#B8A0A0',
      error: '#DC3545',
      success: '#28A745',
      warning: '#FFC107',

      semanticPink: '#FF6B9D',
      semanticYellow: '#FFD93D',
      semanticBlue: '#6BAED6',
      semanticPurple: '#C8A2C8',

      teal: '#4ECDC4',
      pink: '#FF6B9D',

      border: '#5A4040',
      tagBackground: '#FF9999',
    }
  },

  forest: {
    name: 'Forest Night',
    colors: {
      primary: '#4ECDC4',          // Teal
      secondary: '#45B7A8',        // Sea Green
      accent: '#96CEB4',           // Mint
      highlight: '#FFEAA7',        // Soft Yellow
      background: '#1A2B1A',       // Dark Forest Green

      primaryLight: '#7EDDD6',     // Light Teal
      primaryDark: '#2E8B82',      // Dark Teal

      surface: '#2D3F2D',          // Dark Green Surface
      surfaceLight: '#3A4D3A',     // Lighter Green
      textPrimary: '#F0FFF0',      // Honeydew
      textSecondary: '#D0E8D0',    // Light Green
      textMuted: '#A8C8A8',        // Muted Green
      white: '#FFFFFF',
      black: '#000000',

      borderLight: '#3A4D3A',      // Subtle Green Border
      borderDefault: '#4A5D4A',    // Green Border
      borderBright: '#4ECDC4',     // Primary Border

      disabledBackground: '#2D3F2D',
      disabledText: '#A8C8A8',
      error: '#E74C3C',
      success: '#27AE60',
      warning: '#F39C12',

      semanticPink: '#FF7F7F',
      semanticYellow: '#FFEAA7',
      semanticBlue: '#74B9FF',
      semanticPurple: '#A29BFE',

      teal: '#4ECDC4',
      pink: '#FF7F7F',

      border: '#4A5D4A',
      tagBackground: '#7EDDD6',
    }
  },

  monochrome: {
    name: 'Monochrome',
    colors: {
      primary: '#FFFFFF',          // White
      secondary: '#CCCCCC',        // Light Gray
      accent: '#999999',           // Medium Gray
      highlight: '#EEEEEE',        // Very Light Gray
      background: '#000000',       // Black

      primaryLight: '#FFFFFF',     // White
      primaryDark: '#DDDDDD',      // Light Gray

      surface: '#1A1A1A',          // Dark Gray Surface
      surfaceLight: '#2A2A2A',     // Lighter Gray
      textPrimary: '#FFFFFF',      // White
      textSecondary: '#CCCCCC',    // Light Gray
      textMuted: '#999999',        // Medium Gray
      white: '#FFFFFF',
      black: '#000000',

      borderLight: '#333333',      // Dark Gray Border
      borderDefault: '#555555',    // Medium Gray Border
      borderBright: '#FFFFFF',     // White Border

      disabledBackground: '#1A1A1A',
      disabledText: '#666666',
      error: '#FF6B6B',
      success: '#51CF66',
      warning: '#FFD43B',

      semanticPink: '#FF8CC8',
      semanticYellow: '#FFE066',
      semanticBlue: '#74C0FC',
      semanticPurple: '#B197FC',

      teal: '#51CF66',
      pink: '#FF8CC8',

      border: '#555555',
      tagBackground: '#CCCCCC',
    }
  }
};

// Default theme export for backward compatibility
export const colors = themes.default.colors;