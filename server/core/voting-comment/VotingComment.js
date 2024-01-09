class VotingComment {
    constructor(data) {
        this.targetProfile = data.target_profile;
        this.createdBy = data.create_by;
        this.createdDate = data.created_date;
        this.title = data.title;
        this.description = data.description;
        this.mbti = data.mbti;
        this.enneagram = data.enneagram;
        this.zodiac = data.zodiac;
        this.total_like = data.total_like;
    }
}

module.exports = VotingComment;