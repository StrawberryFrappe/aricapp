import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, RefreshControl } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import BlockingStatsService from '../../services/BlockingStatsService';

const StatsScreen = () => {
  const { styles, colors } = useThemedStyles();
  const [weeklyBlocks, setWeeklyBlocks] = useState(0);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      const currentWeekBlocks = await BlockingStatsService.getCurrentWeekBlocks();
      const stats = await BlockingStatsService.getStats();
      setWeeklyBlocks(currentWeekBlocks);
      setTotalBlocks(stats.totalBlocks);
    } catch (error) {
      console.error('Error loading blocking stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const getBlockingMessage = () => {
    if (weeklyBlocks === 0) {
      return "No blocked app attempts this week! 🎉";
    } else if (weeklyBlocks === 1) {
      return "You've been blocked 1 time trying to access an app this week.";
    } else {
      return `You've been blocked ${weeklyBlocks} times trying to access apps this week.`;
    }
  };

  return (
    <ScrollView
      style={[localStyles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={localStyles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={[styles.titleText, { marginBottom: 30, color: colors.textPrimary }]}>
        Weekly Statistics
      </Text>

      {/* Main Stats Card */}
      <View style={[localStyles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {/* Cat Image */}
        <Image
          source={require('../../assets/images/blocking-stats.jpg')}
          style={localStyles.statsImage}
          resizeMode="cover"
        />

        {/* Weekly Counter */}
        <View style={localStyles.counterContainer}>
          <Text style={[localStyles.counterNumber, { color: colors.primary }]}>
            {weeklyBlocks}
          </Text>
          <Text style={[localStyles.counterLabel, { color: colors.textSecondary }]}>
            App Access Blocks This Week
          </Text>
        </View>

        {/* Blocking Message */}
        <Text style={[localStyles.blockingMessage, { color: colors.textPrimary }]}>
          {getBlockingMessage()}
        </Text>

        {/* Total Blocks */}
        <View style={localStyles.totalContainer}>
          <Text style={[localStyles.totalText, { color: colors.textSecondary }]}>
            Total blocks: {totalBlocks}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  statsCard: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  counterNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  counterLabel: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  blockingMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },
  totalContainer: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
    width: '100%',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default StatsScreen;
