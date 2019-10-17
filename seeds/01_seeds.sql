INSERT INTO users ( name, email, password) VALUES 
('Keyvan Kholghi', 'keyvan@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Fabio Papa', 'fabio@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Arian Rahimi', 'arian@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city,  province, post_code, active) VALUES 
(1, 'Fairmont Pacific Rim', 'description', 'thumbnail1', 'coverphoto1', 500.50, 2, 2, 3,'Canada', '1038 Canada Place', 'Vancouver', 'BC', 'V6C 0B9', True),
(2, 'Seaside North Vancouver', 'description', 'thumbnail2', 'coverphoto2', 800.50, 3, 3, 5, 'Canada', '130-125 Victory Ship Way', 'North Vancouver', 'BC', 'V7L 0B1', True),
(3, 'Pinnacle at the Pier', 'description', 'thumbnail3', 'photocover3', 300.50, 1, 1, 2, 'Canada', '138 Victory Ship Way', 'North Vancouver', 'BC', 'V7L 0B1', False);

INSERT INTO reservations (start_date, end_date, property_id, guest_id) VALUES 
('2018-12-31', '2019-01-06', 1, 3),
('2017-01-02', '2017-01-08', 2, 1),
('2018-01-01', '2017-01-07', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) VALUES 
(2, 3, 1, 5, 'message'),
(1, 2, 3, 4, 'message'),
(3, 1, 1, 3, 'message');