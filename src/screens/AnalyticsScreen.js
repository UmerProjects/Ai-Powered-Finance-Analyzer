import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getTransactions } from '../services/firestoreService';
import { formatCurrency } from '../utils/currencyFormatter';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import { TRANSACTION_TYPES } from '../types/models';
import { getCategoryById } from '../constants/categories';

const AnalyticsScreen = () => {
  const { user, userProfile } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;

    const result = await getTransactions(user.uid, { limitCount: 100 });
    
    if (result.success) {
      setTransactions(result.transactions);
      calculateCategoryStats(result.transactions);
    }
  };

  const calculateCategoryStats = (txns) => {
    const expenses = txns.filter(t => t.type === TRANSACTION_TYPES.EXPENSE);
    const categoryTotals = {};

    expenses.forEach(txn => {
      if (!categoryTotals[txn.category]) {
        categoryTotals[txn.category] = 0;
      }
      categoryTotals[txn.category] += txn.amount;
    });

    const stats = Object.entries(categoryTotals)
      .map(([categoryId, total]) => {
        const category = getCategoryById(categoryId);
        return {
          categoryId,
          name: category?.name || categoryId,
          color: category?.color || colors.primary,
          total,
        };
      })
      .sort((a, b) => b.total - a.total);

    setCategoryStats(stats);
  };

  const totalExpenses = categoryStats.reduce((sum, cat) => sum + cat.total, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Your spending breakdown</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Total Expenses</Text>
        <Text style={styles.totalAmount}>
          {formatCurrency(totalExpenses, userProfile?.currency)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>By Category</Text>
        {categoryStats.length === 0 ? (
          <Text style={styles.emptyText}>No expense data available</Text>
        ) : (
          categoryStats.map((cat) => {
            const percentage = totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0;
            return (
              <View key={cat.categoryId} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </View>
                <View style={styles.categoryStats}>
                  <Text style={styles.categoryAmount}>
                    {formatCurrency(cat.total, userProfile?.currency)}
                  </Text>
                  <Text style={styles.categoryPercentage}>{percentage.toFixed(1)}%</Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightText}>
            📊 You have {transactions.length} transactions recorded
          </Text>
        </View>
        {categoryStats.length > 0 && (
          <View style={styles.insightCard}>
            <Text style={styles.insightText}>
              💰 Your top spending category is {categoryStats[0].name}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  totalAmount: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: 'bold',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  categoryName: {
    ...typography.body,
    color: colors.text,
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  categoryPercentage: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.xl,
  },
  insightCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  insightText: {
    ...typography.body,
    color: colors.text,
  },
});

export default AnalyticsScreen;
