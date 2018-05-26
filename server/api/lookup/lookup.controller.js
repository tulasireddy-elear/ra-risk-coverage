/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/lookups              ->  index
 */

'use strict';

var db = require("../../utils/db");
var _und = require("underscore");
var async = require("async");

// Gets a list of Lookups
export function index(req, res) {
  res.json([]);
}

// Gets a list of Lookups
export function postApiEndpoint(req, res) {
  var updateCount = 0;
  
  if (req.params.apiEndpoint === 'postFlashUpdate' && req.params.table === 'system') {
    updateCount = 0;

    async.forEach(req.body, 
      function (element, callback) {
        if (typeof element.SYSTEM_ID !== 'undefined') {
          db.query('update amx_system set OPCO_ID=?, NAME=?, DESCRIPTION=? where SYSTEM_ID=? and (NAME != ? or DESCRIPTION != ?)',
            [element.OPCO_ID, element.NAME, element.DESCRIPTION, element.SYSTEM_ID, element.NAME, element.DESCRIPTION], 
            function (updateErr, updateRow) {
              updateCount += updateRow.changedRows;
              if(updateErr !== null) {
                console.log(updateErr);
                res.json({success: false, error: updateErr});
              }
              callback();
            });
        }
        else {
          db.query('insert into amx_system (OPCO_ID, NAME, DESCRIPTION) values (?, ?, ?)', [element.OPCO_ID, element.NAME, element.DESCRIPTION], 
            function (insertErr, insertRow){
              updateCount += insertRow.changedRows;
              callback();
              //console.log(this.lastID);
            });
        }
      },
      // finally
      function () {
        res.json({success: true, updates: updateCount});
      }
    );
  }

  if (req.params.apiEndpoint === 'postFlashUpdate' && req.params.table === 'contact') {
    updateCount = 0;

    async.forEach(req.body, 
      function (element, callback) {
        if (typeof element.CONTACT_ID !== 'undefined') {
          db.query("update amx_contact set OPCO_ID=?, CONTACT_TYPE=?, NAME=?, EMAIL=? where CONTACT_ID=? and (ifnull(NAME, 'na') != ifnull(?, 'na') or ifnull(CONTACT_TYPE, 'na') != ifnull(?, 'na') or ifnull(EMAIL, 'na') != ifnull(?, 'na') )",
            [element.OPCO_ID, element.CONTACT_TYPE, element.NAME, element.EMAIL, element.CONTACT_ID, element.NAME, element.CONTACT_TYPE, element.EMAIL], 
            function (updateErr, updateRow) {
              updateCount += updateRow.changedRows;
              if(updateErr !== null) {
                console.log(updateErr);
                res.json({success: false, error: updateErr});
              }
              callback();
            });
        }
        else {
          db.query('insert into amx_contact (OPCO_ID, CONTACT_TYPE, NAME, EMAIL) values (?, ?, ?, ?)', 
            [element.OPCO_ID, element.CONTACT_TYPE, element.NAME, element.EMAIL], 
            function (insertErr, insertRow){
              updateCount += insertRow.changedRows;
              callback();
              //console.log(this.lastID);
            });
        }
      },
      // finally
      function () {
        res.json({success: true, updates: updateCount});
      }
    );

  }

  if (req.params.apiEndpoint === 'postFlashUpdate' && req.params.table === 'cycle') {
    updateCount = 0;

    async.forEach(req.body, 
      function (element, callback) {
        if (typeof element.BILL_CYCLE_ID !== 'undefined') {
          db.query("update amx_bill_cycle set OPCO_ID=?, BILL_CYCLE=?, DESCRIPTION=?, CYCLE_CLOSE_DAY=?, CYCLE_TYPE=? where BILL_CYCLE_ID=? and (ifnull(BILL_CYCLE, 0) != ? or ifnull(DESCRIPTION, '') != ? or ifnull(CYCLE_CLOSE_DAY, 0) != ? or CYCLE_TYPE != ?)",
            [element.OPCO_ID, element.BILL_CYCLE, element.DESCRIPTION, element.CYCLE_CLOSE_DAY,  element.CYCLE_TYPE, element.BILL_CYCLE_ID, element.BILL_CYCLE, element.DESCRIPTION, element.CYCLE_CLOSE_DAY, element.CYCLE_TYPE], 
            function (updateErr, updateRow) {
              if(updateErr !== null) {
                console.log(updateErr);
                res.json({success: false, error: updateErr});
              }
              else {
                updateCount += updateRow.changedRows;
                callback();
              }
            });
        }
        else {
          db.query('insert into amx_bill_cycle (OPCO_ID, BILL_CYCLE, DESCRIPTION, CYCLE_CLOSE_DAY, CYCLE_TYPE) values (?, ?, ?, ?, ?)', 
            [element.OPCO_ID, element.BILL_CYCLE, element.DESCRIPTION, element.CYCLE_CLOSE_DAY, element.CYCLE_TYPE], 
            function (insertErr, insertRow){
              updateCount += insertRow.changedRows;
              callback();
              //console.log(this.lastID);
            });
        }
      },
      // finally
      function () {
        res.json({success: true, updates: updateCount});
      }
    );
  }
}

