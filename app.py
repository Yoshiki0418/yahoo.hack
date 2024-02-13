from flask import Flask, request, jsonify, render_template
import sqlite3


app = Flask(__name__)

@app.route('/')
def home():
    return render_template('Introduction.html')

@app.route('/introduction2')
def introduction2():
    return render_template('Introduction2.html')

@app.route('/save-preference', methods=['POST'])
def save_preference():
    data = request.get_json()
    category = data['category']
    preference = data['preference']
    
    # ここでデータベースに接続し、データを保存
    conn = sqlite3.connect('preferences.db')
    c = conn.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS preferences (id INTEGER PRIMARY KEY, category TEXT, preference TEXT)")
    c.execute("INSERT INTO preferences (category, preference) VALUES (?, ?)", (category, preference))
    conn.commit()
    conn.close()

    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)

