const router = require('../router')();
const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const logger = require('../../utilities/logger');


router.get('/', (req, res) => {
  logger.debug("GETGETGETGETGET");
  logger.debug(req.session.call);
  Event.
  findOne({slug: req.params.slug}).
  exec((err, data) => {
    logger.debug('routes/events/participate err:' + err);
    if (err || data === null) {
      return next(err);
    }
    if (!req.session.call) {
      req.session.call = {
        step: 0,
        event: {
          _id : data._id,
          slug: data.slug
        }
      };
    }
    logger.debug('events/participate');
    res.render('events/participate', {
      title: data.title,
      dett: data,
      call: req.session.call,
      user: req.user
    });
  });
});

router.post('/', (req, res) => {
  logger.debug('fetchEvent'+req.params.slug);  
  Event.
  findOne({slug: req.params.slug}).
  exec((err, data) => {
    logger.debug('routes/events/participate err:' + err);
    if (err || data === null) {
      return next(err);
    }
    logger.debug("POSTPOSTPOSTPOSTPOST");
    logger.debug(req.body);
    logger.debug(req.session.call);
    //logger.debug(typeof req.body.step);
    if (data && typeof req.body.step!='undefined') {
      var msg;
      switch (parseInt(req.body.step)) {
        case 0 :
          if (data && typeof req.body.index!='undefined') {
            req.session.call.step = parseInt(req.body.step)+1;
            req.session.call.index = parseInt(req.body.index);
          } else {
            msg = {e:[{name:"index",m:__("Please select a call")}]}
          }
          break;
        case 1 :
          if (data && req.body.accept=='1') {
            req.session.call.step = parseInt(req.body.step)+1;
          } else {
            msg = {e:[{name:"accept",m:__("Please accept the terms and conditions to go forward")}]}
          }
          break;
        case 2 :
          if (data && typeof req.body.performance!='undefined') {
            req.session.call.step = parseInt(req.body.step)+1;
            for (var a=0; a<passport_user.performances.length; a++) {
              if (passport_user.performances[a]._id==req.body.performance){
                req.session.call.performance = passport_user.performances[a];
                req.session.call.subscriptions = [];
                for (var b=0; b<req.session.call.performance.users.length; b++) {
                  if (req.session.call.performance.users[b].members) {
                    for (var c=0; c<req.session.call.performance.users[b].members.length; c++) {
                      DB.subscriptions.findOne({subscriber_id:req.session.call.performance.users[b].members[c]._id}, function(e, subscription) {
                        if (subscription) {
                          req.session.call.subscriptions.push(subscription);
                        }
                      });
                    }
                  } else {
                    DB.subscriptions.findOne({subscriber_id:req.session.call.performance.users[b]._id}, function(e, subscription) {
                      if (subscription) {
                        req.session.call.subscriptions.push(subscription);
                      }
                    });

                  }
                }
              }
            }

          } else {
            msg = {e:[{name:"accept",m:__("Please select a performance to go forward")}]}
          }
          break;
        case 3 :
          if (data && req.body.topics.length) {
            req.session.call.step = parseInt(req.body.step)+1;
            req.session.call.topics = req.body.topics;
          } else {
            msg = {e:[{name:"accept",m:__("Please select at least 1 topic to go forward")}]}
          }
          break;
        case 4 :
          if (data && req.body.subscriptions && req.body.subscriptions.length) {
            req.session.call.step = parseInt(req.body.step)+1;
            var subscriptions = [];
            for (var a=0; a<req.body.subscriptions.length; a++) {
              if (req.body.subscriptions[a].subscriber_id){
                var subscriptionA = req.body.subscriptions[a];
                subscriptions.push(subscriptionA);
              }
            }
            req.session.call.subscriptions = subscriptions;
          } else {
            msg = {e:[{name:"accept",m:__("Please select at least 1 person to go forward")}]}
          }
          break;
      }
      logger.debug(req.session.call);
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(data);
      } else {
        logger.debug('events/participate');  
        res.render('events/participate', {
          title: data.title,
          dett: data,
          call: req.session.call,
          user: req.user
        });
      }
    } else {
      res.sendStatus(404);
    }
  

  });
});