export function getApiEndpoint(req, res, next) {

  if (req.params.apiEndpoint === "getOpcos")
    db.query("select * from amx_opco order by opco_id", function(err, row) {
      if(err !== null) {
        console.log(err);
        next(err);
      }
      else {
        res.json(row);
      }
    });

  if (req.params.apiEndpoint === "getLobs")
    db.query("select * from amx_lob order by lob_id", function(err, row) {
      if(err !== null) {
        console.log(err);
        next(err);
      }
      else {
        res.json(row);
      }
    });

  if (req.params.apiEndpoint === "getAreas")
    db.query("select * from amx_area order by area_id", function(err, row) {
      if(err !== null) {
        console.log(err);
        next(err);
      }
      else {
        res.json(row);
      }
    });

  if (req.params.apiEndpoint === "getServices")
    db.query("select * from amx_service order by service_id", function(err, row) {
      if(err !== null) {
        console.log(err);
        next(err);
      }
      else {
        res.json(row);
      }
    });

  if (req.params.apiEndpoint === "getTechnologies")
    db.query("select * from amx_technology order by technology_id", function(err, row) {
      if(err !== null) {
        console.log(err);
        next(err);
      }
      else {
        res.json(row);
      }
    });

  if (req.params.apiEndpoint === "getSystems")
    db.query("select * from amx_system order by opco_id, name", function(err, row) {
      if(err !== null) {
        console.log(err);
        next(err);
      }
      else {
        res.json(row);
      }
    });

  if (req.params.apiEndpoint === "getContacts")
    db.query("select * from amx_contact order by opco_id, contact_type, name", function(err, row) {
      if(err !== null) {
        console.log(err);
        next(err);
      }
      else {
        res.json(row);
      }
    });

  if (req.params.apiEndpoint === "getBillCycles")
    db.query("select * from amx_bill_cycle order by opco_id, bill_cycle", function(err, row) {
      if(err !== null) {
        console.log(err);
        next(err);
      }
      else {
        res.json(row);
      }
    });

  if (req.params.apiEndpoint === "getPeriodicity")
    db.query("select * from amx_periodicity order by periodicity_id", function(err, row) {
      if(err !== null) {
        console.log(err);
        next(err);
      }
      else {
        res.json(row);
      }
    });

  if (req.params.apiEndpoint === "getCounters") {
      db.query("select * from v_counters where OPCO_ID = ifnull(?, 0) LIMIT 1", 
        [req.query.opcoId],
        function(err, row) {
          if(err !== null) {
            console.log(err);
            next(err);
          }
          else {
            res.json(row[0]);
          }
        });
    }

  if (req.params.apiEndpoint === "getCountersAll") {
      db.query("select * from v_counters", 
        [],
        function(err, row) {
          if(err !== null) {
            console.log(err);
            next(err);
          }
          else {
            res.json(row);
          }
        });
    }
   
}


export function deleteIdFromTable(req, res, next) {

if (req.params.table === 'system')
    db.query("delete from amx_system where system_id = ?", 
      [req.query.id], function (err, row) {
      if(err !== null) {
        console.log(err);
        res.json({success: false, error: err});
      }
      else {
        res.json({success: true});
      }
    });

  if (req.params.table === 'contact')
    db.query("delete from amx_contact where contact_id = ?", 
      [req.query.id], function (err, row) {
      if(err !== null) {
        console.log(err);
        res.json({success: false, error: err});
      }
      else {
        res.json({success: true});
      }
    });

  if (req.params.table === 'cycle')
    db.query("delete from amx_bill_cycle where bill_cycle_id = ?", 
      [req.query.id], function (err, row) {
      if(err !== null) {
        console.log(err);
        res.json({success: false, error: err});
      }
      else {
        res.json({success: true});
      }
    });

}