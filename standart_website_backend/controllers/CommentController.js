import CommentModel from "../models/Comment.js";

export const getNewAll = async (req, res) => {
    try {
        const comments = await CommentModel.find()
            .populate('user')      // вторым аргументом указать конкретные поля: 'fullName, avatarUrl'
            .limit(7)
            .sort({ date: -1 })
            .exec();

        res.json(comments);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Комментарии не получены!"
        });
    };
};

export const getPostComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await CommentModel.find({ post: postId }).populate('user').exec();

       
        res.json(comments);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Комментарии не получены!"
        });
    };
};

export const create = async (req, res) => {
    try {
        const doc = new CommentModel({
            text: req.body.text,
            user: req.body.userId,
            post: req.body.postId,
        });
        const comment = await doc.save();
        res.json(comment);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать комментарий"
        });
    };
};

export const update = async (req, res) => {
    try {
        const commentId = req.params.id;
        await CommentModel.updateOne(
            {
                _id: commentId,
            },
            {
                text: req.body.text,
                user: req.body.userId,
                post: req.body.postId,
            },
        );
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось обновить комментарий"
        });
    };
};

export const remove = (req, res) => {
    try {
        const commentId = req.params.id;
        CommentModel.findOneAndDelete({
            _id: commentId,
        }).then(doc => {
            if (!doc) {
                return res.status(404).json({
                    message: "Статья не найдена"
                });  
            };

            res.json({
                success: true
            });
        });
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось удалить комментарий"
        });
    };
};