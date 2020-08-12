const reload = require('self-reload-json')
const data = new reload('./db/db.json')
const scopes = ['identify', 'email', /* 'connections', (it is currently broken) */ 'guilds', 'guilds.join'];
module.exports = function (passport, app) {
    //메인화면

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/', (req, res) => {
        res.render('./index.ejs', {
            title: "Vendetta",
            type: "메인"
        })
    });

    app.get('/discord', (req, res) => {
        res.render('./discord/index.ejs', {
            title: "Vendetta-Discord",
            type: "메인"
        })
    })

    app.get('/invite', (req, res) => {
        res.render('./discord/invite.ejs', {
            title: "Vendetta-Discord",
            type: "초대링크"
        })
    })

    app.get('/amongus', (req, res) => {
        res.render('./among_us/invite.ejs', {
            title: "Vendetta-Discord",
            type: "초대링크"
        })
    })

    app.get('/wbot', (req, res) => {
        res.render('./wbot/index.ejs', {
            title: "WBOT"
        })
    })

    app.get('/wbot/commands', (req, res) => {
        res.render('./wbot/commands.ejs', {
            title: "WBOT | 커맨드"
        })
    })

    app.get('/wbot/callback', passport.authenticate('discord', { failureRedirect: '/wbot/login',failureFlash: true }), function (req, res) {
        res.redirect('/wbot')
    });

    app.get('/wbot/login', passport.authenticate('discord', { scope: scopes }), function (req, res) {
    });

    app.get('/wbot/register', (req, res) => {
        res.render('./wbot/register.ejs', {
            title: "WBOT | 회원가입"
        })
    })

    app.get('/wbot/logout', function (req, res) {
        req.logout();
        res.redirect('/wbot');
    });


    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    app.use((req, res, next) => {
        res.status(404);
        res.render('./error.ejs', {
            title: "Vendetta-Error",
            type: "에러 핸들링"
        })
    })

    async function checkAuth(req, res, next) {
        if (req.isAuthenticated()) {
            if (!req.user.email) {
                req.logout();
                res.send('<head><meta charset="utf-8" /><script type="text/javascript">alert("디스코드 메일인증이 되지 않은 유저입니다. 메일인증후 사용부탁드립니다.");\nlocation.href="/wbot";</script></head>')
                return;
            }
            return next();
        }
        res.send('<head><meta charset="utf-8" /><script type="text/javascript">alert("로그인이 필요한 서비스 입니다");\nlocation.href="/wbot/login";</script></head>')
    }

    async function check(req, res, next) {
        if (req.isAuthenticated()) {
            if (!data[req.user.id]) {
                res.redirect('/wbot/register')
                return;
            }
            return next();
        }
        res.send('<head><meta charset="utf-8" /><script type="text/javascript">alert("로그인이 필요한 서비스 입니다");\nlocation.href="/wbot/login";</script></head>')
    }
}