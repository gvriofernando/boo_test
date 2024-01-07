class ProfileService {
    constructor(profileRepository) {
        this.profileRepository = profileRepository;
    }

    async createProfile(profileData) {
        return this.profileRepository.createProfile(profileData);
    }

    async getProfileById(profileId) {
        return this.profileRepository.getProfileById(profileId);
    }
}

module.exports = ProfileService;