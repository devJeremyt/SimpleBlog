const express = require('express'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
methodOverride = require('method-override'),
expressSanitizer = require('express-sanitizer');

mongoose.connect("mongodb://localhost:27017/restful_blog_app",{ useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

app.get("/", (req, res)=>{
    res.redirect('/blogs');
});

app.get('/blogs', (req, res)=>{
    Blog.find({}, (err, blogs)=>{
        if(err){
            console.log(err);
        } else{
            res.render("index", {blogs: blogs});
        }
    });
});

//NEW ROUTE
app.get('/blogs/new', (req,res)=>{
        res.render('new');
});

//CREATE ROUTE
app.post('/blogs',(req,res)=>{
    req.body.blog.body = req.sanitize(re.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog)=>{
        if(err){
            console.log(err);
        } else{
            res.redirect('/blogs');
        }
    });
});

//SHOW ROUTE
app.get('/blogs/:id', (req,res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect('/blogs');
        } else{
            res.render('show', {blog:foundBlog});
        };
    });    
});

//EDIT ROUTE
app.get('/blogs/:id/edit', (req,res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect('/blogs');
        } else{
            res.render('edit', {blog: foundBlog});
        };
    })
});

//UPDATE ROUTE
app.put('/blogs/:id', (req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
        if(err){
            res.redirect('/blogs');
        } else{
            res.redirect('/blogs/' + req.params.id);
        };
    });
});

//DELETE ROUTE
app.delete('/blogs/:id', (req,res)=>{
    Blog.findByIdAndDelete(req.params.id, (err)=>{
        if(err){
            console.log(err);
        } else{
            res.redirect('/blogs');            
        }
    });
});

app.listen(3000, ()=>{
    console.log("Blog App Server listening on port 3000");
});