import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js';
import Report from '../models/report.model.js';
import jwt from 'jsonwebtoken';

export const createReport = async (req, res) => {
  try {
    // Get user ID from refresh token
    const refreshToken = req.cookies.refreshToken;
    let userId;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        userId = decoded.userId;
      } catch (error) {
        return res.status(401).json({ message: 'Not authorized, Login first' });
      }
    } else {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    const { type, post, comment, reason, description } = req.body;

    // Required fields validation
    if (!type) return res.status(400).json({ message: 'Type is required' });
    if (!reason) return res.status(400).json({ message: 'Reason is required' });
    if (!description) return res.status(400).json({ message: 'Description is required' });

    // Get full user info
    const reporter = await User.findById(userId).select('-password');
    if (!reporter) return res.status(404).json({ message: 'Reporter not found' });

    let reportData = { reporter, type, reason, description };

    if (type === 'post') {
      if (!post) return res.status(400).json({ message: 'Post ID is required' });
      reportData.post = post;
      reportData.comment = null;
    } else if (type === 'comment') {
      if (!comment) return res.status(400).json({ message: 'Comment ID is required' });

      const foundComment = await Comment.findById(comment).populate('post', '_id');
      if (!foundComment) return res.status(404).json({ message: 'Comment not found' });

      reportData.comment = comment;
      reportData.post = foundComment.post._id;
    } else {
      return res.status(400).json({ message: 'Invalid report type' });
    }

    const newReport = await Report.create(reportData);

    res.status(201).json({ message: 'Report submitted successfully', newReport });
  } catch (error) {
    console.log('Error in createReport controller', error.message);
    res.status(500).json({ message: error.message, location: 'createReport' });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page, 10) : null;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    const skip = page && limit ? (page - 1) * limit : 0;

    // Count total reports
    const totalReports = await Report.countDocuments();
    const totalPages = limit ? Math.ceil(totalReports / limit) : 1;

    // Aggregation pipeline for sorting and pagination
    const reportsPipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'reporter',
          foreignField: '_id',
          as: 'reporter',
        },
      },
      { $unwind: '$reporter' },
      { $project: { 'reporter.password': 0 } }, // Exclude password
      { $sort: { createdAt: -1 } }, // Sort by newest
    ];

    if (page && limit) {
      reportsPipeline.push({ $skip: skip }, { $limit: limit });
    }

    const reports = await Report.aggregate(reportsPipeline);

    // Check if there are more pages
    const hasMore = page && limit ? page * limit < totalReports : false;

    res.status(200).json({
      message: `${reports.length} report(s) fetched successfully`,
      reports,
      totalReports,
      totalPages,
      nextPage: hasMore ? page + 1 : null,
      hasMore,
    });
  } catch (error) {
    console.error('Error in getAllReports controller:', error.message);
    res.status(500).json({ message: error.message, location: 'getAllReports' });
  }
};
