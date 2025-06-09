import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, Dimensions, View } from 'react-native';
import theme from '../assets/Styles/themes';

interface TabItem<T extends string> {
    key: T;
    label: string;
}

interface CustomTabsProps<T extends string> {
    tabs: TabItem<T>[];
    onTabChange: (key: T) => void;
    activeTab: T;
}

const CustomTabs = <T extends string>({ tabs, onTabChange, activeTab }: CustomTabsProps<T>) => {
    const dynamicFontSize = Math.max(12, 18 - tabs.length);

    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key ? styles.activeTab : styles.inactiveTab]}
                        onPress={() => onTabChange(tab.key)}
                    >
                        <Text style={[styles.tabText, { fontSize: dynamicFontSize }, activeTab === tab.key && styles.activeTabText]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.text,
        backgroundColor: '#F8F9FA',
    },
    container: {
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    tab: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: 15,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary,
    },
    inactiveTab: {
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabText: {
        color: theme.colors.text,
        textAlign: 'center',
    },
    activeTabText: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});

export default CustomTabs;
