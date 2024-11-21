const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const cron = require("node-cron");
const {  createJournal, } = require("../types");
const {User, Journal} = require("../db")
const { auth_middle } = require("../auth")

// Assuming you have a Mongoose model called Journal
app.post("/journal", auth_middle, async (req, res) => {
    const userId = req.user.id;
    const { Date, satisfaction_rate, productivity_rate, journal_day } = req.body;

    // Validate input
    const parsed_journal = createJournal.safeParse(req.body);
    if (!parsed_journal.success) {
        return res.status(403).json({ msg: "Invalid inputs" });
    }

    try {
        // Ensure that journal entries exist from the user's creation date until now
        await ensureJournalEntriesFromUserCreation(userId);

        // Check if a journal entry for this user and date already exists, update it or create a new one
        const existingJournal = await Journal.findOneAndUpdate(
            { user: userId, Date: Date },  // Adjusted to `date` (lowercase) for consistency with the DB field
            {
                $set: {
                    satisfaction_rate: satisfaction_rate,
                    productivity_rate: productivity_rate,
                    journal_day: journal_day,
                    active: true
                }
            },
            { new: true, upsert: true }  // Create a new entry if none exists, return the updated/created document
        );

        res.status(200).json({
            msg: "Journal entry has been saved/updated",
            journal: existingJournal,
        });
    } catch (err) {
        console.error("Error while creating/updating journal entry:", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// Define the cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily journal creation task');

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        // Fetch all users
        const users = await User.find({});

        // Loop through each user and create a journal entry if it doesn't exist
        for (let user of users) {
            const journalExists = await Journal.findOne({ userId: user._id, date: today });

            if (!journalExists) {
                const newJournal = new Journal({
                    user: user._id,
                    Date: today,
                    content: '' // Empty journal
                });
                await newJournal.save();
            }
        }

        console.log('Journal entries created for today.');
    } catch (error) {
        console.error('Error creating journal entries:', error);
    }
});
const ensureJournalEntriesFromUserCreation = async (userId) => {
    const user = await User.findById(userId); // Use userId directly
    if (!user) throw new Error('User not found');

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);  // Set time to midnight for consistency in UTC

    const lastEntryDate = new Date(user.createdAt);  // Start from user's creation date
    lastEntryDate.setUTCHours(0, 0, 0, 0);  // Set time to midnight for consistency in UTC

    const formatDate = (date) => date.toISOString().split('T')[0]; // Extract only the date part (YYYY-MM-DD)

    // Loop from the day user was created until today
    while (lastEntryDate <= today) {
        const formattedDate = formatDate(lastEntryDate);

        // Use $gte and $lt to match dates precisely (midnight to midnight range)
        const journalExists = await Journal.findOne({
            user: userId,
            Date: {
                $gte: new Date(formattedDate),
                $lt: new Date(new Date(formattedDate).getTime() + 86400000)  // next day's midnight
            }
        });

        if (!journalExists) {
            // Create a new journal entry if it doesn't exist
            const newJournal = new Journal({
                user: user._id,
                Date: new Date(formattedDate),  // Ensure we pass a new Date object here
                journal_day: '',  // Empty content by default
                satisfaction_rate: 0,
                productivity_rate: 0
            });
            await newJournal.save();
        }
        // Move to the next day
        lastEntryDate.setUTCDate(lastEntryDate.getUTCDate() + 1);
    }
};
app.get("/getjournal", auth_middle, async (req, res) => {
    const userId = req.user.id;
    const journaldate = new Date(req.query.Date);
    const journalcomp = await Journal.find({ user: userId, Date: journaldate })
    if (!journalcomp) {
        res.status(401).json({
            msg: "THEre is no Journal"
        })
    }
    res.status(200).json({
        journalcomp
    })
})
app.get("/getjournalmonthwise", auth_middle, async (req, res) => {
    const userId = req.user.id;
    const todaydate = new Date(req.query.Date);

    // Get the first and last date of the month
    const firstDayOfMonth = new Date(todaydate.getFullYear(), todaydate.getMonth(), 1);
    const lastDayOfMonth = new Date(todaydate.getFullYear(), todaydate.getMonth() + 1, 0);  // Last day of the month

    try {
        // Query for all journal entries within the month
        const journalsForMonth = await Journal.find({
            user: userId,
            Date: {
                $gte: firstDayOfMonth,
                $lte: lastDayOfMonth
            }
        });

        // If no journals found, return a message
        if (!journalsForMonth || journalsForMonth.length === 0) {
            return res.status(200).json({
                msg: "There are no journals for this month"
            });
        }

        // Return the list of journal entries
        res.status(200).json({
            msg: "Journals retrieved successfully",
            journals: journalsForMonth
        });
    } catch (err) {
        console.error("Error while fetching journals for the month:", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
module.exports = app;