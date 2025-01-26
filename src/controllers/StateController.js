// const pool = require("../../db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const getstate = (req, res) => {
  let reqBody = req.body;
  let returnObj = {};

  const schema = Joi.object({
    stateid: Joi.string().allow(""),
  });

  Joi.validate(reqBody, schema, (error, value) => {
    if (!error) {
      sqlQuery = "select * from public.state where 1 = 1 ";

      if (
        typeof reqBody.stateid != "undefined" &&
        reqBody.stateid != "" &&
        reqBody.stateid != null
      ) {
        sqlQuery += "and stateid = " + reqBody.stateid;
      }

      sqlQuery += " order by lastmodifieddate desc";

      console.log("Query => ", sqlQuery);

      pool.query(sqlQuery, (error, results) => {
        if (error) throw error;

        if (results.rowCount > 0) {
          returnObj.returnmsg = "succesfull";
          returnObj.returnval = results.rows;
        } else {
          returnObj.returnmsg = "No data found";
          returnObj.returnval = {};
        }

        res.status(200).json(returnObj);
      });
    } else {
      returnObj.returnmsg = "InputException";
      returnObj.returnval = err.details[0].message;
      res.status(400).json(returnObj);
    }
  });
};

const addstate = (req, res) => {
  let reqBody = req.body;

  let statedata = {
    statename: reqBody.statename,
    createdby: reqBody.createdby || "",
  };

  const schema = Joi.object({
    statename: Joi.string().required(),
    createdby: Joi.string().required(),
  });

  Joi.validate(reqBody, schema, (error, value) => {
    let returnobj = {};
    if (!error) {
      sqlQuery = `select * from public.state where statename = '${reqBody.statename}' `;

      pool.query(sqlQuery, (err, results) => {
        let returnObj = {};
        if (!err) {
          if (results.rowCount > 0) {
            returnObj.returnmsg = "failed";
            returnObj.returnval = "State Already Exists";
            res.status(200).json(returnObj);
          } else {
            sqlQuery = ` insert into public.state (statename,createdby,createddate) values
            ('${statedata.statename}','${statedata.createdby}',CURRENT_TIMESTAMP) `;
            console.log("sqlQuery=======?>", sqlQuery);
            pool.query(sqlQuery, (ierror, iresults) => {
              if (!ierror) {
                if (iresults.rowCount > 0) {
                  returnObj.returnmsg = "succesfull";
                  returnObj.returnval = "state addedd succesfully";
                  res.status(200).json(returnObj);
                } else {
                  returnObj.returnmsg = "failed";
                  returnObj.returnval = "Something went wrong";
                  res.status(200).json(returnObj);
                }
              } else {
                returnObj.returnmsg = "failed";
                returnObj.returnval = ierror;
                res.status(200).json(returnObj);
              }
            });
          }
        } else {
          returnObj.returnmsg = "DBException";
          returnObj.returnval = err.details[0].message;
          res.status(400).json(returnObj);
        }
      });
    } else {
      let returnObj = {};
      returnObj.returnmsg = "InputException";
      returnObj.returnval = error.details[0].message;
      res.status(400).json(returnObj);
    }
  });
};

module.exports = {
  getstate,
  addstate,
};
