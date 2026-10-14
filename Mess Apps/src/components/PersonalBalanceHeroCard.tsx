import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMess } from '../context/MessContext';

interface Props {
  onOpenAuditSlip: () => void;
}

export const PersonalBalanceHeroCard: React.FC<Props> = ({ onOpenAuditSlip }) => {
  const { colors, activeMember, activeMemberStatement, settlement, t, currentMonthLabel } = useMess();

  const netBalance = activeMemberStatement?.netBalance ?? 0;
  const isSurplus = netBalance >= 0;

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.surfaceGlass,
          borderColor: isSurplus ? colors.successBorder : colors.dangerBorder,
          shadowColor: colors.cardShadow,
        },
      ]}
    >
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <Ionicons
            name="wallet"
            size={18}
            color={isSurplus ? colors.success : colors.danger}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('personalPassbook')}</Text>
        </View>
        <View style={[styles.monthBadge, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={[styles.monthBadgeText, { color: colors.textMuted }]}>{currentMonthLabel}</Text>
        </View>
      </View>

      {/* Main Net Balance Row */}
      <View style={styles.balanceRow}>
        <View>
          <Text style={[styles.balanceSubtext, { color: colors.textMuted }]}>{t('netBalance')}</Text>
          <Text
            style={[
              styles.balanceAmount,
              { color: isSurplus ? colors.success : colors.danger },
            ]}
          >
            {isSurplus ? '+' : ''}৳{Math.abs(netBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: isSurplus ? colors.successBg : colors.dangerBg,
              borderColor: isSurplus ? colors.successBorder : colors.dangerBorder,
            },
          ]}
        >
          <Ionicons
            name={isSurplus ? 'trending-up' : 'trending-down'}
            size={14}
            color={isSurplus ? colors.success : colors.danger}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.statusBadgeText,
              { color: isSurplus ? colors.success : colors.danger },
            ]}
          >
            {isSurplus ? t('surplusCredit') : t('dueOwed')}
          </Text>
        </View>
      </View>

      {/* 3 Metric Pills */}
      <View style={[styles.metricsContainer, { backgroundColor: colors.surfaceSecondary }]}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{t('totalDeposits')}</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            ৳{(activeMemberStatement?.totalDeposits ?? 0).toLocaleString()}
          </Text>
        </View>

        <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />

        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{t('totalMealCost')}</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            ৳{(activeMemberStatement?.mealCost ?? 0).toLocaleString()}
          </Text>
          <Text style={[styles.metricSubdetail, { color: colors.textMuted }]}>
            {activeMemberStatement?.totalMeals ?? 0} মিল @ ৳{settlement.mealRate}
          </Text>
        </View>

        <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />

        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{t('fixedSharedCost')}</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            ৳{(activeMemberStatement?.individualExpenses ?? 0).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Action to view full audit slip */}
      <TouchableOpacity
        style={[styles.viewSlipButton, { borderColor: colors.borderHighlight }]}
        onPress={onOpenAuditSlip}
        activeOpacity={0.75}
      >
        <Ionicons name="receipt-outline" size={16} color={colors.primaryLight} style={{ marginRight: 6 }} />
        <Text style={[styles.viewSlipText, { color: colors.primaryLight }]}>{t('myAuditSlip')}</Text>
        <Ionicons name="chevron-forward" size={15} color={colors.primaryLight} style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  monthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  monthBadgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  balanceSubtext: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  metricSubdetail: {
    fontSize: 9,
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 28,
  },
  viewSlipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
  },
  viewSlipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
