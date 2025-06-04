import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { commonStyles, colors } from '../../styles/commonStyles';
import PublishHeader from './_components/PublishHeader';
import UserProfile from './_components/UserProfile';
import AddTagButton from './_components/AddTagButton';
import TextInputArea from './_components/TextInputArea';
import ActionButtons from './_components/ActionButtons';
import EmergencyButton from './_components/EmergencyButton';

/**
 * PublishScreen Component
 * This component allows users to create and publish new posts
 *
 * @function PublishScreen
 * @returns {JSX.Element}
 */

const PublishScreen = ({ navigation }) => {
  const [postText, setPostText] = useState('');

  const handleBackPress = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const handleAddTag = () => {
    // TODO: Implement tag functionality
    console.log('Add tag pressed');
  };

  const handlePhotoPress = () => {
    // TODO: Implement photo picker
    console.log('Photo pressed');
  };

  const handlePublishPress = () => {
    // TODO: Implement publish functionality
    console.log('Publish pressed', postText);
  };

  const handleEmergencyPress = () => {
    // TODO: Implement emergency declaration
    console.log('Emergency declared');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <PublishHeader onBackPress={handleBackPress} />
        
        <UserProfile 
          username="TulioTrivinio31" 
          avatar={null}
        />
        
        <AddTagButton onPress={handleAddTag} />
        
        <TextInputArea 
          value={postText}
          onChangeText={setPostText}
          placeholder="Cuerpo del texto..."
        />
        
        <ActionButtons 
          onPhotoPress={handlePhotoPress}
          onPublishPress={handlePublishPress}
        />
        
        <EmergencyButton onPress={handleEmergencyPress} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
});

export default PublishScreen;
