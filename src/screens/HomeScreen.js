import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// UUID dari EAS Project
const PROJECT_ID = '745ff646-2b60-439d-9551-32960ce6585d';

export default function HomeScreen() {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
      }
    });
  }, []);

  async function registerForPushNotificationsAsync() {
    try {
      // Cek apakah device fisik
      if (!Device.isDevice) {
        Alert.alert('Error', 'Harus menggunakan HP fisik untuk testing notifikasi');
        return;
      }

      // Minta permission
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert('Error', 'Izin notifikasi ditolak');
        return;
      }

      // Setup Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // Dapatkan token dengan projectId
      const tokenObj = await Notifications.getExpoPushTokenAsync({
        projectId: PROJECT_ID
      });
      
      const token = tokenObj.data;
      console.log('Expo Push Token:', token);
      return token;
      
    } catch (error) {
      console.log('Error getting token:', error.message);
      Alert.alert('Error', `Gagal mendapatkan token: ${error.message}`);
    }
  }

  async function sendLocalNotification() {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Reminder Notification',
          body: 'Praktikum React Native dimulai sekarang',
          data: { screen: 'Home' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
        },
      });
      Alert.alert('Success', 'Notifikasi akan muncul dalam 2 detik');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expo Notification App</Text>

      <Text style={styles.label}>Expo Push Token:</Text>
      <Text style={styles.token}>
        {expoPushToken || 'Loading...'}
      </Text>

      <TouchableOpacity style={styles.button} onPress={sendLocalNotification}>
        <Text style={styles.buttonText}>Send Local Notification (2 detik)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  token: {
    fontSize: 10,
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});