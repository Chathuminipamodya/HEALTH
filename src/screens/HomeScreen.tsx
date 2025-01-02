import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import useStore from '../store/useStore';
import { RootStackParamList } from '../../App';
import { styles } from '../styles/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: any;
};

interface User {
  name: {
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
  };
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { clickCount, incrementCount, activeUserIndexes, toggleActiveUser, resetActiveUsers, resetClickCount } = useStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<{ results: User[] }>('https://randomuser.me/api/?results=20');
      setUsers(response.data.results);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogout = async () => {
    // Clear any stored data like user session or authentication tokens
    await AsyncStorage.removeItem('registeredUsername');
    await AsyncStorage.removeItem('registeredPassword');

    // Reset active users and click count in the store
    resetActiveUsers();
    resetClickCount();

    // Navigate to Login screen
    navigation.navigate('Login');
  };

  const renderUser = ({ item, index }: { item: User, index: number }) => {
    const isActive = activeUserIndexes.has(index); // Check if the user is in the active set

    return (
      <TouchableOpacity
        style={[styles.card, isActive && { backgroundColor: 'lightgreen' }]} // Keep the green color if active
        onPress={() => {
          toggleActiveUser(index); // Toggle the active state
          incrementCount(); // Increment the count for new clicks only
        }}
      >
        <Image
          source={{ uri: item.picture.large }}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <View style={styles.tagContainer}>
            <Text style={styles.tag}>{isActive ? 'Active' : 'Inactive'}</Text>
          </View>
          <Text style={styles.cardTitle}>{`${item.name.first} ${item.name.last}`}</Text>
          <Text style={styles.cardDescription}>{item.email}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Logout button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item, index) => index.toString()}
      />

      <TouchableOpacity style={styles.floatingButton}>
        <Text style={styles.floatingButtonText}> Doctors: {clickCount}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
