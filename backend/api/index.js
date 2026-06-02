const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware - CORS configuré pour accepter tous les origins
app.use(cors({
  origin: '*', // Accepte tous les origins (à restreindre en production)
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Configuration email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route pour envoyer une candidature
app.post('/api/submit-candidature', async (req, res) => {
  try {
    const data = req.body;
    console.log(' Candidature reçue :', data.nom, data.email);

    // Construire le corps du message
    const body = `
Nouvelle candidature Ghostech 

━━━━━━━━━━━━━━━━━━━━━━━━━━━
 INFORMATIONS PERSONNELLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nom et Prénoms : ${data.nom}
Âge            : ${data.age}
Sexe           : ${data.sexe}
Ville          : ${data.ville}
WhatsApp       : ${data.whatsapp}
Email          : ${data.email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
 POSTE SOUHAITÉ
━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.poste}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
 COMPÉTENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Technologies   : ${data.competences}
Niveau         : ${data.niveau}
Projets        : ${data.projets}
${data.projetsDetail ? 'Détails projets : ' + data.projetsDetail : ''}
Portfolio      : ${data.portfolio || 'Non renseigné'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
 MOTIVATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pourquoi Ghostech ?
${data.motivation}

Apport à l'équipe :
${data.apport}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
 DISPONIBILITÉ
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Travail à distance : ${data.remote}
Heures/semaine     : ${data.heures}
Engagement actif   : ${data.engagement}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
Construire. Impacter. Conquérir.
    `.trim();

    // Email HTML pour l'équipe avec design Ghostech
    const emailToTeam = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'DM Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #0d2b2a;
            background: #f0f2f4;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(26,122,120,0.10);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #0d2b2a 0%, #1a5f5d 50%, #0d2b2a 100%);
            color: #fff;
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.02em;
          }
          .header p {
            margin: 10px 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .content {
            padding: 30px;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            background: linear-gradient(135deg, #2aa8a2, #3ecfca);
            color: #fff;
            padding: 12px 16px;
            border-radius: 8px;
            font-weight: 700;
            margin-bottom: 12px;
            font-size: 14px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          .info-row {
            display: flex;
            padding: 8px 0;
            border-bottom: 1px solid #e8f1f0;
          }
          .info-label {
            font-weight: 600;
            color: #1a7a78;
            width: 40%;
            min-width: 140px;
          }
          .info-value {
            color: #333;
            word-break: break-word;
          }
          .divider {
            border: none;
            border-top: 2px dashed #3ecfca;
            margin: 20px 0;
          }
          .highlight {
            background: rgba(62, 207, 202, 0.08);
            padding: 16px;
            border-left: 4px solid #3ecfca;
            border-radius: 4px;
            margin: 15px 0;
          }
          .footer {
            background: #f9fbfb;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e8f1f0;
            font-size: 12px;
            color: #5a7372;
          }
          .badge {
            display: inline-block;
            background: linear-gradient(135deg, #e8a520, #f4c04a);
            color: #fff;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 13px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nouvelle Candidature</h1>
            <p>Poste : <strong>${data.poste}</strong></p>
          </div>
          <div class="content">
            
            <div class="section">
              <div class="section-title">Informations Personnelles</div>
              <div class="info-row">
                <div class="info-label">Nom :</div>
                <div class="info-value"><strong>${data.nom}</strong></div>
              </div>
              <div class="info-row">
                <div class="info-label">Âge :</div>
                <div class="info-value">${data.age} ans</div>
              </div>
              <div class="info-row">
                <div class="info-label">Sexe :</div>
                <div class="info-value">${data.sexe}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Ville :</div>
                <div class="info-value">${data.ville}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email :</div>
                <div class="info-value"><a href="mailto:${data.email}" style="color: #2aa8a2; text-decoration: none;">${data.email}</a></div>
              </div>
              <div class="info-row">
                <div class="info-label">WhatsApp :</div>
                <div class="info-value">${data.whatsapp}</div>
              </div>
            </div>

            <hr class="divider">

            <div class="section">
              <div class="section-title">Poste Souhaité</div>
              <div class="highlight"><strong>${data.poste}</strong></div>
            </div>

            <hr class="divider">

            <div class="section">
              <div class="section-title">Compétences</div>
              <div class="info-row">
                <div class="info-label">Technologies :</div>
                <div class="info-value">${data.competences}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Niveau :</div>
                <div class="info-value"><strong>${data.niveau}</strong></div>
              </div>
              <div class="info-row">
                <div class="info-label">Projets :</div>
                <div class="info-value">${data.projets}</div>
              </div>
              ${data.projetsDetail ? '<div class="info-row"><div class="info-label">Détails :</div><div class="info-value">' + data.projetsDetail + '</div></div>' : ''}
              ${data.portfolio ? '<div class="info-row"><div class="info-label">Portfolio :</div><div class="info-value"><a href="' + data.portfolio + '" target="_blank" style="color: #2aa8a2; text-decoration: none;">' + data.portfolio + '</a></div></div>' : ''}
            </div>

            <hr class="divider">

            <div class="section">
              <div class="section-title">Motivation</div>
              <div class="highlight">
                <strong>Pourquoi Ghostech ?</strong><br>
                <p>${data.motivation}</p>
              </div>
              <div class="highlight">
                <strong>Apport à l'équipe :</strong><br>
                <p>${data.apport}</p>
              </div>
            </div>

            <hr class="divider">

            <div class="section">
              <div class="section-title">Disponibilité</div>
              <div class="info-row">
                <div class="info-label">Télétravail :</div>
                <div class="info-value">${data.remote}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Heures/semaine :</div>
                <div class="info-value"><strong>${data.heures}</strong></div>
              </div>
              <div class="info-row">
                <div class="info-label">Engagement :</div>
                <div class="info-value"><strong>${data.engagement}</strong></div>
              </div>
            </div>

            <span class="badge">A examiner</span>
          </div>
          <div class="footer">
            <p><strong>Ghostech</strong> – Innover. Apprendre. Construire.</p>
            <p>© 2026 Ghostech Recrutement</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email HTML pour le candidat avec design Ghostech
    const emailToCandidate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'DM Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #0d2b2a;
            background: #f0f2f4;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(26,122,120,0.10);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #2aa8a2, #3ecfca);
            color: #fff;
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 800;
          }
          .content {
            padding: 30px;
          }
          .welcome {
            font-size: 18px;
            color: #1a7a78;
            margin-bottom: 20px;
          }
          .highlight-box {
            background: linear-gradient(135deg, rgba(42, 168, 162, 0.1), rgba(62, 207, 202, 0.1));
            border-left: 4px solid #2aa8a2;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .step-item {
            display: flex;
            margin: 15px 0;
            align-items: flex-start;
          }
          .step-number {
            display: inline-block;
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #2aa8a2, #3ecfca);
            color: #fff;
            border-radius: 50%;
            text-align: center;
            line-height: 32px;
            font-weight: 700;
            margin-right: 15px;
            flex-shrink: 0;
          }
          .step-text {
            flex: 1;
          }
          .divider {
            border: none;
            border-top: 2px dashed #3ecfca;
            margin: 25px 0;
          }
          .footer {
            background: #f9fbfb;
            padding: 25px;
            text-align: center;
            border-top: 1px solid #e8f1f0;
          }
          .footer-title {
            font-weight: 700;
            color: #1a7a78;
            font-size: 16px;
            margin-bottom: 8px;
          }
          .footer-text {
            color: #5a7372;
            font-size: 13px;
            margin: 5px 0;
          }
          .contact-info {
            display: inline-block;
            background: linear-gradient(135deg, #e8a520, #f4c04a);
            color: #fff;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 15px;
            text-decoration: none;
          }
          .job-badge {
            display: inline-block;
            background: linear-gradient(135deg, #2aa8a2, #3ecfca);
            color: #fff;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 13px;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Merci ${data.nom} !</h1>
          </div>
          <div class="content">
            
            <p class="welcome">Votre candidature pour le poste de <strong>${data.poste}</strong> a bien été reçue !</p>

            <div class="highlight-box">
              <p style="margin: 0; font-weight: 600; color: #1a7a78;">
                Votre candidature a été enregistrée avec succès
              </p>
            </div>

            <p>Notre équipe examinera votre profil attentivement et vous recontactera dans les meilleurs délais.</p>

            <hr class="divider">

            <h3 style="color: #1a7a78; margin-top: 30px;">Prochaines étapes :</h3>

            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-text">
                <strong>Étude des candidatures</strong><br>
                <span style="color: #5a7372; font-size: 14px;">Nous examinons tous les profils reçus</span>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-text">
                <strong>Sélection</strong><br>
                <span style="color: #5a7372; font-size: 14px;">Les profils présélectionnés seront contactés</span>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-text">
                <strong>Entretien</strong><br>
                <span style="color: #5a7372; font-size: 14px;">Via Google Meet, WhatsApp ou Discord</span>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-text">
                <strong>Bienvenue à Ghostech !</strong><br>
                <span style="color: #5a7372; font-size: 14px;">Rejoignez notre équipe de passionnés</span>
              </div>
            </div>

            <hr class="divider">

            <div class="highlight-box">
              <p style="margin: 0; color: #1a7a78;">
                <strong>Conseil :</strong> Gardez un oeil sur vos emails (et dossier spam) !
              </p>
            </div>

          </div>
          <div class="footer">
            <p class="footer-title">Ghostech</p>
            <p class="footer-text">Innover. Apprendre. Construire.</p>
            <p class="footer-text" style="margin-top: 15px;">
              <a href="mailto:ghostech92@gmail.com" style="color: #2aa8a2; text-decoration: none;">ghostech92@gmail.com</a>
            </p>
            <p class="footer-text" style="margin-top: 20px; font-size: 11px; color: #999;">
              © 2026 Ghostech Recrutement
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Envoyer l'email de candidature À L'ÉQUIPE
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL || 'ghostech92@gmail.com',
      subject: `Candidature Ghostech – ${data.poste} – ${data.nom}`,
      html: emailToTeam,
      replyTo: data.email,
    });

    // Envoyer l'email de CONFIRMATION AU CANDIDAT
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: 'Votre candidature Ghostech a été reçue',
      html: emailToCandidate,
    });

    console.log(' Candidature complète envoyée à:', process.env.RECIPIENT_EMAIL);
    console.log(' Confirmation simple envoyée à:', data.email);

    res.status(200).json({
      success: true,
      message: 'Candidature envoyée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de la candidature',
      error: error.message,
    });
  }
});

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get("/", (req, res) => {
  res.send("Ghostech API OK ");
});

module.exports = app;
