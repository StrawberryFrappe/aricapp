import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles, { colors, spacing, borderRadius } from '../../styles/commonStyles';
import ProfileInput from './_components/ProfileInput';
import profileImage from '../../assets/images/11.jpg';

/**
 * EditProfileScreen Component
 * This component serves as a placeholder for the Edit Profile screen in the app.
 * 
 * @function EditProfileScreen
 * @returns {JSX.Element}
 */

const EditProfileScreen = () => {
  const navigation = useNavigation();

  // Placeholder state for profile data
  const [fullName, setFullName] = useState('Tulio Triviño Travesaño');
  const [userName, setUserName] = useState('TulioTriviño31');
  const [personalDescription, setPersonalDescription] = useState('Quien soy, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tristique nibh mauris, ut gravida ex rhoncus et. Nam eget luctus ante, a suscipit ex. Duis id.');
  const [phoneNumber, setPhoneNumber] = useState('+56 9 8765 4321');

  // State to track which field is being edited
  const [editableField, setEditableField] = useState(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEditPress = (field) => {
    // Toggle the editable state for the clicked field
    setEditableField(editableField === field ? null : field);
  };

  const handleDeleteAccount = () => {
    // Implement delete account logic
    console.log('Delete account pressed');
  };

  const handleSaveChanges = () => {
    // Implement save changes logic
    console.log('Save changes pressed');
    // After saving, set editableField back to null
    setEditableField(null);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={commonStyles.iconLarge}>←</Text>
        </TouchableOpacity>
        <Text style={[commonStyles.titleText, commonStyles.boldText, styles.headerTitle]}>UserFullName</Text>
      </View>

      {/* Profile Picture Section */}
      <View style={styles.profilePictureContainer}>
        <Image source={profileImage} style={commonStyles.avatarBig} />
        <TouchableOpacity>
          <Text style={styles.changePhotoText}>Cambiar foto de perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Inputs */}
      <ProfileInput
        label="Nombre"
        value={fullName}
        onEditPress={() => handleEditPress('fullName')}
        isEditable={editableField === 'fullName'}
        onChangeText={setFullName}
      />
      <ProfileInput
        label="Nombre de Usuario"
        value={userName}
        onEditPress={() => handleEditPress('userName')}
        isEditable={editableField === 'userName'}
        onChangeText={setUserName}
      />
      <ProfileInput
        label="Descripción Personal"
        value={personalDescription}
        onEditPress={() => handleEditPress('personalDescription')}
        isEditable={editableField === 'personalDescription'}
        onChangeText={setPersonalDescription}
        multiline={true}
      />
      <ProfileInput
        label="Numero Telefonico"
        value={phoneNumber}
        onEditPress={() => handleEditPress('phoneNumber')}
        isEditable={editableField === 'phoneNumber'}
        onChangeText={setPhoneNumber}
      />

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
          <Text style={styles.buttonText}>Eliminar cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>

      {/* The bottom navigation is likely handled by the navigator outside this component */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    flex: 1,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  changePhotoText: {
    color: colors.primary,
    marginTop: spacing.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: spacing.md,
    marginTop: spacing.xl,
    paddingBottom: spacing.xxl, // Add padding for bottom navigation
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  deleteButton: {
    backgroundColor: 'red', // Use a red color for delete
  },
  saveButton: {
    backgroundColor: colors.primary, // Use primary color for save
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
