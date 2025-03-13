
# Vintage Vibes

A nostalgic web application that combines retro aesthetics with modern functionality.

## 📋 Overview

Vintage Vibes is a Flask-based web application that offers users a unique nostalgic experience with three main features:

1. **Photo Booth**: Capture moments with vintage-style filters
2. **Anonymous Blog**: Share thoughts freely without identity attachments
3. **Gift Ideas Generator**: AI-powered gift suggestions using Google's Gemini API

## 🚀 Features

### Photo Booth
- Live camera access
- Real-time vintage filters
- Download and save capabilities

### Anonymous Blog
- Post without revealing identity
- Reply to others' posts
- Timestamp display

### Gift Ideas
- AI-generated gift suggestions
- Personalized by recipient's age, interests, and occasion
- Powered by Google's Gemini-1.5-pro model

## 🛠️ Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Database**: MongoDB
- **AI**: Google Generative AI (Gemini)
- **Deployment**: Gunicorn

## 💻 Setup & Installation

### Prerequisites
- Python 3.11 or higher
- MongoDB connection (local or cloud)
- Google Gemini API key

### Environment Variables
The application requires the following environment variables:
- `MONGODB_URI`: Your MongoDB connection string
- `GEMINI_API_KEY`: Your Google Gemini API key
- `SESSION_SECRET`: Secret key for Flask sessions

### Running the Application
The application is configured to run with gunicorn. Use the run button or execute:
```
gunicorn --bind 0.0.0.0:5000 main:app
```

## 🐛 Troubleshooting

If you encounter the "feather is not defined" error, make sure to properly include the Feather Icons library in the layout template.

## 📝 License

This project is open-source. Feel free to use, modify, and distribute as needed.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
