import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNetwork } from '@/hooks/useNetwork';

interface OfflineIndicatorProps {
  onRetry?: () => void;
  showRetryButton?: boolean;
}

export default function OfflineIndicator({ 
  onRetry, 
  showRetryButton = true 
}: OfflineIndicatorProps) {
  const { isOffline, isConnected, type } = useNetwork();
  const [fadeAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (isOffline) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOffline, fadeAnim]);

  if (!isOffline) {
    return null;
  }

  const getConnectionMessage = () => {
    if (!isConnected) {
      return 'No internet connection';
    }
    
    switch (type) {
      case 'wifi':
        return 'WiFi connected but no internet access';
      case 'cellular':
        return 'Mobile data connected but no internet access';
      default:
        return 'Limited connectivity';
    }
  };

  const getConnectionIcon = () => {
    if (!isConnected) {
      return 'wifi-off';
    }
    
    switch (type) {
      case 'wifi':
        return 'wifi-outline';
      case 'cellular':
        return 'cellular-outline';
      default:
        return 'cloud-offline-outline';
    }
  };

  return (
    <Animated.View 
      style={[styles.container, { opacity: fadeAnim }]}
      pointerEvents="box-none"
    >
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.leftContent}>
            <Ionicons 
              name={getConnectionIcon() as any} 
              size={20} 
              color="#EF4444" 
            />
            <Text variant="bodySmall" style={styles.message}>
              {getConnectionMessage()}
            </Text>
          </View>
          
          {showRetryButton && onRetry && (
            <IconButton
              icon="refresh"
              size={16}
              onPress={onRetry}
              style={styles.retryButton}
              iconColor="#3B82F6"
            />
          )}
        </Card.Content>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  card: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  message: {
    color: '#DC2626',
    marginLeft: 8,
    fontWeight: '500',
  },
  retryButton: {
    margin: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});
