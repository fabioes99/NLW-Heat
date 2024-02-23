import React from "react";

import { Text, View, KeyboardAvoidingView, Platform } from 'react-native'

import { styles } from './styles';

import { Header } from '../../components/Header';
import { MessageList } from '../../components/MessageList';
import { useAuth } from "../../hooks/auth";
import { SignInComponent } from '../../components/SignInBox';
import { SendMessageForm } from '../../components/SendMessageForm';

export function Home() {
  const { user } = useAuth();
  
  return (
    <KeyboardAvoidingView
    style={{flex:1}}
    behavior={ Platform.OS === 'ios' ? 'padding': undefined}
    >
     <View style={styles.container}>
        <Header />
        <MessageList />
        
        { user ? <SendMessageForm /> : <SignInComponent /> }
      </View >
    </KeyboardAvoidingView>
  
  )
}