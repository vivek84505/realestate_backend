const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const conn = require("../config/db");

// Get users query
const getusers = (req, res) => {
  let reqBody = req.body;
  console.log("req.body=========>", req.body);
  let returnObj = {};

  // Define the Joi schema
  const schema = Joi.object({
    user_id: Joi.string().allow(""),
  });

  // Use schema.validate instead of Joi.validate
  const { error, value } = schema.validate(reqBody);

  if (!error) {
    let sqlQuery = "Select user_id,firstname,lastname,email,mobile,userrole,isactive,createdby,DATE(created_at) AS created_date,lastmodifiedby,updated_at from users where 1=1 ";

    // Uncomment if you want to filter by user_id
    // if (reqBody.user_id) {
    //   sqlQuery += " and user_id = " + reqBody.user_id;
    // }

    sqlQuery += " order by updated_at desc";

    console.log("Query => ", sqlQuery);

    // Execute the SQL query
    conn.query(sqlQuery, (error, data) => {
      if (error) throw error;

      if (data.length > 0) {
        returnObj.status = "success";
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
    returnObj.returnval = error.details[0].message; // Handle Joi validation error
    res.status(400).json(returnObj);
  }
};

const addUser = (req, res) => {
  let returnObj = {};

  let reqBody = req.body;
  let userdata = {
    firstname: reqBody.firstname,
    lastname: reqBody.lastname,
    email: reqBody.email,
    password: bcrypt.hashSync(reqBody.mobile, 8),
    mobile: reqBody.mobile || null,
    createdby: reqBody.createdby || null,
    userrole: reqBody.userrole || 1,
    city: reqBody.city || null,
    address: reqBody.address || null,
  };

  const schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    userrole: Joi.string().required(),
    mobile: Joi.string().required(),
    createdby: Joi.string().allow(),
    state: Joi.string().allow(),
    city: Joi.string().allow(),
    lastmodifiedby: Joi.string().allow(),
    user_role: Joi.number().allow(),
    city: Joi.string().allow(),
    address: Joi.string().allow(),
  });

  const { error, value } = schema.validate(reqBody);

  if (!error) {
    //check if email exists
    sqlQuery = `select * from users where email = '${userdata.email}' OR mobile = '${userdata.mobile}' `;

    console.log("sqlQuery=======?>", sqlQuery);

    conn.query(sqlQuery, (error, data) => {
      if (error) throw error;

      if (data.length) {
        if (data[0].email == userdata.email) {
          returnObj.returnmsg = "Email already exists";
        }

        if (data[0].mobile == userdata.mobile) {
          returnObj.returnmsg = "Mobile already exists";
        }

        returnObj.status = "fail";
        returnObj.returnval = [];
        res.status(200).json(returnObj);
      } else {
        //Add User to DB
        sqlQuery = `insert into users (firstname,lastname,email,password,mobile,createdby,userrole,city,address,created_at) 
        values ( '${userdata.firstname}' , '${userdata.lastname}','${userdata.email}','${userdata.password}','${userdata.mobile}','${userdata.createdby}','${userdata.userrole}','${userdata.city}','${userdata.address}',CURRENT_TIMESTAMP ) `;
        console.log("insert sqlQuery", sqlQuery);
        conn.query(sqlQuery, (error, results1) => {
          if (error) {
            returnObj.status = "fail";
            returnObj.returnmsg = "Something went wrong";
            returnObj.returnval = [];
            res.status(400).json(returnObj);
          } else {
            if (results1.affectedRows > 0) {
              returnObj.status = "sucess";
              returnObj.returnmsg = "User addedd succesfully";
              returnObj.returnval = userdata;
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
};

const deleteuser = (req, res) => {
  let returnObj = {};
  let reqBody = req.body;

  const schema = Joi.object({
    user_id: Joi.string().required(),
  });

  const { error, value } = schema.validate(reqBody);
  if (!error) {
    user_id = reqBody.user_id;
    sqlQuery = ` select * from users where user_id = '${user_id}' `;
    console.log("sqlQuery=======?>", sqlQuery);

    conn.query(sqlQuery, (error, data) => {
      if (data.length == 0) {
        returnObj.status = "fail";
        returnObj.returnmsg = "User does not exist.";
        returnObj.returnval = [];
        res.status(200).json(returnObj);
      } else {
        sqlQuery = `delete from users where user_id = '${user_id}' `;
        console.log("sqlQuery=======?>", sqlQuery);

        conn.query(sqlQuery, (error, results) => {
          if (error) throw error;

          if (results.affectedRows > 0) {
            returnObj.status = "sucess";
            returnObj.returnmsg = "succesfull";
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
};

const updateUser = (req, res) => {
  let returnObj = {};
  let reqBody = req.body;
  const { user_id, firstname, lastname, email, mobile, city, lastmodifiedby } = reqBody;

  const schema = Joi.object({
    user_id: Joi.string().required(),
    firstname: Joi.string().allow(),
    lastname: Joi.string().allow(),
    email: Joi.string().email().allow(),
    mobile: Joi.string().allow(),
    lastmodifiedby: Joi.string().allow(),
    userrole: Joi.string().required(),
    city: Joi.string().allow(),
    address: Joi.string().allow(),
  });

  const { error, value } = schema.validate(reqBody);

  if (!error) {
    sqlQuery = ` select * from users where email = '${email}' OR mobile = '${mobile}'  `;
    console.log("sqlQuery=======?>", sqlQuery);

    conn.query(sqlQuery, (error, data) => {
      if (data.length > 0) {
        if (reqBody.email == data[0].email && reqBody.user_id != data[0].user_id) {
          console.log("email true==========>");
          returnObj.status = "fail";
          returnObj.returnmsg = "Email Already Exists.";
          returnObj.returnval = [];
          return res.status(200).json(returnObj);
        }

        if (reqBody.mobile == data[0].mobile && reqBody.user_id != data[0].user_id) {
          console.log("mobile true==========>");
          returnObj.status = "fail";
          returnObj.returnmsg = "Mobile Already Exists.";
          returnObj.returnval = [];
          return res.status(200).json(returnObj);
        }

        console.log("inside else========>");
        sqlQuery = ` update  users set firstname ='${firstname}',lastname ='${lastname}',email ='${email}',mobile ='${mobile}',city ='${city}',lastmodifiedby ='${lastmodifiedby}',updated_at = CURRENT_TIMESTAMP  where user_id = '${user_id}' `;

        conn.query(sqlQuery, (error, results1) => {
          console.log("results1===>", results1);
          if (error) throw error;
          if (results1.affectedRows > 0) {
            returnObj.status = "sucess";
            returnObj.returnmsg = "User updated succesfully.";
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
};

module.exports = {
  getusers,
  addUser,
  deleteuser,
  updateUser,
};
