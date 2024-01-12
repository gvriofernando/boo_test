'use strict';

const express = require('express');
const router = express.Router();
const ProfileService = require('../core/profile/ProfileService');
const MongoDBProfileRepository = require('../adapters/profile/MongoDBProfileRepository');

const profiles = [
  {
    "id": 1,
    "name": "A Martinez",
    "description": "Adolph Larrue Martinez III.",
    "mbti": "ISFJ",
    "enneagram": "9w3",
    "variant": "sp/so",
    "tritype": 725,
    "socionics": "SEE",
    "sloan": "RCOEN",
    "psyche": "FEVL",
    "image": "https://soulverse.boo.world/images/1.png",
  }
];

module.exports = function() {
  const profileRepository = new MongoDBProfileRepository();
  const profileService = new ProfileService(profileRepository);

  // router.get('/test', function(req, res, next) {
  //   res.render('profile_template', {
  //     profile: profiles[0],
  //   });
  // });

  router.get('/:id', async (req, res) => {
    try {
      const profileId = req.params.id;
      const profile = await profileService.getProfileById(profileId);
  
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found.' });
      }
  
      res.render('profile_template', {
        profile:  profile,
      });
      // return res.json(profile);
    } catch (error) {
      console.error('Error handling profile request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('', async (req, res) => {
    try {
      const newProfile = await profileService.createProfile(req.body);
      res.status(201).json(newProfile);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
}

