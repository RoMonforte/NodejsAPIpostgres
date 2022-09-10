const UserService = require('./user.service');
const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');
const service = new UserService();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const {config} = require('../config/config');

class AuthService {

  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if(!user) {
      throw boom.unauthorized();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
    return user;
  }

  async signToken(user) {
      const payload = {
        sub: user.id,
        role: user.role,

      }
      const token = jwt.sign(payload, config.jwtSecret);
      return {
        user,
        token
      };
  }
  async sendMail(email) {
    const user = await service.findByEmail(email);
    if(!user) {
      throw boom.unauthorized();
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      secure: false,
      port: 587,
      auth: {
          user: 'emmett.weber@ethereal.email',
          pass: 'wWn2PzKBwUhsUbEnEB'
      }
    });
    await transporter.sendMail({
      from: '"emmett.weber@ethereal.email', // sender address
      to: `${user.email}`, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
    return {message: 'mail sent'};
  }
}

module.exports = AuthService;
