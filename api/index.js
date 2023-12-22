const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
const port = 3000;
app.use(cors());

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  mediaLinks: [String],
  createdAt: { type: Date, default: Date.now },
});

const Article = mongoose.model('Article', articleSchema);

mongoose.connect('mongodb+srv://othmane:othmane@cluster0.ltagieg.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
db.once('open', () => {
  console.log('Connecté à MongoDB');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Créer un nouvel article
app.post('/articles', async (req, res) => {
  try {
    const { title, content, category, mediaLinks } = req.body;
    const article = new Article({ title, content, category, mediaLinks });
    await article.save();
    res.json({ success: true, article });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'article:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Récupérer tous les articles
app.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find();

    const formattedArticles = articles.map(article => ({
      _id: article._id,
      title: article.title,
      content: article.content,
      category: article.category,
      mediaLinks: article.mediaLinks,
      createdAt: article.createdAt,
      formattedCreatedAt: new Date(article.createdAt).toLocaleDateString(),
    }));

    res.json({ success: true, articles: formattedArticles });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Supprimer un article par ID
app.delete('/articles/:id', async (req, res) => {
  try {
    const articleId = req.params.id;
    await Article.findByIdAndDelete(articleId);
    res.json({ success: true, message: 'Article supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});


app.put('/articles/:id', async (req, res) => {
  try {
    const articleId = req.params.id;
    const { title, content, category, mediaLinks } = req.body;

    await Article.findByIdAndUpdate(articleId, {
      title,
      content,
      category,
      mediaLinks,
    });

    res.json({ success: true, message: 'Article mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

app.listen(port, () => {
  console.log('Le serveur est en cours d\'exécution sur le port 3000');
});
