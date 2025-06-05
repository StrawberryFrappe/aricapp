import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { commonStyles, colors } from '../../styles/commonStyles';
import ChatHeader from './_components/ChatHeader';
import ConflictMessage from './_components/ConflictMessage';
import ChatMessage from './_components/ChatMessage';
import ChatInput from './_components/ChatInput';

/**
 * InnerStatsScreen Component
 * This component displays the detailed view for specific statistics.
 * It shows the statistic description, data visualizations, and interaction area.
 * 
 * @function InnerStatsScreen
 * @returns {JSX.Element}
 */

const InnerStatsScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      username: "TulioTriviño31",
      role: "Vecino - Contraparte",
      timestamp: "Tú",
      message: "Aver, aver, aver... Pero quien es uste-e-e-e-d",
      isOwn: false,
    },
    {
      id: 2,
      username: "Current User",
      role: "Vecino",
      timestamp: "Tú",
      message: "Holaa :3, Soy Hatsune Miku y vine para que me entrevistees :D",
      isOwn: true,
    },
    {
      id: 3,
      username: "Current User",
      role: "Vecino",
      timestamp: "Tú",
      variant: "image",
      imageSource: "https://example.com/street-image.jpg", // Placeholder for the street image
      isOwn: true,
    },
    {
      id: 4,
      username: "NoSoyTulioTriv33",
      role: "Mediador",
      timestamp: "",
      message: "No me gusta como canta, regresese para Japon.",
      isOwn: false,
    },
  ]);

  const handleSendMessage = (messageText) => {
    const newMessage = {
      id: Date.now(),
      username: "Current User",
      role: "Vecino",
      timestamp: "Tú",
      message: messageText,
      isOwn: true,
    };
    setMessages([...messages, newMessage]);
  };

  const handleAttachmentPress = () => {
    // Handle attachment functionality
    console.log("Attachment pressed");
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ChatHeader title="Estadísticas Detalladas" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ConflictMessage 
          title="Análisis estadístico:"
          description="Datos detallados de tus métricas y progreso"
        />
        
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            username={message.username}
            role={message.role}
            timestamp={message.timestamp}
            message={message.message}
            isOwn={message.isOwn}
            variant={message.variant}
            imageSource={message.imageSource}
          />
        ))}
      </ScrollView>
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        onAttachmentPress={handleAttachmentPress}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
});

export default InnerStatsScreen;
