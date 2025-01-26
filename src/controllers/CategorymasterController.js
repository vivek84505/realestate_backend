// const pool = require("../../db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const categorymasterUpdate = (req,res) => {
  let reqBody = req.body;
  let returnObj = {};

  const schema = Joi.object({
    catid:Joi.string().required(),
    categoryname:Joi.string().allow(''),
    lastmodifiedby:Joi.string().required(),
    isactive:Joi.string().allow('')
  });

  Joi.validate(reqBody,schema,(error,value) => {
    if(!error){
      sqlQuery = ` select catid from public.categorymaster where  categoryname = '${reqBody.categoryname}' `;

      console.log("sqlQuery => ", sqlQuery);
        pool.query(sqlQuery,(error,results) => {

     
        if(error) throw error;
       
        if(results.rowCount > 0 ){

          returnObj.returnmsg = 'Category Already exists!';
          returnObj.returnval = {};
          res.status(400).json(returnObj);
 

        }
        else{
          sqlQuery = ` update public.categorymaster set lastmodifiedby = '${reqBody.lastmodifiedby}', lastmodifieddate = CURRENT_TIMESTAMP `
          console.log("sqlQuery => ", sqlQuery);
          if(typeof(reqBody.categoryname) != undefined && reqBody.categoryname != '' && reqBody.categoryname != null  ){
            sqlQuery += `, categoryname = '${reqBody.categoryname}' `
          }

          if(reqBody.isactive == 1 || reqBody.isactive == 0){
            sqlQuery += `, isactive = '${reqBody.isactive}' `
          }

          sqlQuery += `where catid = '${reqBody.catid}' `

          pool.query(sqlQuery,(error,results) => {
            if (error) throw error;
              if(results.rowCount > 0){
                returnObj.returnmsg = 'succesfull';
                returnObj.returnval = reqBody;
                res.status(400).json(returnObj);
              }            
              else{
                returnObj.returnmsg = 'failed';
                returnObj.returnval = {};
                res.status(400).json(returnObj);
              }          

          }); 
        }

      });

    }
    else{
      returnObj.returnmsg = 'InputException';
      returnObj.returnval= error.details[0].message;
      res.status(400).json(returnObj);
    }
  })
};



const categorymasterAdd = (req, res) => {
  let reqBody = req.body;
  let returnObj = {};

  const schema = Joi.object({
    categoryname: Joi.string().required(),
    createdby: Joi.string().required(),
  });

  Joi.validate(reqBody, schema, (error, value) => {
    if (!error) {
      sqlQuery = ` select catid from public.categorymaster where categoryname = '${reqBody.categoryname}' `;
      console.log("Query => ", sqlQuery);
      pool.query(sqlQuery, (error, results) => {
        if (error) throw error;
        if (results.rowCount > 0) {
          returnObj.returnmsg = "Category already exists!";
          returnObj.returnval = {};
          res.status(400).json(returnObj);
        } else {
          sqlQuery = ` insert into public.categorymaster (categoryname,createdby,createddate,isactive) values ('${reqBody.categoryname}' , '${reqBody.createdby}', CURRENT_TIMESTAMP , '1') `;
          console.log("Query => ", sqlQuery);
          pool.query(sqlQuery, (error, details) => {
            if (!error) {
              returnObj.returnmsg = "succesfull";
              returnObj.returnval = reqBody;
              res.status(400).json(returnObj);
            } else {
              returnObj.returnmsg = "failed";
              returnObj.returnval = {};
              res.status(400).json(returnObj);
            }
          });
        }
      });
    } else {
      returnObj.returnmsg = "InputException";
      returnObj.returnval = error.details[0].message;
      res.status(400).json(returnObj);
    }
  });
};

const categorymastergetAll = (req, res) => {
  let reqBody = req.body;
  let returnObj = {};

  const schema = Joi.object({
    catid: Joi.string().allow(""),
  });

  Joi.validate(reqBody, schema, (error, value) => {
    if (!error) {
      sqlQuery = ` select catid,categoryname,createdby,createddate,lastmodifiedby,lastmodifieddate  from public.categorymaster where 1= 1  `;

      if (
        typeof reqBody.catid != "undefined" &&
        reqBody.catid != "" &&
        reqBody.catid != null
      ) {
        sqlQuery += ` and catid = ${reqBody.catid} `;
      }

      sqlQuery += " order by lastmodifiedby desc";
      console.log("Query => ", sqlQuery);

      pool.query(sqlQuery, (error, results) => {
        if (error) throw error;

        if (results.rowCount > 0) {
          returnObj.returnmsg = "succesfull";
          returnObj.returnval = results.rows;
          res.status(400).json(returnObj);
        } else {
          returnObj.returnmsg = "No data found";
          returnObj.returnval = {};
          res.status(400).json(returnObj);
        }
      });
    } else {
      returnObj.returnObj = "InputException";
      returnObj.returnval = error.details[0].message;
      res.status(400).json(returnObj);
    }
  });
};

module.exports = {
  categorymastergetAll,
  categorymasterAdd,
  categorymasterUpdate
};
