import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './Screens/LoginScreen';
import SignUpScreen from './Screens/SignUpScreen';
import ForgotPasswordScreen from './Screens/ForgotPassword';
import HomeScreen from './Screens/HomeScreen';
import RestaurantMenuScreen from './Screens/MenuScreen';
import ProductDetailsScreen from './Screens/ProductDetailsScreen';
import CartScreen from './Screens/CartScreen';
import { CartProvider } from './Context/CartContext';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Accueil">
      <Drawer.Screen name="Accueil" component={HomeScreen} />
      <Drawer.Screen 
        name="CartScreen" 
        component={CartScreen} 
        options={{ 
          title: "Panier",
        }} 
      />
      <Drawer.Screen 
        name="RestaurantMenu" 
        component={RestaurantMenuScreen} 
        options={{ 
          title: 'Menu',
          drawerItemStyle: { display: 'none' }
        }} 
      />
      <Drawer.Screen 
        name="ProductDetailsScreen" 
        component={ProductDetailsScreen} 
        options={{ 
          title: 'Produit',
          drawerItemStyle: { display: 'none' } 
        }} 
      />
      <Drawer.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ 
          headerShown: false,
          drawerItemStyle: { display: 'none' }
        }} 
      />
      <Drawer.Screen 
        name="SignUp" 
        component={SignUpScreen} 
        options={{ 
          title: 'Créer un compte',
          drawerItemStyle: { display: 'none' } 
        }} 
      />
      <Drawer.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        options={{ 
          title: 'Mot de passe oublié',
          drawerItemStyle: { display: 'none' }
        }} 
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </CartProvider>
  );
}
