const express = require('express');
const session = require("express-session");
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use('/views', express.static('./views'));
app.use('/static', express.static('./static'));
app.set(express.urlencoded({extended:true}));
app.use(express.json());

app.use(
    session({
        secret: 'myKey',
        resave: false,
        saveUninitialized: true,
    })
);

const userInfo = {id: 'ktd', pw: '1234'}

app.get('/', (req, res) => {
    const user = req.session.user;
    console.log(user);
    if(user === undefined) {
        res.render('index', {islogin:false});
    }else{
        res.render('index', {islogin:true, user: user});
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    if(req.body.id === userInfo.id && req.body.pw === userInfo.pw){
        req.session.user = req.body.id;
        res.redirect('/');
    }else {
        res.send('로그인 실패');
    }
})

app.get('/logout', (req, res) => {
    const user = req.session.user
    if(user === undefined){
        res.send(`<script>alter('잘못된접근입니다');document.location.href='/'</script>`)
    } else { 
        req.session.destroy(()=>{
            res.clearCookie('connect.sid');
            res.redirect('/');
        })
    }
})

app.listen(PORT, ()=>{
    console.log('local 연결 완료');
})