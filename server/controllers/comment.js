const { v4 } = require("uuid");
const db = require("../../db");

class CommentControllers{
    async CreateComment (req, res){
        const id_comment = v4();
        const id_blog = req.params.id; 
        const comment_content = req.body.content;
        const comment_userId = req.user.userId;
        try {
            const querycomment = `
                insert into blog_comments (comment_id, blog_id, comment, user_id, created_at) 
                values ("${id_comment}", "${id_blog}", ?, "${comment_userId}", DEFAULT)
            `;
    
            await db.connection.query("BEGIN");
            await db.connection.query(querycomment, [comment_content]);
            await connection.query("COMMIT");

            res.status(200).send({ message: "สร้างเสร็จสิ้น" });
        
        }catch (e) {
            console.log(e);
            res.status(500).send({
                message: "Something went wrong",
            });
        }   
    }

    async DeleteComment (req, res) {
        const id_comment = req.params.idcomment;
        const queryblog = `
            delete from blog_comments
            where blog_comments.comment_id = "${id_comment}"
        `;
        await db.connection.query(queryblog);
        res.status(200).send({ message: "ลบเสร็จสิ้น" });
    }

    async EditComment (req, res){
        const id_comment = req.params.idcomment;
        const comment_content = req.body.comment;

        const querycomment = `
        update blog_comments set blog_comments.comment = ? where blog_comments.comment_id = "${id_comment}"
        `;
        await db.connection.query(querycomment, [comment_content]);
        res.status(200).send({ message: "อัพเดทเสร็จสิ้น" });
        
    }  

    async GetComment (req, res) {
        try {
            const id_comment = req.params.idcomment;
            const querycomment = `
            select users.name, profile_images.url as profile_url, blog_comments.comment, blog_comments.created_at   
            from  users, profile_images, blog_comments
            where blog_comments.comment_id = "${id_comment}" 
                  and blog_comments.user_id = profile_images.user_id
                  and blog_comments.user_id = users.id
            `;
            const [comment] = await db.connection.query(queryblog);
            res.status(200).send({ comment });

        }catch (e) {
            console.log(e);
            res.status(500).send({
                message: "",
            });
        }
    }  
}

module.exports = CommentControllers;