import React, { useState } from 'react';
import { View, TextInput, Button, ScrollView, StyleSheet, ImageBackground, Alert, ActivityIndicator, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ip from './ip';



const CreateArticleScreen = () => {
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('null');
  const [mediaLink, setMediaLink] = useState('');
  const [mediaLinks, setMediaLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const backgroundImage = require('../assets/backgroundimage1.jpg');

  const handleSaveArticle = async () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir ajouter cet article ?',
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
              const response = await fetch(`http://${ip}:3000/articles`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: articleTitle,
                  content: articleContent,
                  category: selectedCategory,
                  mediaLinks: mediaLinks,
                }),
              });

              const data = await response.json();
              console.log('Article enregistré avec succès:', data);

              setIsLoading(false);

              Alert.alert(
                'Succès',
                'L\'article a été ajouté avec succès.',
                [
                  {
                    text: 'OK',
                  },
                ]
              );
              setArticleTitle('');
              setArticleContent('');
              setSelectedCategory('null');
              setMediaLink('');
              setMediaLinks([]);


            } catch (error) {
              console.error('Erreur lors de l\'enregistrement de l\'article:', error);
            }
          },
        },
      ]
    );
  };

  const handleAddMediaLink = () => {
    if (mediaLink.trim() !== '') {
      setMediaLinks([...mediaLinks, mediaLink]);
      setMediaLink('');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
    <ScrollView style={styles.container}>
    <View style={styles.overlay}>
      <View style={styles.inputContainer}>
      <Text style={styles.lb}>Titre :</Text>
        <TextInput
          style={styles.input}
          placeholder="Titre de l'article"
          value={articleTitle}
          onChangeText={setArticleTitle}
        />
      </View>
      <View style={styles.inputContainer}>
      <Text style={styles.lb}>Contenu :</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Contenu de l'article"
          value={articleContent}
          onChangeText={setArticleContent}
          multiline={true}
          numberOfLines={4}
        />
      </View>
      <View style={styles.inputContainer}>
      <Text style={styles.lb}>Catégorie :</Text>
        <Picker
          style={styles.picker}
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
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
      <Text style={styles.lb}>Ajouter des médias :</Text>
        <TextInput
          style={styles.input}
          placeholder="Lien du média (photo, vidéo, document, etc.)"
          value={mediaLink}
          onChangeText={setMediaLink}
          onSubmitEditing={handleAddMediaLink}
        />
        <Button title="Ajouter le média" onPress={handleAddMediaLink} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Enregistrer l'article" onPress={handleSaveArticle} />
      </View>
      </View>
      {isLoading &&
            <View style={styles.loadingContainer}>
               <Text style={styles.LDG}>Loading....</Text>
              <ActivityIndicator size="large" color="black" />
            </View>
          }

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
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 20,
  },
  picker: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingContainer: {
    marginTop:10,
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
  lb: {
    marginBottom: 10,
    marginTop: 10,
  },

});

export default CreateArticleScreen;
