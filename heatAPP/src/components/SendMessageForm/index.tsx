import React, { useState } from "react";

import { View, Text, TextInput, Alert, Keyboard } from 'react-native';
import { api } from "../../services/api";
import { COLORS } from "../../theme";
import { Button } from '../Button';
import { styles } from './styles';

export function SendMessageForm() {
 
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  
  async function handleMessageSubmit() {
    try {
      const messageFormatted = message.trim();
  
      if (messageFormatted.length > 0) {
        setSendingMessage(true);
        await api.post('/messages', { message: messageFormatted });
  
        setMessage('');
        Keyboard.dismiss();
        setSendingMessage(false);
        Alert.alert('Mensagem enviada com sucesso!');
      } else {
        Alert.alert('Escreva a mensagem para enviar.');
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      Alert.alert('Erro ao enviar mensagem. Por favor, tente novamente mais tarde.');
      setSendingMessage(false);
    }
  }
  
  return (
    <View style={styles.container}>

      <TextInput
        keyboardAppearance="dark"
        style={styles.input}
        placeholder="Qual a sua expectativa para o evento"
        placeholderTextColor={COLORS.GRAY_PRIMARY}
        multiline
        maxLength={140}
        onChangeText={setMessage}
        value={message}
        editable={!sendingMessage}
      />

      <Button
        title="ENVIAR MENSAGEM"
        backgroundColor={COLORS.PINK}
        color={COLORS.WHITE}
        isLoading={sendingMessage}
        onPress={handleMessageSubmit}
      />
    </View>
  )
}