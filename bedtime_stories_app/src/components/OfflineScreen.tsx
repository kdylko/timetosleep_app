import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNetwork } from '@/hooks/useNetwork';

interface OfflineScreenProps {
  onRetry?: () => void;
  title?: string;
  message?: string;
  showRetryButton?: boolean;
}

export default function OfflineScreen({ 
  onRetry,
  title = "You're Offline",
  message = "Please check your internet connection and try again.",
  showRetryButton = true
}: OfflineScreenProps) {
  const { isOffline, type } = useNetwork();

  const getOfflineIcon = () => {
    switch (type) {
      case 'wifi':
        return 'wifi-off';
      case 'cellular':
        return 'cellular-outline';
      default:
        return 'cloud-offline';
    }
  };

  const getOfflineMessage = () => {
    if (!isOffline) {
      return "You're back online!";
    }
    
    switch (type) {
      case 'wifi':
        return "WiFi is connected but you don't have internet access.";
      case 'cellular':
        return "Mobile data is connected but you don't have internet access.";
      default:
        return "Please check your internet connection and try again.";
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={getOfflineIcon() as any} 
              size={64} 
              color="#6B7280" 
            />
          </View>
          
          <Text variant="headlineSmall" style={styles.title}>
            {title}
          </Text>
          
          <Text variant="bodyLarge" style={styles.message}>
            {message || getOfflineMessage()}
          </Text>
          
          {showRetryButton && onRetry && (
            <Button 
              mode="contained" 
              onPress={onRetry}
              style={styles.retryButton}
              icon="refresh"
            >
              Try Again
            </Button>
          )}
          
          <View style={styles.tipsContainer}>
            <Text variant="titleSmall" style={styles.tipsTitle}>
              Troubleshooting Tips:
            </Text>
            <Text variant="bodySmall" style={styles.tip}>
              • Check your WiFi or mobile data connection
            </Text>
            <Text variant="bodySmall" style={styles.tip}>
              • Move to an area with better signal
            </Text>
            <Text variant="bodySmall" style={styles.tip}>
              • Restart your router or mobile data
            </Text>
            <Text variant="bodySmall" style={styles.tip}>
              • Check if other apps are working
            </Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    elevation: 2,
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    marginBottom: 24,
  },
  tipsContainer: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
  },
  tipsTitle: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  tip: {
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 18,
  },
});
