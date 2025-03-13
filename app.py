import os
from flask import Flask, render_template, request, jsonify, redirect
from pymongo import MongoClient
from bson.objectid import ObjectId
import google.generativeai as genai
import logging
from datetime import datetime

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_key")

# MongoDB setup with error handling
try:
    mongo_client = MongoClient(os.environ.get("MONGODB_URI", "mongodb://localhost:27017/"))
    db = mongo_client.vintage_blog
    logging.info("MongoDB connected successfully")
except Exception as e:
    logging.error(f"MongoDB connection error: {str(e)}")
    db = None

# Gemini API setup
try:
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
    model = genai.GenerativeModel('gemini-1.5-pro')
    logging.info("Gemini API configured successfully")
except Exception as e:
    logging.error(f"Gemini API configuration error: {str(e)}")
    model = None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/photobooth')
def photobooth():
    return render_template('photobooth.html')

@app.route('/blog')
def blog():
    try:
        if db is None:
            return render_template('blog.html', posts=[], error="Database connection error")
        posts = list(db.posts.find().sort("timestamp", -1))
        return render_template('blog.html', posts=posts)
    except Exception as e:
        logging.error(f"Error fetching blog posts: {str(e)}")
        return render_template('blog.html', posts=[], error="Failed to fetch posts")

@app.route('/blog/post', methods=['POST'])
def create_post():
    try:
        if db is None:
            return jsonify({"error": "Database connection error"}), 500

        post = {
            'content': request.form.get('content'),
            'timestamp': datetime.now(),
            'replies': []
        }
        db.posts.insert_one(post)
        return redirect('/blog')
    except Exception as e:
        logging.error(f"Error creating post: {str(e)}")
        return jsonify({"error": "Failed to create post"}), 500

@app.route('/blog/reply', methods=['POST'])
def create_reply():
    try:
        if db is None:
            return jsonify({"error": "Database connection error"}), 500

        post_id = request.form.get('post_id')
        reply = {
            'content': request.form.get('content'),
            'timestamp': datetime.now()
        }

        result = db.posts.update_one(
            {'_id': ObjectId(post_id)},
            {'$push': {'replies': reply}}
        )

        if result.modified_count == 0:
            return jsonify({"error": "Post not found"}), 404

        return redirect('/blog')
    except Exception as e:
        logging.error(f"Error creating reply: {str(e)}")
        return jsonify({"error": "Failed to create reply"}), 500

@app.route('/gifts')
def gifts():
    return render_template('gifts.html')

@app.route('/gifts/suggest', methods=['POST'])
def suggest_gift():
    try:
        if model is None:
            return jsonify({"error": "AI model not available"}), 500

        age = request.form.get('age')
        interests = request.form.get('interests')
        occasion = request.form.get('occasion')

        prompt = f"Suggest a thoughtful gift for someone who is {age} years old, interested in {interests}, for the occasion: {occasion}. Be specific and suggest only one item with a brief explanation."

        response = model.generate_content(prompt)

        return jsonify({
            'success': True,
            'suggestion': response.text
        })
    except Exception as e:
        logging.error(f"Error generating gift suggestion: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate gift suggestion'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)