const router = require('express').Router();
const { User, BlogPost, Comment } = require('../../models');
const withAuth = require('../../utils/auth.js');

router.get('/', async (req, res) => {
    try {
        const blogPostData = await BlogPost.findAll({
            include: [ 
                { model: User, attributes: ['username']}, 
                { model: Comment, attributes: ['id', 'body_text', 'user_id', 'createdAt', 'updatedAt'] } 
            ],
        });
        res.status(200).json(blogPostData);
        } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const dbBlogPostData = await BlogPost.findByPk(req.params.id, {
            include: [ 
                { 
                    model: User, attributes: ['username']
                },
                { 
                    model: Comment, 
                    attributes: ['id', 'body_text', 'user_id', 'createdAt', 'updatedAt'], 
                    include: [ 
                        { model: User, attributes: ['username'] }
                    ]
                }
            ],
            order: [[ Comment, 'createdAt', 'DESC' ]],
        });
    const blogPost = dbBlogPostData.get({ plain: true });
    console.log(blogPost);
    res.render('blogPosts', { blogPost, loggedIn: req.session.loggedIn });
    } catch (err) {
    console.log(err);
    res.status(500).json(err);
    }
});

router.post('/', withAuth, async (req, res) => {
    let user_id = req.session.user_id;
    try {
        const newBlogPost = await BlogPost.create({
            title: req.body.title,
            body_text: req.body.body_text,
            userId: user_id 
        });
        res.status(200).json(newBlogPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;