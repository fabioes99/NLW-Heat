import React, { useState, useEffect } from 'react';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import { Text, View } from 'react-native'
import * as Linking from 'expo-linking';
import { api } from "../../services/api";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { Button } from '../../components/Button';
import { COLORS } from "../../theme";
import { styles } from './styles';
import { useAuth } from "../../hooks/auth";

export function SignInComponent() {
  const { setUser } = useAuth();
  const CLIENT_ID = 'ee21308c2146334a6cef';
  const [isSigningIn, setIsSigningIn] = useState(false);
  const USER_STORAGE = '@nlwheat:user';
  const TOKEN_STORAGE = '@nlwheat:token';


  const discovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: `https://github.com/settings/connections/applications/${CLIENT_ID}`,
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: [],
      redirectUri: Linking.createURL(),
    },
    discovery
  );


  useEffect(() => {
    const fetchData = async () => {
      if (response.type === 'success') {
        setIsSigningIn(true);
        try {
          const authResponse = await api.post('/authenticate', { code: response.params.code });
          const { user, token } = authResponse.data as AuthResponse;

  
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          await AsyncStorageLib.setItem(USER_STORAGE, JSON.stringify(user));
          await AsyncStorageLib.setItem(TOKEN_STORAGE, token);
  
          setUser(user);
          setIsSigningIn(false);
        } catch (error) {
          setIsSigningIn(false);
          console.log(error);
        }
      }
    };
  
    fetchData();
  }, [response]);
  


  return (
    <View style={styles.container}>
      <Button 
        title="Entrar com GitHub"
        color={COLORS.BLACK_PRIMARY}
        backgroundColor={COLORS.YELLOW}
        icon="github"
        onPress={() => promptAsync()} 
      />
    </View>
  );
};

