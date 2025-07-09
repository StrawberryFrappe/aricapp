import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { createStyles } from '../styles/commonStyles';

/**
 * Custom hook that provides themed styles and colors
 * This hook combines the theme context with styled components
 *
 * @returns {Object} Object containing styles and colors for the current theme
 */
export const useThemedStyles = () => {
  const { colors } = useTheme();

  const styles = useMemo(() => createStyles(colors), [colors]);

  return { styles, colors };
};
