const Profile = require('../model/profile');
const { hasError, validationError } = require('../middleware/validation');
const { tryCatch } = require('../utils/tryCatch');
const { getTime, filterFiles,
    deleteFile } = require('../utils');



// get profile
exports.getProfile = async function (req, res, next) {
    try {
        const userId = req.user.userId;
        const profile = await Profile.findOne({ user: userId });
        if (!profile) {
            throw new Error("No profile found");
        }
        return res.json({
            message: "Profile data fetched.",
            data: profile
        })
    }
    catch (err) {
        next(err)
    }
}

// add profile
exports.addUpdateProfile = async function (req, res, next) {
    try {

        validationError(req, next);
        const profileId = req.params.profileId;
        const profile = await Profile.findById(profileId);
        const isProfileExist = await Profile.findOne({ user: req.user.userId });
        const { dob, address } = req.body;
        const image = req.file;

        if (profile) {
            profile.dob = dob;
            profile.address = address;
            if (image) {
                deleteFile(profile.avatar);
                profile.avatar = image.path;
            }

            await profile.save();
            return res.json({
                data: profile
            })
        } else {
            if (isProfileExist) {
                throw new Error("Profile already existed!")
            }
            const newProfile = new Profile({
                user: req.user.userId,
                dob: dob,
                avatar: image != null ? image.path : "",
                address: address
            });
            // profile.favoriteRestaurants.push(favoriteRestaurants);

            await newProfile.save();
            return res.json({
                data: newProfile
            })
        }

    } catch (err) { next(err) }
}


// add / update profile pic
exports.addUpdateAvatar = async function (req, res, next) {
    try {
        const image = req.file;
        const userId = req.user.userId;
        const profile = await Profile.findOne({ user: userId });

        if (!profile) {
            deleteFile(image.path)
            throw new Error("User profile not found");
        }
        if (!image) {
            deleteFile(image.path)
            throw new Error("Please select profile image");
        }
        if (image) {
            deleteFile(profile.avatar);
            profile.avatar = image.path;
        }
        await profile.save();
        return res.status(200).json({
            message: "profile avatar update successfully",
            data: profile
        });
    }
    catch (err) {
        deleteFile(req.file.path);
        next(err)
    }
}
// add/update profile

// add address
exports.addUpdateAddress = async function (req, res, next) {
    try {
        const userId = req.user.userId;
        const profile = await Profile.findOne({ user: userId });
        if (!profile) {
            throw new Error("There is no profile for this user");
        }
        const { state, city, address, landmark, pincode } = req.body;
        profile.address.state = state;
        profile.address.city = city;
        profile.address.address = address;
        profile.address.landmark = landmark;
        profile.address.pincode = pincode;
        await profile.save();
        return res.json({
            message: "Address update successfully",
            data: profile
        })

    }
    catch (err) {
        next(err)
    }
}