/*
exports.get = function get(req, res) {
  var pathArray = req.url.split("?")[0].split("/");
  var output = (req.query.output ? req.query.output : false);
  if (pathArray[0]=="") pathArray.shift();
  if (pathArray[pathArray.length-1]=="") pathArray.pop();
  if (pathArray[pathArray.length-1].indexOf("output")!=-1) pathArray.pop();
  var passport_user = req.session.passport && req.session.passport.user ? req.session.passport.user : {};
  if (pathArray.length > 0) {
    DB.users.findOne({permalink:pathArray[0]}, function(e, result) {
      if (result) {
        switch (pathArray.length) {
          case 1 :
            res.render('performer', { userpage:true, title: result.display_name, result : result, Fnc:Fnc, user : passport_user });
            break;
          case 2 :
            if (config.sections[pathArray[1]]) {
              res.render('performer_list', { userpage:true, title: result.display_name, title2: config.sections[pathArray[1]].title, sez:pathArray[1], result : result, Fnc:Fnc, user : passport_user });

            } else {
              res.sendStatus(404);
            }
            break;
          case 3 :
            if (config.sections[pathArray[1]]) {
              DB[config.sections[pathArray[1]].coll].findOne({permalink:pathArray[2]}, function(e, dett) {
                if (dett) {
                  if (output=="json") {
                    res.send(result);
                  } else if (output=="xml") {
                    res.render('performer_dett_'+pathArray[1]+"_xml", {  layout: false, userpage:true, title: result.display_name+": "+config.sections[pathArray[1]].title, sez:pathArray[1], result : result, dett : dett, Fnc:Fnc, user : passport_user });
                  } else {
                    res.render('performer_dett_'+pathArray[1], { userpage:true, title: result.display_name+":  "+config.sections[pathArray[1]].title, sez:pathArray[1], result : result, dett : dett, Fnc:Fnc, user : passport_user });
                  }
                } else {
                  res.sendStatus(404);
                }
              });
            } else {
              res.sendStatus(404);
            }
            break;
          case 4 :
            if (config.sections[pathArray[1]] && config.sections[pathArray[1]].subsections && config.sections[pathArray[1]].subsections[pathArray[3]]) {
              DB[config.sections[pathArray[1]].coll].findOne({permalink:pathArray[2]}, function(e, dett) {
                if (dett) {
                  logger.debug("GETGETGETGETGETGET");
                  logger.debug(req.session.call);

                  if (!req.session.call){
                    req.session.call = {
                      step: 0,
                      event: {
                        _id : dett._id,
                        permalink: dett.permalink
                      },
                      //user: req.session.passport.user
                    }
                  }
                  if(typeof req.query.step!='undefined'){
                    req.session.call.step = req.query.step;
                  }
                  var subscriptions = {};

                  if (output=="json") {
                    res.send(result);
                  } else if (output=="xml") {
                    res.render('performer_dett_'+pathArray[1]+'_'+pathArray[3]+"_xml", {  layout: false, userpage:true, title: result.display_name+": "+config.sections[pathArray[1]].title, sez:pathArray[1], result : result, dett : dett, Fnc:Fnc, user : passport_user, call: req.session.call, subscriptions:subscriptions });
                  } else {
                    res.render('performer_dett_'+pathArray[1]+'_'+pathArray[3], {                          userpage:true, title: result.display_name+": "+config.sections[pathArray[1]].title, sez:pathArray[1], result : result, dett : dett, Fnc:Fnc, user : passport_user, call: req.session.call, subscriptions:subscriptions });
                  }
                } else {
                  res.sendStatus(404);
                }
              });
            } else {
              res.sendStatus(404);
            }
            break;
          default :
            res.sendStatus(404);
        }
      } else {
        res.sendStatus(404);
      }
    });
  } else {
    res.sendStatus(404);
  }
};

exports.post = function post(req, res) {
  var pathArray = req.url.split("/");
  var output = (req.query.output ? req.query.output : false);
  if (pathArray[0]=="") pathArray.shift();
  if (pathArray[pathArray.length-1]=="") pathArray.pop();
  if (pathArray[pathArray.length-1].indexOf("output")!=-1) pathArray.pop();
  var passport_user = req.session.passport && req.session.passport.user ? req.session.passport.user : {};
  if (pathArray.length > 0) {
    DB.users.findOne({permalink:pathArray[0]}, function(e, result) {
      if (result) {
        switch (pathArray.length) {
          case 4 :
            if (config.sections[pathArray[1]] && config.sections[pathArray[1]].subsections && config.sections[pathArray[1]].subsections[pathArray[3]]) {
              DB[config.sections[pathArray[1]].coll].findOne({permalink:pathArray[2]}, function(e, dett) {
                logger.debug("POSTPOSTPOSTPOSTPOST");
                logger.debug(req.body);
                logger.debug(req.body.step);
                logger.debug(typeof req.body.step);
                if (dett && typeof req.body.step!='undefined') {
                  var msg;
                  switch (parseInt(req.body.step)) {
                    case 0 :
                      if (dett && typeof req.body.index!='undefined') {
                        req.session.call.step = parseInt(req.body.step)+1;
                        req.session.call.index = parseInt(req.body.index);
                      } else {
                        msg = {e:[{name:"index",m:__("Please select a call")}]}
                      }
                      break;
                    case 1 :
                      if (dett && req.body.accept=='1') {
                        req.session.call.step = parseInt(req.body.step)+1;
                      } else {
                        msg = {e:[{name:"accept",m:__("Please accept the terms and conditions to go forward")}]}
                      }
                      break;
                    case 2 :
                      if (dett && typeof req.body.performance!='undefined') {
                        req.session.call.step = parseInt(req.body.step)+1;
                        for (var a=0; a<passport_user.performances.length; a++) {
                          if (passport_user.performances[a]._id==req.body.performance){
                            req.session.call.performance = passport_user.performances[a];
                            req.session.call.subscriptions = [];
                            for (var b=0; b<req.session.call.performance.users.length; b++) {
                              if (req.session.call.performance.users[b].members) {
                                for (var c=0; c<req.session.call.performance.users[b].members.length; c++) {
                                  DB.subscriptions.findOne({subscriber_id:req.session.call.performance.users[b].members[c]._id}, function(e, subscription) {
                                    if (subscription) {
                                      req.session.call.subscriptions.push(subscription);
                                    }
                                  });
                                }
                              } else {
                                DB.subscriptions.findOne({subscriber_id:req.session.call.performance.users[b]._id}, function(e, subscription) {
                                  if (subscription) {
                                    req.session.call.subscriptions.push(subscription);
                                  }
                                });

                              }
                            }
                          }
                        }

                      } else {
                        msg = {e:[{name:"accept",m:__("Please select a performance to go forward")}]}
                      }
                      break;
                    case 3 :
                      if (dett && req.body.topics.length) {
                        req.session.call.step = parseInt(req.body.step)+1;
                        req.session.call.topics = req.body.topics;
                      } else {
                        msg = {e:[{name:"accept",m:__("Please select at least 1 topic to go forward")}]}
                      }
                      break;
                    case 4 :
                      if (dett && req.body.subscriptions && req.body.subscriptions.length) {
                        req.session.call.step = parseInt(req.body.step)+1;
                        var subscriptions = [];
                        for (var a=0; a<req.body.subscriptions.length; a++) {
                          if (req.body.subscriptions[a].subscriber_id){
                            var subscriptionA = req.body.subscriptions[a];
                            subscriptions.push(subscriptionA);
                          }
                        }
                        req.session.call.subscriptions = subscriptions;
                      } else {
                        msg = {e:[{name:"accept",m:__("Please select at least 1 person to go forward")}]}
                      }
                      break;
                  }
                  logger.debug(req.session.call);
                  if (output=="json") {
                    res.send(result);
                  } else if (output=="xml") {
                    res.render('performer_dett_'+pathArray[1]+'_'+pathArray[3]+"_xml", {  layout: false, userpage:true, title: result.display_name+": "+config.sections[pathArray[1]].title, sez:pathArray[1], result : result, dett : dett, Fnc:Fnc, user : passport_user, call: req.session.call, msg:msg  });
                  } else {
                    res.render('performer_dett_'+pathArray[1]+'_'+pathArray[3], {                          userpage:true, title: result.display_name+": "+config.sections[pathArray[1]].title, sez:pathArray[1], result : result, dett : dett, Fnc:Fnc, user : passport_user, call: req.session.call, msg:msg  });
                  }
                } else {
                  res.sendStatus(404);
                }
              });
            } else {
              res.sendStatus(404);
            }
            break;

          default :
            res.sendStatus(404);
        }
      } else {
        res.sendStatus(404);
      }
    });
  } else {
    res.sendStatus(404);
  }
};
*/

module.exports = router;
