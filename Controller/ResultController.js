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
        const bit_number = 2;
        const generatedBitNumber = bit_number || Math.floor(100000 + Math.random() * 900000); // 6-digit random number
        console.log("Generated bit_number:", generatedBitNumber); // Log the generated bit_number
        const sumOfDigits = number.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        console.log("sumOfDigits", sumOfDigits);
        const Pannamodel = await Panna.find({}).populate('userId').populate('marketId');
        if (!Pannamodel || Pannamodel.length === 0) {
            return res.status(404).json({ message: "No Panna models found." });
        }

        const SangamModel = await Sangam.find({ marketId }).populate('userId').populate('marketId');
        if (!SangamModel || SangamModel.length === 0) {
            return res.status(404).json({ message: "No Sangam models found." });
        }

        console.log("SangamModel", SangamModel);
        console.log("Pannamodel",Pannamodel)

        const resultData = {
            session,
            number,
            betdate,
            marketId,
            bit_number: generatedBitNumber, // Use the generated bit_number
            panaaModal: null,
            sangamModal: null,
            userId: null 
        };
console.log("resultData",resultData)

        for (const panna of Pannamodel) {
            if ((session === 'open' && panna.status === true) || (session === 'close' && panna.status === false)) {
                if (panna.point === sumOfDigits) {
                    resultData.panaaModal = panna;
                    resultData.userId = panna.userId;
                    if (session === 'open') {
                        closePanna = panna.point
                        openPanna = panna.point; // Store the open panna result
                    } else {
                        closePanna = panna.point
                        openPanna = panna.point; // Store the close panna result
                    }
                    console.log("Result data to be saved for Panna:", resultData);
                }
            }
        }


        // Check Sangam models for open or close session
        for (const sangam of SangamModel) {
            if ((session === 'open' && sangam.status === true) || (session === 'close' && sangam.status === false)) {
                console.log("sangam.bid_point",sangam.bid_point)
                console.log("number",number)
                if (parseInt(sangam.bid_point) === parseInt(number)) {
                    resultData.sangamModal = sangam;
                    resultData.userId = sangam.userId;
                    if (session === 'open') {
                        closePanna = sangam.close_panna;
                        openPanna = sangam.open_panna; // Store the open panna result
                    } else {
                        closePanna = sangam.close_panna;
                        openPanna = sangam.open_panna; // Store the close panna result
                    }
                    console.log("Result data to be saved for Sangam:", resultData);
                } else {
                    console.log(`No matching bid point found. Sangam bid_point: ${sangam.bid_point}, Provided number: ${number}`);
                }
                
            }
        }
        if (openPanna || closePanna) {
            const formattedResult = `${openPanna || ''}-${number}-${closePanna || ''}`;
            console.log("Formatted result:", formattedResult);

            const data = new ResultModel(resultData);
            const result = await data.save();

            await Market.findByIdAndUpdate(marketId, {
                result: formattedResult // Save the formatted result (222-555-589 format)
            });
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

