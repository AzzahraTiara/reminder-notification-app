import React, { useEffect, useRef } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import HomeScreen from './src/screens/HomeScreen';

// Konfigurasi handler notifikasi
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
  }),
});

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Listener saat notifikasi diterima
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('📱 Stretching Reminder Received:', notification);
    });

    // Listener saat notifikasi ditekan
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('🔔 Stretching Reminder Response:', response);
    });

    // Cleanup
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <HomeScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});