const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb',
  port: 5432
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool.query(`
  SELECT * 
  FROM users
  WHERE email = '${email}';
  `)
  .then(res => res.rows[0])
  .catch(res => res.rows[null]);

};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool.query(`
  SELECT * FROM users
  WHERE id = '${id}';
  `)
  .then(res => res.rows[0])
  .catch(res => res.rows[null]);
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ('${user.name}', '${user.email}', '${user.password}')
  RETURNING *;
  `)
  .then(res => res.rows[0]);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool.query(`
  SELECT properties.*, reservations.*, AVG(rating) as average_rating
  FROM reservations
  JOIN properties
    ON reservations.property_id = properties.id
  JOIN property_reviews
    ON property_reviews.property_id = properties.id
  WHERE reservations.guest_id = ${guest_id}
    AND reservations.end_date <> now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $1
  `, [limit])
  .then(res => res.rows);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT JOIN property_reviews
    ON properties.id = property_id
  `;
  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `${queryParams.length === 1 ? 'WHERE' : 'AND'} city LIKE $${queryParams.length}`;
  }

  if (options.owner_id) {
    queryParams.push(Number(options.owner_id));
    queryString += `${queryParams.length === 1 ? 'WHERE' : 'AND'} owner_id = $${queryParams.length}`;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryString += `${queryParams.length === 1 ? 'WHERE' : 'AND'}  cost_per_night > $${queryParams.length}`;
  }
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += `${queryParams.length === 1 ? 'WHERE' : 'AND'}  cost_per_night < $${queryParams.length}`;
  }

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `GROUP BY properties.id HAVING AVG(property_reviews.rating) >= $${queryParams.length}`;
  } else {
    queryString += `GROUP BY properties.id`;
  }

  // 4
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5

  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  return pool.query(`
  INSERT INTO properties 
    (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
  VALUES (
    '${property.owner_id}', '${property.title}', '${property.description}', '${property.thumbnail_photo_url}', '${property.cover_photo_url}', '${property.cost_per_night}', '${property.parking_spaces}', '${property.number_of_bathrooms}', '${property.number_of_bedrooms}', '${property.country}', '${property.street}', '${property.city}', '${property.province}', '${property.post_code}'
  )
  RETURNING *;
  `)
  .then(res => res.rows, console.log(property));
}
exports.addProperty = addProperty;
