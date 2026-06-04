import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { 
  registerForPushNotificationsAsync, 
  scheduleStretchingReminder, 
  cancelAllReminders, 
  sendTestReminder,
  getScheduledReminders 
} from '../services/notificationService';

export default function HomeScreen() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [isReminderActive, setIsReminderActive] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Register notifikasi
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    // Cek apakah ada reminder yang aktif
    checkActiveReminders();
  }, []);

  async function checkActiveReminders() {
    const scheduled = await getScheduledReminders();
    setIsReminderActive(scheduled.length > 0);
    if (scheduled.length > 0 && scheduled[0]?.trigger?.seconds) {
      const minutes = scheduled[0].trigger.seconds / 60;
      setSelectedInterval(minutes);
    }
  }

  async function startReminder(intervalMinutes) {
    setLoading(true);
    setSelectedInterval(intervalMinutes);
    const success = await scheduleStretchingReminder(intervalMinutes);
    if (success) {
      setIsReminderActive(true);
      Alert.alert(
        'Berhasil!', 
        `✅ Reminder stretching aktif!\n\nAkan mengingatkan setiap ${intervalMinutes} menit.\n\nJaga kesehatan terus ya! 🧘`
      );
    } else {
      Alert.alert('Gagal', 'Gagal mengaktifkan reminder. Coba lagi.');
    }
    setLoading(false);
  }

  async function stopReminder() {
    setLoading(true);
    await cancelAllReminders();
    setIsReminderActive(false);
    Alert.alert('Berhenti', '⏹️ Reminder stretching telah dihentikan');
    setLoading(false);
  }

  async function testReminder() {
    const success = await sendTestReminder();
    if (success) {
      Alert.alert('Test', '🔔 Notifikasi test akan muncul sekarang');
    } else {
      Alert.alert('Error', 'Gagal mengirim notifikasi test');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🧘‍♀️</Text>
        <Text style={styles.title}>Stretching Reminder</Text>
        <Text style={styles.subtitle}>Ingatkan dirimu untuk bergerak</Text>
      </View>

      {expoPushToken ? (
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenText}>✅ Notifikasi siap digunakan</Text>
        </View>
      ) : (
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenText}>⏳ Mengaktifkan notifikasi...</Text>
        </View>
      )}

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Status Reminder:</Text>
        <Text style={isReminderActive ? styles.statusActive : styles.statusInactive}>
          {isReminderActive ? '🟢 AKTIF' : '⚪ TIDAK AKTIF'}
        </Text>
        {isReminderActive && (
          <Text style={styles.intervalInfo}>
            Setiap {selectedInterval} menit sekali
          </Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Pilih Interval Stretching:</Text>
      
      <View style={styles.intervalContainer}>
        <TouchableOpacity 
          style={[
            styles.intervalButton, 
            selectedInterval === 15 && styles.intervalSelected,
            isReminderActive && styles.intervalDisabled
          ]} 
          onPress={() => startReminder(15)}
          disabled={isReminderActive || loading}
        >
          <Text style={styles.intervalEmoji}>⚡</Text>
          <Text style={styles.intervalText}>15 Menit</Text>
          <Text style={styles.intervalDesc}>Intensif</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.intervalButton, 
            selectedInterval === 30 && styles.intervalSelected,
            isReminderActive && styles.intervalDisabled
          ]} 
          onPress={() => startReminder(30)}
          disabled={isReminderActive || loading}
        >
          <Text style={styles.intervalEmoji}>🌟</Text>
          <Text style={styles.intervalText}>30 Menit</Text>
          <Text style={styles.intervalDesc}>Rekomendasi</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.intervalButton, 
            selectedInterval === 60 && styles.intervalSelected,
            isReminderActive && styles.intervalDisabled
          ]} 
          onPress={() => startReminder(60)}
          disabled={isReminderActive || loading}
        >
          <Text style={styles.intervalEmoji}>🐢</Text>
          <Text style={styles.intervalText}>60 Menit</Text>
          <Text style={styles.intervalDesc}>Santai</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionContainer}>
        {!isReminderActive ? (
          <TouchableOpacity 
            style={[styles.button, styles.buttonStart]} 
            onPress={() => startReminder(selectedInterval)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>🚀 Mulai Reminder</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.buttonStop]} 
            onPress={stopReminder}
            disabled={loading}
          >
            <Text style={styles.buttonText}>⏹️ Hentikan Reminder</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.button, styles.buttonTest]} 
          onPress={testReminder}
          disabled={loading}
        >
          <Text style={styles.buttonText}>🔔 Test Notifikasi</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 Manfaat Stretching:</Text>
        <Text style={styles.infoText}>• Meningkatkan fleksibilitas tubuh</Text>
        <Text style={styles.infoText}>• Mengurangi ketegangan otot</Text>
        <Text style={styles.infoText}>• Melancarkan peredaran darah</Text>
        <Text style={styles.infoText}>• Mengurangi stres</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#10b981',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  tokenContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tokenText: {
    fontSize: 12,
    color: '#64748b',
  },
  statusCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 10,
  },
  statusActive: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
  },
  statusInactive: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  intervalInfo: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  intervalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 25,
    gap: 10,
  },
  intervalButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  intervalSelected: {
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#10b981',
  },
  intervalDisabled: {
    opacity: 0.5,
  },
  intervalEmoji: {
    fontSize: 28,
    marginBottom: 5,
  },
  intervalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  intervalDesc: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  actionContainer: {
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 25,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonStart: {
    backgroundColor: '#10b981',
  },
  buttonStop: {
    backgroundColor: '#ef4444',
  },
  buttonTest: {
    backgroundColor: '#8b5cf6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 6,
    lineHeight: 20,
  },
});