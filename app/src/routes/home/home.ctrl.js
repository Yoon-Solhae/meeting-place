"use strict";

const logger = require("../../config/logger");
const User = require("../../models/User");

// 로그인 상태 확인
function authIsOwner(req, res) {
  if (req.session.is_logined) {
    return true;
  } else {
    return false;
  }
}

const output = {
  home: (req, res) => {
    var is_logined = authIsOwner(req, res);
    logger.info(`GET / 304 "홈 화면으로 이동"`);
    res.render("home/index", { is_logined: is_logined, name: req.session.name });
  },

  login: (req, res) => {
    logger.info(`GET /login 304 "로그인 화면으로 이동"`);
    res.render("home/login");
  },

  register: (req, res) => {
    logger.info(`GET /register 304 "회원가입 화면으로 이동"`);
    res.render("home/register");
  },

  midpoint: (req, res) => {
    var is_logined = authIsOwner(req, res);
    logger.info(`GET /register 304 "중간 지점 화면으로 이동"`);
    res.render("home/midpoint", { is_logined: is_logined, name: req.session.name });
  },
};

const process = {
  login: async (req, res) => {
    const user = new User(req.body);
    const response = await user.login();

    req.session.is_logined = true;
    req.session.name = user.body.id;

    const url = {
      method: "POST",
      path: "/login",
      status: response.err ? 400 : 200,
    };

    log(response, url);

    return res.status(url.status).json(response);
  },

  register: async (req, res) => {
    const user = new User(req.body);
    const response = await user.register();

    const url = {
      method: "POST",
      path: "/register",
      status: response.err ? 409 : 201,
    };

    log(response, url);
    return res.status(url.status).json(response);
  },
};

module.exports = {
  output,
  process,
};

const log = (response, url) => {
  if (response.err) {
    logger.error(
      `${url.method} ${url.path} ${url.status} Response: ${response.success} ${response.err}`
    );
  } else {
    logger.info(
      `${url.method} ${url.path} ${url.status} Response: ${response.success} ${
        response.msg || ""
      }`
    );
  }
};