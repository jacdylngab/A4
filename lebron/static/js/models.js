
class Post {
    constructor(id, content, profile, likes) {
        this.id = id;
        this.content = content;
        this.profile = profile;
        this.likes = likes;
    }
}

class Profile {
    constructor(id, username, email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
}

class Like {
    constructor(id, profile) {
        this.id = id;
        this.profile = profile;
    }
}
