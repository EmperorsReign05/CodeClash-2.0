console.log('Starting server...');
const chrono = require('chrono-node');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Google Calendar setup
const CREDENTIALS_PATH = path.join(__dirname, 'calendar-credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const { client_secret, client_id, redirect_uris } = credentials.installed;

const oAuth2Client = new google.auth.OAuth2(
  client_id, client_secret, redirect_uris[0]
);

if (fs.existsSync(TOKEN_PATH)) {
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oAuth2Client.setCredentials(token);
  console.log('OAuth token loaded');
} else {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
  });
  console.log('Authorize this app by visiting this url:', authUrl);
}

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

// Firebase setup
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Routes
app.get('/', (req, res) => {
  res.send('Task Companion API is running!');
});

app.post('/task', async (req, res) => {
  const { task } = req.body;
  console.log('Received task:', task);

  try {
    // Save to Firestore
    await db.collection('tasks').add({
      task: task,
      createdAt: new Date(),
    });

    console.log('Saved to Firestore');

    // Parse date using chrono-node
    const parsedDate = chrono.parseDate(task);

    const startDateTime = parsedDate
      ? parsedDate.toISOString()
      : new Date().toISOString();

    const endDateTime = parsedDate
      ? new Date(parsedDate.getTime() + 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Create Calendar event using parsed date
    const event = {
      summary: task,
      start: {
        dateTime: startDateTime,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Asia/Kolkata',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    console.log('Calendar event created:', response.data.htmlLink);
   // If task includes "call", also dispatch to Omnidimension
if (task.toLowerCase().includes('call')) {
  try {
    const omniResponse = await fetch('http://localhost:5050/dispatch_call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_id: 1859,  // your real agent ID
        input_text: task
      }),
    });

    const omniResult = await omniResponse.json();
    console.log('Omnidimension Response:', omniResult);
  } catch (err) {
    console.error('Error calling Omnidimension:', err);
  }
}


    // Respond to frontend
    res.status(200).json({
      message: 'Task saved and Calendar event created!',
      calendarLink: response.data.htmlLink,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Error saving task or creating event' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
