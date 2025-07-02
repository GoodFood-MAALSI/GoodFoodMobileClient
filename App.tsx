import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import RestaurantMenuScreen from './Screens/MenuScreen';
import ProductDetailsScreen from './Screens/ProductDetailsScreen';
import LoginScreen from './Screens/LoginScreen';
import SignUpScreen from './Screens/SignUpScreen';
import ForgotPasswordScreen from './Screens/ForgotPassword';
import ConfirmEmailScreen from './Screens/ConfirmEmailScreen';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import { CartProvider } from './Context/CartContext';
import { UserProvider } from './Context/UserContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import FavoriteScreen from './Screens/FavoriteScreen';
import ReviewScreen from './Screens/ReviewScreen';
import RestaurantCartScreen from './Screens/RestaurantCartScreen';
import OrderDetailsScreen from './Screens/OrderDetailsScreen';
import OrderHistoryScreen from './Screens/OrderHistoryScreen';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <CartProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Tabs" component={TabNavigator} />
              <Stack.Screen name="RestaurantMenu" component={RestaurantMenuScreen} />
              <Stack.Screen name="RestaurantCart" component={RestaurantCartScreen} />
              <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="Confirmation" component={ConfirmEmailScreen} />
              <Stack.Screen name="Reset" component={ResetPasswordScreen} />
              <Stack.Screen name="Favoris" component={FavoriteScreen} />
              <Stack.Screen name="Reviews" component={ReviewScreen} />
              <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
              <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
