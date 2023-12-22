import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Image, ImageBackground} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ip from './ip';


const EditArticleScreen = ({ route, navigation }) => {
  const { articleId, articleInfo } = route.params;
  const [article, setArticle] = useState(articleInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState([]);
  const [newMediaLinks, setNewMediaLinks] = useState([]);
  const [mediaLink, setMediaLink] = useState('');

  
  

  const backgroundImage = require('../assets/backgroundimage1.jpg');

  const handleUpdateArticle = async () => {
    try {


      Alert.alert(
        'Confirmation',
        'Êtes-vous sûr de vouloir mettre à jour cet article ?',
        [
          {
            text: 'Non',
            style: 'cancel',
          },
          {
            text: 'Oui',
            onPress: async () => {
      setIsLoading(true);
  
    
      const updatedArticle = await updateArticleOnServer(articleId, article);
  
      setIsLoading(false);
  
      
      if (updatedArticle.success) {
       
        Alert.alert('Succès', 'L\'article a été mis à jour avec succès.', [{ text: 'OK' }]);
        navigation.goBack();
      } else {
       
        Alert.alert('Erreur', "Erreur lors de la mise à jour de l'article.", [{ text: 'OK' }]);
                }
              },
            },
          ]
        );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      setIsLoading(false);
      
      Alert.alert('Erreur', 'Erreur lors de la mise à jour de l\'article.', [{ text: 'OK' }]);
    }
  };
  

    const updateArticleOnServer = async (articleId, updatedArticle) => {
      try {
        const response = await fetch(`http://${ip}:3000/articles/${articleId}`, {
          method: 'PUT', // Utilisez la méthode appropriée (PUT, PATCH, etc.) pour la mise à jour
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedArticle),
        });
    
        // Parsez la réponse JSON
        const result = await response.json();
    
        return result; // Renvoie la réponse du serveur (peut inclure un indicateur de réussite et d'autres données)
      } catch (error) {
        console.error('Erreur lors de la requête de mise à jour:', error);
        throw error; // Vous pouvez choisir de gérer les erreurs ici ou les laisser être traitées dans la fonction appelante
      }
    };



    // Remplacez la fonction handleDeleteMedia par ceci
const handleDeleteMedia = (mediaIndex) => {
  if (article.mediaLinks && Array.isArray(article.mediaLinks)) {
    console.log('Tentative de suppression du média à l\'index', mediaIndex);
    const updatedMediaLinks = article.mediaLinks.filter((_, index) => index !== mediaIndex);
    setArticle({ ...article, mediaLinks: updatedMediaLinks });
  }
};

// Remplacez la fonction renderMedia par ceci
const renderMedia = (media, index) => (
  <View key={index} style={styles.mediaContainer}>
    <Image source={{ uri: media }} style={styles.mediaImage} />
    <TouchableOpacity onPress={() => handleDeleteMedia(index)} style={styles.deleteButton}>
      <Text style={styles.deleteButtonText}>Supprimer</Text>
    </TouchableOpacity>
  </View>
);

// Remplacez la fonction handleAddNewMediaLink par ceci
const handleAddNewMediaLink = () => {
  if (mediaLink.trim() !== '') {
    // Utilisez la méthode setArticle pour mettre à jour la liste des médias
    setArticle((prevArticle) => ({
      ...prevArticle,
      mediaLinks: [...prevArticle.mediaLinks, mediaLink],
    }));
    setMediaLink('');
  }
};

    

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <ScrollView style={styles.container}>
        <View style={styles.overlay}>
          <Text style={styles.title}>Modifier l'article</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Titre :</Text>
            <TextInput
              style={styles.input}
              placeholder="Titre de l'article"
              value={article.title}
              onChangeText={(text) => setArticle({ ...article, title: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contenu de l'article :</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              multiline
              placeholder="Contenu de l'article"
              value={article.content}
              onChangeText={(text) => setArticle({ ...article, content: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Catégorie :</Text>
            <Picker
              style={styles.picker}
              selectedValue={article.category}
              onValueChange={(value) => setArticle({ ...article, category: value })}
            >
              <Picker.Item label="Sélectionner une catégorie" value="null" />
              <Picker.Item label="Technologie" value="technology" />
              <Picker.Item label="Science" value="science" />
              <Picker.Item label="Santé" value="sante" />
              <Picker.Item label="Education" value="education" />
              <Picker.Item label="Divertissement" value="divertissement" />
              <Picker.Item label="Sport" value="sport" />
              <Picker.Item label="Mode" value="mode" />
              <Picker.Item label="Voyage" value="voyage" />
              <Picker.Item label="Cuisine" value="cuisine" />
              <Picker.Item label="Musique" value="musique" />
              <Picker.Item label="Gaming" value="gaming" />
            </Picker>
          </View>


          <View style={styles.inputContainer}>
  <Text style={styles.label}>Médias existants :</Text>
  {article.mediaLinks && article.mediaLinks.map((media, index) => renderMedia(media, index))}
</View>


        <View style={styles.inputContainer}>
  <Text style={styles.label}>Ajouter des médias :</Text>
  <TextInput
    style={styles.input}
    placeholder="Collez le lien du média ici"
    value={mediaLink}
    onChangeText={(text) => setMediaLink(text)}
  />
  <Button title="Ajouter" onPress={handleAddNewMediaLink} />
</View>


          <View style={styles.buttonContainer}>
            <Button title="Mettre à jour l'article" onPress={handleUpdateArticle} />
          </View>
        </View>

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
    padding: 20,
    marginTop: 50,
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
  },
  picker: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  buttonContainer: {
    marginTop: 20,
  },
  loadingContainer: {
    marginTop: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginBottom:50,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  mediaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  mediaImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
  },
});

export default EditArticleScreen;
