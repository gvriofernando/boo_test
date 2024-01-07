class Profile {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.mbti = data.mbti;
        this.enneagram = data.enneagram;
        this.variant = data.variant;
        this.tritype = data.tritype;
        this.socionics = data.socionics;
        this.sloan = data.sloan;
        this.psyche = data.psyche;
        this.image = data.image;
    }
}

module.exports = Profile;