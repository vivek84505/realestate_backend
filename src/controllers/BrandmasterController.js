// const pool = require("../../db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const brandmasterUpdate = (req, res) => {
  let reqBody = req.body;
  let returnObj = {};
  const schema = Joi.object({
    brandid: Joi.string().required(),
    brandname: Joi.string().allow(""),
    lastmodifiedby: Joi.string().required(),
    isactive: Joi.number().allow(""),
  });

  Joi.validate(reqBody, schema, (error, value) => {
    if (!error) {
      sqlQuery = `select * from public.brandmaster where brandname = '${reqBody.brandname}'  `;
      console.log("sqlQuery==========>", sqlQuery);
      pool.query(sqlQuery, (err, results) => {
        if (!err) {
          if (results.rowCount > 0) {
            sqlQuery = `Update public.brandmaster set  lastmodifiedby = '${reqBody.lastmodifiedby}', lastmodifieddate = CURRENT_TIMESTAMP `;

            if (
              typeof reqBody.brandname != undefined &&
              reqBody.brandname != "" &&
              reqBody.brandname != null
            ) {
              sqlQuery += ` , brandname = '${reqBody.brandname}' `;
            }

            if (reqBody.isactive == 0 || reqBody.isactive == 1) {
              console.log("reqBody.isactive=======>", reqBody.isactive);
              sqlQuery += `, isactive = '${reqBody.isactive}' `;
            }

            sqlQuery += `where brandid = '${reqBody.brandid}' `;

            console.log("sqlQuery==========>", sqlQuery);
            pool.query(sqlQuery, (err, results) => {
              if (!err) {
                if (results.rowCount > 0) {
                  returnObj.returnmsg = "succesfull";
                  returnObj.returnval = reqBody;
                  res.status(200).json(returnObj);
                }
              } else {
                returnObj.returnmsg = "failed";
                returnObj.returnval = {};
                res.status(200).json(returnObj);
              }
            });
          } else {
            returnObj.returnmsg = "Brand does not exists!";
            returnObj.returnval = {};
            res.status(200).json(returnObj);
          }
        }
      });
    } else {
      returnObj.returnmsg = "InputException";
      returnObj.returnval = error.details[0].message;
      res.status(200).json(returnObj);
    }
  });
};

const brandmasterAdd = (req, res) => {
  let reqBody = req.body;
  let returnObj = {};

  const schema = Joi.object({
    brandname: Joi.string().required(),
    createdby: Joi.string().allow(""),
  });

  reqBody.brandname = reqBody.brandname || "";
  reqBody.createdby = reqBody.createdby || "";

  Joi.validate(reqBody, schema, (error, value) => {
    if (!error) {
      sqlQuery = `select * from public.brandmaster where brandname = '${reqBody.brandname}' and isactive = '1' `;
      console.log("Query => ", sqlQuery);

      pool.query(sqlQuery, (err, results) => {
        if (!err) {
          if (results.rowCount > 0) {
            returnObj.returnmsg = "Brand already exists!";
            returnObj.returnval = {};
            res.status(200).json(returnObj);
          } else {
            sqlQuery = `insert into public.brandmaster (brandname,createddate,createdby,isactive) values ('${reqBody.brandname}',CURRENT_TIMESTAMP,'${reqBody.createdby}','1')`;

            console.log("sqlQuery=======>", sqlQuery);

            pool.query(sqlQuery, (err, results) => {
              if (!err) {
                returnObj.returnmsg = "succesfull";
                returnObj.returnval = reqBody;
                res.status(200).json(returnObj);
              } else {
                returnObj.returnmsg = "failed";
                returnObj.returnval = {};
                res.status(200).json(returnObj);
              }
            });
          }
        }
      });
    } else {
      returnObj.returnmsg = "InputException";
      returnObj.returnval = error.details[0].message;
      res.status(200).json(returnObj);
    }
  });
};

const brandmasterGetAll = (req, res) => {
  let reqBody = req.body;
  let returnObj = {};

  const schema = Joi.object({
    brandid: Joi.string().allow(""),
  });

  Joi.validate(reqBody, schema, (error, value) => {
    if (!error) {
      sqlQuery = "select * from public.brandmaster where 1=1 ";

      if (
        typeof reqBody.brandid != "undefined" &&
        reqBody.brandid != null &&
        reqBody.brandid != ""
      ) {
        sqlQuery += " and brandid = " + reqBody.brandid;
      }

      sqlQuery += " order by lastmodifiedby desc";

      console.log("Query => ", sqlQuery);

      pool.query(sqlQuery, (error, results) => {
        if (error) throw error;

        if (results.rowCount > 0) {
          returnObj.returnmsg = "succesfull";
          returnObj.returnval = results.rows;
        } else {
          returnObj.returnmsg = "No data Found";
          returnObj.returnval = {};
        }

        res.status(200).json(returnObj);
      });
    } else {
      returnObj.returnmsg = "InputException";
      returnObj.returnval = error.details[0].message;
      res.status(400).json(returnObj);
    }
  });
};

module.exports = {
  brandmasterGetAll,
  brandmasterAdd,
  brandmasterUpdate,
};
