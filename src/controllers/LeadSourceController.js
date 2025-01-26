const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const conn = require("../config/db");

//Get users query
const getleadsourceall = (req, res) => {
  let reqBody = req.body;
  let returnObj = {};
  const schema = Joi.object({
    leadsourceid: Joi.string().allow(""),
  });

  Joi.validate(reqBody, schema, (err, value) => {
    if (!err) {
      sqlQuery =
        "Select leadsourceid,leadsource,isactive,createdby,DATE(createddate) AS createddate,lastmodifiedby,COALESCE(DATE_FORMAT(lastmodifieddate, '%Y-%m-%d'), '') AS lastmodifieddate from tbl_leadsourcemaster where 1= 1 ";

      if (
        typeof reqBody.leadsourceid != "undefined" &&
        reqBody.leadsourceid != ""
      ) {
        sqlQuery += " and leadsourceid = " + reqBody.leadsourceid;
      }

      sqlQuery += " order by createddate desc";

      console.log("Query => ", sqlQuery);

      conn.query(sqlQuery, (error, data) => {
        if (error) throw error;

        if (data.length > 0) {
          returnObj.status = "sucess";
          returnObj.returnmsg = "successful";
          returnObj.returnval = data;
          res.status(200).json(returnObj);
        } else {
          returnObj.status = "fail";
          returnObj.returnmsg = "No Data found";
          returnObj.returnval = [];
          res.status(200).json(returnObj);
        }
      });
    } else {
      returnObj.status = "fail";
      returnObj.returnmsg = "InputException";
      returnObj.returnval = err.details[0].message;
      res.status(400).json(returnObj);
    }
  });
};

const addleadsource = (req, res) => {
  let returnObj = {};

  let reqBody = req.body;
  let leadsourcedata = {
    leadsource: reqBody.leadsource,
    createdby: reqBody.createdby,
  };

  const schema = Joi.object({
    leadsource: Joi.string().required(),
    createdby: Joi.string().required(),
  });

  Joi.validate(reqBody, schema, (err, value) => {
    if (!err) {
      //check if email exists
      sqlQuery = `select leadsource from tbl_leadsourcemaster where leadsource = '${leadsourcedata.leadsource}'  `;

      console.log("sqlQuery=======?>", sqlQuery);

      conn.query(sqlQuery, (error, data) => {
        if (error) throw error;

        if (data.length) {
          if (data[0].leadsource == leadsourcedata.leadsource) {
            returnObj.returnmsg = "Leadsource already exists";
          }

          returnObj.status = "fail";
          returnObj.returnval = [];
          return res.status(200).json(returnObj);
        } else {
          //Add leadsourcedata to DB
          sqlQuery = `insert into tbl_leadsourcemaster (leadsource,createdby,isactive,createddate) 
        values ( '${leadsourcedata.leadsource}' , '${leadsourcedata.createdby}','1',CURRENT_TIMESTAMP ) `;

          conn.query(sqlQuery, (error, results1) => {
            if (error) {
              returnObj.status = "fail";
              returnObj.returnmsg = "Something went wrong";
              returnObj.returnval = [];
              res.status(400).json(returnObj);
            } else {
              if (results1.affectedRows > 0) {
                returnObj.status = "sucess";
                returnObj.returnmsg = "Lead source addedd succesfully";
                returnObj.returnval = leadsourcedata;
                res.status(200).json(returnObj);
              } else {
                returnObj.status = "fail";
                returnObj.returnmsg = "Something went wrong";
                returnObj.returnval = [];
                res.status(200).json(returnObj);
              }
            }
          });
        }
      });
    } else {
      returnObj.status = "fail";
      returnObj.returnmsg = "InputException";
      returnObj.returnval = err.details[0].message;
      res.status(400).json(returnObj);
    }
  });
};

const deleteleadsource = (req, res) => {
  let returnObj = {};
  let reqBody = req.body;

  const schema = Joi.object({
    leadsourceid: Joi.string().required(),
  });

  Joi.validate(reqBody, schema, (err, value) => {
    if (!err) {
      leadsourceid = reqBody.leadsourceid;
      sqlQuery = ` select * from tbl_leadsourcemaster where leadsourceid = '${leadsourceid}' `;
      console.log("sqlQuery=======?>", sqlQuery);

      conn.query(sqlQuery, (error, data) => {
        if (error) {
          returnObj.status = "fail";
          returnObj.returnmsg = "Something went wrong.";
          returnObj.returnval = [];
          res.status(200).json(returnObj);
        }

        if (data.length == 0) {
          returnObj.status = "fail";
          returnObj.returnmsg = "Lead Source does not exist.";
          returnObj.returnval = [];
          res.status(200).json(returnObj);
        } else {
          sqlQuery = `delete from tbl_leadsourcemaster where leadsourceid = '${leadsourceid}' `;
          console.log("sqlQuery=======?>", sqlQuery);

          conn.query(sqlQuery, (error, results) => {
            if (error) throw error;

            if (results.affectedRows > 0) {
              returnObj.status = "sucess";
              returnObj.returnmsg = "Leadsource Deleted";
              returnObj.returnval = [];
              res.status(200).json(returnObj);
            } else {
              returnObj.status = "fail";
              returnObj.returnmsg = "Something went wrong.";
              returnObj.returnval = [];
              res.status(200).json(returnObj);
            }
          });
        }
      });
    } else {
      returnObj.status = "fail";
      returnObj.returnmsg = "InputException";
      returnObj.returnval = err.details[0].message;
      res.status(400).json(returnObj);
    }
  });
};

const updateleadsource = (req, res) => {
  let returnObj = {};
  let reqBody = req.body;
  const { leadsourceid, leadsource, lastmodifiedby } = reqBody;

  const schema = Joi.object({
    leadsourceid: Joi.string().required(),
    leadsource: Joi.string().allow(),
    lastmodifiedby: Joi.string().allow(),
  });

  Joi.validate(reqBody, schema, (err, value) => {
    if (!err) {
      sqlQuery = ` select leadsourceid,leadsource from tbl_leadsourcemaster where leadsource = '${leadsource}'  `;
      console.log("sqlQuery=======?>", sqlQuery);

      conn.query(sqlQuery, (error, data) => {
        if (
          data.length > 0 &&
          reqBody.leadsource == data[0].leadsource &&
          reqBody.leadsourceid != data[0].leadsourceid
        ) {
          returnObj.status = "fail";
          returnObj.returnmsg = "Lead Source Already Exists.";
          returnObj.returnval = [];
          return res.status(200).json(returnObj);
        } else {
          sqlQuery = ` update  tbl_leadsourcemaster set leadsource ='${leadsource}', lastmodifiedby ='${lastmodifiedby}',lastmodifieddate = CURRENT_TIMESTAMP  where leadsourceid = '${leadsourceid}' `;

          conn.query(sqlQuery, (error, results1) => {
            if (error) throw error;
            if (results1.affectedRows > 0) {
              returnObj.status = "sucess";
              returnObj.returnmsg = "Lead Source updated succesfully.";
              returnObj.returnval = [];
              return res.status(200).json(returnObj);
            } else {
              returnObj.status = "fail";
              returnObj.returnmsg = "Something went wrong";
              returnObj.returnval = [];
              return res.status(200).json(returnObj);
            }
          });
        }
      });
    } else {
      returnObj.returnmsg = "InputException";
      returnObj.returnval = err.details[0].message;
      return res.status(400).json(returnObj);
    }
  });
};

module.exports = {
  getleadsourceall,
  addleadsource,
  deleteleadsource,
  updateleadsource,
};
