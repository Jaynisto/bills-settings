import bodyParser from 'body-parser';
import express from 'express';
import exphbs  from 'express-handlebars';
import BillWithSettings from './settings-bill.js';
import moment from "moment";

const settingsBill = BillWithSettings();


const app = express();



//Configuring handlebars
const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath:  './views',
    layoutsDir : './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');


//Rendering the index handlebar
app.use(express.static('public'));

//Takin g the information
app.use(bodyParser.urlencoded({extended : false}));

app.use(bodyParser.json());

app.get('/', (req, res)=>{   
    res.render("index", {
        settings: settingsBill.getSettings(),
        totals: settingsBill.totals(),
        total: settingsBill.maxTotalLevel()
    });
});

app.post('/settings', (req, res)=>{
    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });
    console.log(req.body);
    res.redirect('/');
});

app.post('/action', (req, res)=>{
    // console.log(req.body.actionType);
    settingsBill.recordAction(req.body.actionType);
    res.redirect('/');
});

app.get('/actions', (req, res)=>{
    for(const item of settingsBill.actions()){
        let currentMoment = item.date;
        item.timestamp = moment(currentMoment).fromNow();    
    }
    res.render('actions', { actions: settingsBill.actions()});
});

app.get('/actions/:actionType', (req, res)=>{
    for(const item of settingsBill.actions()){
        let currentMoment = item.date;
        item.timestamp = moment(currentMoment).fromNow();    
    }
    const actionType = req.params.actionType;
    res.render('actions', { actions: settingsBill.actionsFor(actionType)})
});

const PORT = process.env.PORT || 30011

app.listen(PORT, (req, res)=>{
    console.log("App Started Departing....");
});