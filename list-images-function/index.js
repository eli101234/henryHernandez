const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const BUCKET_NAME = 'henry-photos';
const FOLDER_NAME = 'gradPhotos'

exports.listImages = async (req, res) => {
  const folder = req.query.folder || ''; // e.g. "news", "travel"
  const prefix = folder ? `${folder}/` : '';

  try {
    const [files] = await storage.bucket(BUCKET_NAME).getFiles({ prefix });
    const imageUrls = files
      .filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      .map(file => `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`);

    res.set('Access-Control-Allow-Origin', '*');
    res.status(200).json(imageUrls);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error listing images');
  }
};