const router = require('express').Router();
const { User, BlogPost, Comment } = require('../../models');
const withAuth = require('../../utils/auth.js');

router.get('/', async (req, res) => {
    try{ 
        const savedComments = await Comment.findAll({
            include: [ 
                { model: User, attributes: ['username'] }, 
                { model: BlogPost, attributes: ['title'] } 
            ],
            attributes: ['id', 'body_text', 'user_id', 'blogpost_id', 'createdAt', 'updatedAt'],
        });
        if (!savedComments) {
            res.status(404).json({ message: "No comments to display"});
            return;
        };
        res.status(200).json(savedComments);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.create({   
            body_text: req.body.comment,
            user_id: req.session.user_id,
            blogpost_id: req.body.blogpost_id
        });
        res.status(200).json(commentData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


module.exports = router;