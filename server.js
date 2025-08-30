const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const ftp = require('basic-ftp');

const app = express();
const PORT = process.env.PORT || 3000;

// Chemin local pour r1.json
const localFile = path.join(__dirname, 'r1.json');

// Fonction pour récupérer r1.json depuis LWS
async function downloadR1() {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    try {
        await client.access({
            host: "ftp.lws.fr",   // mettre le FTP de ton frère
            user: "USERNAME",     // son user FTP
            password: "PASSWORD", // son mot de passe FTP
            secure: false
        });
        await client.downloadTo(localFile, "/chemin-sur-lws/r1.json");
        console.log("r1.json mis à jour depuis LWS");
    } catch (err) {
        console.error(err);
    }
    client.close();
}

// Télécharger au démarrage
downloadR1();

// Puis toutes les 30 secondes (ou le temps que tu veux)
setInterval(downloadR1, 30000);

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
