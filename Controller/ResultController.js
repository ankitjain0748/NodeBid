const ResultModel = require("../Models/Result");
const Market = require("../Models/Marketing");
const UserModal = require("../Models/SignUp");
const Panna = require("../Models/Panna");
const Sangam = require("../Models/Sangam");

const catchAsync = require("../utils/catchAsync");

// exports.ResultAdd = async (req, res) => {
//     try {
//         const { session, number, betdate, marketId } = req.body;

//         const sumOfDigits = number.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
//         console.log("sumOfDigits", sumOfDigits);

//         const Pannamodel = await Panna.find({}).populate('userId').populate('marketId');
//         if (!Pannamodel || Pannamodel.length === 0) {
//             return res.status(404).json({ message: "No Panna models found." });
//         }

//         const SangamModel = await Sangam.find({}).populate('userId').populate('marketId');
//         if (!SangamModel || SangamModel.length === 0) {
//             return res.status(404).json({ message: "No Sangam models found." });
//         }

//         console.log("SangamModel", SangamModel);

//         // Collect results
//         const results = [];

//         // Check Panna models
//         for (const panna of Pannamodel) {
//             if ((session === 'open' && panna.status === true) || (session === 'close' && panna.status === false)) {
//                 if (panna.point === sumOfDigits) {
//                     const data = new ResultModel({
//                         session,
//                         number,
//                         betdate,
//                         marketId,
//                         panaaModal: panna,
//                         userId: panna.userId // Save userId from Panna
//                     });

//                     console.log("Result data to be saved for Panna:", data);
//                     const result = await data.save();
//                     results.push(result); // Store the result
//                 }
//             }
//         }

//         // Check Sangam models
//         for (const sangam of SangamModel) {
//             if ((session === 'open' && sangam.status === true) || (session === 'close' && sangam.status === false)) {
//                 if (sangam.bid_point === number) {
//                     const data = new ResultModel({
//                         session,
//                         number,
//                         betdate,
//                         marketId,
//                         sangamModal: sangam,
//                         userId: sangam.userId // Save userId from Sangam
//                     });

//                     console.log("Result data to be saved for Sangam:", data);
//                     const result = await data.save();
//                     results.push(result); // Store the result
//                 }
//             }
//         }

//         // Check if any results were saved
//         if (results.length > 0) {
//             return res.status(200).json({
//                 status: 200,
//                 message: "Results saved successfully.",
//                 data: results
//             });
//         }

//         return res.status(400).json({ message: "No matching point found in Panna or Sangam models." });

//     } catch (error) {
//         console.error("Error saving result:", error);
//         res.status(500).json({ message: "An error occurred while saving the result." });
//     }
// };


exports.ResultAdd = async (req, res) => {
    try {
        const { session, number, betdate, marketId } = req.body;

        const sumOfDigits = number.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        console.log("sumOfDigits", sumOfDigits);

        const Pannamodel = await Panna.find({}).populate('userId').populate('marketId');
        if (!Pannamodel || Pannamodel.length === 0) {
            return res.status(404).json({ message: "No Panna models found." });
        }

        const SangamModel = await Sangam.find({}).populate('userId').populate('marketId');
        if (!SangamModel || SangamModel.length === 0) {
            return res.status(404).json({ message: "No Sangam models found." });
        }

        console.log("SangamModel", SangamModel);

        // Initialize object to hold the final result data
        const resultData = {
            session,
            number,
            betdate,
            marketId,
            panaaModal: null,
            sangamModal: null,
            userId: null // Store userId from either model
        };

        // Check Panna models
        for (const panna of Pannamodel) {
            if ((session === 'open' && panna.status === true) || (session === 'close' && panna.status === false)) {
                if (panna.point === sumOfDigits) {
                    resultData.panaaModal = panna; // Save Panna data
                    resultData.userId = panna.userId; // Save userId from Panna
                    console.log("Result data to be saved for Panna:", resultData);
                }
            }
        }

        // Check Sangam models
        for (const sangam of SangamModel) {
            if ((session === 'open' && sangam.status === true) || (session === 'close' && sangam.status === false)) {
                if (sangam.bid_point === number) {
                    resultData.sangamModal = sangam; // Save Sangam data
                    resultData.userId = sangam.userId; // Save userId from Sangam
                    console.log("Result data to be saved for Sangam:", resultData);
                }
            }
        }

        // If any data was found, save the result
        if (resultData.panaaModal || resultData.sangamModal) {
            const data = new ResultModel(resultData);
            const result = await data.save();
            return res.status(200).json({
                status: 200,
                message: "Result saved successfully.",
                data: result
            });
        }

        return res.status(400).json({ message: "No matching point found in Panna or Sangam models." });

    } catch (error) {
        console.error("Error saving result:", error);
        res.status(500).json({ message: "An error occurred while saving the result." });
    }
};




exports.ResultList = catchAsync(async (req, res) => {
    try {
        const records = await ResultModel.find({})
            .populate('marketId') 
            .populate('userId') 

            ;

        if (!records || records.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No results found.",
            });
        }

        res.status(200).json({
            status: true,
            data: records,
            message: "Results fetched successfully.",
        });
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({
            status: false,
            message: "Internal Server Error. Please try again later.",
        });
    }
});

