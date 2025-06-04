import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import ProfileHeader from './_components/ProfileHeader';
import PresentationSection from './_components/PresentationSection';
import ProfileTabs from './_components/ProfileTabs';
import Post from '../../components/Post';
import commonStyles from '../../styles/commonStyles';

/**
 * ProfileScreen Component
 * This component serves as a placeholder for the Profile screen in the app.
 * It includes a button to navigate to the EditProfile screen.
 * 
 * @function ProfileScreen
 * @returns {JSX.Element}
 */

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('Publicaciones');

  
  

  // Placeholder data
  const userData = {
    avatarUrl: 'https://via.placeholder.com/150', // Replace with actual avatar URL
    name: 'Tulio Triviño31',
    publications: 8,
    likes: 15,
    presentation: 'Quien soy? Para el ciego, soy el pan. Para el sordo, soy la luz. Para el hambriento, soy el sonido. Heme aqui la encarnacion de la divinidad misma.',
  };

  const publicationsData = [
    {
      id: '1',
      author: 'Tulio Triviño31',
      date: '06-04-2025',
      tags: ['Anuncios', 'Comunidad'],
      content: 'Vecinos, hoy se inauguro el nuevo Parque Cacique Lienan Llanquinao, aca los ninos de la población podrán jugar libremente y los adultos mayores pasear en la tranquilidad del vecindario',
    },
    {
      id: '2',
      author: 'Tulio Triviño31',
      date: '06-04-2025',
      tags: ['Anuncios', 'Comunidad'],
      content: 'Vecinos, hoy se inauguro el nuevo Parque Cacique Lienan Llanquinao, aca los ninos de la población podrán jugar libremente y los adultos mayores pasear en la tranquilidad del vecindario',
    }
    // Add more publication objects here
  ];

  const mentionsData = [
    {
      id: '1',
      author: 'Tulio Triviño31',
      date: '06-04-2025',
      tags: ['Anuncios', 'Comunidad'],
      content: 'Vecinos, hoy se inauguro el nuevo Parque Cacique Lienan Llanquinao, aca los ninos de la población podrán jugar libremente y los adultos mayores pasear en la tranquilidad del vecindario',
    }
    // Add mention objects here
  ];

  const renderContent = () => {
    if (activeTab === 'Publicaciones') {
      return (
        <View>
          {publicationsData.map((post) => (
            <Post key={post.id} {...post} />
          ))}
        </View>
      );
    } else if (activeTab === 'Menciones') {
      return (
        <View>
          {/* Render mentions data here using PostItem or a similar component */}
          {mentionsData.map((mention) => (
            <Post key={mention.id} {...mention} /> // Using PostItem for mentions for now
          ))}
        </View>
      );
    }
    return null;
  };

  return (
    <ScrollView style={commonStyles.container}>
      <ProfileHeader
        avatarUrl={userData.avatarUrl}
        name={userData.name}
        publications={userData.publications}
        likes={userData.likes}
      />
      <PresentationSection text={userData.presentation} />
      <ProfileTabs tabs={['Publicaciones', 'Menciones']} onTabChange={setActiveTab} />
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingBottom: 80, // Add padding to avoid content being hidden by navigation if any
  },
});

export default ProfileScreen;
