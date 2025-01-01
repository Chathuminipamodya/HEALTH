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

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type Props = {
  route: HomeScreenRouteProp;
};

interface Post {
  id: number;
  title: string;
  body: string;
}

const HomeScreen: React.FC<Props> = () => {
  const [items, setItems] = useState<Post[]>([]);
  const { clickCount, incrementCount } = useStore();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
      setItems(response.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={incrementCount}
    >
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <View style={styles.tagContainer}>
          <Text style={styles.tag}>Active</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.body}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.floatingButton}>
        <Text style={styles.floatingButtonText}>Clicks: {clickCount}</Text>
      </TouchableOpacity>
    </View>
  );
};
export default HomeScreen;