import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMess } from '../context/MessContext';
import { MainTabType } from '../types';

interface TabBarProps {
  currentTab: MainTabType;
  onSelectTab: (tab: MainTabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ currentTab, onSelectTab }) => {
  const { colors, t, triggerHaptic } = useMess();
  const insets = useSafeAreaInsets();

  const tabs: { key: MainTabType; label: string; iconFocused: keyof typeof Ionicons.glyphMap; iconUnfocused: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'home', label: t('home'), iconFocused: 'home', iconUnfocused: 'home-outline' },
    { key: 'meals', label: t('meals'), iconFocused: 'restaurant', iconUnfocused: 'restaurant-outline' },
    { key: 'market', label: t('market'), iconFocused: 'cart', iconUnfocused: 'cart-outline' },
    { key: 'accounts', label: t('accounts'), iconFocused: 'wallet', iconUnfocused: 'wallet-outline' },
    { key: 'profile', label: t('profile'), iconFocused: 'person', iconUnfocused: 'person-outline' },
  ];

  const handlePress = (tabKey: MainTabType) => {
    if (tabKey !== currentTab) {
      triggerHaptic();
      onSelectTab(tabKey);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.tabBarBorder,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              onPress={() => handlePress(tab.key)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconWrap,
                  isActive && {
                    backgroundColor: colors.primary + '25',
                  },
                ]}
              >
                <Ionicons
                  name={isActive ? tab.iconFocused : tab.iconUnfocused}
                  size={21}
                  color={isActive ? colors.tabActive : colors.tabInactive}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? colors.tabActive : colors.tabInactive },
                  isActive && styles.activeTabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 48,
  },
  iconWrap: {
    width: 38,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  activeTabLabel: {
    fontWeight: '700',
  },
});
