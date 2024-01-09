const VotingComment = require('./VotingComment');
const mbtiTypes = require('../../config/mbtiConfig');
const enneagramTypes = require('../../config/enneagramConfig');
const zodiacTypes = require('../../config/zodiacConfig');
const { InvalidMBTIError, InvalidEnneagramError, InvalidZodiacError } = require('../../errors');

class VotingCommentService {
  constructor(votingCommentRepository) {
    this.votingCommentRepository = votingCommentRepository;
  }

  async createVotingComment(votingData, profileId) {
    const votingComment = new VotingComment(votingData);
    votingComment.total_like = 0
    votingComment.targetProfile = profileId
    const currentDate = new Date();
    const isoDateString = currentDate.toISOString();
    const formattedDate = isoDateString.split('T')[0];
    votingComment.createdDate = formattedDate

    if (votingComment.mbti != "" && !mbtiTypes.includes(votingComment.mbti)) {
      throw InvalidMBTIError;
    }

    if (votingComment.enneagram != "" && !enneagramTypes.includes(votingComment.enneagram)) {
      throw InvalidEnneagramError;
    }

    if (votingComment.zodiac != "" && !zodiacTypes.includes(votingComment.zodiac)) {
      throw InvalidZodiacError;
    }
    try {
      return this.votingCommentRepository.createVotingComment(votingComment);
    } catch (error) {
      console.error('Error getting VotingComments by target profile:', error);
      throw error;
    }
  }

  async getVotingCommentsByTargetProfile(targetProfileId, filter, sort) {
    try {
      return this.votingCommentRepository.getVotingCommentsByTargetProfile(targetProfileId, filter, sort);
    } catch (error) {
      console.error('Error creating VotingComments:', error);
      throw error;
    }
  }
}

module.exports = VotingCommentService;