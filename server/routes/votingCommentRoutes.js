const express = require('express');
const router = express.Router();
const VotingCommentService = require('../core/voting-comment/VotingCommentService');
const MongoDBVotingCommentRepository = require('../adapters/voting-comment/MongoDBVotingCommentRepository');
const { InternalServerError } = require('../errors');


module.exports = function() {
    const votingRepository = new MongoDBVotingCommentRepository();
    const votingCommentService = new VotingCommentService(votingRepository);

    router.post('/:id', async (req, res) => {
        try {
            const votingData = req.body;
            const profileId = req.params.id;
            const createdVotingId = await votingCommentService.createVotingComment(votingData, profileId);

            res.status(201).json({ _id: createdVotingId });
        } catch (error) {
            console.error('Error creating VotingComment:', error);

            if (error.statusCode) {
            res.status(error.statusCode).json({ error: error.message });
            } else {
            res.status(InternalServerError.statusCode).json({ error: InternalServerError.message });
            }
        }
    });

    router.get('/:targetProfileId', async (req, res) => {
        try {
            const targetProfileId = req.params.targetProfileId;
            let filter = ""
            let sort = ""

            if (req.query.filter) {
                filter = validateAndNormalizeFilter(req.query.filter);
            }

            if (req.query.sort) {
                sort = validateAndNormalizeSort(req.query.sort);
            }
            const votingComments = await votingCommentService.getVotingCommentsByTargetProfile(targetProfileId, filter, sort);

            res.status(200).json(votingComments);
        } catch (error) {
            console.error('Error getting VotingComments by target profile:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.post('/like-dislike/:id', async (req, res) => {
        try {
            const userId = req.body.userId;
            const votingCommentId = req.params.id;
            const action = req.body.action; // Should be 'like', 'dislike'
            if (!['like', 'dislike'].includes(action)) {
                return res.status(400).json({ error: 'Invalid action parameter' });
            }
            const updatedVotingComment = await votingCommentService.likeDislikeVotingComment(userId, votingCommentId, action);
            
            res.status(200).json(updatedVotingComment);
        } catch (error) {
            console.error('Error liking/disliking VotingComment:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    return router;
}

function validateAndNormalizeFilter(filter) {
    const validFilters = ["mbti", "enneagram", "zodiac"];
    if (!validFilters.includes(filter)) {
        throw new Error("Invalid filter parameter");
    }
    return filter;
}

function validateAndNormalizeSort(sort) {
    const validSorts = ["recent", "best"];
    if (!validSorts.includes(sort)) {
        throw new Error("Invalid sort parameter");
    }
    return sort;
}