import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { getTransactions } from '../services/firestoreService';
import { formatCurrency } from '../utils/currencyFormatter';
import { formatRelativeTime } from '../utils/dateFormatter';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import { TRANSACTION_TYPES } from '../types/models';

const DashboardScreen = () => {
  const { user, userProfile } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });

  const loadTransactions = async () => {
    if (!user) return;
    
    setLoading(true);
    const result = await getTransactions(user.uid, { limitCount: 10 });
    setLoading(false);
    
    if (result.success) {
      setTransactions(result.transactions);
      calculateStats(result.transactions);
    }
  };

  const calculateStats = (txns) => {
    const income = txns
      .filter(t => t.type === TRANSACTION_TYPES.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = txns
      .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    
    setStats({
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    });
  };

  useEffect(() => {
    loadTransactions();
  }, [user]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadTransactions} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {userProfile?.displayName || 'User'}!</Text>
        <Text style={styles.subtitle}>Here's your financial overview</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.success }]}>
          <Ionicons name="arrow-down-circle" size={24} color="#FFF" />
          <Text style={styles.statLabel}>Income</Text>
          <Text style={styles.statValue}>
            {formatCurrency(stats.totalIncome, userProfile?.currency)}
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.error }]}>
          <Ionicons name="arrow-up-circle" size={24} color="#FFF" />
          <Text style={styles.statLabel}>Expenses</Text>
          <Text style={styles.statValue}>
            {formatCurrency(stats.totalExpenses, userProfile?.currency)}
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.primary }]}>
          <Ionicons name="wallet" size={24} color="#FFF" />
          <Text style={styles.statLabel}>Balance</Text>
          <Text style={styles.statValue}>
            {formatCurrency(stats.balance, userProfile?.currency)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>Add a transaction or scan a receipt to get started</Text>
          </View>
        ) : (
          transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <Ionicons
                  name={transaction.type === TRANSACTION_TYPES.INCOME ? 'arrow-down-circle' : 'arrow-up-circle'}
                  size={24}
                  color={transaction.type === TRANSACTION_TYPES.INCOME ? colors.success : colors.error}
                />
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description || 'Transaction'}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {formatRelativeTime(transaction.date.toDate ? transaction.date.toDate() : transaction.date)}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: transaction.type === TRANSACTION_TYPES.INCOME ? colors.success : colors.error }
                ]}
              >
                {transaction.type === TRANSACTION_TYPES.INCOME ? '+' : '-'}
                {formatCurrency(transaction.amount, userProfile?.currency)}
              </Text>
            </View>
          ))
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
  greeting: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  statLabel: {
    color: '#FFF',
    fontSize: 12,
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  statValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  transactionDescription: {
    ...typography.body,
    color: colors.text,
  },
  transactionDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  transactionAmount: {
    ...typography.h4,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    ...typography.h4,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

export default DashboardScreen;
