"use strict"

const db = require("../config/db");

class PlaceStorage {
    static async save(userInfo, userPlace) {
      return new Promise((resolve, reject) => {
        const query = "INSERT INTO recommend_data(place_name, univ, gender, addr, lat, lng) VALUES(?, ?, ?, ?, ?, ?);";
        db.query(query, [userPlace.name, userInfo.univ, userInfo.gender, userPlace.addr.address_name, userPlace.lat, userPlace.lng], (err) => {
          if (err) reject(`${err}`);
          else resolve({ success: true });
        });
      });
    }

    static async getRecommendData(userInfo) {
      return new Promise((resolve, reject) => {
        const query = `SELECT COUNT(place_name), place_name, addr, lat, lng FROM recommend_data
                        WHERE univ = ? and gender = ?
                        GROUP BY place_name
                        ORDER BY COUNT(place_name) DESC;`;
        db.query(query, [userInfo.univ, userInfo.gender], (err, data) => {
          if (err) reject(`${err}`);
          else {
            resolve(data);
          }
        });
      });
    }
  }

module.exports = PlaceStorage;