import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMess } from '../context/MessContext';

interface HeaderProps {
  onOpenUserPicker?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenUserPicker }) => {
  const {
    mess,
    currentMonthLabel,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    themeMode,
    setThemeMode,
    language,
    setLanguage,
    colors,
    activeMember,
    t,
    triggerHaptic,
  } = useMess();

  const [monthModalVisible, setMonthModalVisible] = useState(false);

  const toggleTheme = () => {
    triggerHaptic();
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    triggerHaptic();
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceGlass, borderBottomColor: colors.border }]}>
      {/* Top row: Brand & Profile Picker */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.profileBadge}
          onPress={onOpenUserPicker}
          activeOpacity={0.7}
        >
          <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {activeMember.nickname ? activeMember.nickname[0] : activeMember.name[0]}
            </Text>
          </View>
          <View style={styles.profileTextContainer}>
            <View style={styles.nameRow}>
              <Text style={[styles.profileName, { color: colors.text }]} numberOfLines={1}>
                {activeMember.name}
              </Text>
              <View
                style={[
                  styles.rolePill,
                  {
                    backgroundColor:
                      activeMember.role === 'owner' || activeMember.role === 'manager'
                        ? colors.primaryDark
                        : colors.surfaceSecondary,
                  },
                ]}
              >
                <Text style={styles.rolePillText}>
                  {activeMember.role === 'owner'
                    ? t('roleOwner')
                    : activeMember.role === 'manager'
                    ? t('roleManager')
                    : t('roleMember')}
                </Text>
              </View>
            </View>
            <Text style={[styles.messNameText, { color: colors.textMuted }]} numberOfLines={1}>
              {mess.name} • রুম {activeMember.roomNo || 'N/A'}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Right Action Icons: Language & Theme */}
        <View style={styles.actionsGroup}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
            onPress={toggleLanguage}
            activeOpacity={0.7}
          >
            <Text style={[styles.langText, { color: colors.primaryLight }]}>
              {language === 'bn' ? 'বাং' : 'EN'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons
              name={themeMode === 'dark' ? 'sunny-outline' : 'moon-outline'}
              size={18}
              color={themeMode === 'dark' ? '#FBBF24' : '#6366F1'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Month Selector Pill */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={[styles.monthPill, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
          onPress={() => setMonthModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={15} color={colors.primaryLight} style={{ marginRight: 6 }} />
          <Text style={[styles.monthPillText, { color: colors.text }]}>{currentMonthLabel}</Text>
          <Ionicons name="chevron-down" size={14} color={colors.textMuted} style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        <View style={styles.modeIndicator}>
          <View
            style={[
              styles.modeDot,
              { backgroundColor: mess.mealInputMode === 'direct_total' ? colors.warning : colors.success },
            ]}
          />
          <Text style={[styles.modeText, { color: colors.textMuted }]}>
            {mess.mealInputMode === 'direct_total' ? t('directTotalMode') : t('detailedMode')}
          </Text>
        </View>
      </View>

      {/* Month Selection Modal */}
      <Modal visible={monthModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMonthModalVisible(false)}
        >
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('changeMonth')}</Text>
            {availableMonths.map((opt) => {
              const isSelected = opt.value === selectedMonth;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.modalOption,
                    isSelected && { backgroundColor: colors.primaryLight + '22' },
                  ]}
                  onPress={() => {
                    triggerHaptic();
                    setSelectedMonth(opt.value);
                    setMonthModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      { color: isSelected ? colors.primaryLight : colors.text },
                      isSelected && { fontWeight: '700' },
                    ]}
                  >
                    {language === 'bn' ? opt.labelBn : opt.labelEn}
                  </Text>
                  {isSelected && <Ionicons name="checkmark-circle" size={18} color={colors.primaryLight} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  profileTextContainer: {
    flex: 1,
    marginRight: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
    maxWidth: 130,
  },
  rolePill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
    marginLeft: 6,
  },
  rolePillText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '600',
  },
  messNameText: {
    fontSize: 11,
    marginTop: 1,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  langText: {
    fontSize: 11,
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  monthPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },
  modeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  modalOptionText: {
    fontSize: 14,
  },
});
