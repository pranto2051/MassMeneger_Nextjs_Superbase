import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMess } from '../context/MessContext';
import { PersonalBalanceHeroCard } from '../components/PersonalBalanceHeroCard';
import { MainTabType } from '../types';

interface Props {
  onNavigateTab: (tab: MainTabType) => void;
  onOpenAuditSlip: () => void;
  onOpenAddExpense: () => void;
  onOpenAddDeposit: () => void;
  onOpenSwapMarket: () => void;
}

export const HomeScreen: React.FC<Props> = ({
  onNavigateTab,
  onOpenAuditSlip,
  onOpenAddExpense,
  onOpenAddDeposit,
  onOpenSwapMarket,
}) => {
  const {
    colors,
    t,
    mess,
    activeMember,
    members,
    meals,
    todayMarketAssignment,
    tomorrowMarketAssignment,
    settlement,
    setMealCount,
    triggerHaptic,
  } = useMess();

  const todayStr = '2026-10-15';
  const tomorrowStr = '2026-10-16';

  // Active member's today meal entries
  const todayMeals = meals.filter((e) => e.memberId === activeMember.id && e.mealDate === todayStr);
  const tomorrowMeals = meals.filter((e) => e.memberId === activeMember.id && e.mealDate === tomorrowStr);

  const getMealValue = (dateStr: string, type: 'breakfast' | 'lunch' | 'dinner' | 'total'): number => {
    const list = dateStr === todayStr ? todayMeals : tomorrowMeals;
    const match = list.find((e) => e.mealType === type);
    return match ? match.mealCount : 0;
  };

  const todayTotalCount =
    mess.mealInputMode === 'direct_total'
      ? getMealValue(todayStr, 'total')
      : getMealValue(todayStr, 'breakfast') +
        getMealValue(todayStr, 'lunch') +
        getMealValue(todayStr, 'dinner');

  const todayMarketMember = todayMarketAssignment
    ? members.find((m) => m.id === todayMarketAssignment.memberId)
    : null;

  const tomorrowMarketMember = tomorrowMarketAssignment
    ? members.find((m) => m.id === tomorrowMarketAssignment.memberId)
    : null;

  const handleCall = (phone?: string) => {
    triggerHaptic();
    if (!phone) {
      Alert.alert('নাম্বার নেই', 'এই সদস্যের কোনো মোবাইল নম্বর সংরক্ষিত নেই।');
      return;
    }
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone?: string) => {
    triggerHaptic();
    if (!phone) {
      Alert.alert('নাম্বার নেই', 'এই সদস্যের কোনো হোয়াটসঅ্যাপ নম্বর নেই।');
      return;
    }
    const cleanPhone = phone.startsWith('0') ? '88' + phone : phone;
    Linking.openURL(`https://wa.me/${cleanPhone}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* 1. Hero Personal Balance Passbook */}
      <PersonalBalanceHeroCard onOpenAuditSlip={onOpenAuditSlip} />

      {/* 2. Quick Action Grid */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('quickActions')}</Text>
      </View>
      <View style={styles.quickGrid}>
        <TouchableOpacity
          style={[styles.quickCard, { backgroundColor: colors.surfaceGlass, borderColor: colors.border }]}
          onPress={() => onNavigateTab('meals')}
          activeOpacity={0.7}
        >
          <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
            <Ionicons name="restaurant" size={20} color={colors.primaryLight} />
          </View>
          <Text style={[styles.quickLabel, { color: colors.text }]}>{t('updateMeal')}</Text>
          <Text style={[styles.quickSub, { color: colors.textMuted }]}>মিল বৃদ্ধি/হ্রাস</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickCard, { backgroundColor: colors.surfaceGlass, borderColor: colors.border }]}
          onPress={onOpenAddExpense}
          activeOpacity={0.7}
        >
          <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(244, 63, 94, 0.15)' }]}>
            <Ionicons name="camera" size={20} color={colors.danger} />
          </View>
          <Text style={[styles.quickLabel, { color: colors.text }]}>{t('recordExpense')}</Text>
          <Text style={[styles.quickSub, { color: colors.textMuted }]}>মেমো ও ভাউচার</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickCard, { backgroundColor: colors.surfaceGlass, borderColor: colors.border }]}
          onPress={onOpenAddDeposit}
          activeOpacity={0.7}
        >
          <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <Ionicons name="cash" size={20} color={colors.success} />
          </View>
          <Text style={[styles.quickLabel, { color: colors.text }]}>{t('recordDeposit')}</Text>
          <Text style={[styles.quickSub, { color: colors.textMuted }]}>ফান্ডে টাকা জমা</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickCard, { backgroundColor: colors.surfaceGlass, borderColor: colors.border }]}
          onPress={onOpenAuditSlip}
          activeOpacity={0.7}
        >
          <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(14, 165, 233, 0.15)' }]}>
            <Ionicons name="receipt" size={20} color={colors.info} />
          </View>
          <Text style={[styles.quickLabel, { color: colors.text }]}>{t('myAuditSlip')}</Text>
          <Text style={[styles.quickSub, { color: colors.textMuted }]}>হিসাব বিবরণী</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Today's Meal Status Widget */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surfaceGlass, borderColor: colors.border, shadowColor: colors.cardShadow },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="restaurant-outline" size={18} color={colors.primaryLight} style={{ marginRight: 6 }} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('todayMealStatus')}</Text>
          </View>
          <View style={[styles.todayBadge, { backgroundColor: colors.surfaceSecondary }]}>
            <Text style={[styles.todayBadgeTxt, { color: colors.primaryLight }]}>১৫ অক্টোবর ২০২৬</Text>
          </View>
        </View>

        {mess.mealInputMode === 'direct_total' ? (
          // Direct Total Controls
          <View style={styles.directMealBox}>
            <View style={styles.directCountRow}>
              <TouchableOpacity
                style={[styles.stepBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
                onPress={() => {
                  const curr = getMealValue(todayStr, 'total');
                  setMealCount(activeMember.id, todayStr, 'total', Math.max(0, curr - 1));
                }}
              >
                <Ionicons name="remove" size={22} color={colors.text} />
              </TouchableOpacity>

              <View style={styles.directValueWrap}>
                <Text style={[styles.directTotalNumber, { color: colors.primaryLight }]}>
                  {getMealValue(todayStr, 'total')}
                </Text>
                <Text style={[styles.directTotalUnit, { color: colors.textMuted }]}>টি মিল</Text>
              </View>

              <TouchableOpacity
                style={[styles.stepBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
                onPress={() => {
                  const curr = getMealValue(todayStr, 'total');
                  setMealCount(activeMember.id, todayStr, 'total', curr + 1);
                }}
              >
                <Ionicons name="add" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Quick Chips */}
            <View style={styles.chipsRow}>
              {[0, 1, 2, 3].map((val) => {
                const isSelected = getMealValue(todayStr, 'total') === val;
                return (
                  <TouchableOpacity
                    key={val}
                    style={[
                      styles.chipBtn,
                      {
                        backgroundColor: isSelected ? colors.primaryDark : colors.surfaceSecondary,
                        borderColor: isSelected ? colors.primaryLight : colors.border,
                      },
                    ]}
                    onPress={() => setMealCount(activeMember.id, todayStr, 'total', val)}
                  >
                    <Text
                      style={[
                        styles.chipBtnTxt,
                        { color: isSelected ? '#FFF' : colors.text },
                        isSelected && { fontWeight: '700' },
                      ]}
                    >
                      {val === 0 ? t('chipOff') : `${val} টি`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          // Detailed Shifts Controls
          <View style={styles.shiftsRow}>
            {mess.enableBreakfast && (
              <View style={[styles.shiftCard, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                <Text style={[styles.shiftName, { color: colors.textMuted }]}>{t('breakfast')}</Text>
                <Text style={[styles.shiftCount, { color: colors.text }]}>
                  {getMealValue(todayStr, 'breakfast')}
                </Text>
                <View style={styles.shiftActions}>
                  <TouchableOpacity
                    style={styles.shiftMiniBtn}
                    onPress={() => {
                      const cur = getMealValue(todayStr, 'breakfast');
                      setMealCount(
                        activeMember.id,
                        todayStr,
                        'breakfast',
                        Math.max(0, cur - mess.breakfastMealValue)
                      );
                    }}
                  >
                    <Ionicons name="remove" size={16} color={colors.text} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.shiftMiniBtn}
                    onPress={() => {
                      const cur = getMealValue(todayStr, 'breakfast');
                      setMealCount(activeMember.id, todayStr, 'breakfast', cur + mess.breakfastMealValue);
                    }}
                  >
                    <Ionicons name="add" size={16} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {mess.enableLunch && (
              <View style={[styles.shiftCard, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                <Text style={[styles.shiftName, { color: colors.textMuted }]}>{t('lunch')}</Text>
                <Text style={[styles.shiftCount, { color: colors.text }]}>
                  {getMealValue(todayStr, 'lunch')}
                </Text>
                <View style={styles.shiftActions}>
                  <TouchableOpacity
                    style={styles.shiftMiniBtn}
                    onPress={() => {
                      const cur = getMealValue(todayStr, 'lunch');
                      setMealCount(activeMember.id, todayStr, 'lunch', Math.max(0, cur - 1));
                    }}
                  >
                    <Ionicons name="remove" size={16} color={colors.text} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.shiftMiniBtn}
                    onPress={() => {
                      const cur = getMealValue(todayStr, 'lunch');
                      setMealCount(activeMember.id, todayStr, 'lunch', cur + 1);
                    }}
                  >
                    <Ionicons name="add" size={16} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {mess.enableDinner && (
              <View style={[styles.shiftCard, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                <Text style={[styles.shiftName, { color: colors.textMuted }]}>{t('dinner')}</Text>
                <Text style={[styles.shiftCount, { color: colors.text }]}>
                  {getMealValue(todayStr, 'dinner')}
                </Text>
                <View style={styles.shiftActions}>
                  <TouchableOpacity
                    style={styles.shiftMiniBtn}
                    onPress={() => {
                      const cur = getMealValue(todayStr, 'dinner');
                      setMealCount(activeMember.id, todayStr, 'dinner', Math.max(0, cur - 1));
                    }}
                  >
                    <Ionicons name="remove" size={16} color={colors.text} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.shiftMiniBtn}
                    onPress={() => {
                      const cur = getMealValue(todayStr, 'dinner');
                      setMealCount(activeMember.id, todayStr, 'dinner', cur + 1);
                    }}
                  >
                    <Ionicons name="add" size={16} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={[styles.cardFooterTxt, { color: colors.textMuted }]}>
            আজ আপনার মোট মিল: <Text style={{ color: colors.primaryLight, fontWeight: '700' }}>{todayTotalCount} টি</Text>
          </Text>
        </View>
      </View>

      {/* 4. Market Duty In-Charge Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surfaceGlass, borderColor: colors.border, shadowColor: colors.cardShadow },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="cart-outline" size={18} color={colors.warning} style={{ marginRight: 6 }} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('todayMarketDuty')}</Text>
          </View>
          <TouchableOpacity
            style={[styles.swapPill, { borderColor: colors.border }]}
            onPress={onOpenSwapMarket}
          >
            <Ionicons name="swap-horizontal" size={13} color={colors.warning} style={{ marginRight: 4 }} />
            <Text style={[styles.swapPillTxt, { color: colors.warning }]}>{t('swapMarket')}</Text>
          </TouchableOpacity>
        </View>

        {todayMarketMember ? (
          <View style={styles.dutyCardBody}>
            <View style={styles.dutyMemberRow}>
              <View style={[styles.dutyAvatar, { backgroundColor: colors.warning }]}>
                <Text style={styles.dutyAvatarTxt}>
                  {todayMarketMember.nickname ? todayMarketMember.nickname[0] : todayMarketMember.name[0]}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.dutyMemberName, { color: colors.text }]}>{todayMarketMember.name}</Text>
                <Text style={[styles.dutyMemberSub, { color: colors.textMuted }]}>
                  রুম {todayMarketMember.roomNo || 'N/A'} • {todayMarketAssignment?.slotLabel}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: colors.warningBg, borderColor: colors.warningBorder }]}>
                <Text style={[styles.statusBadgeTxt, { color: colors.warning }]}>{t('statusAssigned')}</Text>
              </View>
            </View>

            {/* Call & WhatsApp Action Buttons */}
            <View style={styles.dutyActionRow}>
              <TouchableOpacity
                style={[styles.contactBtn, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: colors.successBorder }]}
                onPress={() => handleCall(todayMarketMember.mobile)}
                activeOpacity={0.7}
              >
                <Ionicons name="call" size={15} color={colors.success} style={{ marginRight: 6 }} />
                <Text style={[styles.contactBtnTxt, { color: colors.success }]}>{t('callNow')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.contactBtn, { backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.35)' }]}
                onPress={() => handleWhatsApp(todayMarketMember.whatsapp || todayMarketMember.mobile)}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-whatsapp" size={15} color="#22C55E" style={{ marginRight: 6 }} />
                <Text style={[styles.contactBtnTxt, { color: '#22C55E' }]}>{t('whatsapp')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={[styles.noDutyTxt, { color: colors.textMuted }]}>আজকের কোনো নির্ধারিত বাজার নেই।</Text>
        )}

        {/* Tomorrow Duty Preview */}
        {tomorrowMarketMember && (
          <View style={[styles.tomorrowDutyWrap, { borderTopColor: colors.border }]}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} style={{ marginRight: 6 }} />
            <Text style={[styles.tomorrowDutyTxt, { color: colors.textMuted }]}>
              আগামীকাল বাজার করবেন: <Text style={{ color: colors.text, fontWeight: '600' }}>{tomorrowMarketMember.name}</Text> (রুম {tomorrowMarketMember.roomNo})
            </Text>
          </View>
        )}
      </View>

      {/* 5. Overall Mess KPI Cards */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>মেসের সার্বিক পরিসংখ্যান</Text>
      </View>
      <View style={styles.kpiRow}>
        <View style={[styles.kpiCard, { backgroundColor: colors.surfaceGlass, borderColor: colors.border }]}>
          <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>{t('mealRate')}</Text>
          <Text style={[styles.kpiVal, { color: colors.primaryLight }]}>৳{settlement.mealRate}</Text>
          <Text style={[styles.kpiSub, { color: colors.textMuted }]}>চলতি মাসের রেট</Text>
        </View>

        <View style={[styles.kpiCard, { backgroundColor: colors.surfaceGlass, borderColor: colors.border }]}>
          <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>{t('totalMealsConsumed')}</Text>
          <Text style={[styles.kpiVal, { color: colors.info }]}>{settlement.totalMeals}</Text>
          <Text style={[styles.kpiSub, { color: colors.textMuted }]}>সবার মোট মিল</Text>
        </View>
      </View>

      <View style={styles.kpiRow}>
        <View style={[styles.kpiCard, { backgroundColor: colors.surfaceGlass, borderColor: colors.border }]}>
          <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>মেস মোট খরচ</Text>
          <Text style={[styles.kpiVal, { color: colors.danger }]}>৳{settlement.totalExpenses.toLocaleString()}</Text>
          <Text style={[styles.kpiSub, { color: colors.textMuted }]}>বাজার ও ফিক্সড</Text>
        </View>

        <View style={[styles.kpiCard, { backgroundColor: colors.surfaceGlass, borderColor: colors.border }]}>
          <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>{t('messCashReserve')}</Text>
          <Text
            style={[
              styles.kpiVal,
              { color: settlement.totalDeposits >= settlement.totalExpenses ? colors.success : colors.danger },
            ]}
          >
            ৳{(settlement.totalDeposits - settlement.totalExpenses).toLocaleString()}
          </Text>
          <Text style={[styles.kpiSub, { color: colors.textMuted }]}>নগদ উদ্বৃত্ত</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  sectionHeaderRow: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 10,
  },
  quickCard: {
    width: '48.2%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  quickIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  quickSub: {
    fontSize: 10,
    marginTop: 2,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  todayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  todayBadgeTxt: {
    fontSize: 11,
    fontWeight: '600',
  },
  directMealBox: {
    paddingVertical: 4,
  },
  directCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 12,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directValueWrap: {
    alignItems: 'center',
    minWidth: 80,
  },
  directTotalNumber: {
    fontSize: 32,
    fontWeight: '900',
  },
  directTotalUnit: {
    fontSize: 11,
    fontWeight: '500',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chipBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  chipBtnTxt: {
    fontSize: 12,
  },
  shiftsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  shiftCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  shiftName: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  shiftCount: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  shiftActions: {
    flexDirection: 'row',
    gap: 6,
  },
  shiftMiniBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  cardFooterTxt: {
    fontSize: 11,
    textAlign: 'center',
  },
  swapPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  swapPillTxt: {
    fontSize: 11,
    fontWeight: '600',
  },
  dutyCardBody: {
    marginTop: 2,
  },
  dutyMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dutyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dutyAvatarTxt: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dutyMemberName: {
    fontSize: 15,
    fontWeight: '700',
  },
  dutyMemberSub: {
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusBadgeTxt: {
    fontSize: 10,
    fontWeight: '700',
  },
  dutyActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  contactBtnTxt: {
    fontSize: 12,
    fontWeight: '700',
  },
  noDutyTxt: {
    fontSize: 12,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  tomorrowDutyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  tomorrowDutyTxt: {
    fontSize: 11,
  },
  kpiRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 10,
  },
  kpiCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  kpiVal: {
    fontSize: 19,
    fontWeight: '800',
    marginVertical: 4,
  },
  kpiSub: {
    fontSize: 10,
  },
});
