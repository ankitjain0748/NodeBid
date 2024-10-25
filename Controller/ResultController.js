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
        const { session, number, betdate, marketId, bit_number } = req.body;

        console.log("req.body", req.body);
        
        // If bit_number is not provided, generate a default one
        const generatedBitNumber = bit_number || Math.floor(100000 + Math.random() * 900000); // 6-digit random number

        // Calculate the sum of digits
        const sumOfDigits = number.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);

        // Fetching Panna and Sangam models
        const Pannamodel = await Panna.find({}).populate('userId').populate('marketId');
        const SangamModel = await Sangam.find({}).populate('userId').populate('marketId');

        if ((!Pannamodel || Pannamodel.length === 0) && (!SangamModel || SangamModel.length === 0)) {
            return res.status(404).json({ message: "No Panna or Sangam models found." });
        }

        // Initialize result data
        const resultData = {
            session,
            result: null, // Initialize the result field
            number,
            betdate,
            marketId,
            bit_number: generatedBitNumber,
            panaaModal: null,
            sangamModal: null,
            userId: null,
            win_manage: "loser" // Default value is loser
        };

        let pannaWin = false;
        let sangamWin = false;

        // Check Panna models
        for (const panna of Pannamodel) {
            if ((session === 'open' && panna.status === true) || (session === 'close' && panna.status === false)) {
                if (panna.point === sumOfDigits) {
                    resultData.panaaModal = panna;
                    resultData.userId = panna.userId;
                    resultData.result = panna.marketId.result; // Assign result key from Panna's marketId
                    pannaWin = true;
                    break; // No need to keep checking if we found a match
                }
            }
        }

        // Check Sangam models if Panna didn't have a winner
        if (!pannaWin) {
            for (const sangam of SangamModel) {
                if ((session === 'open' && sangam.status === true) || (session === 'close' && sangam.status === false)) {
                    if (sangam.bid_point === number) {
                        resultData.sangamModal = sangam;
                        resultData.userId = sangam.userId;
                        resultData.result = sangam.marketId.result; // Assign result key from Sangam's marketId
                        sangamWin = true;
                        break; // No need to keep checking if we found a match
                    }
                }
            }
        }

        // Determine win_manage based on Panna and Sangam win conditions
        if (pannaWin || sangamWin) {
            resultData.win_manage = "winner";
        }

        // Save the result if any winning condition is met
        if (resultData.panaaModal || resultData.sangamModal) {
            const data = new ResultModel(resultData);
            const savedResult = await data.save();

            return res.status(200).json({
                status: 200,
                message: "Result saved successfully.",
                data: savedResult
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

exports.ResultAddMarket = async (req, res) => {
    try {
        const { marketId } = req.body;

        if (!marketId) {
            return res.status(400).json({ message: "Market ID is required." });
        }

        const Pannamodel = await ResultModel.find({marketId});
        if (!Pannamodel || Pannamodel.length === 0) {
            return res.status(404).json({ message: "No Panna models found for the given market ID." });
        }
     

        return res.status(200).json({
            status: 200,
            message: "Result fetched successfully.",
            data: Pannamodel
        });

    } catch (error) {
        console.error("Error fetching result:", error);
        res.status(500).json({ message: "An error occurred while fetching the result." });
    }
};



exports.ResultUser = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "Market ID is required." });
        }

        // Fetching Panna models based on marketId
        const Pannamodel = await ResultModel.find({userId});
        if (!Pannamodel || Pannamodel.length === 0) {
            return res.status(404).json({ message: "No Panna models found for the given market ID." });
        }

     


        return res.status(200).json({
            status: 200,
            message: "Result fetched successfully.",
            data: Pannamodel
        });

    } catch (error) {
        console.error("Error fetching result:", error);
        res.status(500).json({ message: "An error occurred while fetching the result." });
    }
};
