import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMess } from '../context/MessContext';
import { MemberMonthlyStatement } from '../types';

interface Props {
  onOpenAddExpense: () => void;
  onOpenAddDeposit: () => void;
  onSelectMemberStatement: (statement: MemberMonthlyStatement) => void;
}

type AccountSubTab = 'statements' | 'deposits' | 'expenses';

export const AccountsScreen: React.FC<Props> = ({
  onOpenAddExpense,
  onOpenAddDeposit,
  onSelectMemberStatement,
}) => {
  const {
    colors,
    t,
    currentMonthLabel,
    settlement,
    period,
    lockPeriod,
    unlockPeriod,
    filteredDeposits,
    filteredExpenses,
    members,
    deleteDeposit,
    deleteExpense,
    triggerHaptic,
  } = useMess();

  const [activeSubTab, setActiveSubTab] = useState<AccountSubTab>('statements');

  const handlePeriodLockToggle = () => {
    triggerHaptic();
    if (period.status === 'locked') {
      Alert.alert(
        'অডিট আনলক করবেন?',
        'হিসাব আনলক করলে নতুন মিল, খরচ বা জমা পরিবর্তন করার সুযোগ পুনরায় সক্রিয় হবে।',
        [
          { text: 'বাতিল', style: 'cancel' },
          { text: 'হ্যাঁ, আনলক করুন', onPress: unlockPeriod },
        ]
      );
    } else {
      Alert.alert(
        'চলতি মাস অডিট লক করবেন?',
        'লক করলে চূড়ান্ত মিল রেট ফিক্সড হয়ে যাবে এবং সকল সদস্যের স্টেটমেন্ট ফাইনাল হিসেবে গণ্য হবে।',
        [
          { text: 'বাতিল', style: 'cancel' },
          { text: 'লক করুন', onPress: lockPeriod },
        ]
      );
    }
  };

  const handleDeleteDeposit = (id: string, memberName: string, amt: number) => {
    Alert.alert(
      'জমা এন্ট্রি মুছে ফেলবেন?',
      `${memberName}-এর ৳${amt} জমার রেকর্ডটি কি মুছে ফেলতে চান?`,
      [
        { text: 'বাতিল', style: 'cancel' },
        { text: 'মুছে ফেলুন', style: 'destructive', onPress: () => deleteDeposit(id) },
      ]
    );
  };

  const handleDeleteExpense = (id: string, title: string, amt: number) => {
    Alert.alert(
      'খরচের এন্ট্রি মুছে ফেলবেন?',
      `"${title}" (৳${amt}) খরচের রেকর্ডটি কি মুছে ফেলতে চান?`,
      [
        { text: 'বাতিল', style: 'cancel' },
        { text: 'মুছে ফেলুন', style: 'destructive', onPress: () => deleteExpense(id) },
      ]
    );
  };

  const isPeriodLocked = period.status === 'locked';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. Top KPI Summary Card */}
      <View
        style={[
          styles.kpiHeroCard,
          { backgroundColor: colors.surfaceGlass, borderColor: colors.border, shadowColor: colors.cardShadow },
        ]}
      >
        <View style={styles.kpiTopRow}>
          <View>
            <Text style={[styles.kpiHeroLabel, { color: colors.textMuted }]}>{t('mealRate')}</Text>
            <Text style={[styles.kpiHeroRate, { color: colors.primaryLight }]}>৳{settlement.mealRate}</Text>
          </View>

          <View style={styles.kpiTopRight}>
            <TouchableOpacity
              style={[
                styles.lockBadge,
                {
                  backgroundColor: isPeriodLocked ? colors.dangerBg : colors.successBg,
                  borderColor: isPeriodLocked ? colors.dangerBorder : colors.successBorder,
                },
              ]}
              onPress={handlePeriodLockToggle}
            >
              <Ionicons
                name={isPeriodLocked ? 'lock-closed' : 'lock-open-outline'}
                size={14}
                color={isPeriodLocked ? colors.danger : colors.success}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.lockBadgeTxt,
                  { color: isPeriodLocked ? colors.danger : colors.success },
                ]}
              >
                {isPeriodLocked ? 'অডিট লকড' : 'হিসাব ওপেন'}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.monthLabelTxt, { color: colors.textMuted }]}>{currentMonthLabel}</Text>
          </View>
        </View>

        {/* 4 Metrics Strip */}
        <View style={[styles.metricsStrip, { backgroundColor: colors.surfaceSecondary }]}>
          <View style={styles.stripCol}>
            <Text style={[styles.stripLabel, { color: colors.textMuted }]}>মোট মিল</Text>
            <Text style={[styles.stripVal, { color: colors.text }]}>{settlement.totalMeals} টি</Text>
          </View>
          <View style={[styles.stripDivider, { backgroundColor: colors.border }]} />

          <View style={styles.stripCol}>
            <Text style={[styles.stripLabel, { color: colors.textMuted }]}>খাবার খরচ</Text>
            <Text style={[styles.stripVal, { color: colors.primaryLight }]}>
              ৳{settlement.eligibleMealExpenses.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.stripDivider, { backgroundColor: colors.border }]} />

          <View style={styles.stripCol}>
            <Text style={[styles.stripLabel, { color: colors.textMuted }]}>ফিক্সড চার্জ</Text>
            <Text style={[styles.stripVal, { color: colors.warning }]}>
              ৳{settlement.fixedSharedExpenses.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.stripDivider, { backgroundColor: colors.border }]} />

          <View style={styles.stripCol}>
            <Text style={[styles.stripLabel, { color: colors.textMuted }]}>মোট জমা</Text>
            <Text style={[styles.stripVal, { color: colors.success }]}>
              ৳{settlement.totalDeposits.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Sub-tab Segment Control */}
      <View style={[styles.segmentContainer, { backgroundColor: colors.surfaceSecondary }]}>
        <TouchableOpacity
          style={[
            styles.segmentBtn,
            activeSubTab === 'statements' && { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => {
            triggerHaptic();
            setActiveSubTab('statements');
          }}
        >
          <Text
            style={[
              styles.segmentTxt,
              { color: activeSubTab === 'statements' ? colors.primaryLight : colors.textMuted },
              activeSubTab === 'statements' && { fontWeight: '700' },
            ]}
          >
            {t('tabStatements')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentBtn,
            activeSubTab === 'deposits' && { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => {
            triggerHaptic();
            setActiveSubTab('deposits');
          }}
        >
          <Text
            style={[
              styles.segmentTxt,
              { color: activeSubTab === 'deposits' ? colors.primaryLight : colors.textMuted },
              activeSubTab === 'deposits' && { fontWeight: '700' },
            ]}
          >
            {t('tabDeposits')} ({filteredDeposits.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentBtn,
            activeSubTab === 'expenses' && { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => {
            triggerHaptic();
            setActiveSubTab('expenses');
          }}
        >
          <Text
            style={[
              styles.segmentTxt,
              { color: activeSubTab === 'expenses' ? colors.primaryLight : colors.textMuted },
              activeSubTab === 'expenses' && { fontWeight: '700' },
            ]}
          >
            {t('tabExpenses')} ({filteredExpenses.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3. Sub-tab Content Views */}
      <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
        {/* SUBTAB 1: Member Statements Passbook */}
        {activeSubTab === 'statements' && (
          <View>
            <Text style={[styles.subTabHint, { color: colors.textMuted }]}>
              💡 যেকোনো সদস্যের কার্ডে ট্যাপ করে তার সম্পূর্ণ ডিজিটাল অডিট স্লিপ ও রিসিট দেখুন:
            </Text>

            {settlement.statements.map((stmt) => {
              const isSurplus = stmt.netBalance >= 0;
              return (
                <TouchableOpacity
                  key={stmt.memberId}
                  style={[
                    styles.stmtCard,
                    {
                      backgroundColor: colors.surfaceGlass,
                      borderColor: isSurplus ? colors.successBorder : colors.dangerBorder,
                      shadowColor: colors.cardShadow,
                    },
                  ]}
                  onPress={() => {
                    triggerHaptic();
                    onSelectMemberStatement(stmt);
                  }}
                  activeOpacity={0.75}
                >
                  <View style={styles.stmtTop}>
                    <View style={styles.stmtMemberLeft}>
                      <View style={[styles.stmtAvatar, { backgroundColor: colors.primary }]}>
                        <Text style={styles.stmtAvatarTxt}>{stmt.memberName[0]}</Text>
                      </View>
                      <View>
                        <Text style={[styles.stmtName, { color: colors.text }]}>{stmt.memberName}</Text>
                        <Text style={[styles.stmtRoom, { color: colors.textMuted }]}>
                          রুম: {stmt.roomNo || 'N/A'} • {stmt.totalMeals} টি মিল
                        </Text>
                      </View>
                    </View>

                    {/* Net Balance Pill */}
                    <View
                      style={[
                        styles.netPill,
                        {
                          backgroundColor: isSurplus ? colors.successBg : colors.dangerBg,
                          borderColor: isSurplus ? colors.successBorder : colors.dangerBorder,
                        },
                      ]}
                    >
                      <Text style={[styles.netPillTxt, { color: isSurplus ? colors.success : colors.danger }]}>
                        {isSurplus ? '+' : ''}৳{stmt.netBalance.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {/* Math Breakdown Row */}
                  <View style={[styles.stmtBreakdown, { backgroundColor: colors.surfaceSecondary }]}>
                    <Text style={[styles.breakdownTxt, { color: colors.textSecondary }]}>
                      জমা: <Text style={{ color: colors.success, fontWeight: '700' }}>৳{stmt.totalDeposits}</Text>
                      {'  '}•{'  '}
                      মিল খরচ: <Text style={{ color: colors.danger, fontWeight: '700' }}>৳{stmt.mealCost}</Text>
                      {'  '}•{'  '}
                      ফিক্সড: <Text style={{ color: colors.warning, fontWeight: '700' }}>৳{stmt.individualExpenses}</Text>
                    </Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* SUBTAB 2: Deposits */}
        {activeSubTab === 'deposits' && (
          <View>
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: colors.success }]}
              onPress={onOpenAddDeposit}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={18} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.addBtnTxt}>{t('addDeposit')}</Text>
            </TouchableOpacity>

            {filteredDeposits.map((dep) => {
              const mem = members.find((m) => m.id === dep.memberId);
              return (
                <View
                  key={dep.id}
                  style={[styles.itemRecordCard, { backgroundColor: colors.surfaceGlass, borderColor: colors.border }]}
                >
                  <View style={styles.recordLeft}>
                    <View style={[styles.recordIconCircle, { backgroundColor: colors.successBg }]}>
                      <Ionicons name="card-outline" size={18} color={colors.success} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.recordMemberName, { color: colors.text }]}>
                        {mem?.name || 'সদস্য'}
                      </Text>
                      <Text style={[styles.recordSub, { color: colors.textMuted }]}>
                        {dep.depositDate} • {dep.paymentMethod.toUpperCase()}
                        {dep.referenceNote ? ` • ${dep.referenceNote}` : ''}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.recordRight}>
                    <Text style={[styles.recordAmount, { color: colors.success }]}>
                      +৳{dep.amount.toLocaleString()}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteDeposit(dep.id, mem?.name || '', dep.amount)}
                      style={{ padding: 4 }}
                    >
                      <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* SUBTAB 3: Expenses */}
        {activeSubTab === 'expenses' && (
          <View>
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: colors.primary }]}
              onPress={onOpenAddExpense}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={18} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.addBtnTxt}>{t('addExpense')}</Text>
            </TouchableOpacity>

            {filteredExpenses.map((exp) => {
              const buyer = members.find((m) => m.id === exp.paidByMemberId);
              return (
                <View
                  key={exp.id}
                  style={[styles.itemRecordCard, { backgroundColor: colors.surfaceGlass, borderColor: colors.border }]}
                >
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <View style={styles.expHeaderRow}>
                      <View
                        style={[
                          styles.catBadge,
                          {
                            backgroundColor: exp.includeInMealRate ? colors.primaryLight + '25' : colors.warningBg,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.catBadgeTxt,
                            { color: exp.includeInMealRate ? colors.primaryLight : colors.warning },
                          ]}
                        >
                          {exp.includeInMealRate ? 'মিল রেট' : 'ফিক্সড খরচ'}
                        </Text>
                      </View>
                      <Text style={[styles.expDateTxt, { color: colors.textMuted }]}>{exp.expenseDate}</Text>
                    </View>

                    <Text style={[styles.recordMemberName, { color: colors.text }]}>{exp.title}</Text>
                    <Text style={[styles.recordSub, { color: colors.textMuted }]}>
                      পরিশোধ করেছেন: {buyer?.name || 'সদস্য'} {exp.note ? `• ${exp.note}` : ''}
                    </Text>

                    {exp.receiptPath && (
                      <View style={[styles.receiptRow, { borderColor: colors.border }]}>
                        <Image source={{ uri: exp.receiptPath }} style={styles.receiptThumb} />
                        <Text style={[styles.receiptLabel, { color: colors.primaryLight }]}>
                          মেমোর ছবি সংযুক্ত
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.recordRight}>
                    <Text style={[styles.recordAmount, { color: colors.danger }]}>
                      -৳{exp.amount.toLocaleString()}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteExpense(exp.id, exp.title, exp.amount)}
                      style={{ padding: 4 }}
                    >
                      <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  kpiHeroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    elevation: 3,
  },
  kpiTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  kpiHeroLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  kpiHeroRate: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  kpiTopRight: {
    alignItems: 'flex-end',
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  lockBadgeTxt: {
    fontSize: 11,
    fontWeight: '700',
  },
  monthLabelTxt: {
    fontSize: 11,
    marginTop: 4,
  },
  metricsStrip: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  stripCol: {
    flex: 1,
    alignItems: 'center',
  },
  stripLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  stripVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  stripDivider: {
    width: 1,
    height: 24,
  },
  segmentContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 3,
    marginBottom: 10,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentTxt: {
    fontSize: 12,
  },
  scrollList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  subTabHint: {
    fontSize: 11,
    marginBottom: 10,
  },
  stmtCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  stmtTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stmtMemberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stmtAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stmtAvatarTxt: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  stmtName: {
    fontSize: 14,
    fontWeight: '700',
  },
  stmtRoom: {
    fontSize: 11,
    marginTop: 1,
  },
  netPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  netPillTxt: {
    fontSize: 14,
    fontWeight: '800',
  },
  stmtBreakdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  breakdownTxt: {
    fontSize: 11,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  addBtnTxt: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  itemRecordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  recordMemberName: {
    fontSize: 13,
    fontWeight: '700',
  },
  recordSub: {
    fontSize: 11,
    marginTop: 2,
  },
  recordRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  recordAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  expHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  catBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  catBadgeTxt: {
    fontSize: 9,
    fontWeight: '700',
  },
  expDateTxt: {
    fontSize: 10,
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
  },
  receiptThumb: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  receiptLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});
