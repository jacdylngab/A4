from flask import Flask, render_template, request, session, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from http import HTTPStatus
import os 

app = Flask(__name__)
app.secret_key = 'FDJSL;a4_wcaa4w;ESLFJ:KS$ER$j'

db_name = 'lebron.db'
sqlite_uri = f'sqlite:///{os.path.abspath(os.path.curdir)}/{db_name}'
app.config['SQLALCHEMY_DATABASE_URI'] = sqlite_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

app.config['SESSION_TYPE'] = 'sqlalchemy'
app.config['SESSION_SQLALCHEMY'] = db
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
Session(app)

'''
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
For a detailed explanation of why this application is named lebron,
ask Carson K.  This is all his doing!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
'''

from models import Post, Profile, Like

def create_debug_dude(dudename):
    dude = Profile.query.filter_by(username=dudename).first()
    if not dude:
        print(f'Creating {dudename}')
        dude = Profile(
            username=dudename,
            password='x',
            email=f'{dudename}@bvu.edu'
        )
        db.session.add(dude)
        db.session.commit()

with app.app_context():
    db.create_all()
    create_debug_dude('shep')
    create_debug_dude('test')

PROFILE_ID = 'profile_id'
PUBLIC_URIS = ['/profile-form/', '/profile/', '/login-form/', '/login/']

#---- Page routes

@app.before_request
def preprocess():
    logged_in = PROFILE_ID in session

    if request.path.startswith('/api/') and not logged_in:
        return jsonify({ 'error': 'Not logged in' }), HTTPStatus.FORBIDDEN

    if not logged_in and request.path not in PUBLIC_URIS:
        return redirect(url_for('login_form'))


@app.route('/')
def main_feed():
    return render_template('main.html')

@app.route('/profile/<int:profile_id>/', methods=['GET'])
def profile_feed(profile_id):
    profile = Profile.query.get(profile_id)
    if profile:
        return render_template('profile.html', profile=profile)
    else:
        return render_template('error.html'), HTTPStatus.NOT_FOUND

@app.route('/profile-form/', methods=['GET'])
def profile_form():
    return 'NOT IMPLEMENTED YET'

@app.route('/login-form/', methods=['GET'])
def login_form():
    return render_template('login_form.html')

@app.route('/login/', methods=['POST'])
def login():
    profile = Profile.query.filter_by(username=request.form['username']).first()
    if not profile or profile.password != request.form['password']:
        return render_template('login_form.html', message='Invalid username/password')

    session[PROFILE_ID] = profile.id
    return redirect(url_for('main_feed'))


@app.route('/logout/', methods=['GET'])
def logout():
    del session[PROFILE_ID]
    return redirect(url_for('login_form'))

#---- REST API Endpoints

@app.route('/api/profile/<username>/', methods=['GET'])
def get_profile(username):
    return jsonify({ 'error': 'not supported yet' }), HTTPStatus.NOT_IMPLEMENTED

@app.route('/api/profile/', methods=['POST'])
def create_profile():
    return jsonify({ 'error': 'not supported yet' }), HTTPStatus.NOT_IMPLEMENTED

@app.route('/api/post/', methods=['GET'])
def get_posts():
    ''' for single post
    ?profile_id=
    ?profile_name=
    '''

    if 'profile_id' in request.args:
        posts = Post.query.filter_by(profile_id=request.args['profile_id']).all()
    else:
        posts = Post.query.all()

    return jsonify(list(map(lambda p: p.serialize(), posts)))

@app.route('/api/post/', methods=['POST'])
def create_post():
    data = request.get_json()
    if 'content' not in data:
        return jsonify({ 'error': 'no content sent' }), HTTPStatus.BAD_REQUEST

    profile = Profile.query.get(session[PROFILE_ID])
    new_post = Post()
    new_post.content = data['content']
    new_post.profile = profile
    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post.serialize())

@app.route('/api/like/<post_id>/', methods=['POST'])
def like_post():
    return jsonify({ 'error': 'not supported yet' }), HTTPStatus.NOT_IMPLEMENTED

@app.route('/api/unlike/<post_id>/', methods=['POST'])
def unlike_post():
    return jsonify({ 'error': 'not supported yet' }), HTTPStatus.NOT_IMPLEMENTED

