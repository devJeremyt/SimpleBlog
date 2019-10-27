const express = require('express'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
methodOverride = require('method-override');

mongoose.connect("mongodb://localhost:27017/restful_blog_app",{ useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

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

app.get('/blogs/new', (req,res)=>{
        res.render('new');
});

app.post('/blogs',(req,res)=>{
    Blog.create(req.body.blog, (err, newBlog)=>{
        if(err){
            console.log(err);
        } else{
            res.redirect('/blogs');
        }
    });
});

app.get('/blogs/:id', (req,res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect('/blogs');
        } else{
            res.render('show', {blog:foundBlog});
        };
    });    
});

app.get('/blogs/:id/edit', (req,res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect('/blog');
        } else{
            res.render('edit', {blog: foundBlog});
        };
    })
});

app.put('/blogs/:id', (req,res)=>{
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
        if(err){
            res.redirect('/blogs');
        } else{
            res.redirect('/blogs/' + req.params.id);
        };
    });
});

app.listen(3000, ()=>{
    console.log("Blog App Server listening on port 3000");
});