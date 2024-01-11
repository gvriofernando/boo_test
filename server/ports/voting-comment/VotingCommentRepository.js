class VotingCommentRepository {
    createVotingComment(votingData) {
        throw new Error('Method not implemented');
    }

    getVotingCommentsByTargetProfile(targetProfileId, filter, sort){
        throw new Error('Method not implemented');
    }

    likeDislikeVotingComment(votingCommentId, action) {
        throw new Error('Method not implemented');
    }

    updateUserVote(userId, votingCommentId, action) {
        throw new Error('Method not implemented');
    }
}

module.exports = VotingCommentRepository;