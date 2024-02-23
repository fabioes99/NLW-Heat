import React, { createContext, useContext, useState, useEffect } from "react";
import { Platform } from 'react-native'
import * as AuthSession from 'expo-auth-session';
import { api } from "../services/api";
import AsyncStorageLib from "@react-native-async-storage/async-storage";

const CLIENT_ID = 'ee21308c2146334a6cef';
const SCOPE = 'read:user';
const USER_STORAGE = '@nlwheat:user';
const TOKEN_STORAGE = '@nlwheat:token';

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
}

type AuthContextData = {
  user: User | null;
  isSigningIn: boolean;
  signOut: () => Promise<void>;
}
type AuthProviderProps = {
  children: React.ReactNode;
}

type AuthResponse = {
  token: string;
  user: User;
}

type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  },
  type?: string;
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {

  const [isSigningIn, setIsSigningIn] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  /* funcao antiga do auth-expo-session
  async function signIn() {
    
    try {
      setIsSigningIn(true);
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;
      const authSessionResponse = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;
      console.log(authSessionResponse);

      if ( authSessionResponse.type === 'success' && authSessionResponse.params.error !== 'acess_denied' ) {
        
        const authResponse = await api.post('/authenticate', { code: authSessionResponse.params.code });
        
        const { user, token } = authResponse.data as AuthResponse;
        console.log(authResponse.data);
  
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await AsyncStorageLib.setItem(USER_STORAGE, JSON.stringify(user));
        await AsyncStorageLib.setItem(TOKEN_STORAGE, token );
  
        setUser(user);
      }
    } catch (error) {
      console.log(error);
    }
    finally{
      setIsSigningIn(false);
    }
    
  } */

  async function signOut() {
    setUser(null);
    await AsyncStorageLib.removeItem(USER_STORAGE);
    await AsyncStorageLib.removeItem(TOKEN_STORAGE);
  }

  useEffect(() => {
    async function loadUserStorageData(  ){
      const userStorage = await AsyncStorageLib.getItem(USER_STORAGE);
      const tokenStorage = await AsyncStorageLib.getItem(TOKEN_STORAGE);
     
      if (userStorage && tokenStorage) {
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`;
        setUser(JSON.parse(userStorage));
      }
      setIsSigningIn(false);
    }

    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{
      signOut,
      user,
      isSigningIn, 
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth }