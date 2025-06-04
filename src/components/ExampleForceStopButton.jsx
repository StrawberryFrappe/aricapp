import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';
import { initializeShizuku, forceStopApp } from '../ShizukuBridge';

const ExampleForceStopButton = () => {
  const [initialized, setInitialized] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    initializeShizuku()
      .then(() => setInitialized(true))
      .catch(err => {
        console.warn('initializeShizuku error', err);
        if (err.code === 'PERMISSION_REQUIRED' || err.message.includes('User permission')) {
          setShowModal(true);
        }
      });
  }, []);

  const handleForceStop = () => {
    forceStopApp('com.example.target')
      .then(() => console.log('Target app force-stopped'))
      .catch(err => console.error('forceStopApp error', err));
  };

  return (
    <View style={styles.container}>
      <Button title="Close App" onPress={handleForceStop} disabled={!initialized} />
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              To continue, please open Shizuku Manager and tap "Start from ADB".
            </Text>
            <Button title="OK" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalText: {
    marginBottom: 12,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ExampleForceStopButton;
