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


  async sendRecovery(email) {
    const user = await service.findByEmail(email);
    if(!user) {
      throw boom.unauthorized();
    }
    const payload = {sub: user.id};
    const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '15min'});
    const link = `http://myfrontend.com/recovery?token=${token}`;
    await service.update(user.id, {recoveryToken: token});
    const mail = {
      from: '"emmett.weber@ethereal.email', // sender address
      to: `${user.email}`,
      subject: "Recovery password",
      html: `<b>Ingresa a este link => ${link}</b>`,
    }
   const rta = await this.sendMail(mail)
   return rta;
  }

  async sendMail(infomail) {

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      secure: false,
      port: 587,
      auth: {
          user: 'emmett.weber@ethereal.email',
          pass: 'wWn2PzKBwUhsUbEnEB'
      }
    });
    await transporter.sendMail(infomail);
    return {message: 'mail sent'};
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await service.findOne(payload.sub);
      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      }
      const hash = await bcrypt.hash(newPassword, 10);
      await service.update(user.id, {recoveryToken: null, password: hash});
      return {message: 'password changed'};
    } catch (error) {
      throw boom.unauthorized()
    }
  }
}

module.exports = AuthService;
