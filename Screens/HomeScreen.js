import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ImageBackground, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import ip from './ip';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';

const HomeScreen = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  
  const backgroundImage = require('../assets/backgroundimage1.jpg');
  const navigation = useNavigation();

  const fetchArticles = async () => {
    try {
      const response = await fetch(`http://${ip}:3000/articles`);
      const data = await response.json();
      setArticles(data.articles);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      await fetchArticles();
    }, 1000);

    fetchArticles();
    return () => clearInterval(intervalId);
  }, []);



  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const deleteArticle = async (articleId) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cet article ?',
      [
        {
          text: 'Non',
          style: 'cancel',
        },
        {
          text: 'Oui',
          onPress: async () => {
            try {
              setIsLoading(true);
              await fetch(`http://${ip}:3000/articles/${articleId}`, {
                method: 'DELETE',
              });
              await fetchArticles();
              setIsLoading(false);
              Alert.alert(
                'Succès',
                'L\'article a été supprimé avec succès.',
                [
                  {
                    text: 'OK',
                  },
                ]
              );
            } catch (error) {
              console.error('Erreur lors de la suppression de l\'article:', error);
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };
  

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <Text style={styles.welcomeText}>WELCOME TO D BLOG</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher des articles"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
  {filteredArticles && articles.length > 0 ? (
    filteredArticles.map((article) => (
      <View key={article._id} style={styles.articleContainer}>
        <View style={styles.overlay}>
          <Text style={styles.title}>{article.title}</Text>
           <TouchableOpacity
              style={styles.updateButton}
              onPress={() => navigation.navigate('EditArticleScreen', { articleId: article._id, articleInfo: article })}
            >
              <Icon name="pencil" size={20} color="white" />
            </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteArticle(article._id)}
          >
           <Icon name="trash" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.date}>{new Date(article.createdAt).toLocaleDateString()}</Text>
          {article.category !== "null" && (
          <Text style={styles.category}>Catégorie : {article.category}</Text>
        )}
          <Text style={styles.content}>{article.content}</Text>
          <View style={styles.mediaContainer}>
        {article.mediaLinks.map((mediaLink, index) => (
          <View key={index} style={styles.mediaWrapper}>
            {/\.(mp4|webm|ogg|avi|mov|wmv)/i.test(mediaLink) ? (
              <Video
                source={{ uri: mediaLink }}
                style={styles.media}
                useNativeControls
                resizeMode={Video.RESIZE_MODE_CONTAIN}
                isLooping
              />
            ) : (
              <Image source={{ uri: mediaLink }} style={styles.media} />
            )}
          </View>
        ))}
      </View>
        </View>
      </View>
    ))
  ) : (
    <Text style={styles.zero} >Aucun article trouvé</Text>
  )}
  {isLoading && (
    <View style={styles.loadingContainer}>
      <Text style={styles.LDG}>Loading....</Text>
      <ActivityIndicator size="large" color="black" />
    </View>
  )}
</ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%', 
    height: '100%', 
  },
  container: {
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    justifyContent: 'center', 
  },
  articleContainer: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: 'gray',
  },
  category: {
    fontSize: 16,
    color: 'blue',
  },
  content: {
    fontSize: 16,
    marginTop: 8,
  },
  mediaContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 8,
  },
  mediaWrapper: {
    marginBottom: 20,
  },
  media: {
    width: 300,
    height: 200, 
    borderRadius: 8,
  },
  welcomeText: {
    color: 'red',
    fontSize: 30,
    fontWeight: 'bold',
    width: '100%', 
    textAlign: 'center',
    marginTop: 50,
  },
  searchInput: {
    height: 40,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    marginTop:15,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
   loadingContainer: {
    marginTop:100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding:10,
  },
  LDG: {
   textAlign: 'center',
   color: 'black',
  },
  zero:{
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
  updateButton: {
    position: 'absolute',
    top: 10,
    right: 70, // ajuste la position selon tes besoins
    backgroundColor: 'green', // couleur pour le bouton Update
    padding: 10,
    borderRadius: 5,
  },
});

export default HomeScreen;