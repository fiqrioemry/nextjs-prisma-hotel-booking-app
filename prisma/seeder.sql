	
	-- ========================
	-- ROOM TYPES
	-- ========================
	INSERT INTO "RoomType" (id, name, "createdAt", "updatedAt")
	VALUES
	  (gen_random_uuid(), 'Standard', now(), now()),
	  (gen_random_uuid(), 'Deluxe', now(), now()),
	  (gen_random_uuid(), 'Suite', now(), now()),
	  (gen_random_uuid(), 'Family', now(), now()),
	  (gen_random_uuid(), 'Presidential', now(), now()),
	  (gen_random_uuid(), 'Penthouse', now(), now());
	
	-- ========================
	-- USERS
	-- ========================
	INSERT INTO "User" (id, name, email, "emailVerified", image, role, "createdAt", "updatedAt")
	VALUES
	  (gen_random_uuid(), 'Admin System', 'admin@hotel.com', true, 'https://placehold.co/100x100', 'ADMIN', now(), now()),
	  (gen_random_uuid(), 'John Doe', 'john.doe@email.com', true, 'https://placehold.co/100x100', 'USER', now(), now()),
	  (gen_random_uuid(), 'Jane Smith', 'jane.smith@email.com', true, 'https://placehold.co/100x100', 'USER', now(), now()),
	  (gen_random_uuid(), 'Ahmad Rahman', 'ahmad.rahman@email.com', true, 'https://placehold.co/100x100', 'USER', now(), now()),
	  (gen_random_uuid(), 'Siti Nurhaliza', 'siti.nurhaliza@email.com', false, 'https://placehold.co/100x100', 'USER', now(), now()),
	  (gen_random_uuid(), 'Budi Santoso', 'budi.santoso@email.com', true, 'https://placehold.co/100x100', 'USER', now(), now()),
	  (gen_random_uuid(), 'Lisa Anderson', 'lisa.anderson@email.com', true, 'https://placehold.co/100x100', 'USER', now(), now()),
	  (gen_random_uuid(), 'Michael Chen', 'michael.chen@email.com', true, 'https://placehold.co/100x100', 'USER', now(), now()),
	  (gen_random_uuid(), 'Sarah Wilson', 'sarah.wilson@email.com', false, 'https://placehold.co/100x100', 'USER', now(), now()),
	  (gen_random_uuid(), 'David Kim', 'david.kim@email.com', true, 'https://placehold.co/100x100', 'USER', now(), now());

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO "Account" 
(id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 
   (SELECT id FROM "User" WHERE email = 'admin@hotel.com'), 
   (SELECT id FROM "User" WHERE email = 'admin@hotel.com'), 
   'credential', 
   crypt('password123', gen_salt('bf')), 
   now(), now()),

  (gen_random_uuid(), 
   (SELECT id FROM "User" WHERE email = 'john.doe@email.com'), 
   (SELECT id FROM "User" WHERE email = 'john.doe@email.com'), 
   'credential', 
   crypt('password123', gen_salt('bf')), 
   now(), now()),

  (gen_random_uuid(), 
   (SELECT id FROM "User" WHERE email = 'jane.smith@email.com'), 
   (SELECT id FROM "User" WHERE email = 'jane.smith@email.com'), 
   'credential', 
   crypt('password123', gen_salt('bf')), 
   now(), now()),

  (gen_random_uuid(), 
   (SELECT id FROM "User" WHERE email = 'ahmad.rahman@email.com'), 
   (SELECT id FROM "User" WHERE email = 'ahmad.rahman@email.com'), 
   'credential', 
   crypt('password123', gen_salt('bf')), 
   now(), now()),

  (gen_random_uuid(), 
   (SELECT id FROM "User" WHERE email = 'siti.nurhaliza@email.com'), 
   (SELECT id FROM "User" WHERE email = 'siti.nurhaliza@email.com'), 
   'credential', 
   crypt('password123', gen_salt('bf')), 
   now(), now()),

  (gen_random_uuid(), 
   (SELECT id FROM "User" WHERE email = 'budi.santoso@email.com'), 
   (SELECT id FROM "User" WHERE email = 'budi.santoso@email.com'), 
   'credential', 
   crypt('password123', gen_salt('bf')), 
   now(), now()),

  (gen_random_uuid(), 
   (SELECT id FROM "User" WHERE email = 'lisa.anderson@email.com'), 
   (SELECT id FROM "User" WHERE email = 'lisa.anderson@email.com'), 
   'credential', 
   crypt('password123', gen_salt('bf')), 
   now(), now()),

  (gen_random_uuid(), 
   (SELECT id FROM "User" WHERE email = 'michael.chen@email.com'), 
   (SELECT id FROM "User" WHERE email = 'michael.chen@email.com'), 
   'credential', 
   crypt('password123', gen_salt('bf')), 
   now(), now()),

  (gen_random_uuid(), 
   (SELECT id FROM "User" WHERE email = 'sarah.wilson@email.com'), 
   (SELECT id FROM "User" WHERE email = 'sarah.wilson@email.com'), 
   'credential', 
   crypt('password123', gen_salt('bf')), 
   now(), now()),

  (gen_random_uuid(), 
   (SELECT id FROM "User" WHERE email = 'david.kim@email.com'), 
   (SELECT id FROM "User" WHERE email = 'david.kim@email.com'), 
   'credential', 
   crypt('password123', gen_salt('bf')), 
   now(), now());


	-- ========================
	-- HOTELS (English Descriptions - Max 50 words)
	-- ========================
	INSERT INTO "Hotel" (id, name, description, location, thumbnail, address, "createdAt", "updatedAt")
	VALUES
	  (gen_random_uuid(), 'Hotel Mawar Indah', 'Perfect accommodation in Jakarta business district offering elegant rooms with modern amenities including AC, LED TV, free WiFi, and hot shower. Enjoy delicious breakfast buffet daily with easy access to shopping centers, restaurants, and entertainment venues with professional staff service.', 'Jakarta', 'https://placehold.co/600x400', 'Jl. Sudirman No. 123, Jakarta', now(), now()),
	  
	  (gen_random_uuid(), 'Hotel Melati Sejahtera', 'Budget-friendly hotel in strategic Medan location perfect for backpackers and families. Features comfortable beds, AC, cable TV, private bathrooms, 24-hour reception, free WiFi, and laundry service with easy access to local attractions and transportation hubs.', 'Medan', 'https://placehold.co/600x400', 'Jl. Gatot Subroto No. 45, Medan', now(), now()),
	  
	  (gen_random_uuid(), 'Hotel Bunga Raya', 'Luxury beachfront resort in Surabaya offering exclusive suites with ocean views, private beach access, jacuzzi, and premium facilities. Enjoy water sports, spa treatments, international cuisine, infinity pool, fitness center, and kids club for unforgettable vacation experience.', 'Surabaya', 'https://placehold.co/600x400', 'Jl. Pantai Indah No. 77, Surabaya', now(), now()),
	  
	  (gen_random_uuid(), 'Grand Palace Hotel', 'Five-star luxury icon in Semarang business district serving VIP guests with world-class service. Features premium suites, fine dining restaurants, exclusive spa treatments, business center, elegant ballrooms, and 24/7 concierge service for exceptional hospitality experience.', 'Semarang', 'https://placehold.co/600x400', 'Jl. MH Thamrin No. 88, Semarang', now(), now()),
	  
	  (gen_random_uuid(), 'Sunrise Beach Resort', 'Dream vacation destination on Bandung beautiful coastline combining natural beauty with world-class facilities. Offers beachfront villas, water sports, multiple pools, spa wellness, fresh seafood restaurants, daily activities, and adventure tours for memorable family holidays.', 'Bandung', 'https://placehold.co/600x400', 'Jl. Sunset Road No. 25, Bandung', now(), now()),
	  
	  (gen_random_uuid(), 'Mountain View Lodge', 'Eco-friendly mountain retreat in Jakarta offering spectacular views, fresh air, and peaceful atmosphere. Features natural cottages, hiking trails, camping grounds, organic restaurant, bonfire areas, stargazing deck, and team building packages for nature lovers.', 'Jakarta', 'https://placehold.co/600x400', 'Jl. Raya Puncak No. 15, Jakarta', now(), now()),
	  
	  (gen_random_uuid(), 'City Center Inn', 'Modern business hotel in Medan financial district designed for executives and professionals. Features work stations, high-speed internet, meeting rooms, business center, express services, airport shuttle, fitness center, and corporate packages for efficient business stays.', 'Medan', 'https://placehold.co/600x400', 'Jl. Gatot Subroto No. 67, Medan', now(), now()),
	  
	  (gen_random_uuid(), 'Heritage Boutique Hotel', 'Unique boutique hotel in historic Surabaya combining traditional Javanese architecture with modern luxury. Features themed rooms with antique furniture, cultural performances, batik workshops, traditional spa treatments, courtyard garden, and local artisan shopping experiences.', 'Surabaya', 'https://placehold.co/600x400', 'Jl. Sultan Agung No. 12, Surabaya', now(), now());
	-- ========================
	-- ROOMS
	-- ========================
	WITH hotel_ids AS (
	  SELECT id, row_number() OVER () AS rn FROM "Hotel"
	),
	type_ids AS (
	  SELECT id, row_number() OVER () AS rt FROM "RoomType"
	)
	INSERT INTO "Room" 
	(id, "id", "typeId", name, facilities, description, price, capacity, "totalUnits", "createdAt", "updatedAt")
	VALUES
	  -- Hotel Mawar Indah
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=1),(SELECT id FROM type_ids WHERE rt=1), 'Standard Room', ARRAY['Free WiFi','Air Conditioning','TV','Private Bathroom'], 'Simple standard room suitable for 2 guests.', 350000, 2, 10, now(), now()),
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=1),(SELECT id FROM type_ids WHERE rt=2), 'Deluxe Room', ARRAY['Free WiFi','Air Conditioning','Breakfast Included','Mini Bar','Balcony'], 'Deluxe room with larger space and complimentary breakfast.', 550000, 2, 5, now(), now()),
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=1),(SELECT id FROM type_ids WHERE rt=3), 'Executive Suite', ARRAY['Free WiFi','Air Conditioning','Breakfast Included','Mini Bar','Living Area','City View'], 'Spacious suite with separate living area and city view.', 850000, 3, 3, now(), now()),
	
	  -- Hotel Melati Sejahtera
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=2),(SELECT id FROM type_ids WHERE rt=1), 'Budget Room', ARRAY['Fan','Shared Bathroom','WiFi'], 'Affordable budget room for backpackers.', 150000, 2, 8, now(), now()),
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=2),(SELECT id FROM type_ids WHERE rt=2), 'Standard Room', ARRAY['Air Conditioning','Private Bathroom','TV','WiFi'], 'Standard room with private facilities.', 250000, 2, 6, now(), now()),
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=2),(SELECT id FROM type_ids WHERE rt=4), 'Family Room', ARRAY['Air Conditioning','Private Bathroom','TV','WiFi','Extra Bed'], 'Spacious room for families up to 4 guests.', 400000, 4, 4, now(), now()),
	
	  -- Hotel Bunga Raya
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=3),(SELECT id FROM type_ids WHERE rt=1), 'Ocean View Standard', ARRAY['Free WiFi','Air Conditioning','Ocean View','Private Balcony'], 'Standard room with beautiful ocean view.', 750000, 2, 8, now(), now()),
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=3),(SELECT id FROM type_ids WHERE rt=3), 'Ocean View Suite', ARRAY['Free WiFi','Air Conditioning','Private Balcony','Room Service','Mini Bar','Jacuzzi'], 'Luxury suite with ocean view and private balcony.', 1250000, 4, 3, now(), now()),
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=3),(SELECT id FROM type_ids WHERE rt=6), 'Beachfront Villa', ARRAY['Free WiFi','Air Conditioning','Private Beach Access','Kitchen','Living Area','Pool'], 'Exclusive villa with direct beach access.', 2500000, 6, 2, now(), now()),
	
	  -- Grand Palace Hotel
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=4),(SELECT id FROM type_ids WHERE rt=2), 'Deluxe Room', ARRAY['Free WiFi','Air Conditioning','Breakfast Included','Mini Bar','City View','24h Room Service'], 'Luxurious room with premium amenities.', 950000, 2, 12, now(), now()),
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=4),(SELECT id FROM type_ids WHERE rt=3), 'Executive Suite', ARRAY['Free WiFi','Air Conditioning','Breakfast Included','Mini Bar','Living Area','Business Center Access'], 'Executive suite for business travelers.', 1450000, 3, 6, now(), now()),
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=4),(SELECT id FROM type_ids WHERE rt=5), 'Presidential Suite', ARRAY['Free WiFi','Air Conditioning','Butler Service','Dining Area','Kitchen','Panoramic View','Spa Access'], 'Ultimate luxury suite with butler service.', 3500000, 4, 2, now(), now()),
	
	  -- Sunrise Beach Resort
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=5),(SELECT id FROM type_ids WHERE rt=1), 'Garden View Room', ARRAY['Free WiFi','Air Conditioning','Garden View','Mini Fridge','Pool Access'], 'Peaceful room overlooking tropical gardens.', 650000, 2, 10, now(), now()),
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=5),(SELECT id FROM type_ids WHERE rt=2), 'Pool View Suite', ARRAY['Free WiFi','Air Conditioning','Pool View','Mini Bar','Balcony','Room Service'], 'Suite with direct pool view and balcony.', 950000, 3, 6, now(), now()),
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=5),(SELECT id FROM type_ids WHERE rt=6), 'Beachfront Bungalow', ARRAY['Free WiFi','Air Conditioning','Beach Access','Private Terrace','Mini Kitchen','Outdoor Shower'], 'Private bungalow steps from the beach.', 1800000, 4, 4, now(), now()),
	
	  -- Mountain View Lodge
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=6),(SELECT id FROM type_ids WHERE rt=1), 'Standard Mountain View', ARRAY['Free WiFi','Heater','Mountain View','Fireplace','Tea/Coffee Maker'], 'Cozy room with stunning mountain views.', 450000, 2, 8, now(), now()),
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=6),(SELECT id FROM type_ids WHERE rt=2), 'Deluxe Cabin', ARRAY['Free WiFi','Heater','Mountain View','Fireplace','Mini Kitchen','Private Deck'], 'Spacious cabin with private deck.', 750000, 4, 5, now(), now()),
	
	  -- City Center Inn
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=7),(SELECT id FROM type_ids WHERE rt=1), 'Business Room', ARRAY['Free WiFi','Air Conditioning','Work Desk','Business Center Access','Express Laundry'], 'Modern room designed for business travelers.', 550000, 2, 15, now(), now()),
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=7),(SELECT id FROM type_ids WHERE rt=3), 'Executive Floor', ARRAY['Free WiFi','Air Conditioning','Lounge Access','Work Desk','Premium Amenities','City View'], 'Premium room with executive lounge access.', 850000, 2, 8, now(), now()),
	
	  -- Heritage Boutique Hotel
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=8),(SELECT id FROM type_ids WHERE rt=1), 'Traditional Room', ARRAY['Free WiFi','Air Conditioning','Traditional Decor','Garden View','Cultural Experience'], 'Authentic Javanese-style room.', 400000, 2, 6, now(), now()),
	  (gen_random_uuid(), (SELECT id FROM hotel_ids WHERE rn=8),(SELECT id FROM type_ids WHERE rt=3), 'Heritage Suite', ARRAY['Free WiFi','Air Conditioning','Traditional Decor','Living Area','Private Garden','Cultural Tours'], 'Luxurious suite with traditional Javanese design.', 800000, 3, 3, now(), now());
	
	-- ========================
	-- ROOM IMAGES
	-- ========================
	WITH room_ids AS (
	  SELECT id, row_number() OVER () AS rn FROM "Room"
	)
	INSERT INTO "RoomImage" (id, "id", url, "createdAt", "updatedAt")
	VALUES
	  -- Hotel Mawar Indah - Standard Room (rn=1)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=1), 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=1), 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300', now(), now()),
	  
	  -- Hotel Mawar Indah - Deluxe Room (rn=2)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=2), 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=2), 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=400&h=300', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=2), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300', now(), now()),
	  
	  -- Hotel Mawar Indah - Executive Suite (rn=3)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=3), 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=3), 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300', now(), now()),
	  
	  -- Hotel Melati Sejahtera - Budget Room (rn=4)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=4), 'https://images.unsplash.com/photo-1586612668281-c0a34117e245?w=400&h=300', now(), now()),
	  
	  -- Hotel Melati Sejahtera - Standard Room (rn=5)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=5), 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=5), 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300', now(), now()),
	  
	  -- Hotel Melati Sejahtera - Family Room (rn=6)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=6), 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&h=300', now(), now()),
	  
	  -- Hotel Bunga Raya - Ocean View Standard (rn=7)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=7), 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=7), 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400&h=300', now(), now()),
	  
	  -- Hotel Bunga Raya - Ocean View Suite (rn=8)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=8), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=8), 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=8), 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300', now(), now()),
	  
	  -- Hotel Bunga Raya - Beachfront Villa (rn=9)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=9), 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=9), 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=400&h=300', now(), now()),
	  
	  -- Grand Palace Hotel - Deluxe Room (rn=10)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=10), 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300', now(), now()),
	  
	  -- Grand Palace Hotel - Executive Suite (rn=11)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=11), 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300', now(), now()),
	  
	  -- Grand Palace Hotel - Presidential Suite (rn=12)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=12), 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=12), 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=400&h=300', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=12), 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300', now(), now()),
	  
	  -- Sunrise Beach Resort - Garden View Room (rn=13)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=13), 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300', now(), now()),
	  
	  -- Sunrise Beach Resort - Pool View Suite (rn=14)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=14), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300', now(), now()),
	  
	  -- Sunrise Beach Resort - Beachfront Bungalow (rn=15)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=15), 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=15), 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=400&h=300', now(), now()),
	  
	  -- Mountain View Lodge - Standard Mountain View (rn=16)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=16), 'https://images.unsplash.com/photo-1441260038675-7329ab4cc264?w=400&h=300', now(), now()),
	  
	  -- Mountain View Lodge - Deluxe Cabin (rn=17)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=17), 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=400&h=300', now(), now()),
	  
	  -- City Center Inn - Business Room (rn=18)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=18), 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300', now(), now()),
	  
	  -- City Center Inn - Executive Floor (rn=19)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=19), 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300', now(), now()),
	  
	  -- Heritage Boutique Hotel - Traditional Room (rn=20)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=20), 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300', now(), now()),
	  
	  -- Heritage Boutique Hotel - Heritage Suite (rn=21)
	  (gen_random_uuid(), (SELECT id FROM room_ids WHERE rn=21), 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300', now(), now());
	-- ========================
	-- BOOKINGS
	-- ========================
	WITH user_ids AS (
	  SELECT id, row_number() OVER () AS rn FROM "User" WHERE role = 'USER'
	),
	room_ids AS (
	  SELECT id, row_number() OVER () AS rn FROM "Room"
	)
	INSERT INTO "Booking" (id, "userId", "id", "checkIn", "checkOut", status, "createdAt", "updatedAt")
	VALUES
	  -- Confirmed bookings
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=1), (SELECT id FROM room_ids WHERE rn=1), '2025-09-15'::date, '2025-09-17'::date, 'CONFIRMED', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=2), (SELECT id FROM room_ids WHERE rn=3), '2025-09-20'::date, '2025-09-22'::date, 'CONFIRMED', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=3), (SELECT id FROM room_ids WHERE rn=7), '2025-09-18'::date, '2025-09-21'::date, 'CONFIRMED', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=4), (SELECT id FROM room_ids WHERE rn=10), '2025-09-25'::date, '2025-09-27'::date, 'CONFIRMED', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=5), (SELECT id FROM room_ids WHERE rn=13), '2025-10-01'::date, '2025-10-05'::date, 'CONFIRMED', now(), now()),
	  
	  -- Completed bookings (past dates)
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=1), (SELECT id FROM room_ids WHERE rn=2), '2025-08-10'::date, '2025-08-12'::date, 'COMPLETED', '2025-08-08 10:00:00'::timestamp, '2025-08-12 12:00:00'::timestamp),
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=6), (SELECT id FROM room_ids WHERE rn=5), '2025-08-15'::date, '2025-08-18'::date, 'COMPLETED', '2025-08-13 14:30:00'::timestamp, '2025-08-18 11:00:00'::timestamp),
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=7), (SELECT id FROM room_ids WHERE rn=8), '2025-08-20'::date, '2025-08-25'::date, 'COMPLETED', '2025-08-18 09:15:00'::timestamp, '2025-08-25 10:30:00'::timestamp),
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=8), (SELECT id FROM room_ids WHERE rn=11), '2025-07-22'::date, '2025-07-24'::date, 'COMPLETED', '2025-07-20 16:45:00'::timestamp, '2025-07-24 11:00:00'::timestamp),
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=9), (SELECT id FROM room_ids WHERE rn=15), '2025-07-28'::date, '2025-07-30'::date, 'COMPLETED', '2025-07-26 11:20:00'::timestamp, '2025-07-30 12:00:00'::timestamp),
	  
	  -- Pending bookings
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=2), (SELECT id FROM room_ids WHERE rn=4), '2025-10-10'::date, '2025-10-12'::date, 'PENDING', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=3), (SELECT id FROM room_ids WHERE rn=6), '2025-10-15'::date, '2025-10-18'::date, 'PENDING', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=4), (SELECT id FROM room_ids WHERE rn=9), '2025-10-20'::date, '2025-10-23'::date, 'PENDING', now(), now()),
	  
	  -- Cancelled bookings
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=5), (SELECT id FROM room_ids WHERE rn=12), '2025-09-12'::date, '2025-09-14'::date, 'CANCELLED', '2025-09-10 10:00:00'::timestamp, '2025-09-11 14:30:00'::timestamp),
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=6), (SELECT id FROM room_ids WHERE rn=14), '2025-09-05'::date, '2025-09-07'::date, 'CANCELLED', '2025-09-03 15:20:00'::timestamp, '2025-09-04 09:15:00'::timestamp),
	  
	  -- More future bookings
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=7), (SELECT id FROM room_ids WHERE rn=16), '2025-11-01'::date, '2025-11-03'::date, 'CONFIRMED', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=8), (SELECT id FROM room_ids WHERE rn=18), '2025-11-05'::date, '2025-11-08'::date, 'PENDING', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=9), (SELECT id FROM room_ids WHERE rn=20), '2025-11-10'::date, '2025-11-15'::date, 'CONFIRMED', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=1), (SELECT id FROM room_ids WHERE rn=19), '2025-12-20'::date, '2025-12-25'::date, 'PENDING', now(), now()),
	  (gen_random_uuid(), (SELECT id FROM user_ids WHERE rn=2), (SELECT id FROM room_ids WHERE rn=21), '2025-12-28'::date, '2025-12-31'::date, 'CONFIRMED', now(), now());
	
	-- ========================
	-- PAYMENTS
	-- ========================
	WITH booking_data AS (
	  SELECT 
	    b.id as booking_id,
	    b."userId",
	    b.status as booking_status,
	    r.price,
	    EXTRACT(DAY FROM (b."checkOut" - b."checkIn")) as nights,
	    b."createdAt",
	    b."updatedAt",
	    row_number() OVER () as rn
	  FROM "Booking" b
	  JOIN "Room" r ON b."id" = r.id
	)
	INSERT INTO "Payment" (id, "userId", "bookingId", "invoiceNo", amount, tax, status, "paymentMethod", "paymentUrl", metadata, "createdAt", "updatedAt")
	VALUES
	  -- Paid payments for confirmed/completed bookings
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=1), 
	   (SELECT booking_id FROM booking_data WHERE rn=1), 
	   'INV-2025-001', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=1), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=1), 
	   'PAID', 
	   'BANK_TRANSFER', 
	   'https://payment.gateway.com/pay/abc123', 
	   '{"bank": "BCA", "account": "1234567890", "reference": "TXN001"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=1), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=1)),
	
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=2), 
	   (SELECT booking_id FROM booking_data WHERE rn=2), 
	   'INV-2025-002', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=2), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=2), 
	   'PAID', 
	   'QRIS', 
	   'https://payment.gateway.com/pay/def456', 
	   '{"qris_string": "00020101021126580011ID.DANA.WWW0118936000000000000000303UMI51450015ID.DANA.QRIS", "merchant": "Pesan Hotel"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=2), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=2)),
	
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=3), 
	   (SELECT booking_id FROM booking_data WHERE rn=3), 
	   'INV-2025-003', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=3), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=3), 
	   'PAID', 
	   'BANK_TRANSFER', 
	   'https://payment.gateway.com/pay/ghi789', 
	   '{"bank": "Mandiri", "account": "9876543210", "reference": "TXN003"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=3), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=3)),
	
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=4), 
	   (SELECT booking_id FROM booking_data WHERE rn=4), 
	   'INV-2025-004', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=4), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=4), 
	   'PAID', 
	   'CASH', 
	   NULL, 
	   '{"payment_location": "Hotel Front Desk", "receipt_number": "CSH004"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=4), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=4)),
	
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=5), 
	   (SELECT booking_id FROM booking_data WHERE rn=5), 
	   'INV-2025-005', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=5), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=5), 
	   'PAID', 
	   'QRIS', 
	   'https://payment.gateway.com/pay/jkl012', 
	   '{"qris_string": "00020101021126580011ID.OVO.WEWQ0118936555000000000000303UMI51450015ID.OVO.QRIS", "merchant": "Pesan Hotel"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=5), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=5)),
	
	  -- Completed bookings payments
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=6), 
	   (SELECT booking_id FROM booking_data WHERE rn=6), 
	   'INV-2025-006', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=6), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=6), 
	   'PAID', 
	   'BANK_TRANSFER', 
	   'https://payment.gateway.com/pay/mno345', 
	   '{"bank": "BRI", "account": "5566778899", "reference": "TXN006"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=6), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=6)),
	
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=7), 
	   (SELECT booking_id FROM booking_data WHERE rn=7), 
	   'INV-2025-007', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=7), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=7), 
	   'PAID', 
	   'CASH', 
	   NULL, 
	   '{"payment_location": "Hotel Front Desk", "receipt_number": "CSH007"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=7), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=7)),
	
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=8), 
	   (SELECT booking_id FROM booking_data WHERE rn=8), 
	   'INV-2025-008', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=8), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=8), 
	   'PAID', 
	   'QRIS', 
	   'https://payment.gateway.com/pay/pqr678', 
	   '{"qris_string": "00020101021126580011ID.GOPAY.WWW0118936777000000000000303UMI51450015ID.GOPAY.QRIS", "merchant": "Pesan Hotel"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=8), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=8)),
	
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=9), 
	   (SELECT booking_id FROM booking_data WHERE rn=9), 
	   'INV-2025-009', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=9), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=9), 
	   'PAID', 
	   'BANK_TRANSFER', 
	   'https://payment.gateway.com/pay/stu901', 
	   '{"bank": "BNI", "account": "1122334455", "reference": "TXN009"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=9), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=9)),
	
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=10), 
	   (SELECT booking_id FROM booking_data WHERE rn=10), 
	   'INV-2025-010', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=10), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=10), 
	   'PAID', 
	   'CASH', 
	   NULL, 
	   '{"payment_location": "Hotel Front Desk", "receipt_number": "CSH010"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=10), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=10)),
	
	  -- Pending payments for pending bookings
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=11), 
	   (SELECT booking_id FROM booking_data WHERE rn=11), 
	   'INV-2025-011', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=11), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=11), 
	   'PENDING', 
	   'BANK_TRANSFER', 
	   'https://payment.gateway.com/pay/vwx234', 
	   '{"bank": "BCA", "account": "2233445566", "reference": "TXN011", "expires_at": "2025-10-11T23:59:59Z"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=11), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=11)),
	
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=12), 
	   (SELECT booking_id FROM booking_data WHERE rn=12), 
	   'INV-2025-012', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=12), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=12), 
	   'PENDING', 
	   'QRIS', 
	   'https://payment.gateway.com/pay/yz567', 
	   '{"qris_string": "00020101021126580011ID.DANA.XXX0118936888000000000000303UMI51450015ID.DANA.QRIS", "merchant": "Pesan Hotel", "expires_at": "2025-10-16T23:59:59Z"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=12), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=12)),
	
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=13), 
	   (SELECT booking_id FROM booking_data WHERE rn=13), 
	   'INV-2025-013', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=13), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=13), 
	   'PENDING', 
	   'BANK_TRANSFER', 
	   'https://payment.gateway.com/pay/abc890', 
	   '{"bank": "Mandiri", "account": "3344556677", "reference": "TXN013", "expires_at": "2025-10-21T23:59:59Z"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=13), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=13)),
	
	  -- Failed payments for cancelled bookings
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=14), 
	   (SELECT booking_id FROM booking_data WHERE rn=14), 
	   'INV-2025-014', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=14), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=14), 
	   'FAILED', 
	   'BANK_TRANSFER', 
	   'https://payment.gateway.com/pay/def123', 
	   '{"bank": "BRI", "account": "4455667788", "reference": "TXN014", "failure_reason": "Insufficient funds", "failed_at": "2025-09-11T10:30:00Z"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=14), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=14)),
	
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=15), 
	   (SELECT booking_id FROM booking_data WHERE rn=15), 
	   'INV-2025-015', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=15), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=15), 
	   'FAILED', 
	   'QRIS', 
	   'https://payment.gateway.com/pay/ghi456', 
	   '{"qris_string": "00020101021126580011ID.OVO.YYY0118936999000000000000303UMI51450015ID.OVO.QRIS", "merchant": "Pesan Hotel", "failure_reason": "Payment timeout", "failed_at": "2025-09-04T15:45:00Z"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=15), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=15)),
	
	  -- More confirmed booking payments
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=16), 
	   (SELECT booking_id FROM booking_data WHERE rn=16), 
	   'INV-2025-016', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=16), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=16), 
	   'PAID', 
	   'BANK_TRANSFER', 
	   'https://payment.gateway.com/pay/jkl789', 
	   '{"bank": "BCA", "account": "5566778899", "reference": "TXN016"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=16), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=16)),
	
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=17), 
	   (SELECT booking_id FROM booking_data WHERE rn=17), 
	   'INV-2025-017', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=17), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=17), 
	   'PENDING', 
	   'QRIS', 
	   'https://payment.gateway.com/pay/mno012', 
	   '{"qris_string": "00020101021126580011ID.GOPAY.ZZZ0118936111000000000000303UMI51450015ID.GOPAY.QRIS", "merchant": "Pesan Hotel", "expires_at": "2025-11-06T23:59:59Z"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=17), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=17)),
	
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=18), 
	   (SELECT booking_id FROM booking_data WHERE rn=18), 
	   'INV-2025-018', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=18), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=18), 
	   'PAID', 
	   'CASH', 
	   NULL, 
	   '{"payment_location": "Hotel Front Desk", "receipt_number": "CSH018"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=18), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=18)),
	
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=19), 
	   (SELECT booking_id FROM booking_data WHERE rn=19), 
	   'INV-2025-019', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=19), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=19), 
	   'PENDING', 
	   'BANK_TRANSFER', 
	   'https://payment.gateway.com/pay/pqr345', 
	   '{"bank": "Mandiri", "account": "6677889900", "reference": "TXN019", "expires_at": "2025-12-21T23:59:59Z"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=19), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=19)),
	
	  (gen_random_uuid(), 
	   (SELECT "userId" FROM booking_data WHERE rn=20), 
	   (SELECT booking_id FROM booking_data WHERE rn=20), 
	   'INV-2025-020', 
	   (SELECT (price * nights * 1.11) FROM booking_data WHERE rn=20), 
	   (SELECT (price * nights * 0.11) FROM booking_data WHERE rn=20), 
	   'PAID', 
	   'QRIS', 
	   'https://payment.gateway.com/pay/stu678', 
	   '{"qris_string": "00020101021126580011ID.DANA.AAA0118936222000000000000303UMI51450015ID.DANA.QRIS", "merchant": "Pesan Hotel"}', 
	   (SELECT "createdAt" FROM booking_data WHERE rn=20), 
	   (SELECT "updatedAt" FROM booking_data WHERE rn=20));
	
	-- ========================
	-- ADDITIONAL STANDALONE PAYMENTS (without bookings)
	-- ========================
	WITH user_ids AS (
	  SELECT id, row_number() OVER () AS rn FROM "User" WHERE role = 'USER'
	)
	INSERT INTO "Payment" (id, "userId", "bookingId", "invoiceNo", amount, tax, status, "paymentMethod", "paymentUrl", metadata, "createdAt", "updatedAt")
	VALUES
	  -- Refund payments (negative amounts)
	  (gen_random_uuid(), 
	   (SELECT id FROM user_ids WHERE rn=1), 
	   NULL, 
	   'REF-2025-001', 
	   -385000, 
	   -35000, 
	   'PAID', 
	   'BANK_TRANSFER', 
	   NULL, 
	   '{"type": "refund", "original_invoice": "INV-2025-XXX", "reason": "Customer cancellation", "refund_date": "2025-09-10"}', 
	   '2025-09-10 14:30:00'::timestamp, 
	   '2025-09-10 14:30:00'::timestamp),
	
	  -- Deposit payments for future bookings
	  (gen_random_uuid(), 
	   (SELECT id FROM user_ids WHERE rn=3), 
	   NULL, 
	   'DEP-2025-001', 
	   500000, 
	   45455, 
	   'PAID', 
	   'QRIS', 
	   'https://payment.gateway.com/pay/dep001', 
	   '{"type": "deposit", "qris_string": "00020101021126580011ID.OVO.DEP0118936333000000000000303UMI51450015ID.OVO.QRIS", "merchant": "Pesan Hotel", "purpose": "Advance payment for future booking"}', 
	   now(), 
	   now()),
	
	  -- Service fee payments
	  (gen_random_uuid(), 
	   (SELECT id FROM user_ids WHERE rn=5), 
	   NULL, 
	   'SVC-2025-001', 
	   75000, 
	   6818, 
	   'PAID', 
	   'BANK_TRANSFER', 
	   'https://payment.gateway.com/pay/svc001', 
	   '{"type": "service_fee", "bank": "BCA", "account": "7788990011", "reference": "SVC001", "description": "Late checkout fee"}', 
	   now(), 
	   now()),
	
	  -- Penalty payments
	  (gen_random_uuid(), 
	   (SELECT id FROM user_ids WHERE rn=7), 
	   NULL, 
	   'PEN-2025-001', 
	   250000, 
	   22727, 
	   'PENDING', 
	   'BANK_TRANSFER', 
	   'https://payment.gateway.com/pay/pen001', 
	   '{"type": "penalty", "bank": "Mandiri", "account": "8899001122", "reference": "PEN001", "reason": "Room damage", "expires_at": "2025-09-30T23:59:59Z"}', 
	   now(), 
	   now());
	
