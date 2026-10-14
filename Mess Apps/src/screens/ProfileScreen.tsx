import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMess } from '../context/MessContext';
import { MealInputMode } from '../types';

interface Props {
  onOpenUserPicker: () => void;
  onOpenAddMember: () => void;
}

export const ProfileScreen: React.FC<Props> = ({ onOpenUserPicker, onOpenAddMember }) => {
  const {
    colors,
    t,
    mess,
    updateMess,
    activeMember,
    members,
    toggleMemberActive,
    themeMode,
    setThemeMode,
    language,
    setLanguage,
    triggerHaptic,
  } = useMess();

  const [messName, setMessName] = useState(mess.name);
  const [mealInputMode, setMealInputMode] = useState<MealInputMode>(mess.mealInputMode);
  const [enableBreakfast, setEnableBreakfast] = useState(mess.enableBreakfast);
  const [enableLunch, setEnableLunch] = useState(mess.enableLunch);
  const [enableDinner, setEnableDinner] = useState(mess.enableDinner);
  const [breakfastVal, setBreakfastVal] = useState(String(mess.breakfastMealValue));
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveSettings = () => {
    triggerHaptic();
    updateMess({
      name: messName.trim() || mess.name,
      mealInputMode,
      enableBreakfast,
      enableLunch,
      enableDinner,
      breakfastMealValue: parseFloat(breakfastVal) || 0.5,
    });
    Alert.alert('সেটিংস সংরক্ষিত হয়েছে', 'মেস সেটিংস সফলভাবে আপডেট হয়েছে।');
  };

  const handleCall = (phone?: string) => {
    triggerHaptic();
    if (!phone) {
      Alert.alert('নাম্বার নেই', 'এই সদস্যের কোনো ফোন নম্বর নেই।');
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

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    return m.name.toLowerCase().includes(q) || (m.roomNo && m.roomNo.includes(q));
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* 1. Active Logged-in User Profile Card */}
      <View
        style={[
          styles.profileHeroCard,
          { backgroundColor: colors.surfaceGlass, borderColor: colors.border, shadowColor: colors.cardShadow },
        ]}
      >
        <View style={styles.profileHeroTop}>
          <View style={[styles.avatarBig, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarBigTxt}>
              {activeMember.nickname ? activeMember.nickname[0] : activeMember.name[0]}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.profileHeroName, { color: colors.text }]}>{activeMember.name}</Text>
            <Text style={[styles.profileHeroSub, { color: colors.textMuted }]}>
              রুম নং {activeMember.roomNo || 'N/A'} • {activeMember.mobile || 'মোবাইল নেই'}
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
              <Text style={styles.rolePillTxt}>
                {activeMember.role === 'owner' ? t('roleOwner') : activeMember.role === 'manager' ? t('roleManager') : t('roleMember')}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.switchUserBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
            onPress={onOpenUserPicker}
            activeOpacity={0.7}
          >
            <Ionicons name="swap-horizontal" size={16} color={colors.primaryLight} style={{ marginRight: 4 }} />
            <Text style={[styles.switchUserTxt, { color: colors.primaryLight }]}>{t('switchMember')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Mess Settings & Configuration */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.surfaceGlass, borderColor: colors.border, shadowColor: colors.cardShadow },
        ]}
      >
        <View style={styles.sectionTitleRow}>
          <Ionicons name="settings-outline" size={18} color={colors.primaryLight} style={{ marginRight: 6 }} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('messSettings')}</Text>
        </View>

        {/* Mess Name */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t('messName')}</Text>
        <TextInput
          style={[
            styles.textInput,
            { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, color: colors.text },
          ]}
          value={messName}
          onChangeText={setMessName}
        />

        {/* Meal Input Mode Toggle */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t('mealInputMode')}</Text>
        <View style={[styles.modeToggleRow, { backgroundColor: colors.surfaceSecondary }]}>
          <TouchableOpacity
            style={[
              styles.modeSegment,
              mealInputMode === 'detailed' && { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => {
              triggerHaptic();
              setMealInputMode('detailed');
            }}
          >
            <Text
              style={[
                styles.modeSegmentTxt,
                { color: mealInputMode === 'detailed' ? colors.primaryLight : colors.textMuted },
                mealInputMode === 'detailed' && { fontWeight: '700' },
              ]}
            >
              {t('detailedMode')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeSegment,
              mealInputMode === 'direct_total' && { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => {
              triggerHaptic();
              setMealInputMode('direct_total');
            }}
          >
            <Text
              style={[
                styles.modeSegmentTxt,
                { color: mealInputMode === 'direct_total' ? colors.warning : colors.textMuted },
                mealInputMode === 'direct_total' && { fontWeight: '700' },
              ]}
            >
              {t('directTotalMode')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Shifts Toggles */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>মিলের সময়সূচী ও শিফট</Text>
        <View style={[styles.toggleItem, { borderColor: colors.border }]}>
          <Text style={[styles.toggleLabel, { color: colors.text }]}>{t('enableBreakfast')}</Text>
          <Switch
            value={enableBreakfast}
            onValueChange={(val) => {
              triggerHaptic();
              setEnableBreakfast(val);
            }}
            trackColor={{ false: colors.surfaceSecondary, true: colors.primaryLight }}
            thumbColor={enableBreakfast ? colors.primary : '#F4F4F5'}
          />
        </View>

        {enableBreakfast && (
          <View style={styles.nestedInputRow}>
            <Text style={[styles.nestedLabel, { color: colors.textMuted }]}>{t('breakfastWeight')}</Text>
            <TextInput
              style={[
                styles.nestedInput,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, color: colors.text },
              ]}
              value={breakfastVal}
              onChangeText={setBreakfastVal}
              keyboardType="numeric"
            />
          </View>
        )}

        <View style={[styles.toggleItem, { borderColor: colors.border }]}>
          <Text style={[styles.toggleLabel, { color: colors.text }]}>{t('enableLunch')}</Text>
          <Switch
            value={enableLunch}
            onValueChange={(val) => {
              triggerHaptic();
              setEnableLunch(val);
            }}
            trackColor={{ false: colors.surfaceSecondary, true: colors.primaryLight }}
            thumbColor={enableLunch ? colors.primary : '#F4F4F5'}
          />
        </View>

        <View style={[styles.toggleItem, { borderColor: colors.border }]}>
          <Text style={[styles.toggleLabel, { color: colors.text }]}>{t('enableDinner')}</Text>
          <Switch
            value={enableDinner}
            onValueChange={(val) => {
              triggerHaptic();
              setEnableDinner(val);
            }}
            trackColor={{ false: colors.surfaceSecondary, true: colors.primaryLight }}
            thumbColor={enableDinner ? colors.primary : '#F4F4F5'}
          />
        </View>

        {/* Theme & Language Toggles */}
        <View style={styles.appPrefsRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t('themeMode')}</Text>
            <TouchableOpacity
              style={[styles.prefBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
              onPress={() => {
                triggerHaptic();
                setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
              }}
            >
              <Ionicons
                name={themeMode === 'dark' ? 'moon' : 'sunny'}
                size={16}
                color={themeMode === 'dark' ? '#818CF8' : '#F59E0B'}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.prefBtnTxt, { color: colors.text }]}>
                {themeMode === 'dark' ? t('themeDark') : t('themeLight')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t('language')}</Text>
            <TouchableOpacity
              style={[styles.prefBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
              onPress={() => {
                triggerHaptic();
                setLanguage(language === 'bn' ? 'en' : 'bn');
              }}
            >
              <Ionicons name="language" size={16} color={colors.primaryLight} style={{ marginRight: 6 }} />
              <Text style={[styles.prefBtnTxt, { color: colors.text }]}>
                {language === 'bn' ? 'বাংলা (Bangla)' : 'English'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Settings Button */}
        <TouchableOpacity
          style={[styles.saveSettingsBtn, { backgroundColor: colors.primary }]}
          onPress={handleSaveSettings}
          activeOpacity={0.8}
        >
          <Ionicons name="save-outline" size={17} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.saveSettingsTxt}>{t('saveChanges')}</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Member Directory */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.surfaceGlass, borderColor: colors.border, shadowColor: colors.cardShadow },
        ]}
      >
        <View style={styles.directoryHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="people-outline" size={18} color={colors.primaryLight} style={{ marginRight: 6 }} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('memberDirectory')} ({members.length})
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.addMemberBtn, { backgroundColor: colors.primary }]}
            onPress={onOpenAddMember}
            activeOpacity={0.8}
          >
            <Ionicons name="person-add" size={14} color="#FFF" style={{ marginRight: 4 }} />
            <Text style={styles.addMemberTxt}>{t('addMember')}</Text>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={[styles.searchBox, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
          <Ionicons name="search" size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={t('searchMember')}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Member Cards */}
        {filteredMembers.map((member) => (
          <View
            key={member.id}
            style={[
              styles.directoryCard,
              { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
              !member.isActive && { opacity: 0.6 },
            ]}
          >
            <View style={styles.dirCardRow}>
              <View style={[styles.dirAvatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.dirAvatarTxt}>{member.nickname ? member.nickname[0] : member.name[0]}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.dirName, { color: colors.text }]}>{member.name}</Text>
                  {!member.isActive && (
                    <Text style={[styles.inactiveBadge, { color: colors.danger }]}> (নিষ্ক্রিয়)</Text>
                  )}
                </View>
                <Text style={[styles.dirSub, { color: colors.textMuted }]}>
                  রুম {member.roomNo || 'N/A'} • {member.mobile || 'মোবাইল নেই'}
                </Text>
              </View>

              {/* One-tap Phone & WhatsApp */}
              <View style={styles.dirActionIcons}>
                <TouchableOpacity
                  style={[styles.dirMiniBtn, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}
                  onPress={() => handleCall(member.mobile)}
                >
                  <Ionicons name="call" size={15} color={colors.success} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.dirMiniBtn, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}
                  onPress={() => handleWhatsApp(member.whatsapp || member.mobile)}
                >
                  <Ionicons name="logo-whatsapp" size={15} color="#22C55E" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.dirMiniBtn, { backgroundColor: 'rgba(255, 255, 255, 0.08)' }]}
                  onPress={() => toggleMemberActive(member.id)}
                >
                  <Ionicons
                    name={member.isActive ? 'checkmark-circle' : 'close-circle'}
                    size={16}
                    color={member.isActive ? colors.success : colors.danger}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileHeroCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
  },
  profileHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBig: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarBigTxt: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
  },
  profileHeroName: {
    fontSize: 16,
    fontWeight: '800',
  },
  profileHeroSub: {
    fontSize: 11,
    marginTop: 2,
  },
  rolePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  rolePillTxt: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  switchUserBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  switchUserTxt: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
  },
  modeToggleRow: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
  },
  modeSegment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeSegmentTxt: {
    fontSize: 12,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  toggleLabel: {
    fontSize: 12,
  },
  nestedInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingLeft: 12,
  },
  nestedLabel: {
    fontSize: 11,
  },
  nestedInput: {
    width: 60,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center',
    fontSize: 12,
  },
  appPrefsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  prefBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  prefBtnTxt: {
    fontSize: 11,
    fontWeight: '600',
  },
  saveSettingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  saveSettingsTxt: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  directoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addMemberBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  addMemberTxt: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
  },
  directoryCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    marginBottom: 8,
  },
  dirCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dirAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dirAvatarTxt: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  dirName: {
    fontSize: 13,
    fontWeight: '700',
  },
  inactiveBadge: {
    fontSize: 10,
  },
  dirSub: {
    fontSize: 10,
    marginTop: 2,
  },
  dirActionIcons: {
    flexDirection: 'row',
    gap: 6,
  },
  dirMiniBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
