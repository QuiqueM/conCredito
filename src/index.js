const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')
const { database } = require('./keys')
const passport = require('passport')



const app = express()
require('./lib/passport')
 
//settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
    //helpers: require('./lib/handlebars')

}))
app.set('view engine', '.hbs')

//middelware
app.use(session({
    secret: 'quiquemartinez',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
    
}))

app.use(flash())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())



//variables globlales
app.use((req, res, next) => {
    app.locals.success = req.flash('success')
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next()
})


//Routes
app.use(require('./routes'))
app.use(require('./routes/autenticacion'))
app.use('/prospectos',require('./routes/prospectos'))



//servidor
app.listen(app.get('port'), () => {
    console.log(`servidor en el puerto`, app.get('port'))
})