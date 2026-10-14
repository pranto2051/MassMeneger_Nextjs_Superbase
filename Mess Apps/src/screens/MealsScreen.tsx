import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMess } from '../context/MessContext';
import { MealType } from '../types';

export const MealsScreen: React.FC = () => {
  const {
    colors,
    t,
    mess,
    updateMess,
    members,
    meals,
    setMealCount,
    setAllMembersMealForDate,
    triggerHaptic,
  } = useMess();

  const [currentDateStr, setCurrentDateStr] = useState<string>('2026-10-15');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Date navigation helpers
  const shiftDay = (delta: number) => {
    triggerHaptic();
    const [y, m, d] = currentDateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + delta);
    const nextY = dateObj.getFullYear();
    const nextM = String(dateObj.getMonth() + 1).padStart(2, '0');
    const nextD = String(dateObj.getDate()).padStart(2, '0');
    setCurrentDateStr(`${nextY}-${nextM}-${nextD}`);
  };

  const goToToday = () => {
    triggerHaptic();
    setCurrentDateStr('2026-10-15');
  };

  // Get meal count for a specific member and shift
  const getCount = (memberId: string, mealType: MealType): number => {
    const entry = meals.find(
      (e) => e.memberId === memberId && e.mealDate === currentDateStr && e.mealType === mealType
    );
    return entry ? Number(entry.mealCount) : 0;
  };

  // Calculate day totals
  const activeMembers = members.filter((m) => m.isActive);

  let dayTotalMeals = 0;
  let dayBreakfast = 0;
  let dayLunch = 0;
  let dayDinner = 0;

  activeMembers.forEach((m) => {
    if (mess.mealInputMode === 'direct_total') {
      dayTotalMeals += getCount(m.id, 'total');
    } else {
      const bf = getCount(m.id, 'breakfast');
      const lu = getCount(m.id, 'lunch');
      const di = getCount(m.id, 'dinner');
      dayBreakfast += bf;
      dayLunch += lu;
      dayDinner += di;
      dayTotalMeals += bf + lu + di;
    }
  });

  const toggleInputMode = () => {
    triggerHaptic();
    const nextMode = mess.mealInputMode === 'detailed' ? 'direct_total' : 'detailed';
    updateMess({ mealInputMode: nextMode });
    showToast(
      nextMode === 'direct_total'
        ? 'ডিরেক্ট মিল ইনপুট মোড সক্রিয় করা হয়েছে'
        : 'বেলা ভিত্তিক (বিস্তারিত) মোড সক্রিয় করা হয়েছে'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Toast Banner */}
      {toastMessage && (
        <View style={[styles.toastBanner, { backgroundColor: colors.primary }]}>
          <Ionicons name="checkmark-circle" size={16} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.toastTxt}>{toastMessage}</Text>
        </View>
      )}

      {/* Date Navigator Bar */}
      <View style={[styles.dateBar, { backgroundColor: colors.surfaceGlass, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.dateNavBtn, { backgroundColor: colors.surfaceSecondary }]}
          onPress={() => shiftDay(-1)}
        >
          <Ionicons name="chevron-back" size={18} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.dateInfo}>
          <Text style={[styles.dateMainTxt, { color: colors.text }]}>{currentDateStr}</Text>
          <Text style={[styles.dateSubTxt, { color: colors.textMuted }]}>
            {currentDateStr === '2026-10-15' ? 'আজকের তারিখ' : 'নির্বাচিত দিন'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.dateNavBtn, { backgroundColor: colors.surfaceSecondary }]}
          onPress={() => shiftDay(1)}
        >
          <Ionicons name="chevron-forward" size={18} color={colors.text} />
        </TouchableOpacity>

        {currentDateStr !== '2026-10-15' && (
          <TouchableOpacity
            style={[styles.todayBtn, { backgroundColor: colors.primaryLight + '25', borderColor: colors.primaryLight }]}
            onPress={goToToday}
          >
            <Text style={[styles.todayBtnTxt, { color: colors.primaryLight }]}>আজ</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Mode Switcher & Quick Stats Bar */}
      <View style={[styles.modeBar, { backgroundColor: colors.surfaceSecondary, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.modeSwitchBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={toggleInputMode}
          activeOpacity={0.7}
        >
          <Ionicons
            name="swap-horizontal"
            size={16}
            color={mess.mealInputMode === 'direct_total' ? colors.warning : colors.primaryLight}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.modeSwitchTxt, { color: colors.text }]}>
            মোড: {mess.mealInputMode === 'direct_total' ? 'ডিরেক্ট মিল ইনপুট' : 'বেলা ভিত্তিক'}
          </Text>
        </TouchableOpacity>

        <View style={styles.statsSummary}>
          <Text style={[styles.statsLabel, { color: colors.textMuted }]}>দিনের মোট মিল:</Text>
          <Text style={[styles.statsValue, { color: colors.primaryLight }]}>{dayTotalMeals.toFixed(1)} টি</Text>
        </View>
      </View>

      {/* Bulk Shortcuts Bar */}
      <View style={[styles.bulkBar, { backgroundColor: colors.surfaceGlass }]}>
        <Text style={[styles.bulkTitle, { color: colors.textMuted }]}>এক ক্লিকে সবার মিল:</Text>
        <View style={styles.bulkActionsRow}>
          <TouchableOpacity
            style={[styles.bulkBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
            onPress={() => {
              setAllMembersMealForDate(currentDateStr, 1);
              showToast('সকল সক্রিয় সদস্যের মিল ১ করা হয়েছে');
            }}
          >
            <Text style={[styles.bulkBtnTxt, { color: colors.primaryLight }]}>{t('setAllToOne')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bulkBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
            onPress={() => {
              setAllMembersMealForDate(currentDateStr, 0);
              showToast('সকল সক্রিয় সদস্যের মিল ০ করা হয়েছে');
            }}
          >
            <Text style={[styles.bulkBtnTxt, { color: colors.danger }]}>{t('setAllToZero')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Member Meal Cards List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {activeMembers.map((member) => {
          const directCount = getCount(member.id, 'total');
          const bfCount = getCount(member.id, 'breakfast');
          const luCount = getCount(member.id, 'lunch');
          const diCount = getCount(member.id, 'dinner');
          const memberTotal =
            mess.mealInputMode === 'direct_total' ? directCount : bfCount + luCount + diCount;

          return (
            <View
              key={member.id}
              style={[
                styles.memberMealCard,
                { backgroundColor: colors.surfaceGlass, borderColor: colors.border, shadowColor: colors.cardShadow },
              ]}
            >
              {/* Member Card Top Info */}
              <View style={styles.cardTopRow}>
                <View style={[styles.memberAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.memberAvatarTxt}>{member.nickname ? member.nickname[0] : member.name[0]}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                  <Text style={[styles.memberSub, { color: colors.textMuted }]}>
                    রুম নং: {member.roomNo || 'N/A'} • {member.nickname || 'সদস্য'}
                  </Text>
                </View>

                <View style={[styles.totalCountBadge, { backgroundColor: memberTotal > 0 ? colors.primaryLight + '25' : colors.surfaceSecondary }]}>
                  <Text style={[styles.totalCountTxt, { color: memberTotal > 0 ? colors.primaryLight : colors.textMuted }]}>
                    মোট: {memberTotal}
                  </Text>
                </View>
              </View>

              {/* Direct Total Input Mode */}
              {mess.mealInputMode === 'direct_total' ? (
                <View style={styles.directControls}>
                  <View style={styles.stepperRow}>
                    <TouchableOpacity
                      style={[styles.stepBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
                      onPress={() => {
                        const cur = getCount(member.id, 'total');
                        setMealCount(member.id, currentDateStr, 'total', Math.max(0, cur - 1));
                      }}
                    >
                      <Ionicons name="remove" size={20} color={colors.text} />
                    </TouchableOpacity>

                    <View style={styles.countDisplay}>
                      <Text style={[styles.countNum, { color: colors.text }]}>{directCount}</Text>
                      <Text style={[styles.countUnit, { color: colors.textMuted }]}>টি মিল</Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.stepBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
                      onPress={() => {
                        const cur = getCount(member.id, 'total');
                        setMealCount(member.id, currentDateStr, 'total', cur + 1);
                      }}
                    >
                      <Ionicons name="add" size={20} color={colors.text} />
                    </TouchableOpacity>
                  </View>

                  {/* 4 Quick Chips: 0, 1, 2, 3 */}
                  <View style={styles.chipsRow}>
                    {[0, 1, 2, 3].map((val) => {
                      const isSelected = directCount === val;
                      return (
                        <TouchableOpacity
                          key={val}
                          style={[
                            styles.chip,
                            {
                              backgroundColor: isSelected ? colors.primaryDark : colors.surfaceSecondary,
                              borderColor: isSelected ? colors.primaryLight : colors.border,
                            },
                          ]}
                          onPress={() => setMealCount(member.id, currentDateStr, 'total', val)}
                        >
                          <Text
                            style={[
                              styles.chipTxt,
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
                /* Detailed Shifts Mode */
                <View style={styles.detailedShifts}>
                  {mess.enableBreakfast && (
                    <View style={[styles.shiftCol, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                      <Text style={[styles.shiftLabel, { color: colors.textMuted }]}>{t('breakfast')}</Text>
                      <Text style={[styles.shiftValue, { color: colors.text }]}>{bfCount}</Text>
                      <View style={styles.miniBtnRow}>
                        <TouchableOpacity
                          style={styles.miniBtn}
                          onPress={() => {
                            setMealCount(
                              member.id,
                              currentDateStr,
                              'breakfast',
                              Math.max(0, bfCount - mess.breakfastMealValue)
                            );
                          }}
                        >
                          <Ionicons name="remove" size={14} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.miniBtn}
                          onPress={() => {
                            setMealCount(
                              member.id,
                              currentDateStr,
                              'breakfast',
                              bfCount + mess.breakfastMealValue
                            );
                          }}
                        >
                          <Ionicons name="add" size={14} color={colors.text} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {mess.enableLunch && (
                    <View style={[styles.shiftCol, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                      <Text style={[styles.shiftLabel, { color: colors.textMuted }]}>{t('lunch')}</Text>
                      <Text style={[styles.shiftValue, { color: colors.text }]}>{luCount}</Text>
                      <View style={styles.miniBtnRow}>
                        <TouchableOpacity
                          style={styles.miniBtn}
                          onPress={() => {
                            setMealCount(member.id, currentDateStr, 'lunch', Math.max(0, luCount - 1));
                          }}
                        >
                          <Ionicons name="remove" size={14} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.miniBtn}
                          onPress={() => {
                            setMealCount(member.id, currentDateStr, 'lunch', luCount + 1);
                          }}
                        >
                          <Ionicons name="add" size={14} color={colors.text} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {mess.enableDinner && (
                    <View style={[styles.shiftCol, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                      <Text style={[styles.shiftLabel, { color: colors.textMuted }]}>{t('dinner')}</Text>
                      <Text style={[styles.shiftValue, { color: colors.text }]}>{diCount}</Text>
                      <View style={styles.miniBtnRow}>
                        <TouchableOpacity
                          style={styles.miniBtn}
                          onPress={() => {
                            setMealCount(member.id, currentDateStr, 'dinner', Math.max(0, diCount - 1));
                          }}
                        >
                          <Ionicons name="remove" size={14} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.miniBtn}
                          onPress={() => {
                            setMealCount(member.id, currentDateStr, 'dinner', diCount + 1);
                          }}
                        >
                          <Ionicons name="add" size={14} color={colors.text} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  toastTxt: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  dateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  dateNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateInfo: {
    alignItems: 'center',
  },
  dateMainTxt: {
    fontSize: 16,
    fontWeight: '800',
  },
  dateSubTxt: {
    fontSize: 11,
    marginTop: 1,
  },
  todayBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  todayBtnTxt: {
    fontSize: 12,
    fontWeight: '700',
  },
  modeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  modeSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  modeSwitchTxt: {
    fontSize: 11,
    fontWeight: '700',
  },
  statsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 11,
    marginRight: 4,
  },
  statsValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  bulkBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  bulkTitle: {
    fontSize: 11,
  },
  bulkActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bulkBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  bulkBtnTxt: {
    fontSize: 11,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  memberMealCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  memberAvatarTxt: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
  },
  memberSub: {
    fontSize: 11,
    marginTop: 2,
  },
  totalCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  totalCountTxt: {
    fontSize: 12,
    fontWeight: '800',
  },
  directControls: {
    marginTop: 2,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 10,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countDisplay: {
    alignItems: 'center',
    minWidth: 70,
  },
  countNum: {
    fontSize: 26,
    fontWeight: '900',
  },
  countUnit: {
    fontSize: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  chipTxt: {
    fontSize: 11,
  },
  detailedShifts: {
    flexDirection: 'row',
    gap: 8,
  },
  shiftCol: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
    alignItems: 'center',
  },
  shiftLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  shiftValue: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  miniBtnRow: {
    flexDirection: 'row',
    gap: 6,
  },
  miniBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
