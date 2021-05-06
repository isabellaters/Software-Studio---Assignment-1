

// importing dependencies
const sharp = require('sharp');
const uid = require('uid');
const fs = require('fs');


const   Book = require("../models/book"),
        Issue = require("../models/issue"),
        User = require("../models/user");

exports.postIssueBook = async(req, res, next) => {
    if(req.user.violationFlag) {
        req.flash("error", "You are flagged for violating rules/delay on returning books/paying fines. Untill the flag is lifted, You can't issue any books");
        return res.redirect("back");
    }
    try {
        const book = await Book.findById(req.params.book_id);
        const user = await User.findById(req.params.user_id);
        console.log(book);

        // registering loan
        book.stock -= 1;
        const issue = new Issue({
            book_info: {
                title: book.title,
                description: book.description,
                publishDate: book.publishDate,
                pageCount: book.pageCount,
                createdAt: book.createdAt,
                coverImage: book.coverImage,
                coverImageType: book.coverImageType,
                author: book.author,
                stock: book.stock,
                issueDate: book.issueDate,
                returnDate: book.returnDate,
                isRenewed: book.isRenewed,
            },
            user_id: {
                id:user._id,
                email: user.email,
            }
        });

        user.bookIssueInfo.push(book._id);

        await issue.save();
        await book.save();
        await user.save();

        res.redirect("/books/<%=book._id%>");

    } catch(err) {
        console.log(err);
    }
}