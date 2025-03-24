from app import db                                                        


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(144), unique=False, nullable=False)
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'), nullable=False)
    likes = db.relationship('Like', backref='post', uselist=True, lazy=True)
    
    def serialize(self):
        return {
            'id': self.id,
            'content': self.content,
            'profile': self.profile.serialize(),
            'likes': list(map(lambda x: x.serialize(), self.likes)),
        }
    def __repr__(self):
        return f'<Post id={self.id}>'


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(16), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    email = db.Column(db.String(80), unique=False, nullable=False)
    posts = db.relationship('Post', backref='profile', lazy=True)

    def serialize(self):
        # Do not return password (obviously).
        # Do not return posts (which would send us into infinite recursion).
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
        }

    def __repr__(self):
        return f'<Profile id={self.id}>'


class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    profile = db.relationship('Profile', uselist=False, lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'profile': self.profile.serialize(),
        }

    def __repr__(self):
        return f'<Like id={self.id}>'
