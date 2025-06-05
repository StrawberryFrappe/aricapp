import React from 'react';
import { View } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';

const StatsScreen = () => {
  const { styles } = useThemedStyles(createStyles);
  return <View style={styles.container} />;
};

const createStyles = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default StatsScreen;
