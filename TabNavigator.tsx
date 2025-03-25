import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Screens/HomeScreen';
import CartScreen from './Screens/CartScreen';
import ProfileScreen from './Screens/ProfilScreen';
import { Ionicons } from '@expo/vector-icons';
import colors from './assets/Styles/colors';

const Tab = createBottomTabNavigator();

const getTabBarIcon = ({ route, focused, color, size }: { route: any, focused: boolean, color: string, size: number }) => {
  let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

  if (route.name === 'Accueil') iconName = focused ? 'home' : 'home-outline';
  else if (route.name === 'Panier') iconName = focused ? 'cart' : 'cart-outline';
  else if (route.name === 'Profil') iconName = focused ? 'person' : 'person-outline';

  return <Ionicons name={iconName} size={size} color={color} />;
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Accueil"
      screenOptions={({ route }) => ({
        tabBarIcon: (props) => getTabBarIcon({ ...props, route }),
        tabBarActiveTintColor: colors[7],
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Panier" component={CartScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
