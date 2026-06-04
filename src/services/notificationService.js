import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';

// UUID dari EAS Project (ganti dengan UUID Anda)
const PROJECT_ID = '745ff646-2b60-439d-9551-32960ce6585d';

export async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      Alert.alert('Error', 'Harus menggunakan HP fisik untuk testing notifikasi');
      return null;
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
      return null;
    }

    // Setup Android channel untuk stretching
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('stretching', {
        name: 'Stretching Reminder',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10b981',
        sound: 'default',
      });
    }

    // Dapatkan token
    const tokenObj = await Notifications.getExpoPushTokenAsync({
      projectId: PROJECT_ID
    });
    
    const token = tokenObj.data;
    console.log('✅ Stretching App Token:', token);
    return token;
    
  } catch (error) {
    console.log('Error getting token:', error.message);
    return null;
  }
}

// Jadwalkan reminder stretching
export async function scheduleStretchingReminder(intervalMinutes = 30) {
  try {
    // Hapus semua reminder yang sudah ada sebelumnya
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Buat reminder baru
    const reminderId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🧘 Waktunya Stretching!',
        body: 'Sudah waktunya untuk peregangan. Sehatkan tubuhmu!',
        sound: 'default',
        data: { type: 'stretching_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: intervalMinutes * 60,
        repeats: true,
      },
    });
    
    console.log(`✅ Reminder stretching dijadwalkan setiap ${intervalMinutes} menit`);
    return reminderId;
  } catch (error) {
    console.log('Error scheduling reminder:', error.message);
    return null;
  }
}

// Hapus semua reminder
export async function cancelAllReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('✅ Semua reminder dihapus');
}

// Kirim reminder langsung (test)
export async function sendTestReminder() {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🧘 Reminder Test',
        body: 'Jangan lupa stretching!',
        sound: 'default',
        data: { type: 'test_reminder' },
      },
      trigger: null,
    });
    console.log('✅ Test reminder dikirim');
    return true;
  } catch (error) {
    console.log('Error sending test reminder:', error.message);
    return false;
  }
}

// Dapatkan semua scheduled reminders
export async function getScheduledReminders() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled;
}