-- Historical PO import for production
-- Run from the Replit Shell:
--   psql "$PROD_DATABASE_URL" -f prod_import.sql

BEGIN;

CREATE TEMP TABLE order_id_map (old_id int NOT NULL, new_id int NOT NULL);

DO $do$
DECLARE _new_id int;
BEGIN

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (6, '01/19/2026', '01/19/2026', '01/22/2026', 'received', NULL, NULL, '2026-06-26 00:45:51.556366', '2026-06-26 00:45:51.556366')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (10, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (6, '01/26/2026', '01/26/2026', '01/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:09.863431', '2026-06-26 00:46:09.863431')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (11, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (6, '02/02/2026', '02/02/2026', '02/05/2026', 'received', NULL, NULL, '2026-06-26 00:46:26.137404', '2026-06-26 00:46:26.137404')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (12, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (6, '02/09/2026', '02/09/2026', '02/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:26.172439', '2026-06-26 00:46:26.172439')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (13, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (7, '01/19/2026', '01/19/2026', '01/22/2026', 'received', NULL, NULL, '2026-06-26 00:46:26.201903', '2026-06-26 00:46:26.201903')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (14, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (7, '02/09/2026', '02/09/2026', '02/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:26.298806', '2026-06-26 00:46:26.298806')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (15, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (7, '03/09/2026', '03/09/2026', '03/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:26.411469', '2026-06-26 00:46:26.411469')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (16, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (7, '03/16/2026', '03/16/2026', '03/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:26.456622', '2026-06-26 00:46:26.456622')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (17, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (7, '03/23/2026', '03/23/2026', '03/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:26.503046', '2026-06-26 00:46:26.503046')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (18, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (7, '04/20/2026', '04/20/2026', '04/23/2026', 'received', NULL, NULL, '2026-06-26 00:46:26.523515', '2026-06-26 00:46:26.523515')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (19, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (7, '04/27/2026', '04/27/2026', '04/30/2026', 'received', NULL, NULL, '2026-06-26 00:46:26.53704', '2026-06-26 00:46:26.53704')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (20, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (7, '01/26/2026', '01/26/2026', '01/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:26.571897', '2026-06-26 00:46:26.571897')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (21, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (7, '02/02/2026', '02/02/2026', '02/05/2026', 'received', NULL, NULL, '2026-06-26 00:46:26.602033', '2026-06-26 00:46:26.602033')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (22, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (7, '02/23/2026', '02/23/2026', '02/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:26.665525', '2026-06-26 00:46:26.665525')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (23, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (8, '03/02/2026', '03/02/2026', '03/05/2026', 'received', NULL, NULL, '2026-06-26 00:46:26.706091', '2026-06-26 00:46:26.706091')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (24, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (8, '03/09/2026', '03/09/2026', '03/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:26.735469', '2026-06-26 00:46:26.735469')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (25, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (8, '03/16/2026', '03/16/2026', '03/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:27.064433', '2026-06-26 00:46:27.064433')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (26, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (8, '03/30/2026', '03/30/2026', '04/02/2026', 'received', NULL, NULL, '2026-06-26 00:46:27.246032', '2026-06-26 00:46:27.246032')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (27, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (8, '04/13/2026', '04/13/2026', '04/16/2026', 'received', NULL, NULL, '2026-06-26 00:46:27.304048', '2026-06-26 00:46:27.304048')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (28, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (8, '04/06/2026', '04/06/2026', '04/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:27.32931', '2026-06-26 00:46:27.32931')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (29, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (8, '05/04/2026', '05/04/2026', '05/07/2026', 'received', NULL, NULL, '2026-06-26 00:46:27.342301', '2026-06-26 00:46:27.342301')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (30, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (8, '05/11/2026', '05/11/2026', '05/14/2026', 'received', NULL, NULL, '2026-06-26 00:46:27.398054', '2026-06-26 00:46:27.398054')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (31, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (8, '05/18/2026', '05/18/2026', '05/21/2026', 'received', NULL, NULL, '2026-06-26 00:46:27.428643', '2026-06-26 00:46:27.428643')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (32, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (8, '06/01/2026', '06/01/2026', '06/04/2026', 'received', NULL, NULL, '2026-06-26 00:46:27.440819', '2026-06-26 00:46:27.440819')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (33, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (8, '04/27/2026', '04/27/2026', '04/30/2026', 'received', NULL, NULL, '2026-06-26 00:46:27.452072', '2026-06-26 00:46:27.452072')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (34, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (8, '02/16/2026', '02/16/2026', '02/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:27.499022', '2026-06-26 00:46:27.499022')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (35, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (8, '02/23/2026', '02/23/2026', '02/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:27.504899', '2026-06-26 00:46:27.504899')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (36, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '03/16/2026', '03/16/2026', '03/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:27.572342', '2026-06-26 00:46:27.572342')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (37, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '03/30/2026', '03/30/2026', '04/02/2026', 'received', NULL, NULL, '2026-06-26 00:46:27.602407', '2026-06-26 00:46:27.602407')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (38, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '04/06/2026', '04/06/2026', '04/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:27.625147', '2026-06-26 00:46:27.625147')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (39, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '04/13/2026', '04/13/2026', '04/16/2026', 'received', NULL, NULL, '2026-06-26 00:46:27.824964', '2026-06-26 00:46:27.824964')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (40, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '04/20/2026', '04/20/2026', '04/23/2026', 'received', NULL, NULL, '2026-06-26 00:46:28.087063', '2026-06-26 00:46:28.087063')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (41, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '01/26/2026', '01/26/2026', '01/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:28.121296', '2026-06-26 00:46:28.121296')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (42, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '01/19/2026', '01/19/2026', '01/22/2026', 'received', NULL, NULL, '2026-06-26 00:46:28.319992', '2026-06-26 00:46:28.319992')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (43, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '05/26/2026', '05/26/2026', '05/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:28.370398', '2026-06-26 00:46:28.370398')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (44, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '06/08/2026', '06/08/2026', '06/11/2026', 'received', NULL, NULL, '2026-06-26 00:46:28.597568', '2026-06-26 00:46:28.597568')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (45, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '02/16/2026', '02/16/2026', '02/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:28.67954', '2026-06-26 00:46:28.67954')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (46, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '02/23/2026', '02/23/2026', '02/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:28.690329', '2026-06-26 00:46:28.690329')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (47, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '03/02/2026', '03/02/2026', '03/05/2026', 'received', NULL, NULL, '2026-06-26 00:46:28.730141', '2026-06-26 00:46:28.730141')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (48, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '03/09/2026', '03/09/2026', '03/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:28.815296', '2026-06-26 00:46:28.815296')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (49, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '05/11/2026', '05/11/2026', '05/14/2026', 'received', NULL, NULL, '2026-06-26 00:46:28.890768', '2026-06-26 00:46:28.890768')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (50, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '01/05/2026', '01/05/2026', '01/08/2026', 'received', NULL, NULL, '2026-06-26 00:46:28.925295', '2026-06-26 00:46:28.925295')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (51, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '03/23/2026', '03/23/2026', '03/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:28.956844', '2026-06-26 00:46:28.956844')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (52, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '06/15/2026', '06/15/2026', '06/18/2026', 'received', NULL, NULL, '2026-06-26 00:46:28.999662', '2026-06-26 00:46:28.999662')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (53, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '05/04/2026', '05/04/2026', '05/07/2026', 'received', NULL, NULL, '2026-06-26 00:46:29.051852', '2026-06-26 00:46:29.051852')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (54, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '04/27/2026', '04/27/2026', '04/30/2026', 'received', NULL, NULL, '2026-06-26 00:46:29.11241', '2026-06-26 00:46:29.11241')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (55, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '05/18/2026', '05/18/2026', '05/21/2026', 'received', NULL, NULL, '2026-06-26 00:46:29.198764', '2026-06-26 00:46:29.198764')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (56, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '06/01/2026', '06/01/2026', '06/04/2026', 'received', NULL, NULL, '2026-06-26 00:46:29.232849', '2026-06-26 00:46:29.232849')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (57, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '06/22/2026', '06/22/2026', '06/25/2026', 'received', NULL, NULL, '2026-06-26 00:46:29.722894', '2026-06-26 00:46:29.722894')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (58, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '12/29/2026', '12/29/2026', '01/02/2026', 'draft', NULL, NULL, '2026-06-26 00:46:29.809133', '2026-06-26 00:46:29.809133')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (59, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '01/12/2026', '01/12/2026', '01/15/2026', 'received', NULL, NULL, '2026-06-26 00:46:29.828988', '2026-06-26 00:46:29.828988')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (60, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '07/20/2026', '07/20/2026', '07/23/2026', 'draft', NULL, NULL, '2026-06-26 00:46:29.869416', '2026-06-26 00:46:29.869416')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (61, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (10, '06/29/2026', '06/29/2026', '07/02/2026', 'draft', NULL, NULL, '2026-06-26 00:46:29.876627', '2026-06-26 00:46:29.876627')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (62, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (11, '03/23/2026', '03/23/2026', '03/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:29.889136', '2026-06-26 00:46:29.889136')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (63, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (11, '03/30/2026', '03/30/2026', '04/02/2026', 'received', NULL, NULL, '2026-06-26 00:46:29.951677', '2026-06-26 00:46:29.951677')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (64, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (11, '04/06/2026', '04/06/2026', '04/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.005431', '2026-06-26 00:46:30.005431')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (65, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (11, '04/13/2026', '04/13/2026', '04/16/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.05763', '2026-06-26 00:46:30.05763')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (66, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (11, '12/29/2026', '12/29/2026', '01/02/2026', 'draft', NULL, NULL, '2026-06-26 00:46:30.090111', '2026-06-26 00:46:30.090111')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (67, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (11, '01/12/2026', '01/12/2026', '01/15/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.109241', '2026-06-26 00:46:30.109241')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (68, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (11, '03/09/2026', '03/09/2026', '03/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.168916', '2026-06-26 00:46:30.168916')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (69, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (11, '02/16/2026', '02/16/2026', '02/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.232225', '2026-06-26 00:46:30.232225')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (70, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (11, '05/11/2026', '05/11/2026', '05/14/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.282245', '2026-06-26 00:46:30.282245')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (71, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (11, '01/26/2026', '01/26/2026', '01/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.346633', '2026-06-26 00:46:30.346633')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (72, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (11, '06/22/2026', '06/22/2026', '06/25/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.390975', '2026-06-26 00:46:30.390975')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (73, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (11, '04/20/2026', '04/20/2026', '04/23/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.440267', '2026-06-26 00:46:30.440267')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (74, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (11, '02/09/2026', '02/09/2026', '02/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.464831', '2026-06-26 00:46:30.464831')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (75, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (11, '02/23/2026', '02/23/2026', '02/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.497601', '2026-06-26 00:46:30.497601')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (76, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '12/29/2026', '12/29/2026', '01/02/2026', 'draft', NULL, NULL, '2026-06-26 00:46:30.694482', '2026-06-26 00:46:30.694482')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (77, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '01/05/2026', '01/05/2026', '01/08/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.710602', '2026-06-26 00:46:30.710602')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (78, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '01/12/2026', '01/12/2026', '01/15/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.753944', '2026-06-26 00:46:30.753944')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (79, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '01/19/2026', '01/19/2026', '01/22/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.79641', '2026-06-26 00:46:30.79641')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (80, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '01/26/2026', '01/26/2026', '01/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.84542', '2026-06-26 00:46:30.84542')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (81, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '02/04/2026', '02/04/2026', '02/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.888511', '2026-06-26 00:46:30.888511')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (82, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '02/09/2026', '02/09/2026', '02/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.924726', '2026-06-26 00:46:30.924726')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (83, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '02/16/2026', '02/16/2026', '02/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:30.973329', '2026-06-26 00:46:30.973329')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (84, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '02/23/2026', '02/23/2026', '02/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.015044', '2026-06-26 00:46:31.015044')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (85, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '03/02/2026', '03/02/2026', '03/05/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.057935', '2026-06-26 00:46:31.057935')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (86, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '03/09/2026', '03/09/2026', '03/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.110657', '2026-06-26 00:46:31.110657')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (87, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '03/16/2026', '03/16/2026', '03/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.166923', '2026-06-26 00:46:31.166923')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (88, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '03/23/2026', '03/23/2026', '03/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.210635', '2026-06-26 00:46:31.210635')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (89, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '03/30/2026', '03/30/2026', '04/02/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.252196', '2026-06-26 00:46:31.252196')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (90, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '04/06/2026', '04/06/2026', '04/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.292888', '2026-06-26 00:46:31.292888')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (91, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '04/13/2026', '04/13/2026', '04/16/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.33854', '2026-06-26 00:46:31.33854')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (92, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '04/20/2026', '04/20/2026', '04/23/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.379606', '2026-06-26 00:46:31.379606')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (93, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '04/27/2026', '04/27/2026', '04/30/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.434325', '2026-06-26 00:46:31.434325')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (94, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '05/04/2026', '05/04/2026', '05/07/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.490538', '2026-06-26 00:46:31.490538')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (95, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '05/11/2026', '05/11/2026', '05/14/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.546949', '2026-06-26 00:46:31.546949')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (96, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '05/18/2026', '05/18/2026', '05/21/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.688098', '2026-06-26 00:46:31.688098')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (97, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '05/26/2026', '05/26/2026', '05/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.73948', '2026-06-26 00:46:31.73948')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (98, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '06/01/2026', '06/01/2026', '06/04/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.780867', '2026-06-26 00:46:31.780867')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (99, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '06/08/2026', '06/08/2026', '06/11/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.833487', '2026-06-26 00:46:31.833487')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (100, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '06/15/2026', '06/15/2026', '06/18/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.870204', '2026-06-26 00:46:31.870204')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (101, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '06/22/2026', '06/22/2026', '06/25/2026', 'received', NULL, NULL, '2026-06-26 00:46:31.906498', '2026-06-26 00:46:31.906498')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (102, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (12, '06/29/2026', '06/29/2026', '07/02/2026', 'draft', NULL, NULL, '2026-06-26 00:46:31.938245', '2026-06-26 00:46:31.938245')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (103, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '12/29/2026', '12/29/2026', '01/02/2026', 'draft', NULL, NULL, '2026-06-26 00:46:31.97546', '2026-06-26 00:46:31.97546')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (104, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '01/05/2026', '01/05/2026', '01/08/2026', 'received', NULL, NULL, '2026-06-26 00:46:32.015011', '2026-06-26 00:46:32.015011')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (105, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '01/12/2026', '01/12/2026', '01/15/2026', 'received', NULL, NULL, '2026-06-26 00:46:32.131982', '2026-06-26 00:46:32.131982')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (106, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '01/26/2026', '01/26/2026', '01/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:32.203515', '2026-06-26 00:46:32.203515')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (107, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '02/16/2026', '02/16/2026', '02/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:32.272784', '2026-06-26 00:46:32.272784')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (108, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '02/23/2026', '02/23/2026', '02/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:32.416729', '2026-06-26 00:46:32.416729')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (109, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '03/02/2026', '03/02/2026', '03/05/2026', 'received', NULL, NULL, '2026-06-26 00:46:32.576202', '2026-06-26 00:46:32.576202')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (110, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '03/09/2026', '03/09/2026', '03/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:32.653181', '2026-06-26 00:46:32.653181')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (111, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '03/30/2026', '03/30/2026', '04/02/2026', 'received', NULL, NULL, '2026-06-26 00:46:32.763095', '2026-06-26 00:46:32.763095')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (112, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '04/06/2026', '04/06/2026', '04/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:32.857101', '2026-06-26 00:46:32.857101')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (113, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '04/13/2026', '04/13/2026', '04/16/2026', 'received', NULL, NULL, '2026-06-26 00:46:32.988938', '2026-06-26 00:46:32.988938')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (114, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '04/20/2026', '04/20/2026', '04/23/2026', 'received', NULL, NULL, '2026-06-26 00:46:33.270847', '2026-06-26 00:46:33.270847')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (115, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '04/27/2026', '04/27/2026', '04/30/2026', 'received', NULL, NULL, '2026-06-26 00:46:33.392954', '2026-06-26 00:46:33.392954')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (116, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '05/04/2026', '05/04/2026', '05/07/2026', 'received', NULL, NULL, '2026-06-26 00:46:33.502935', '2026-06-26 00:46:33.502935')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (117, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '05/11/2026', '05/11/2026', '05/14/2026', 'received', NULL, NULL, '2026-06-26 00:46:33.694906', '2026-06-26 00:46:33.694906')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (118, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '05/18/2026', '05/18/2026', '05/21/2026', 'received', NULL, NULL, '2026-06-26 00:46:33.756731', '2026-06-26 00:46:33.756731')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (119, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '05/26/2026', '05/26/2026', '05/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:33.807954', '2026-06-26 00:46:33.807954')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (120, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '06/01/2026', '06/01/2026', '06/04/2026', 'received', NULL, NULL, '2026-06-26 00:46:33.873632', '2026-06-26 00:46:33.873632')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (121, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '06/08/2026', '06/08/2026', '06/11/2026', 'received', NULL, NULL, '2026-06-26 00:46:33.952737', '2026-06-26 00:46:33.952737')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (122, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '06/15/2026', '06/15/2026', '06/18/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.008903', '2026-06-26 00:46:34.008903')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (123, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '06/22/2026', '06/22/2026', '06/25/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.090746', '2026-06-26 00:46:34.090746')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (124, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '02/09/2026', '02/09/2026', '02/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.155901', '2026-06-26 00:46:34.155901')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (125, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '03/23/2026', '03/23/2026', '03/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.203106', '2026-06-26 00:46:34.203106')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (126, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '07/27/2026', '07/27/2026', '07/30/2026', 'draft', NULL, NULL, '2026-06-26 00:46:34.454885', '2026-06-26 00:46:34.454885')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (127, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '01/19/2026', '01/19/2026', '01/22/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.462575', '2026-06-26 00:46:34.462575')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (128, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (13, '03/16/2026', '03/16/2026', '03/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.49792', '2026-06-26 00:46:34.49792')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (129, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (14, '05/04/2026', '05/04/2026', '05/07/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.524996', '2026-06-26 00:46:34.524996')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (130, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (14, '05/11/2026', '05/11/2026', '05/14/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.530877', '2026-06-26 00:46:34.530877')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (131, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (14, '05/18/2026', '05/18/2026', '05/21/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.537746', '2026-06-26 00:46:34.537746')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (132, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (14, '05/26/2026', '05/26/2026', '05/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.545004', '2026-06-26 00:46:34.545004')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (133, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (14, '06/01/2026', '06/01/2026', '06/04/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.551956', '2026-06-26 00:46:34.551956')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (134, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (14, '03/02/2026', '03/02/2026', '03/05/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.557853', '2026-06-26 00:46:34.557853')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (135, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (14, '04/13/2026', '04/13/2026', '04/16/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.563352', '2026-06-26 00:46:34.563352')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (136, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (14, '04/27/2026', '04/27/2026', '04/30/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.568912', '2026-06-26 00:46:34.568912')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (137, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (14, '04/20/2026', '04/20/2026', '04/23/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.575534', '2026-06-26 00:46:34.575534')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (138, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (14, '04/06/2026', '04/06/2026', '04/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.581339', '2026-06-26 00:46:34.581339')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (139, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (14, '06/08/2026', '06/08/2026', '06/11/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.586039', '2026-06-26 00:46:34.586039')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (140, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (14, '06/22/2026', '06/22/2026', '06/25/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.590528', '2026-06-26 00:46:34.590528')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (141, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (14, '06/29/2026', '06/29/2026', '07/02/2026', 'draft', NULL, NULL, '2026-06-26 00:46:34.599039', '2026-06-26 00:46:34.599039')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (142, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (14, '03/09/2026', '03/09/2026', '03/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.603906', '2026-06-26 00:46:34.603906')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (143, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (14, '12/29/2025', '12/29/2025', '01/02/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.609553', '2026-06-26 00:46:34.609553')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (144, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '12/29/2026', '12/29/2026', '01/02/2026', 'draft', NULL, NULL, '2026-06-26 00:46:34.670242', '2026-06-26 00:46:34.670242')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (145, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '03/02/2026', '03/02/2026', '03/05/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.687485', '2026-06-26 00:46:34.687485')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (146, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '03/09/2026', '03/09/2026', '03/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.693575', '2026-06-26 00:46:34.693575')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (147, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '04/06/2026', '04/06/2026', '04/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.70217', '2026-06-26 00:46:34.70217')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (148, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '04/13/2026', '04/13/2026', '04/16/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.706988', '2026-06-26 00:46:34.706988')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (149, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '04/20/2026', '04/20/2026', '04/23/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.714072', '2026-06-26 00:46:34.714072')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (150, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '04/27/2026', '04/27/2026', '04/30/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.729942', '2026-06-26 00:46:34.729942')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (151, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '01/12/2026', '01/12/2026', '01/15/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.73701', '2026-06-26 00:46:34.73701')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (152, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '01/05/2026', '01/05/2026', '01/08/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.745271', '2026-06-26 00:46:34.745271')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (153, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '06/29/2026', '06/29/2026', '07/02/2026', 'draft', NULL, NULL, '2026-06-26 00:46:34.74895', '2026-06-26 00:46:34.74895')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (154, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '03/16/2026', '03/16/2026', '03/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.753743', '2026-06-26 00:46:34.753743')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (155, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '03/23/2026', '03/23/2026', '03/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.761623', '2026-06-26 00:46:34.761623')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (156, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '02/04/2026', '02/04/2026', '02/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.769767', '2026-06-26 00:46:34.769767')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (157, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '02/09/2026', '02/09/2026', '02/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.775604', '2026-06-26 00:46:34.775604')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (158, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '02/16/2026', '02/16/2026', '02/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.779684', '2026-06-26 00:46:34.779684')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (159, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '02/23/2026', '02/23/2026', '02/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.785141', '2026-06-26 00:46:34.785141')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (160, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '01/26/2026', '01/26/2026', '01/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.788918', '2026-06-26 00:46:34.788918')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (161, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '06/22/2026', '06/22/2026', '06/25/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.792176', '2026-06-26 00:46:34.792176')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (162, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '03/30/2026', '03/30/2026', '04/02/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.795336', '2026-06-26 00:46:34.795336')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (163, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '01/19/2026', '01/19/2026', '01/22/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.798844', '2026-06-26 00:46:34.798844')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (164, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '05/04/2026', '05/04/2026', '05/07/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.803936', '2026-06-26 00:46:34.803936')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (165, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '05/11/2026', '05/11/2026', '05/14/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.808876', '2026-06-26 00:46:34.808876')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (166, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '05/18/2026', '05/18/2026', '05/21/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.814602', '2026-06-26 00:46:34.814602')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (167, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (15, '06/01/2026', '06/01/2026', '06/04/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.819438', '2026-06-26 00:46:34.819438')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (168, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '02/23/2026', '02/23/2026', '02/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.835842', '2026-06-26 00:46:34.835842')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (169, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '03/30/2026', '03/30/2026', '04/02/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.901764', '2026-06-26 00:46:34.901764')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (170, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '05/11/2026', '05/11/2026', '05/14/2026', 'received', NULL, NULL, '2026-06-26 00:46:34.923477', '2026-06-26 00:46:34.923477')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (171, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '02/16/2026', '02/16/2026', '02/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:35.062444', '2026-06-26 00:46:35.062444')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (172, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '01/12/2026', '01/12/2026', '01/15/2026', 'received', NULL, NULL, '2026-06-26 00:46:35.158627', '2026-06-26 00:46:35.158627')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (173, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '03/02/2026', '03/02/2026', '03/05/2026', 'received', NULL, NULL, '2026-06-26 00:46:35.248941', '2026-06-26 00:46:35.248941')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (174, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '03/09/2026', '03/09/2026', '03/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:35.284717', '2026-06-26 00:46:35.284717')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (175, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '04/13/2026', '04/13/2026', '04/16/2026', 'received', NULL, NULL, '2026-06-26 00:46:35.342511', '2026-06-26 00:46:35.342511')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (176, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '01/05/2026', '01/05/2026', '01/08/2026', 'received', NULL, NULL, '2026-06-26 00:46:35.410991', '2026-06-26 00:46:35.410991')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (177, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '05/18/2026', '05/18/2026', '05/21/2026', 'received', NULL, NULL, '2026-06-26 00:46:35.572088', '2026-06-26 00:46:35.572088')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (178, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '06/01/2026', '06/01/2026', '06/04/2026', 'received', NULL, NULL, '2026-06-26 00:46:35.647952', '2026-06-26 00:46:35.647952')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (179, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '06/22/2026', '06/22/2026', '06/25/2026', 'received', NULL, NULL, '2026-06-26 00:46:35.735177', '2026-06-26 00:46:35.735177')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (180, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '06/29/2026', '06/29/2026', '07/02/2026', 'draft', NULL, NULL, '2026-06-26 00:46:35.785682', '2026-06-26 00:46:35.785682')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (181, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '04/27/2026', '04/27/2026', '04/30/2026', 'received', NULL, NULL, '2026-06-26 00:46:35.813506', '2026-06-26 00:46:35.813506')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (182, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '05/04/2026', '05/04/2026', '05/07/2026', 'received', NULL, NULL, '2026-06-26 00:46:35.882686', '2026-06-26 00:46:35.882686')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (183, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '01/26/2026', '01/26/2026', '01/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:35.96536', '2026-06-26 00:46:35.96536')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (184, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '04/06/2026', '04/06/2026', '04/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:35.98936', '2026-06-26 00:46:35.98936')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (185, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '04/20/2026', '04/20/2026', '04/23/2026', 'received', NULL, NULL, '2026-06-26 00:46:36.01435', '2026-06-26 00:46:36.01435')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (186, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '05/26/2026', '05/26/2026', '05/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:36.062458', '2026-06-26 00:46:36.062458')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (187, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '12/29/2026', '12/29/2026', '01/02/2026', 'draft', NULL, NULL, '2026-06-26 00:46:36.093465', '2026-06-26 00:46:36.093465')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (188, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '03/16/2026', '03/16/2026', '03/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:36.103401', '2026-06-26 00:46:36.103401')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (189, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '06/15/2026', '06/15/2026', '06/18/2026', 'received', NULL, NULL, '2026-06-26 00:46:36.149576', '2026-06-26 00:46:36.149576')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (190, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '06/08/2026', '06/08/2026', '06/11/2026', 'received', NULL, NULL, '2026-06-26 00:46:36.380892', '2026-06-26 00:46:36.380892')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (191, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '01/19/2026', '01/19/2026', '01/22/2026', 'received', NULL, NULL, '2026-06-26 00:46:36.426656', '2026-06-26 00:46:36.426656')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (192, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (16, '03/23/2026', '03/23/2026', '03/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:36.448607', '2026-06-26 00:46:36.448607')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (193, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '02/16/2026', '02/16/2026', '02/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:36.60667', '2026-06-26 00:46:36.60667')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (194, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '03/02/2026', '03/02/2026', '03/05/2026', 'received', NULL, NULL, '2026-06-26 00:46:36.766153', '2026-06-26 00:46:36.766153')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (195, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '01/12/2026', '01/12/2026', '01/15/2026', 'received', NULL, NULL, '2026-06-26 00:46:36.95513', '2026-06-26 00:46:36.95513')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (196, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '02/09/2026', '02/09/2026', '02/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:37.058487', '2026-06-26 00:46:37.058487')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (197, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '02/23/2026', '02/23/2026', '02/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:37.138767', '2026-06-26 00:46:37.138767')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (198, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '03/30/2026', '03/30/2026', '04/02/2026', 'received', NULL, NULL, '2026-06-26 00:46:37.418114', '2026-06-26 00:46:37.418114')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (199, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '05/11/2026', '05/11/2026', '05/14/2026', 'received', NULL, NULL, '2026-06-26 00:46:37.528136', '2026-06-26 00:46:37.528136')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (200, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '05/26/2026', '05/26/2026', '05/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:37.659742', '2026-06-26 00:46:37.659742')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (201, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '06/01/2026', '06/01/2026', '06/04/2026', 'received', NULL, NULL, '2026-06-26 00:46:37.804071', '2026-06-26 00:46:37.804071')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (202, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '03/23/2026', '03/23/2026', '03/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:37.938855', '2026-06-26 00:46:37.938855')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (203, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '04/13/2026', '04/13/2026', '04/16/2026', 'received', NULL, NULL, '2026-06-26 00:46:38.01038', '2026-06-26 00:46:38.01038')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (204, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '04/20/2026', '04/20/2026', '04/23/2026', 'received', NULL, NULL, '2026-06-26 00:46:38.023886', '2026-06-26 00:46:38.023886')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (205, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '12/29/2026', '12/29/2026', '01/02/2026', 'draft', NULL, NULL, '2026-06-26 00:46:38.055156', '2026-06-26 00:46:38.055156')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (206, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '05/18/2026', '05/18/2026', '05/21/2026', 'received', NULL, NULL, '2026-06-26 00:46:38.15955', '2026-06-26 00:46:38.15955')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (207, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '01/26/2026', '01/26/2026', '01/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:38.229275', '2026-06-26 00:46:38.229275')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (208, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '04/06/2026', '04/06/2026', '04/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:38.324171', '2026-06-26 00:46:38.324171')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (209, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '05/04/2026', '05/04/2026', '05/07/2026', 'received', NULL, NULL, '2026-06-26 00:46:38.339019', '2026-06-26 00:46:38.339019')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (210, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '06/08/2026', '06/08/2026', '06/11/2026', 'received', NULL, NULL, '2026-06-26 00:46:38.398914', '2026-06-26 00:46:38.398914')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (211, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '06/15/2026', '06/15/2026', '06/18/2026', 'received', NULL, NULL, '2026-06-26 00:46:38.430235', '2026-06-26 00:46:38.430235')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (212, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '01/05/2026', '01/05/2026', '01/08/2026', 'received', NULL, NULL, '2026-06-26 00:46:38.478422', '2026-06-26 00:46:38.478422')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (213, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '04/27/2026', '04/27/2026', '04/30/2026', 'received', NULL, NULL, '2026-06-26 00:46:38.491139', '2026-06-26 00:46:38.491139')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (214, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '03/16/2026', '03/16/2026', '03/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:39.133498', '2026-06-26 00:46:39.133498')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (215, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '02/04/2026', '02/04/2026', '02/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:39.330252', '2026-06-26 00:46:39.330252')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (216, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '01/19/2026', '01/19/2026', '01/22/2026', 'received', NULL, NULL, '2026-06-26 00:46:39.334784', '2026-06-26 00:46:39.334784')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (217, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (17, '06/22/2026', '06/22/2026', '06/25/2026', 'received', NULL, NULL, '2026-06-26 00:46:39.378972', '2026-06-26 00:46:39.378972')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (218, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '01/12/2026', '01/12/2026', '01/15/2026', 'received', NULL, NULL, '2026-06-26 00:46:39.41326', '2026-06-26 00:46:39.41326')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (219, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '02/16/2026', '02/16/2026', '02/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:39.482739', '2026-06-26 00:46:39.482739')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (220, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '03/16/2026', '03/16/2026', '03/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:39.565878', '2026-06-26 00:46:39.565878')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (221, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '05/11/2026', '05/11/2026', '05/14/2026', 'received', NULL, NULL, '2026-06-26 00:46:39.585731', '2026-06-26 00:46:39.585731')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (222, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '05/18/2026', '05/18/2026', '05/21/2026', 'received', NULL, NULL, '2026-06-26 00:46:39.678155', '2026-06-26 00:46:39.678155')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (223, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '03/09/2026', '03/09/2026', '03/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:39.729819', '2026-06-26 00:46:39.729819')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (224, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '07/06/2026', '07/06/2026', '07/09/2026', 'draft', NULL, NULL, '2026-06-26 00:46:39.789204', '2026-06-26 00:46:39.789204')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (225, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '03/30/2026', '03/30/2026', '04/02/2026', 'received', NULL, NULL, '2026-06-26 00:46:39.798961', '2026-06-26 00:46:39.798961')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (226, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '06/22/2026', '06/22/2026', '06/25/2026', 'received', NULL, NULL, '2026-06-26 00:46:39.864385', '2026-06-26 00:46:39.864385')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (227, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '02/23/2026', '02/23/2026', '02/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:39.940929', '2026-06-26 00:46:39.940929')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (228, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '04/06/2026', '04/06/2026', '04/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.03365', '2026-06-26 00:46:40.03365')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (229, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '04/20/2026', '04/20/2026', '04/23/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.054269', '2026-06-26 00:46:40.054269')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (230, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '06/08/2026', '06/08/2026', '06/11/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.091057', '2026-06-26 00:46:40.091057')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (231, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '03/23/2026', '03/23/2026', '03/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.125078', '2026-06-26 00:46:40.125078')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (232, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '03/02/2026', '03/02/2026', '03/05/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.159761', '2026-06-26 00:46:40.159761')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (233, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '01/05/2026', '01/05/2026', '01/08/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.175288', '2026-06-26 00:46:40.175288')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (234, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '04/13/2026', '04/13/2026', '04/16/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.243106', '2026-06-26 00:46:40.243106')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (235, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '04/27/2026', '04/27/2026', '04/30/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.28031', '2026-06-26 00:46:40.28031')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (236, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '05/04/2026', '05/04/2026', '05/07/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.360303', '2026-06-26 00:46:40.360303')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (237, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '01/19/2026', '01/19/2026', '01/22/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.401964', '2026-06-26 00:46:40.401964')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (238, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '06/15/2026', '06/15/2026', '06/18/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.451807', '2026-06-26 00:46:40.451807')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (239, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '12/29/2026', '12/29/2026', '01/02/2026', 'draft', NULL, NULL, '2026-06-26 00:46:40.488118', '2026-06-26 00:46:40.488118')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (240, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '06/01/2026', '06/01/2026', '06/04/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.498888', '2026-06-26 00:46:40.498888')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (241, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '05/26/2026', '05/26/2026', '05/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.540181', '2026-06-26 00:46:40.540181')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (242, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '02/09/2026', '02/09/2026', '02/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.596618', '2026-06-26 00:46:40.596618')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (243, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '01/26/2026', '01/26/2026', '01/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.644124', '2026-06-26 00:46:40.644124')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (244, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (18, '02/02/2026', '02/02/2026', '02/05/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.672407', '2026-06-26 00:46:40.672407')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (245, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '01/26/2026', '01/26/2026', '01/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.69011', '2026-06-26 00:46:40.69011')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (246, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '03/09/2026', '03/09/2026', '03/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.763934', '2026-06-26 00:46:40.763934')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (247, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '03/23/2026', '03/23/2026', '03/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.840503', '2026-06-26 00:46:40.840503')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (248, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '03/30/2026', '03/30/2026', '04/02/2026', 'received', NULL, NULL, '2026-06-26 00:46:40.909115', '2026-06-26 00:46:40.909115')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (249, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '04/06/2026', '04/06/2026', '04/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:41.019396', '2026-06-26 00:46:41.019396')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (250, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '04/13/2026', '04/13/2026', '04/16/2026', 'received', NULL, NULL, '2026-06-26 00:46:41.044994', '2026-06-26 00:46:41.044994')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (251, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '05/04/2026', '05/04/2026', '05/07/2026', 'received', NULL, NULL, '2026-06-26 00:46:41.165946', '2026-06-26 00:46:41.165946')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (252, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '05/11/2026', '05/11/2026', '05/14/2026', 'received', NULL, NULL, '2026-06-26 00:46:41.212417', '2026-06-26 00:46:41.212417')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (253, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '05/18/2026', '05/18/2026', '05/21/2026', 'received', NULL, NULL, '2026-06-26 00:46:41.258383', '2026-06-26 00:46:41.258383')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (254, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '05/26/2026', '05/26/2026', '05/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:41.273385', '2026-06-26 00:46:41.273385')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (255, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '06/01/2026', '06/01/2026', '06/04/2026', 'received', NULL, NULL, '2026-06-26 00:46:41.300363', '2026-06-26 00:46:41.300363')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (256, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '06/08/2026', '06/08/2026', '06/11/2026', 'received', NULL, NULL, '2026-06-26 00:46:41.464481', '2026-06-26 00:46:41.464481')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (257, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '06/15/2026', '06/15/2026', '06/18/2026', 'received', NULL, NULL, '2026-06-26 00:46:41.568866', '2026-06-26 00:46:41.568866')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (258, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '06/22/2026', '06/22/2026', '06/25/2026', 'received', NULL, NULL, '2026-06-26 00:46:41.684434', '2026-06-26 00:46:41.684434')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (259, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '01/05/2026', '01/05/2026', '01/08/2026', 'received', NULL, NULL, '2026-06-26 00:46:41.782679', '2026-06-26 00:46:41.782679')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (260, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '12/29/2026', '12/29/2026', '01/02/2026', 'draft', NULL, NULL, '2026-06-26 00:46:41.87582', '2026-06-26 00:46:41.87582')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (261, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '01/12/2026', '01/12/2026', '01/15/2026', 'received', NULL, NULL, '2026-06-26 00:46:41.897595', '2026-06-26 00:46:41.897595')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (262, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '02/16/2026', '02/16/2026', '02/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.001233', '2026-06-26 00:46:42.001233')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (263, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '06/29/2026', '06/29/2026', '07/02/2026', 'draft', NULL, NULL, '2026-06-26 00:46:42.127152', '2026-06-26 00:46:42.127152')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (264, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '02/02/2026', '02/02/2026', '02/05/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.133415', '2026-06-26 00:46:42.133415')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (265, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '01/19/2026', '01/19/2026', '01/22/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.154242', '2026-06-26 00:46:42.154242')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (266, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (1, '02/09/2026', '02/09/2026', '02/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.168622', '2026-06-26 00:46:42.168622')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (267, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (3, '03/16/2026', '03/16/2026', '03/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.185303', '2026-06-26 00:46:42.185303')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (268, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (3, '03/23/2026', '03/23/2026', '03/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.208539', '2026-06-26 00:46:42.208539')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (269, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (3, '04/13/2026', '04/13/2026', '04/16/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.230686', '2026-06-26 00:46:42.230686')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (270, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (3, '01/19/2026', '01/19/2026', '01/22/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.260886', '2026-06-26 00:46:42.260886')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (271, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (3, '02/02/2026', '02/02/2026', '02/05/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.265706', '2026-06-26 00:46:42.265706')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (272, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (3, '02/16/2026', '02/16/2026', '02/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.278218', '2026-06-26 00:46:42.278218')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (273, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (3, '02/23/2026', '02/23/2026', '02/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.291524', '2026-06-26 00:46:42.291524')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (274, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (3, '03/09/2026', '03/09/2026', '03/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.304914', '2026-06-26 00:46:42.304914')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (275, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (3, '05/04/2026', '05/04/2026', '05/07/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.317743', '2026-06-26 00:46:42.317743')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (276, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (3, '04/06/2026', '04/06/2026', '04/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.322717', '2026-06-26 00:46:42.322717')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (277, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (3, '06/22/2026', '06/22/2026', '06/25/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.335978', '2026-06-26 00:46:42.335978')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (278, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (4, '05/11/2026', '05/11/2026', '05/14/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.342661', '2026-06-26 00:46:42.342661')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (279, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (4, '05/26/2026', '05/26/2026', '05/29/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.355238', '2026-06-26 00:46:42.355238')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (280, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (4, '01/05/2026', '01/05/2026', '01/08/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.42712', '2026-06-26 00:46:42.42712')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (281, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (4, '01/12/2026', '01/12/2026', '01/15/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.50317', '2026-06-26 00:46:42.50317')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (282, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (4, '03/02/2026', '03/02/2026', '03/05/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.572376', '2026-06-26 00:46:42.572376')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (283, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (4, '03/09/2026', '03/09/2026', '03/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.584134', '2026-06-26 00:46:42.584134')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (284, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (4, '03/16/2026', '03/16/2026', '03/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.705625', '2026-06-26 00:46:42.705625')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (285, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (4, '03/23/2026', '03/23/2026', '03/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.778945', '2026-06-26 00:46:42.778945')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (286, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (4, '05/04/2026', '05/04/2026', '05/07/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.809491', '2026-06-26 00:46:42.809491')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (287, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (4, '05/18/2026', '05/18/2026', '05/21/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.883558', '2026-06-26 00:46:42.883558')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (288, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (4, '04/06/2026', '04/06/2026', '04/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:42.966418', '2026-06-26 00:46:42.966418')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (289, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (4, '04/20/2026', '04/20/2026', '04/23/2026', 'received', NULL, NULL, '2026-06-26 00:46:43.041608', '2026-06-26 00:46:43.041608')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (290, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (4, '02/16/2026', '02/16/2026', '02/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:43.116884', '2026-06-26 00:46:43.116884')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (291, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (5, '03/09/2026', '03/09/2026', '03/12/2026', 'received', NULL, NULL, '2026-06-26 00:46:43.167881', '2026-06-26 00:46:43.167881')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (292, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (5, '03/16/2026', '03/16/2026', '03/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:43.189547', '2026-06-26 00:46:43.189547')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (293, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (5, '03/02/2026', '03/02/2026', '03/05/2026', 'received', NULL, NULL, '2026-06-26 00:46:43.268108', '2026-06-26 00:46:43.268108')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (294, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (5, '03/23/2026', '03/23/2026', '03/26/2026', 'received', NULL, NULL, '2026-06-26 00:46:43.34898', '2026-06-26 00:46:43.34898')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (295, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (5, '05/18/2026', '05/18/2026', '05/21/2026', 'received', NULL, NULL, '2026-06-26 00:46:43.372226', '2026-06-26 00:46:43.372226')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (296, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (5, '03/30/2026', '03/30/2026', '04/02/2026', 'received', NULL, NULL, '2026-06-26 00:46:43.418125', '2026-06-26 00:46:43.418125')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (297, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (5, '04/06/2026', '04/06/2026', '04/09/2026', 'received', NULL, NULL, '2026-06-26 00:46:43.484272', '2026-06-26 00:46:43.484272')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (298, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (5, '04/20/2026', '04/20/2026', '04/23/2026', 'received', NULL, NULL, '2026-06-26 00:46:43.532236', '2026-06-26 00:46:43.532236')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (299, _new_id);

  INSERT INTO orders (vendor_id, week_date, ship_date, arrive_date, status, notes, email_sent_at, created_at, updated_at)
  VALUES (5, '02/16/2026', '02/16/2026', '02/19/2026', 'received', NULL, NULL, '2026-06-26 00:46:43.563015', '2026-06-26 00:46:43.563015')
  RETURNING id INTO _new_id;
  INSERT INTO order_id_map VALUES (300, _new_id);

END $do$;

INSERT INTO order_items (order_id, product_id, quantity_ordered, quantity_confirmed, availability, notes, created_at)
SELECT m.new_id, i.product_id, i.quantity_ordered, i.quantity_confirmed, i.availability, i.notes, i.created_at
FROM (VALUES
  (11, 172, 80, 80, 'available', NULL::text, '2026-06-26 00:46:09.867467'),
  (12, 172, 240, 240, 'available', NULL::text, '2026-06-26 00:46:26.14498'),
  (12, 174, 96, 96, 'available', NULL::text, '2026-06-26 00:46:26.15866'),
  (13, 172, 60, 60, 'available', NULL::text, '2026-06-26 00:46:26.175969'),
  (13, 174, 48, 48, 'available', NULL::text, '2026-06-26 00:46:26.186816'),
  (14, 189, 1, 1, 'available', NULL::text, '2026-06-26 00:46:26.205102'),
  (14, 190, 2, 2, 'available', NULL::text, '2026-06-26 00:46:26.213472'),
  (14, 194, 6, 6, 'available', NULL::text, '2026-06-26 00:46:26.22318'),
  (14, 195, 6, 6, 'available', NULL::text, '2026-06-26 00:46:26.232806'),
  (14, 196, 6, 6, 'available', NULL::text, '2026-06-26 00:46:26.240565'),
  (14, 197, 6, 6, 'available', NULL::text, '2026-06-26 00:46:26.249853'),
  (14, 198, 1, 1, 'available', NULL::text, '2026-06-26 00:46:26.25894'),
  (14, 199, 2, 2, 'available', NULL::text, '2026-06-26 00:46:26.268357'),
  (14, 201, 5, 5, 'available', NULL::text, '2026-06-26 00:46:26.276979'),
  (14, 202, 5, 5, 'available', NULL::text, '2026-06-26 00:46:26.285923'),
  (15, 189, 1, 1, 'available', NULL::text, '2026-06-26 00:46:26.301294'),
  (15, 190, 7, 7, 'available', NULL::text, '2026-06-26 00:46:26.310379'),
  (15, 194, 12, 12, 'available', NULL::text, '2026-06-26 00:46:26.318773'),
  (15, 195, 6, 6, 'available', NULL::text, '2026-06-26 00:46:26.327888'),
  (15, 196, 10, 10, 'available', NULL::text, '2026-06-26 00:46:26.336574'),
  (15, 198, 1, 1, 'available', NULL::text, '2026-06-26 00:46:26.345616'),
  (15, 199, 11, 11, 'available', NULL::text, '2026-06-26 00:46:26.355704'),
  (15, 200, 5, 5, 'available', NULL::text, '2026-06-26 00:46:26.365378'),
  (15, 201, 90, 90, 'available', NULL::text, '2026-06-26 00:46:26.375104'),
  (15, 202, 30, 30, 'available', NULL::text, '2026-06-26 00:46:26.384789'),
  (15, 196, 5, 5, 'available', NULL::text, '2026-06-26 00:46:26.393951'),
  (15, 197, 10, 10, 'available', NULL::text, '2026-06-26 00:46:26.401895'),
  (16, 189, 1, 1, 'available', NULL::text, '2026-06-26 00:46:26.415014'),
  (16, 190, 1, 1, 'available', NULL::text, '2026-06-26 00:46:26.426406'),
  (16, 191, 1, 1, 'available', NULL::text, '2026-06-26 00:46:26.43617'),
  (16, 194, 12, 12, 'available', NULL::text, '2026-06-26 00:46:26.445727'),
  (16, 196, 5, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:26.453292'),
  (17, 189, 1, 1, 'available', NULL::text, '2026-06-26 00:46:26.458892'),
  (17, 190, 3, 3, 'available', NULL::text, '2026-06-26 00:46:26.467679'),
  (17, 191, 1, 1, 'available', NULL::text, '2026-06-26 00:46:26.477278'),
  (17, 194, 12, 12, 'available', NULL::text, '2026-06-26 00:46:26.484376'),
  (17, 196, 3, 3, 'available', NULL::text, '2026-06-26 00:46:26.493481'),
  (18, 190, 15, 15, 'available', NULL::text, '2026-06-26 00:46:26.50522'),
  (18, 194, 3, 3, 'available', NULL::text, '2026-06-26 00:46:26.513066'),
  (19, 190, 3, 3, 'available', NULL::text, '2026-06-26 00:46:26.526174'),
  (20, 190, 2, 2, 'available', NULL::text, '2026-06-26 00:46:26.541139'),
  (20, 196, 15, 15, 'available', NULL::text, '2026-06-26 00:46:26.55013'),
  (21, 198, 2, 2, 'available', NULL::text, '2026-06-26 00:46:26.57421'),
  (21, 199, 7, 7, 'available', NULL::text, '2026-06-26 00:46:26.584191'),
  (21, 201, 15, 15, 'available', NULL::text, '2026-06-26 00:46:26.592967'),
  (22, 198, 2, 2, 'available', NULL::text, '2026-06-26 00:46:26.606248'),
  (22, 199, 9, 9, 'available', NULL::text, '2026-06-26 00:46:26.614517'),
  (22, 200, 3, 3, 'available', NULL::text, '2026-06-26 00:46:26.623604'),
  (22, 201, 25, 25, 'available', NULL::text, '2026-06-26 00:46:26.632516'),
  (22, 202, 40, 40, 'available', NULL::text, '2026-06-26 00:46:26.641037'),
  (22, 196, 5, 5, 'available', NULL::text, '2026-06-26 00:46:26.648149'),
  (22, 197, 10, 10, 'available', NULL::text, '2026-06-26 00:46:26.6564'),
  (23, 198, 1, 1, 'available', NULL::text, '2026-06-26 00:46:26.667685'),
  (23, 199, 2, 2, 'available', NULL::text, '2026-06-26 00:46:26.675784'),
  (23, 201, 5, 5, 'available', NULL::text, '2026-06-26 00:46:26.684436'),
  (23, 197, 10, 10, 'available', NULL::text, '2026-06-26 00:46:26.692324'),
  (24, 203, 21, 21, 'available', NULL::text, '2026-06-26 00:46:26.70885'),
  (24, 218, 12, 12, 'available', NULL::text, '2026-06-26 00:46:26.716964'),
  (24, 232, 6, 6, 'available', NULL::text, '2026-06-26 00:46:26.726516'),
  (25, 204, 2, 2, 'available', NULL::text, '2026-06-26 00:46:26.73771'),
  (25, 205, 2, 2, 'available', NULL::text, '2026-06-26 00:46:26.746264'),
  (25, 206, 2, 2, 'available', NULL::text, '2026-06-26 00:46:26.754075'),
  (25, 207, 2, 2, 'available', NULL::text, '2026-06-26 00:46:26.761488'),
  (25, 211, 2, 2, 'available', NULL::text, '2026-06-26 00:46:26.769449'),
  (25, 212, 2, 2, 'available', NULL::text, '2026-06-26 00:46:26.777557'),
  (25, 214, 2, 2, 'available', NULL::text, '2026-06-26 00:46:26.88789'),
  (25, 211, 2, 2, 'available', NULL::text, '2026-06-26 00:46:26.896502'),
  (25, 216, 2, 2, 'available', NULL::text, '2026-06-26 00:46:26.908182'),
  (25, 217, 3, 3, 'available', NULL::text, '2026-06-26 00:46:26.91694'),
  (25, 218, 12, 12, 'available', NULL::text, '2026-06-26 00:46:26.925896'),
  (25, 225, 6, 6, 'available', NULL::text, '2026-06-26 00:46:26.933998'),
  (25, 226, 6, 6, 'available', NULL::text, '2026-06-26 00:46:26.944493'),
  (25, 228, 6, 6, 'available', NULL::text, '2026-06-26 00:46:26.952749'),
  (25, 231, 6, 6, 'available', NULL::text, '2026-06-26 00:46:26.960858'),
  (25, 232, 3, 3, 'available', NULL::text, '2026-06-26 00:46:26.9696'),
  (25, 233, 6, 6, 'available', NULL::text, '2026-06-26 00:46:26.978507'),
  (25, 234, 6, 6, 'available', NULL::text, '2026-06-26 00:46:26.987006'),
  (25, 237, 6, 6, 'available', NULL::text, '2026-06-26 00:46:26.995466'),
  (25, 239, 10, 10, 'available', NULL::text, '2026-06-26 00:46:27.003555'),
  (25, 240, 5, 5, 'available', NULL::text, '2026-06-26 00:46:27.011918'),
  (25, 246, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.021263'),
  (25, 248, 15, 15, 'available', NULL::text, '2026-06-26 00:46:27.02975'),
  (25, 249, 15, 15, 'available', NULL::text, '2026-06-26 00:46:27.037845'),
  (25, 250, 5, 5, 'available', NULL::text, '2026-06-26 00:46:27.046477'),
  (25, 252, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.054563'),
  (26, 204, 4, 4, 'available', NULL::text, '2026-06-26 00:46:27.066883'),
  (26, 205, 3, 3, 'available', NULL::text, '2026-06-26 00:46:27.075351'),
  (26, 206, 3, 3, 'available', NULL::text, '2026-06-26 00:46:27.083136'),
  (26, 207, 2, 2, 'available', NULL::text, '2026-06-26 00:46:27.090943'),
  (26, 211, 5, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.101123'),
  (26, 212, 3, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.104054'),
  (26, 214, 4, 4, 'available', NULL::text, '2026-06-26 00:46:27.106704'),
  (26, 211, 3, 3, 'available', NULL::text, '2026-06-26 00:46:27.115895'),
  (26, 216, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.125556'),
  (26, 217, 3, 3, 'available', NULL::text, '2026-06-26 00:46:27.134448'),
  (26, 218, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.142621'),
  (26, 225, 12, 12, 'available', NULL::text, '2026-06-26 00:46:27.152787'),
  (26, 226, 12, 12, 'available', NULL::text, '2026-06-26 00:46:27.161217'),
  (26, 228, 12, 12, 'available', NULL::text, '2026-06-26 00:46:27.170413'),
  (26, 233, 18, 18, 'available', NULL::text, '2026-06-26 00:46:27.178137'),
  (26, 234, 18, 18, 'available', NULL::text, '2026-06-26 00:46:27.187692'),
  (26, 237, 15, 15, 'available', NULL::text, '2026-06-26 00:46:27.196729'),
  (26, 240, 12, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.205236'),
  (26, 246, 20, 20, 'available', NULL::text, '2026-06-26 00:46:27.207755'),
  (26, 249, 25, 25, 'available', NULL::text, '2026-06-26 00:46:27.217049'),
  (26, 250, 15, 15, 'available', NULL::text, '2026-06-26 00:46:27.224975'),
  (26, 252, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.234321'),
  (27, 208, 4, 4, 'available', NULL::text, '2026-06-26 00:46:27.24846'),
  (27, 213, 2, 2, 'available', NULL::text, '2026-06-26 00:46:27.257463'),
  (27, 214, 1, 1, 'available', NULL::text, '2026-06-26 00:46:27.266345'),
  (27, 216, 2, 2, 'available', NULL::text, '2026-06-26 00:46:27.27433'),
  (27, 237, 15, 15, 'available', NULL::text, '2026-06-26 00:46:27.283406'),
  (27, 249, 50, 50, 'available', NULL::text, '2026-06-26 00:46:27.29327'),
  (28, 209, 4, 4, 'available', NULL::text, '2026-06-26 00:46:27.306755'),
  (28, 222, 4, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.315016'),
  (28, 246, 40, 40, 'available', NULL::text, '2026-06-26 00:46:27.317334'),
  (28, 251, 8, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.326168'),
  (29, 210, 15, 15, 'available', NULL::text, '2026-06-26 00:46:27.332083'),
  (30, 210, 5, 5, 'available', NULL::text, '2026-06-26 00:46:27.344818'),
  (30, 220, 50, 50, 'available', NULL::text, '2026-06-26 00:46:27.353978'),
  (30, 228, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.363781'),
  (30, 232, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.373988'),
  (30, 239, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.383417'),
  (31, 220, 100, 100, 'available', NULL::text, '2026-06-26 00:46:27.400494'),
  (31, 248, 50, 50, 'available', NULL::text, '2026-06-26 00:46:27.408556'),
  (31, 249, 50, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.416801'),
  (31, 252, 3, 3, 'available', NULL::text, '2026-06-26 00:46:27.419145'),
  (32, 220, 50, 50, 'available', NULL::text, '2026-06-26 00:46:27.431319'),
  (33, 220, 25, 25, 'available', NULL::text, '2026-06-26 00:46:27.443034'),
  (34, 223, 3, 3, 'available', NULL::text, '2026-06-26 00:46:27.454562'),
  (34, 224, 3, 3, 'available', NULL::text, '2026-06-26 00:46:27.463175'),
  (34, 229, 10, 10, 'available', NULL::text, '2026-06-26 00:46:27.470958'),
  (34, 233, 10, 10, 'available', NULL::text, '2026-06-26 00:46:27.481122'),
  (34, 235, 10, 10, 'available', NULL::text, '2026-06-26 00:46:27.489751'),
  (35, 228, 12, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.501523'),
  (36, 228, 12, 12, 'available', NULL::text, '2026-06-26 00:46:27.508168'),
  (36, 249, 10, 10, 'available', NULL::text, '2026-06-26 00:46:27.516215'),
  (37, 261, 1, 1, 'available', NULL::text, '2026-06-26 00:46:27.579346'),
  (37, 311, 3, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.595797'),
  (37, 312, 3, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.598084'),
  (38, 261, 1, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.604825'),
  (38, 264, 1, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.607907'),
  (38, 295, 6, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.610249'),
  (38, 296, 10, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.613345'),
  (38, 299, 10, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.615747'),
  (38, 302, 6, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.618027'),
  (38, 325, 1, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.620385'),
  (39, 261, 2, 2, 'available', NULL::text, '2026-06-26 00:46:27.627247'),
  (39, 270, 2, 2, 'available', NULL::text, '2026-06-26 00:46:27.634997'),
  (39, 276, 2, 2, 'available', NULL::text, '2026-06-26 00:46:27.642284'),
  (39, 280, 3, 3, 'available', NULL::text, '2026-06-26 00:46:27.650575'),
  (39, 283, 2, 2, 'available', NULL::text, '2026-06-26 00:46:27.659244'),
  (39, 284, 3, 3, 'available', NULL::text, '2026-06-26 00:46:27.668134'),
  (39, 286, 5, 5, 'available', NULL::text, '2026-06-26 00:46:27.678281'),
  (39, 290, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.68749'),
  (39, 293, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.697989'),
  (39, 294, 6, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.706519'),
  (39, 296, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.709621'),
  (39, 303, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.719562'),
  (39, 307, 3, 3, 'available', NULL::text, '2026-06-26 00:46:27.739175'),
  (39, 308, 3, 3, 'available', NULL::text, '2026-06-26 00:46:27.748291'),
  (39, 309, 3, 3, 'available', NULL::text, '2026-06-26 00:46:27.758046'),
  (39, 312, 3, 3, 'available', NULL::text, '2026-06-26 00:46:27.768492'),
  (39, 315, 2, 2, 'available', NULL::text, '2026-06-26 00:46:27.781608'),
  (39, 316, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:27.790993'),
  (39, 319, 3, 3, 'available', NULL::text, '2026-06-26 00:46:27.794536'),
  (39, 324, 10, 10, 'available', NULL::text, '2026-06-26 00:46:27.804187'),
  (39, 326, 10, 10, 'available', NULL::text, '2026-06-26 00:46:27.813914'),
  (40, 261, 2, 2, 'available', NULL::text, '2026-06-26 00:46:27.831927'),
  (40, 270, 2, 2, 'available', NULL::text, '2026-06-26 00:46:27.843058'),
  (40, 276, 2, 2, 'available', NULL::text, '2026-06-26 00:46:27.852872'),
  (40, 280, 2, 2, 'available', NULL::text, '2026-06-26 00:46:27.863014'),
  (40, 283, 2, 2, 'available', NULL::text, '2026-06-26 00:46:27.873814'),
  (40, 284, 4, 4, 'available', NULL::text, '2026-06-26 00:46:27.883861'),
  (40, 285, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.894408'),
  (40, 286, 5, 5, 'available', NULL::text, '2026-06-26 00:46:27.903543'),
  (40, 290, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.914273'),
  (40, 291, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.923739'),
  (40, 293, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.934204'),
  (40, 294, 5, 5, 'available', NULL::text, '2026-06-26 00:46:27.944233'),
  (40, 295, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.962605'),
  (40, 296, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.972108'),
  (40, 298, 6, 6, 'available', NULL::text, '2026-06-26 00:46:27.987402'),
  (40, 303, 6, 6, 'available', NULL::text, '2026-06-26 00:46:28.00315'),
  (40, 307, 2, 2, 'available', NULL::text, '2026-06-26 00:46:28.014225'),
  (40, 308, 3, 3, 'available', NULL::text, '2026-06-26 00:46:28.022702'),
  (40, 312, 3, 3, 'available', NULL::text, '2026-06-26 00:46:28.03306'),
  (40, 315, 3, 3, 'available', NULL::text, '2026-06-26 00:46:28.042516'),
  (40, 319, 4, 4, 'available', NULL::text, '2026-06-26 00:46:28.052479'),
  (40, 324, 10, 10, 'available', NULL::text, '2026-06-26 00:46:28.061991'),
  (40, 326, 10, 10, 'available', NULL::text, '2026-06-26 00:46:28.071924'),
  (41, 261, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:28.090288'),
  (41, 264, 2, 2, 'available', NULL::text, '2026-06-26 00:46:28.094979'),
  (41, 295, 14, 14, 'available', NULL::text, '2026-06-26 00:46:28.107657'),
  (41, 325, 6, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:28.117008'),
  (42, 261, 1, 1, 'available', NULL::text, '2026-06-26 00:46:28.123566'),
  (42, 262, 5, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:28.132429'),
  (42, 269, 10, 10, 'available', NULL::text, '2026-06-26 00:46:28.135058'),
  (42, 307, 5, 5, 'available', NULL::text, '2026-06-26 00:46:28.28421'),
  (42, 319, 20, 20, 'available', NULL::text, '2026-06-26 00:46:28.293402'),
  (42, 323, 11, 11, 'available', NULL::text, '2026-06-26 00:46:28.308991'),
  (43, 262, 18, 18, 'available', NULL::text, '2026-06-26 00:46:28.323794'),
  (43, 269, 8, 8, 'available', NULL::text, '2026-06-26 00:46:28.331685'),
  (43, 319, 2, 2, 'available', NULL::text, '2026-06-26 00:46:28.340758'),
  (43, 323, 6, 6, 'available', NULL::text, '2026-06-26 00:46:28.349679'),
  (43, 324, 6, 6, 'available', NULL::text, '2026-06-26 00:46:28.359973'),
  (44, 293, 3, 3, 'available', NULL::text, '2026-06-26 00:46:28.375218'),
  (44, 294, 3, 3, 'available', NULL::text, '2026-06-26 00:46:28.383978'),
  (44, 297, 6, 6, 'available', NULL::text, '2026-06-26 00:46:28.393841'),
  (44, 299, 3, 3, 'available', NULL::text, '2026-06-26 00:46:28.517157'),
  (44, 300, 8, 8, 'available', NULL::text, '2026-06-26 00:46:28.527854'),
  (44, 309, 2, 2, 'available', NULL::text, '2026-06-26 00:46:28.536403'),
  (44, 312, 2, 2, 'available', NULL::text, '2026-06-26 00:46:28.547497'),
  (44, 313, 3, 3, 'available', NULL::text, '2026-06-26 00:46:28.558136'),
  (44, 319, 3, 3, 'available', NULL::text, '2026-06-26 00:46:28.568043'),
  (44, 324, 5, 5, 'available', NULL::text, '2026-06-26 00:46:28.576638'),
  (45, 290, 2, 2, 'available', NULL::text, '2026-06-26 00:46:28.602926'),
  (45, 291, 3, 3, 'available', NULL::text, '2026-06-26 00:46:28.614168'),
  (45, 294, 3, 3, 'available', NULL::text, '2026-06-26 00:46:28.622649'),
  (45, 296, 3, 3, 'available', NULL::text, '2026-06-26 00:46:28.63163'),
  (45, 298, 6, 6, 'available', NULL::text, '2026-06-26 00:46:28.640406'),
  (45, 302, 4, 4, 'available', NULL::text, '2026-06-26 00:46:28.649405'),
  (45, 305, 2, 2, 'available', NULL::text, '2026-06-26 00:46:28.65746'),
  (45, 319, 3, 3, 'available', NULL::text, '2026-06-26 00:46:28.666827'),
  (46, 299, 6, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:28.682876'),
  (46, 304, 6, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:28.685468'),
  (47, 291, 5, 5, 'available', NULL::text, '2026-06-26 00:46:28.694347'),
  (47, 295, 5, 5, 'available', NULL::text, '2026-06-26 00:46:28.703094'),
  (47, 302, 5, 5, 'available', NULL::text, '2026-06-26 00:46:28.71108'),
  (47, 324, 9, 9, 'available', NULL::text, '2026-06-26 00:46:28.719789'),
  (48, 269, 2, 2, 'available', NULL::text, '2026-06-26 00:46:28.733718'),
  (48, 291, 5, 5, 'available', NULL::text, '2026-06-26 00:46:28.742629'),
  (48, 294, 5, 5, 'available', NULL::text, '2026-06-26 00:46:28.751804'),
  (48, 300, 4, 4, 'available', NULL::text, '2026-06-26 00:46:28.760967'),
  (48, 309, 3, 3, 'available', NULL::text, '2026-06-26 00:46:28.77009'),
  (48, 311, 4, 4, 'available', NULL::text, '2026-06-26 00:46:28.778634'),
  (48, 324, 10, 10, 'available', NULL::text, '2026-06-26 00:46:28.790172'),
  (48, 326, 11, 11, 'available', NULL::text, '2026-06-26 00:46:28.802556'),
  (49, 269, 2, 2, 'available', NULL::text, '2026-06-26 00:46:28.818388'),
  (49, 307, 3, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:28.827977'),
  (49, 311, 3, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:28.830542'),
  (49, 314, 6, 6, 'available', NULL::text, '2026-06-26 00:46:28.833866'),
  (49, 319, 4, 4, 'available', NULL::text, '2026-06-26 00:46:28.843406'),
  (49, 321, 2, 2, 'available', NULL::text, '2026-06-26 00:46:28.8531'),
  (49, 324, 10, 10, 'available', NULL::text, '2026-06-26 00:46:28.861927'),
  (49, 325, 2, 2, 'available', NULL::text, '2026-06-26 00:46:28.871395'),
  (49, 326, 10, 10, 'available', NULL::text, '2026-06-26 00:46:28.880101'),
  (50, 264, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:28.894396'),
  (50, 269, 1, 1, 'available', NULL::text, '2026-06-26 00:46:28.897811'),
  (50, 313, 3, 3, 'available', NULL::text, '2026-06-26 00:46:28.907796'),
  (50, 325, 5, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:28.918442'),
  (50, 326, 10, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:28.921164'),
  (51, 269, 4, 4, 'available', NULL::text, '2026-06-26 00:46:28.927844'),
  (51, 314, 10, 10, 'available', NULL::text, '2026-06-26 00:46:28.937286'),
  (51, 319, 4, 4, 'available', NULL::text, '2026-06-26 00:46:28.946654'),
  (52, 269, 2, 2, 'available', NULL::text, '2026-06-26 00:46:28.9594'),
  (52, 282, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:28.969222'),
  (52, 314, 3, 3, 'available', NULL::text, '2026-06-26 00:46:28.971804'),
  (52, 325, 4, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:28.98108'),
  (52, 326, 6, 6, 'available', NULL::text, '2026-06-26 00:46:28.983897'),
  (53, 269, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.003378'),
  (53, 291, 3, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:29.013401'),
  (53, 294, 3, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:29.015995'),
  (53, 298, 6, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:29.019267'),
  (53, 305, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:29.021665'),
  (53, 317, 6, 6, 'available', NULL::text, '2026-06-26 00:46:29.028049'),
  (53, 319, 3, 3, 'available', NULL::text, '2026-06-26 00:46:29.037915'),
  (53, 326, 6, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:29.047745'),
  (54, 275, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.054982'),
  (54, 291, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.063404'),
  (54, 296, 3, 3, 'available', NULL::text, '2026-06-26 00:46:29.072383'),
  (54, 314, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.081392'),
  (54, 320, 3, 3, 'available', NULL::text, '2026-06-26 00:46:29.094893'),
  (54, 324, 5, 5, 'available', NULL::text, '2026-06-26 00:46:29.102737'),
  (55, 291, 8, 8, 'available', NULL::text, '2026-06-26 00:46:29.115488'),
  (55, 310, 22, 22, 'available', NULL::text, '2026-06-26 00:46:29.124994'),
  (55, 314, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.133761'),
  (55, 316, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.142893'),
  (55, 317, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.151846'),
  (55, 320, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.161249'),
  (55, 324, 5, 5, 'available', NULL::text, '2026-06-26 00:46:29.169941'),
  (55, 326, 12, 12, 'available', NULL::text, '2026-06-26 00:46:29.179643'),
  (55, 327, 4, 4, 'available', NULL::text, '2026-06-26 00:46:29.188505'),
  (56, 305, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.202039'),
  (56, 311, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.211125'),
  (56, 312, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.21998'),
  (57, 290, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.236019'),
  (57, 293, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.249324'),
  (57, 313, 3, 3, 'available', NULL::text, '2026-06-26 00:46:29.701871'),
  (57, 317, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.712331'),
  (58, 294, 4, 4, 'available', NULL::text, '2026-06-26 00:46:29.726277'),
  (58, 296, 6, 6, 'available', NULL::text, '2026-06-26 00:46:29.736079'),
  (58, 300, 5, 5, 'available', NULL::text, '2026-06-26 00:46:29.746623'),
  (58, 311, 3, 3, 'available', NULL::text, '2026-06-26 00:46:29.755703'),
  (58, 312, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.766125'),
  (58, 305, 4, 4, 'available', NULL::text, '2026-06-26 00:46:29.774961'),
  (58, 314, 5, 5, 'available', NULL::text, '2026-06-26 00:46:29.786895'),
  (58, 323, 12, 12, 'available', NULL::text, '2026-06-26 00:46:29.796132'),
  (59, 314, 10, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:29.815523'),
  (59, 323, 15, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:29.81915'),
  (59, 324, 15, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:29.821966'),
  (59, 326, 4, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:29.825113'),
  (60, 320, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.832808'),
  (60, 325, 6, 6, 'available', NULL::text, '2026-06-26 00:46:29.847287'),
  (60, 326, 5, 5, 'available', NULL::text, '2026-06-26 00:46:29.858216'),
  (61, 324, 5, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:29.872464'),
  (62, 325, 6, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:29.879908'),
  (62, 326, 10, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:29.882234'),
  (63, 328, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.891749'),
  (63, 332, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.901218'),
  (63, 333, 3, 3, 'available', NULL::text, '2026-06-26 00:46:29.909921'),
  (63, 336, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.92037'),
  (63, 347, 20, 20, 'available', NULL::text, '2026-06-26 00:46:29.929227'),
  (63, 348, 20, 20, 'available', NULL::text, '2026-06-26 00:46:29.940138'),
  (64, 328, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.954998'),
  (64, 333, 3, 3, 'available', NULL::text, '2026-06-26 00:46:29.964528'),
  (64, 336, 3, 3, 'available', NULL::text, '2026-06-26 00:46:29.974298'),
  (64, 343, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.984614'),
  (64, 344, 2, 2, 'available', NULL::text, '2026-06-26 00:46:29.994474'),
  (65, 328, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.008029'),
  (65, 333, 3, 3, 'available', NULL::text, '2026-06-26 00:46:30.01793'),
  (65, 336, 3, 3, 'available', NULL::text, '2026-06-26 00:46:30.026662'),
  (65, 343, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.035668'),
  (65, 344, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.044405'),
  (66, 328, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.061093'),
  (66, 333, 3, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.064373'),
  (66, 336, 3, 3, 'available', NULL::text, '2026-06-26 00:46:30.06689'),
  (66, 343, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.077307'),
  (66, 344, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.079998'),
  (66, 347, 12, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.083337'),
  (66, 348, 12, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.085694'),
  (67, 329, 3, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:30.092841'),
  (67, 330, 3, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:30.096168'),
  (67, 331, 5, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:30.098646'),
  (67, 338, 1, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:30.101792'),
  (67, 343, 2, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:30.104359'),
  (68, 329, 5, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.111984'),
  (68, 330, 5, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.114962'),
  (68, 331, 5, 5, 'available', NULL::text, '2026-06-26 00:46:30.122313'),
  (68, 338, 5, 5, 'available', NULL::text, '2026-06-26 00:46:30.131986'),
  (68, 339, 1, 1, 'available', NULL::text, '2026-06-26 00:46:30.140599'),
  (68, 340, 1, 1, 'available', NULL::text, '2026-06-26 00:46:30.149391'),
  (68, 347, 1, 1, 'available', NULL::text, '2026-06-26 00:46:30.158206'),
  (69, 329, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.172098'),
  (69, 330, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.181081'),
  (69, 331, 1, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.190142'),
  (69, 333, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.193178'),
  (69, 338, 3, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.197359'),
  (69, 343, 3, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.200576'),
  (69, 344, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.202954'),
  (69, 346, 10, 10, 'available', NULL::text, '2026-06-26 00:46:30.212081'),
  (69, 348, 10, 10, 'available', NULL::text, '2026-06-26 00:46:30.221453'),
  (70, 331, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.234756'),
  (70, 338, 3, 3, 'available', NULL::text, '2026-06-26 00:46:30.243842'),
  (70, 344, 4, 4, 'available', NULL::text, '2026-06-26 00:46:30.252943'),
  (70, 347, 12, 12, 'available', NULL::text, '2026-06-26 00:46:30.262302'),
  (70, 348, 12, 12, 'available', NULL::text, '2026-06-26 00:46:30.271389'),
  (71, 331, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.284811'),
  (71, 333, 5, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.2952'),
  (71, 336, 3, 3, 'available', NULL::text, '2026-06-26 00:46:30.29962'),
  (71, 338, 3, 3, 'available', NULL::text, '2026-06-26 00:46:30.30884'),
  (71, 343, 3, 3, 'available', NULL::text, '2026-06-26 00:46:30.318091'),
  (71, 344, 1, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.327411'),
  (71, 346, 15, 15, 'available', NULL::text, '2026-06-26 00:46:30.329887'),
  (71, 347, 20, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.339174'),
  (71, 348, 20, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.341982'),
  (72, 333, 5, 5, 'available', NULL::text, '2026-06-26 00:46:30.349423'),
  (72, 338, 5, 5, 'available', NULL::text, '2026-06-26 00:46:30.359385'),
  (72, 343, 1, 1, 'available', NULL::text, '2026-06-26 00:46:30.369009'),
  (72, 347, 12, 12, 'available', NULL::text, '2026-06-26 00:46:30.378743'),
  (73, 333, 3, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.394288'),
  (73, 336, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.396754'),
  (73, 343, 4, 4, 'available', NULL::text, '2026-06-26 00:46:30.405908'),
  (73, 344, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.414338'),
  (73, 347, 20, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:30.417265'),
  (73, 348, 20, 20, 'available', NULL::text, '2026-06-26 00:46:30.420511'),
  (73, 348, 3, 3, 'available', NULL::text, '2026-06-26 00:46:30.430077'),
  (74, 336, 3, 3, 'available', NULL::text, '2026-06-26 00:46:30.443997'),
  (74, 338, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.453394'),
  (75, 338, 3, 3, 'available', NULL::text, '2026-06-26 00:46:30.467601'),
  (75, 344, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.477866'),
  (75, 348, 6, 6, 'available', NULL::text, '2026-06-26 00:46:30.486637'),
  (76, 338, 3, 3, 'available', NULL::text, '2026-06-26 00:46:30.500169'),
  (76, 343, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.509641'),
  (76, 344, 4, 4, 'available', NULL::text, '2026-06-26 00:46:30.518326'),
  (76, 347, 12, 12, 'available', NULL::text, '2026-06-26 00:46:30.528334'),
  (76, 348, 12, 12, 'available', NULL::text, '2026-06-26 00:46:30.537211'),
  (77, 349, 3, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:30.697726'),
  (77, 351, 40, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:30.700821'),
  (77, 353, 330, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:30.703307'),
  (77, 354, 80, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:30.706698'),
  (78, 349, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.714045'),
  (78, 351, 26, 26, 'available', NULL::text, '2026-06-26 00:46:30.723855'),
  (78, 353, 200, 200, 'available', NULL::text, '2026-06-26 00:46:30.733755'),
  (78, 354, 40, 40, 'available', NULL::text, '2026-06-26 00:46:30.742403'),
  (79, 349, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.756652'),
  (79, 351, 29, 29, 'available', NULL::text, '2026-06-26 00:46:30.767117'),
  (79, 353, 180, 180, 'available', NULL::text, '2026-06-26 00:46:30.776072'),
  (79, 354, 65, 65, 'available', NULL::text, '2026-06-26 00:46:30.785835'),
  (80, 349, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.799734'),
  (80, 351, 30, 30, 'available', NULL::text, '2026-06-26 00:46:30.81269'),
  (80, 353, 230, 230, 'available', NULL::text, '2026-06-26 00:46:30.825105'),
  (80, 354, 100, 100, 'available', NULL::text, '2026-06-26 00:46:30.833496'),
  (81, 349, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.84797'),
  (81, 351, 28, 28, 'available', NULL::text, '2026-06-26 00:46:30.857393'),
  (81, 353, 230, 230, 'available', NULL::text, '2026-06-26 00:46:30.868148'),
  (81, 354, 100, 100, 'available', NULL::text, '2026-06-26 00:46:30.878199'),
  (82, 349, 1, 1, 'available', NULL::text, '2026-06-26 00:46:30.892127'),
  (82, 353, 150, 150, 'available', NULL::text, '2026-06-26 00:46:30.901004'),
  (82, 354, 75, 75, 'available', NULL::text, '2026-06-26 00:46:30.910616'),
  (83, 349, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.930183'),
  (83, 351, 33, 33, 'available', NULL::text, '2026-06-26 00:46:30.939397'),
  (83, 353, 250, 250, 'available', NULL::text, '2026-06-26 00:46:30.949305'),
  (83, 354, 80, 80, 'available', NULL::text, '2026-06-26 00:46:30.960964'),
  (84, 349, 2, 2, 'available', NULL::text, '2026-06-26 00:46:30.976513'),
  (84, 351, 33, 33, 'available', NULL::text, '2026-06-26 00:46:30.985739'),
  (84, 353, 300, 300, 'available', NULL::text, '2026-06-26 00:46:30.995469'),
  (84, 354, 95, 95, 'available', NULL::text, '2026-06-26 00:46:31.004374'),
  (85, 349, 3, 3, 'available', NULL::text, '2026-06-26 00:46:31.019076'),
  (85, 351, 35, 35, 'available', NULL::text, '2026-06-26 00:46:31.028767'),
  (85, 353, 300, 300, 'available', NULL::text, '2026-06-26 00:46:31.037813'),
  (85, 354, 75, 75, 'available', NULL::text, '2026-06-26 00:46:31.047418'),
  (86, 349, 4, 4, 'available', NULL::text, '2026-06-26 00:46:31.060976'),
  (86, 351, 36, 36, 'available', NULL::text, '2026-06-26 00:46:31.071778'),
  (86, 352, 6, 6, 'available', NULL::text, '2026-06-26 00:46:31.081197'),
  (86, 353, 300, 300, 'available', NULL::text, '2026-06-26 00:46:31.090934'),
  (86, 354, 90, 90, 'available', NULL::text, '2026-06-26 00:46:31.100973'),
  (87, 349, 5, 5, 'available', NULL::text, '2026-06-26 00:46:31.113713'),
  (87, 351, 30, 30, 'available', NULL::text, '2026-06-26 00:46:31.124041'),
  (87, 352, 6, 6, 'available', NULL::text, '2026-06-26 00:46:31.133334'),
  (87, 353, 250, 250, 'available', NULL::text, '2026-06-26 00:46:31.146312'),
  (87, 354, 70, 70, 'available', NULL::text, '2026-06-26 00:46:31.157057'),
  (88, 349, 3, 3, 'available', NULL::text, '2026-06-26 00:46:31.170725'),
  (88, 351, 30, 30, 'available', NULL::text, '2026-06-26 00:46:31.179536'),
  (88, 353, 250, 250, 'available', NULL::text, '2026-06-26 00:46:31.190307'),
  (88, 354, 70, 70, 'available', NULL::text, '2026-06-26 00:46:31.199622'),
  (89, 349, 3, 3, 'available', NULL::text, '2026-06-26 00:46:31.213211'),
  (89, 351, 30, 30, 'available', NULL::text, '2026-06-26 00:46:31.222161'),
  (89, 353, 200, 200, 'available', NULL::text, '2026-06-26 00:46:31.232526'),
  (89, 354, 65, 65, 'available', NULL::text, '2026-06-26 00:46:31.241748'),
  (90, 349, 5, 5, 'available', NULL::text, '2026-06-26 00:46:31.25538'),
  (90, 351, 26, 26, 'available', NULL::text, '2026-06-26 00:46:31.264009'),
  (90, 353, 150, 150, 'available', NULL::text, '2026-06-26 00:46:31.27269'),
  (90, 354, 50, 50, 'available', NULL::text, '2026-06-26 00:46:31.281053'),
  (91, 349, 10, 10, 'available', NULL::text, '2026-06-26 00:46:31.295499'),
  (91, 351, 39, 39, 'available', NULL::text, '2026-06-26 00:46:31.309448'),
  (91, 353, 250, 250, 'available', NULL::text, '2026-06-26 00:46:31.318679'),
  (91, 354, 100, 100, 'available', NULL::text, '2026-06-26 00:46:31.327604'),
  (92, 349, 3, 3, 'available', NULL::text, '2026-06-26 00:46:31.341684'),
  (92, 351, 30, 30, 'available', NULL::text, '2026-06-26 00:46:31.35101'),
  (92, 353, 200, 200, 'available', NULL::text, '2026-06-26 00:46:31.36029'),
  (92, 354, 75, 75, 'available', NULL::text, '2026-06-26 00:46:31.369124'),
  (93, 349, 4, 4, 'available', NULL::text, '2026-06-26 00:46:31.384008'),
  (93, 350, 2, 2, 'available', NULL::text, '2026-06-26 00:46:31.394763'),
  (93, 351, 33, 33, 'available', NULL::text, '2026-06-26 00:46:31.405478'),
  (93, 353, 250, 250, 'available', NULL::text, '2026-06-26 00:46:31.414819'),
  (93, 354, 60, 60, 'available', NULL::text, '2026-06-26 00:46:31.423649'),
  (94, 349, 3, 3, 'available', NULL::text, '2026-06-26 00:46:31.437257'),
  (94, 350, 2, 2, 'available', NULL::text, '2026-06-26 00:46:31.451566'),
  (94, 351, 30, 30, 'available', NULL::text, '2026-06-26 00:46:31.460113'),
  (94, 353, 200, 200, 'available', NULL::text, '2026-06-26 00:46:31.471097'),
  (94, 354, 60, 60, 'available', NULL::text, '2026-06-26 00:46:31.479953'),
  (95, 349, 10, 10, 'available', NULL::text, '2026-06-26 00:46:31.495684'),
  (95, 350, 2, 2, 'available', NULL::text, '2026-06-26 00:46:31.505078'),
  (95, 351, 25, 25, 'available', NULL::text, '2026-06-26 00:46:31.515936'),
  (95, 353, 160, 160, 'available', NULL::text, '2026-06-26 00:46:31.527283'),
  (95, 354, 40, 40, 'available', NULL::text, '2026-06-26 00:46:31.536503'),
  (96, 349, 5, 5, 'available', NULL::text, '2026-06-26 00:46:31.549391'),
  (96, 350, 2, 2, 'available', NULL::text, '2026-06-26 00:46:31.649532'),
  (96, 351, 25, 25, 'available', NULL::text, '2026-06-26 00:46:31.658313'),
  (96, 353, 200, 200, 'available', NULL::text, '2026-06-26 00:46:31.667159'),
  (96, 354, 50, 50, 'available', NULL::text, '2026-06-26 00:46:31.676349'),
  (97, 349, 8, 8, 'available', NULL::text, '2026-06-26 00:46:31.690548'),
  (97, 350, 1, 1, 'available', NULL::text, '2026-06-26 00:46:31.700863'),
  (97, 351, 20, 20, 'available', NULL::text, '2026-06-26 00:46:31.709534'),
  (97, 353, 150, 150, 'available', NULL::text, '2026-06-26 00:46:31.719079'),
  (97, 354, 40, 40, 'available', NULL::text, '2026-06-26 00:46:31.728306'),
  (98, 349, 2, 2, 'available', NULL::text, '2026-06-26 00:46:31.742259'),
  (98, 351, 20, 20, 'available', NULL::text, '2026-06-26 00:46:31.752243'),
  (98, 353, 175, 175, 'available', NULL::text, '2026-06-26 00:46:31.761025'),
  (98, 354, 80, 80, 'available', NULL::text, '2026-06-26 00:46:31.770333'),
  (99, 349, 3, 3, 'available', NULL::text, '2026-06-26 00:46:31.784019'),
  (99, 350, 1, 1, 'available', NULL::text, '2026-06-26 00:46:31.793133'),
  (99, 351, 25, 25, 'available', NULL::text, '2026-06-26 00:46:31.802931'),
  (99, 353, 200, 200, 'available', NULL::text, '2026-06-26 00:46:31.8123'),
  (99, 354, 100, 100, 'available', NULL::text, '2026-06-26 00:46:31.822007'),
  (100, 351, 20, 20, 'available', NULL::text, '2026-06-26 00:46:31.836204'),
  (100, 353, 200, 200, 'available', NULL::text, '2026-06-26 00:46:31.849964'),
  (100, 354, 80, 80, 'available', NULL::text, '2026-06-26 00:46:31.858942'),
  (101, 351, 25, 25, 'available', NULL::text, '2026-06-26 00:46:31.87315'),
  (101, 353, 250, 250, 'available', NULL::text, '2026-06-26 00:46:31.885363'),
  (101, 354, 80, 80, 'available', NULL::text, '2026-06-26 00:46:31.894053'),
  (102, 351, 25, 25, 'available', NULL::text, '2026-06-26 00:46:31.90899'),
  (102, 353, 200, 200, 'available', NULL::text, '2026-06-26 00:46:31.918253'),
  (102, 354, 70, 70, 'available', NULL::text, '2026-06-26 00:46:31.927148'),
  (103, 351, 15, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:31.940719'),
  (103, 353, 150, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:31.944008'),
  (103, 354, 50, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:31.94671'),
  (104, 355, 5, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:31.97892'),
  (104, 375, 3, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:31.982225'),
  (104, 382, 5, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:31.984762'),
  (104, 388, 2, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:31.988142'),
  (104, 392, 2, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:31.990954'),
  (104, 397, 2, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:31.994102'),
  (104, 408, 2, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:31.996715'),
  (104, 410, 3, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:31.999679'),
  (104, 411, 2, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:32.002127'),
  (104, 412, 2, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:32.005162'),
  (104, 417, 2, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:32.007836'),
  (104, 422, 20, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:32.011194'),
  (105, 355, 5, 5, 'available', NULL::text, '2026-06-26 00:46:32.020846'),
  (105, 368, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.032045'),
  (105, 375, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.041786'),
  (105, 382, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.050949'),
  (105, 392, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.061986'),
  (105, 393, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.075045'),
  (105, 405, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.085928'),
  (105, 410, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.095083'),
  (105, 413, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.103998'),
  (105, 414, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.113016'),
  (105, 422, 15, 15, 'available', NULL::text, '2026-06-26 00:46:32.121665'),
  (106, 355, 5, 5, 'available', NULL::text, '2026-06-26 00:46:32.134983'),
  (106, 373, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.146988'),
  (106, 384, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.160137'),
  (106, 388, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.173009'),
  (106, 389, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.182527'),
  (106, 422, 15, 15, 'available', NULL::text, '2026-06-26 00:46:32.192564'),
  (107, 355, 5, 5, 'available', NULL::text, '2026-06-26 00:46:32.206049'),
  (107, 373, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.215572'),
  (107, 381, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.228721'),
  (107, 386, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.244204'),
  (107, 416, 1, 1, 'available', NULL::text, '2026-06-26 00:46:32.253688'),
  (107, 419, 1, 1, 'available', NULL::text, '2026-06-26 00:46:32.263014'),
  (108, 355, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.275898'),
  (108, 358, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.284781'),
  (108, 359, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.294364'),
  (108, 371, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.303553'),
  (108, 382, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.317446'),
  (108, 388, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.327365'),
  (108, 391, 4, 4, 'available', NULL::text, '2026-06-26 00:46:32.340895'),
  (108, 396, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.349547'),
  (108, 408, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.359291'),
  (108, 409, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.368138'),
  (108, 416, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.377377'),
  (108, 419, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.386628'),
  (108, 421, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.39637'),
  (108, 422, 10, 10, 'available', NULL::text, '2026-06-26 00:46:32.405852'),
  (109, 355, 9, 9, 'available', NULL::text, '2026-06-26 00:46:32.419281'),
  (109, 369, 7, 7, 'available', NULL::text, '2026-06-26 00:46:32.429135'),
  (109, 375, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.438022'),
  (109, 381, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.447181'),
  (109, 382, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.458121'),
  (109, 385, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.467165'),
  (109, 388, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.476503'),
  (109, 393, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.485166'),
  (109, 396, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.498933'),
  (109, 405, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.512765'),
  (109, 411, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.521984'),
  (109, 412, 1, 1, 'available', NULL::text, '2026-06-26 00:46:32.530951'),
  (109, 416, 1, 1, 'available', NULL::text, '2026-06-26 00:46:32.540507'),
  (109, 419, 1, 1, 'available', NULL::text, '2026-06-26 00:46:32.54822'),
  (109, 421, 1, 1, 'available', NULL::text, '2026-06-26 00:46:32.557006'),
  (109, 422, 15, 15, 'available', NULL::text, '2026-06-26 00:46:32.566461'),
  (110, 355, 4, 4, 'available', NULL::text, '2026-06-26 00:46:32.578682'),
  (110, 373, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.586661'),
  (110, 375, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.595635'),
  (110, 382, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.605946'),
  (110, 388, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.617343'),
  (110, 391, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.626452'),
  (110, 396, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.63453'),
  (110, 422, 15, 15, 'available', NULL::text, '2026-06-26 00:46:32.642934'),
  (111, 355, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.655806'),
  (111, 362, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.664342'),
  (111, 369, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.672799'),
  (111, 375, 5, 5, 'available', NULL::text, '2026-06-26 00:46:32.680571'),
  (111, 388, 5, 5, 'available', NULL::text, '2026-06-26 00:46:32.689007'),
  (111, 389, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.701666'),
  (111, 392, 5, 5, 'available', NULL::text, '2026-06-26 00:46:32.710154'),
  (111, 396, 5, 5, 'available', NULL::text, '2026-06-26 00:46:32.71913'),
  (111, 405, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.727345'),
  (111, 416, 1, 1, 'available', NULL::text, '2026-06-26 00:46:32.736416'),
  (111, 421, 1, 1, 'available', NULL::text, '2026-06-26 00:46:32.745201'),
  (111, 422, 20, 20, 'available', NULL::text, '2026-06-26 00:46:32.753257'),
  (112, 355, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.765613'),
  (112, 357, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.774635'),
  (112, 404, 1, 1, 'available', NULL::text, '2026-06-26 00:46:32.78401'),
  (112, 406, 1, 1, 'available', NULL::text, '2026-06-26 00:46:32.793568'),
  (112, 410, 5, 5, 'available', NULL::text, '2026-06-26 00:46:32.802625'),
  (112, 412, 1, 1, 'available', NULL::text, '2026-06-26 00:46:32.811157'),
  (112, 416, 2, 2, 'available', NULL::text, '2026-06-26 00:46:32.820099'),
  (112, 419, 1, 1, 'available', NULL::text, '2026-06-26 00:46:32.829271'),
  (112, 421, 1, 1, 'available', NULL::text, '2026-06-26 00:46:32.83886'),
  (112, 422, 20, 20, 'available', NULL::text, '2026-06-26 00:46:32.847734'),
  (113, 355, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.85946'),
  (113, 369, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.867504'),
  (113, 385, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.877339'),
  (113, 386, 5, 5, 'available', NULL::text, '2026-06-26 00:46:32.886814'),
  (113, 388, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.894671'),
  (113, 393, 4, 4, 'available', NULL::text, '2026-06-26 00:46:32.903671'),
  (113, 398, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.912033'),
  (113, 406, 4, 4, 'available', NULL::text, '2026-06-26 00:46:32.920602'),
  (113, 408, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.92935'),
  (113, 411, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.937808'),
  (113, 412, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.945943'),
  (113, 416, 1, 1, 'available', NULL::text, '2026-06-26 00:46:32.955515'),
  (113, 419, 1, 1, 'available', NULL::text, '2026-06-26 00:46:32.963621'),
  (113, 421, 1, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:32.973106'),
  (113, 422, 15, 15, 'available', NULL::text, '2026-06-26 00:46:32.976243'),
  (114, 355, 3, 3, 'available', NULL::text, '2026-06-26 00:46:32.991479'),
  (114, 356, 1, 1, 'available', NULL::text, '2026-06-26 00:46:32.999838'),
  (114, 362, 1, 1, 'available', NULL::text, '2026-06-26 00:46:33.008183'),
  (114, 363, 1, 1, 'available', NULL::text, '2026-06-26 00:46:33.01674'),
  (114, 372, 5, 5, 'available', NULL::text, '2026-06-26 00:46:33.029196'),
  (114, 381, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.037691'),
  (114, 385, 5, 5, 'available', NULL::text, '2026-06-26 00:46:33.202944'),
  (114, 386, 3, 3, 'available', NULL::text, '2026-06-26 00:46:33.213254'),
  (114, 389, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.223228'),
  (114, 394, 3, 3, 'available', NULL::text, '2026-06-26 00:46:33.233243'),
  (114, 396, 5, 5, 'available', NULL::text, '2026-06-26 00:46:33.241915'),
  (114, 406, 3, 3, 'available', NULL::text, '2026-06-26 00:46:33.251065'),
  (114, 422, 15, 15, 'available', NULL::text, '2026-06-26 00:46:33.260753'),
  (115, 355, 20, 20, 'available', NULL::text, '2026-06-26 00:46:33.273532'),
  (115, 357, 1, 1, 'available', NULL::text, '2026-06-26 00:46:33.283447'),
  (115, 369, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.29634'),
  (115, 372, 3, 3, 'available', NULL::text, '2026-06-26 00:46:33.305999'),
  (115, 386, 3, 3, 'available', NULL::text, '2026-06-26 00:46:33.313767'),
  (115, 389, 4, 4, 'available', NULL::text, '2026-06-26 00:46:33.324562'),
  (115, 415, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.336223'),
  (115, 416, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.345497'),
  (115, 418, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.355319'),
  (115, 419, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.364361'),
  (115, 421, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.373291'),
  (115, 422, 20, 20, 'available', NULL::text, '2026-06-26 00:46:33.383188'),
  (116, 355, 5, 5, 'available', NULL::text, '2026-06-26 00:46:33.396003'),
  (116, 369, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.404641'),
  (116, 378, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.41456'),
  (116, 387, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.424497'),
  (116, 391, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.434403'),
  (116, 399, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.443545'),
  (116, 416, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.452423'),
  (116, 419, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.4642'),
  (116, 421, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.478855'),
  (116, 422, 25, 25, 'available', NULL::text, '2026-06-26 00:46:33.489728'),
  (117, 355, 5, 5, 'available', NULL::text, '2026-06-26 00:46:33.505563'),
  (117, 369, 3, 3, 'available', NULL::text, '2026-06-26 00:46:33.521881'),
  (117, 385, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.645786'),
  (117, 387, 1, 1, 'available', NULL::text, '2026-06-26 00:46:33.656056'),
  (117, 397, 3, 3, 'available', NULL::text, '2026-06-26 00:46:33.665296'),
  (117, 416, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.674066'),
  (117, 422, 20, 20, 'available', NULL::text, '2026-06-26 00:46:33.683999'),
  (118, 355, 5, 5, 'available', NULL::text, '2026-06-26 00:46:33.698108'),
  (118, 357, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.707686'),
  (118, 416, 4, 4, 'available', NULL::text, '2026-06-26 00:46:33.718529'),
  (118, 419, 3, 3, 'available', NULL::text, '2026-06-26 00:46:33.727191'),
  (118, 421, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.737321'),
  (118, 422, 25, 25, 'available', NULL::text, '2026-06-26 00:46:33.745971'),
  (119, 355, 4, 4, 'available', NULL::text, '2026-06-26 00:46:33.76029'),
  (119, 416, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.769663'),
  (119, 419, 1, 1, 'available', NULL::text, '2026-06-26 00:46:33.778333'),
  (119, 421, 3, 3, 'available', NULL::text, '2026-06-26 00:46:33.787699'),
  (119, 422, 15, 15, 'available', NULL::text, '2026-06-26 00:46:33.79664'),
  (120, 355, 4, 4, 'available', NULL::text, '2026-06-26 00:46:33.810624'),
  (120, 356, 1, 1, 'available', NULL::text, '2026-06-26 00:46:33.820142'),
  (120, 357, 1, 1, 'available', NULL::text, '2026-06-26 00:46:33.828046'),
  (120, 369, 1, 1, 'available', NULL::text, '2026-06-26 00:46:33.836552'),
  (120, 406, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.844405'),
  (120, 411, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.854737'),
  (120, 422, 15, 15, 'available', NULL::text, '2026-06-26 00:46:33.863152'),
  (121, 355, 5, 5, 'available', NULL::text, '2026-06-26 00:46:33.876022'),
  (121, 356, 1, 1, 'available', NULL::text, '2026-06-26 00:46:33.885542'),
  (121, 357, 1, 1, 'available', NULL::text, '2026-06-26 00:46:33.893989'),
  (121, 369, 6, 6, 'available', NULL::text, '2026-06-26 00:46:33.906262'),
  (121, 405, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.914363'),
  (121, 411, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.923441'),
  (121, 417, 1, 1, 'available', NULL::text, '2026-06-26 00:46:33.931746'),
  (121, 422, 15, 15, 'available', NULL::text, '2026-06-26 00:46:33.940382'),
  (122, 355, 5, 5, 'available', NULL::text, '2026-06-26 00:46:33.955751'),
  (122, 357, 1, 1, 'available', NULL::text, '2026-06-26 00:46:33.96387'),
  (122, 369, 2, 2, 'available', NULL::text, '2026-06-26 00:46:33.972393'),
  (122, 391, 3, 3, 'available', NULL::text, '2026-06-26 00:46:33.980858'),
  (122, 417, 1, 1, 'available', NULL::text, '2026-06-26 00:46:33.989845'),
  (122, 422, 10, 10, 'available', NULL::text, '2026-06-26 00:46:33.998519'),
  (123, 355, 5, 5, 'available', NULL::text, '2026-06-26 00:46:34.011403'),
  (123, 357, 1, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:34.021071'),
  (123, 369, 3, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:34.023477'),
  (123, 388, 3, 3, 'available', NULL::text, '2026-06-26 00:46:34.026232'),
  (123, 391, 2, 2, 'available', NULL::text, '2026-06-26 00:46:34.034496'),
  (123, 397, 3, 3, 'available', NULL::text, '2026-06-26 00:46:34.049905'),
  (123, 398, 3, 3, 'available', NULL::text, '2026-06-26 00:46:34.058484'),
  (123, 417, 2, 2, 'available', NULL::text, '2026-06-26 00:46:34.067389'),
  (123, 422, 14, 14, 'available', NULL::text, '2026-06-26 00:46:34.075841'),
  (124, 355, 1, 1, 'available', NULL::text, '2026-06-26 00:46:34.093286'),
  (124, 375, 3, 3, 'available', NULL::text, '2026-06-26 00:46:34.102427'),
  (124, 383, 3, 3, 'available', NULL::text, '2026-06-26 00:46:34.110836'),
  (124, 388, 3, 3, 'available', NULL::text, '2026-06-26 00:46:34.1196'),
  (124, 397, 2, 2, 'available', NULL::text, '2026-06-26 00:46:34.128024'),
  (124, 401, 2, 2, 'available', NULL::text, '2026-06-26 00:46:34.136955'),
  (124, 422, 10, 10, 'available', NULL::text, '2026-06-26 00:46:34.146074'),
  (125, 369, 2, 2, 'available', NULL::text, '2026-06-26 00:46:34.158254'),
  (125, 389, 3, 3, 'available', NULL::text, '2026-06-26 00:46:34.166974'),
  (125, 400, 3, 3, 'available', NULL::text, '2026-06-26 00:46:34.175369'),
  (125, 416, 2, 2, 'available', NULL::text, '2026-06-26 00:46:34.184156'),
  (125, 422, 10, 10, 'available', NULL::text, '2026-06-26 00:46:34.193371'),
  (126, 369, 7, 7, 'available', NULL::text, '2026-06-26 00:46:34.205633'),
  (126, 388, 5, 5, 'available', NULL::text, '2026-06-26 00:46:34.214537'),
  (126, 408, 3, 3, 'available', NULL::text, '2026-06-26 00:46:34.398645'),
  (126, 411, 3, 3, 'available', NULL::text, '2026-06-26 00:46:34.408216'),
  (126, 416, 3, 3, 'available', NULL::text, '2026-06-26 00:46:34.417229'),
  (126, 419, 3, 3, 'available', NULL::text, '2026-06-26 00:46:34.427408'),
  (126, 421, 3, 3, 'available', NULL::text, '2026-06-26 00:46:34.436193'),
  (126, 422, 15, 15, 'available', NULL::text, '2026-06-26 00:46:34.445119'),
  (127, 391, 2, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:34.458071'),
  (128, 419, 3, 3, 'available', NULL::text, '2026-06-26 00:46:34.465752'),
  (128, 421, 2, 2, 'available', NULL::text, '2026-06-26 00:46:34.478858'),
  (128, 422, 10, 10, 'available', NULL::text, '2026-06-26 00:46:34.488133'),
  (129, 420, 4, 4, 'available', NULL::text, '2026-06-26 00:46:34.501176'),
  (129, 422, 15, 15, 'available', NULL::text, '2026-06-26 00:46:34.509458'),
  (169, 887, 1, 1, 'available', NULL::text, '2026-06-26 00:46:34.838657'),
  (169, 855, 12, 12, 'available', NULL::text, '2026-06-26 00:46:34.848052'),
  (169, 867, 6, 6, 'available', NULL::text, '2026-06-26 00:46:34.857202'),
  (169, 871, 5, 5, 'available', NULL::text, '2026-06-26 00:46:34.865605'),
  (169, 880, 20, 20, 'available', NULL::text, '2026-06-26 00:46:34.874225'),
  (169, 900, 6, 6, 'available', NULL::text, '2026-06-26 00:46:34.883009'),
  (169, 901, 6, 6, 'available', NULL::text, '2026-06-26 00:46:34.891292'),
  (170, 865, 8, 8, 'available', NULL::text, '2026-06-26 00:46:34.904784'),
  (170, 903, 3, 3, 'available', NULL::text, '2026-06-26 00:46:34.913717'),
  (171, 894, 2, 2, 'available', NULL::text, '2026-06-26 00:46:34.926945'),
  (171, 894, 2, 2, 'available', NULL::text, '2026-06-26 00:46:34.935548'),
  (171, 894, 2, 2, 'available', NULL::text, '2026-06-26 00:46:34.944729'),
  (171, 894, 4, 4, 'available', NULL::text, '2026-06-26 00:46:34.954664'),
  (171, 899, 10, 10, 'available', NULL::text, '2026-06-26 00:46:34.963924'),
  (171, 855, 8, 8, 'available', NULL::text, '2026-06-26 00:46:34.972889'),
  (171, 869, 6, 6, 'available', NULL::text, '2026-06-26 00:46:34.986746'),
  (171, 871, 8, 8, 'available', NULL::text, '2026-06-26 00:46:34.996602'),
  (171, 888, 8, 8, 'available', NULL::text, '2026-06-26 00:46:35.005635'),
  (171, 900, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.015456'),
  (171, 872, 3, 3, 'available', NULL::text, '2026-06-26 00:46:35.025247'),
  (171, 882, 8, 8, 'available', NULL::text, '2026-06-26 00:46:35.034217'),
  (171, 883, 8, 8, 'available', NULL::text, '2026-06-26 00:46:35.044835'),
  (171, 901, 4, 4, 'available', NULL::text, '2026-06-26 00:46:35.053437'),
  (172, 894, 1, 1, 'available', NULL::text, '2026-06-26 00:46:35.065494'),
  (172, 894, 2, 2, 'available', NULL::text, '2026-06-26 00:46:35.073691'),
  (172, 899, 8, 8, 'available', NULL::text, '2026-06-26 00:46:35.082121'),
  (172, 855, 4, 4, 'available', NULL::text, '2026-06-26 00:46:35.090575'),
  (172, 865, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.100483'),
  (172, 867, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.108132'),
  (172, 871, 3, 3, 'available', NULL::text, '2026-06-26 00:46:35.115871'),
  (172, 871, 8, 8, 'available', NULL::text, '2026-06-26 00:46:35.12375'),
  (172, 871, 8, 8, 'available', NULL::text, '2026-06-26 00:46:35.132035'),
  (172, 888, 4, 4, 'available', NULL::text, '2026-06-26 00:46:35.139732'),
  (172, 900, 8, 8, 'available', NULL::text, '2026-06-26 00:46:35.149215'),
  (173, 899, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.161928'),
  (173, 866, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.170491'),
  (173, 867, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.179762'),
  (173, 871, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.18986'),
  (173, 871, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.204113'),
  (173, 900, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.213075'),
  (173, 884, 3, 3, 'available', NULL::text, '2026-06-26 00:46:35.221539'),
  (173, 901, 2, 2, 'available', NULL::text, '2026-06-26 00:46:35.230532'),
  (173, 901, 2, 2, 'available', NULL::text, '2026-06-26 00:46:35.238828'),
  (174, 887, 2, 2, 'available', NULL::text, '2026-06-26 00:46:35.251783'),
  (174, 871, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.259752'),
  (174, 888, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.267294'),
  (174, 901, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.275815'),
  (175, 887, 2, 2, 'available', NULL::text, '2026-06-26 00:46:35.287173'),
  (175, 894, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:35.29488'),
  (175, 894, 2, 2, 'available', NULL::text, '2026-06-26 00:46:35.297202'),
  (175, 894, 3, 3, 'available', NULL::text, '2026-06-26 00:46:35.304881'),
  (175, 894, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:35.313454'),
  (175, 855, 8, 8, 'available', NULL::text, '2026-06-26 00:46:35.316728'),
  (175, 871, 12, 12, 'available', NULL::text, '2026-06-26 00:46:35.324651'),
  (175, 900, 20, 20, 'available', NULL::text, '2026-06-26 00:46:35.333141'),
  (176, 894, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:35.346903'),
  (176, 894, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:35.349519'),
  (176, 894, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:35.352254'),
  (176, 855, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.354702'),
  (176, 865, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.364876'),
  (176, 866, 8, 8, 'available', NULL::text, '2026-06-26 00:46:35.373424'),
  (176, 868, 4, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:35.381746'),
  (176, 869, 8, 8, 'available', NULL::text, '2026-06-26 00:46:35.384191'),
  (176, 900, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.392741'),
  (176, 900, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.400998'),
  (177, 894, 1, 1, 'available', NULL::text, '2026-06-26 00:46:35.413679'),
  (177, 894, 1, 1, 'available', NULL::text, '2026-06-26 00:46:35.423149'),
  (177, 894, 3, 3, 'available', NULL::text, '2026-06-26 00:46:35.43214'),
  (177, 894, 2, 2, 'available', NULL::text, '2026-06-26 00:46:35.440571'),
  (177, 894, 3, 3, 'available', NULL::text, '2026-06-26 00:46:35.450039'),
  (177, 899, 8, 8, 'available', NULL::text, '2026-06-26 00:46:35.459234'),
  (177, 855, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.467766'),
  (177, 865, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.476287'),
  (177, 868, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.485377'),
  (177, 871, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.493797'),
  (177, 871, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.502879'),
  (177, 900, 25, 25, 'available', NULL::text, '2026-06-26 00:46:35.511192'),
  (177, 900, 15, 15, 'available', NULL::text, '2026-06-26 00:46:35.519383'),
  (177, 902, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.530522'),
  (177, 879, 2, 2, 'available', NULL::text, '2026-06-26 00:46:35.538056'),
  (177, 883, 4, 4, 'available', NULL::text, '2026-06-26 00:46:35.546327'),
  (177, 901, 3, 3, 'available', NULL::text, '2026-06-26 00:46:35.55501'),
  (177, 901, 3, 3, 'available', NULL::text, '2026-06-26 00:46:35.562758'),
  (178, 894, 2, 2, 'available', NULL::text, '2026-06-26 00:46:35.574404'),
  (178, 894, 4, 4, 'available', NULL::text, '2026-06-26 00:46:35.582253'),
  (178, 899, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.590412'),
  (178, 855, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.59818'),
  (178, 869, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.605995'),
  (178, 871, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.614209'),
  (178, 900, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.622374'),
  (178, 882, 4, 4, 'available', NULL::text, '2026-06-26 00:46:35.631818'),
  (178, 883, 39, 39, 'available', NULL::text, '2026-06-26 00:46:35.639202'),
  (179, 894, 3, 3, 'available', NULL::text, '2026-06-26 00:46:35.65022'),
  (179, 899, 8, 8, 'available', NULL::text, '2026-06-26 00:46:35.657986'),
  (179, 855, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.675886'),
  (179, 869, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.684441'),
  (179, 900, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.697359'),
  (179, 900, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.705753'),
  (179, 879, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.714624'),
  (179, 901, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.724138'),
  (180, 894, 2, 2, 'available', NULL::text, '2026-06-26 00:46:35.738691'),
  (180, 894, 3, 3, 'available', NULL::text, '2026-06-26 00:46:35.747354'),
  (180, 855, 12, 12, 'available', NULL::text, '2026-06-26 00:46:35.756283'),
  (180, 901, 4, 4, 'available', NULL::text, '2026-06-26 00:46:35.764964'),
  (180, 901, 4, 4, 'available', NULL::text, '2026-06-26 00:46:35.774236'),
  (181, 894, 2, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:35.788686'),
  (181, 855, 6, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:35.791766'),
  (181, 865, 8, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:35.79468'),
  (181, 871, 15, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:35.798188'),
  (181, 900, 10, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:35.801039'),
  (181, 900, 15, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:35.803813'),
  (181, 883, 10, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:35.806662'),
  (181, 901, 3, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:35.809627'),
  (182, 894, 4, 4, 'available', NULL::text, '2026-06-26 00:46:35.816188'),
  (182, 899, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.825168'),
  (182, 855, 8, 8, 'available', NULL::text, '2026-06-26 00:46:35.834832'),
  (182, 867, 8, 8, 'available', NULL::text, '2026-06-26 00:46:35.844599'),
  (182, 900, 12, 12, 'available', NULL::text, '2026-06-26 00:46:35.853791'),
  (182, 901, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.862525'),
  (182, 889, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.871601'),
  (183, 894, 2, 2, 'available', NULL::text, '2026-06-26 00:46:35.885497'),
  (183, 859, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.894867'),
  (183, 866, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.904476'),
  (183, 869, 8, 8, 'available', NULL::text, '2026-06-26 00:46:35.913839'),
  (183, 888, 8, 8, 'available', NULL::text, '2026-06-26 00:46:35.925184'),
  (183, 900, 15, 15, 'available', NULL::text, '2026-06-26 00:46:35.936031'),
  (183, 900, 10, 10, 'available', NULL::text, '2026-06-26 00:46:35.945258'),
  (183, 901, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.954988'),
  (184, 900, 35, 35, 'available', NULL::text, '2026-06-26 00:46:35.968943'),
  (184, 879, 6, 6, 'available', NULL::text, '2026-06-26 00:46:35.97838'),
  (185, 900, 20, 20, 'available', NULL::text, '2026-06-26 00:46:35.993217'),
  (185, 879, 3, 3, 'available', NULL::text, '2026-06-26 00:46:36.002639'),
  (186, 866, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.018152'),
  (186, 869, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.026632'),
  (186, 900, 15, 15, 'available', NULL::text, '2026-06-26 00:46:36.035629'),
  (186, 900, 15, 15, 'available', NULL::text, '2026-06-26 00:46:36.043767'),
  (186, 889, 4, 4, 'available', NULL::text, '2026-06-26 00:46:36.052219'),
  (187, 899, 8, 8, 'available', NULL::text, '2026-06-26 00:46:36.065657'),
  (187, 869, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.074935'),
  (187, 900, 10, 10, 'available', NULL::text, '2026-06-26 00:46:36.084146'),
  (188, 899, 51, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:36.096404'),
  (188, 883, 20, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:36.098843'),
  (189, 855, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.106404'),
  (189, 871, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.1155'),
  (189, 871, 8, 8, 'available', NULL::text, '2026-06-26 00:46:36.12363'),
  (189, 879, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.132469'),
  (189, 889, 12, 12, 'available', NULL::text, '2026-06-26 00:46:36.14043'),
  (190, 855, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.152226'),
  (190, 867, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.160419'),
  (190, 880, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.168911'),
  (190, 901, 3, 3, 'available', NULL::text, '2026-06-26 00:46:36.369157'),
  (191, 867, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.38676'),
  (191, 900, 8, 8, 'available', NULL::text, '2026-06-26 00:46:36.398115'),
  (191, 883, 10, 10, 'available', NULL::text, '2026-06-26 00:46:36.407009'),
  (191, 901, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.416467'),
  (192, 865, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.429293'),
  (192, 884, 4, 4, 'available', NULL::text, '2026-06-26 00:46:36.43868'),
  (193, 881, 1, 1, 'available', NULL::text, '2026-06-26 00:46:36.451624'),
  (194, 1311, 2, 2, 'available', NULL::text, '2026-06-26 00:46:36.610121'),
  (194, 922, 1, 1, 'available', NULL::text, '2026-06-26 00:46:36.621337'),
  (194, 935, 2, 2, 'available', NULL::text, '2026-06-26 00:46:36.630571'),
  (194, 958, 1, 1, 'available', NULL::text, '2026-06-26 00:46:36.64027'),
  (194, 985, 2, 2, 'available', NULL::text, '2026-06-26 00:46:36.649419'),
  (194, 1041, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.660102'),
  (194, 1055, 4, 4, 'available', NULL::text, '2026-06-26 00:46:36.670726'),
  (194, 1055, 4, 4, 'available', NULL::text, '2026-06-26 00:46:36.680395'),
  (194, 1087, 4, 4, 'available', NULL::text, '2026-06-26 00:46:36.694458'),
  (194, 1097, 4, 4, 'available', NULL::text, '2026-06-26 00:46:36.705689'),
  (194, 1111, 4, 4, 'available', NULL::text, '2026-06-26 00:46:36.715245'),
  (194, 1143, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.72707'),
  (194, 1143, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.736903'),
  (194, 1278, 4, 4, 'available', NULL::text, '2026-06-26 00:46:36.746415'),
  (194, 1291, 2, 2, 'available', NULL::text, '2026-06-26 00:46:36.756309'),
  (195, 918, 2, 2, 'available', NULL::text, '2026-06-26 00:46:36.768794'),
  (195, 922, 2, 2, 'available', NULL::text, '2026-06-26 00:46:36.776811'),
  (195, 935, 3, 3, 'available', NULL::text, '2026-06-26 00:46:36.784628'),
  (195, 959, 1, 1, 'available', NULL::text, '2026-06-26 00:46:36.793995'),
  (195, 958, 1, 1, 'available', NULL::text, '2026-06-26 00:46:36.801532'),
  (195, 958, 1, 1, 'available', NULL::text, '2026-06-26 00:46:36.80979'),
  (195, 958, 2, 2, 'available', NULL::text, '2026-06-26 00:46:36.81825'),
  (195, 1039, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.828504'),
  (195, 1051, 4, 4, 'available', NULL::text, '2026-06-26 00:46:36.837724'),
  (195, 1055, 24, 24, 'available', NULL::text, '2026-06-26 00:46:36.84576'),
  (195, 1055, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.857729'),
  (195, 1103, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.867492'),
  (195, 1108, 8, 8, 'available', NULL::text, '2026-06-26 00:46:36.876073'),
  (195, 1143, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.88491'),
  (195, 1167, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.89325'),
  (195, 1175, 10, 10, 'available', NULL::text, '2026-06-26 00:46:36.902013'),
  (195, 1143, 4, 4, 'available', NULL::text, '2026-06-26 00:46:36.910414'),
  (195, 1306, 2, 2, 'available', NULL::text, '2026-06-26 00:46:36.919525'),
  (195, 1308, 2, 2, 'available', NULL::text, '2026-06-26 00:46:36.928356'),
  (195, 1311, 8, 8, 'available', NULL::text, '2026-06-26 00:46:36.93637'),
  (195, 1408, 2, 2, 'available', NULL::text, '2026-06-26 00:46:36.944861'),
  (196, 918, 2, 2, 'available', NULL::text, '2026-06-26 00:46:36.958037'),
  (196, 935, 3, 3, 'available', NULL::text, '2026-06-26 00:46:36.966664'),
  (196, 958, 3, 3, 'available', NULL::text, '2026-06-26 00:46:36.975278'),
  (196, 973, 3, 3, 'available', NULL::text, '2026-06-26 00:46:36.983673'),
  (196, 1055, 6, 6, 'available', NULL::text, '2026-06-26 00:46:36.9934'),
  (196, 1055, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.002247'),
  (196, 1088, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.010993'),
  (196, 1097, 4, 4, 'available', NULL::text, '2026-06-26 00:46:37.020776'),
  (196, 1143, 4, 4, 'available', NULL::text, '2026-06-26 00:46:37.029206'),
  (196, 1342, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.040007'),
  (196, 1323, 3, 3, 'available', NULL::text, '2026-06-26 00:46:37.048936'),
  (197, 918, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.061006'),
  (197, 959, 3, 3, 'available', NULL::text, '2026-06-26 00:46:37.06902'),
  (197, 973, 3, 3, 'available', NULL::text, '2026-06-26 00:46:37.077143'),
  (197, 1021, 3, 3, 'available', NULL::text, '2026-06-26 00:46:37.085894'),
  (197, 1087, 4, 4, 'available', NULL::text, '2026-06-26 00:46:37.094206'),
  (197, 1111, 4, 4, 'available', NULL::text, '2026-06-26 00:46:37.10288'),
  (197, 1278, 4, 4, 'available', NULL::text, '2026-06-26 00:46:37.112298'),
  (197, 1342, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.120467'),
  (197, 1323, 3, 3, 'available', NULL::text, '2026-06-26 00:46:37.128993'),
  (198, 918, 1, 1, 'available', NULL::text, '2026-06-26 00:46:37.141253'),
  (198, 935, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.150362'),
  (198, 959, 1, 1, 'available', NULL::text, '2026-06-26 00:46:37.160002'),
  (198, 958, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.168209'),
  (198, 969, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.176732'),
  (198, 983, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.185074'),
  (198, 1039, 4, 4, 'available', NULL::text, '2026-06-26 00:46:37.194343'),
  (198, 1033, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.203442'),
  (198, 1054, 4, 4, 'available', NULL::text, '2026-06-26 00:46:37.212021'),
  (198, 1055, 4, 4, 'available', NULL::text, '2026-06-26 00:46:37.22042'),
  (198, 1055, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.228527'),
  (198, 1097, 4, 4, 'available', NULL::text, '2026-06-26 00:46:37.238028'),
  (198, 1108, 4, 4, 'available', NULL::text, '2026-06-26 00:46:37.248466'),
  (198, 1119, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.256984'),
  (198, 1143, 3, 3, 'available', NULL::text, '2026-06-26 00:46:37.265443'),
  (198, 1148, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.27406'),
  (198, 1156, 4, 4, 'available', NULL::text, '2026-06-26 00:46:37.282323'),
  (198, 1167, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.290499'),
  (198, 1175, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.298772'),
  (198, 1176, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.308705'),
  (198, 1177, 4, 4, 'available', NULL::text, '2026-06-26 00:46:37.316626'),
  (198, 1263, 1, 1, 'available', NULL::text, '2026-06-26 00:46:37.33167'),
  (198, 1271, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.340004'),
  (198, 1278, 4, 4, 'available', NULL::text, '2026-06-26 00:46:37.347491'),
  (198, 1306, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.356808'),
  (198, 1308, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.364979'),
  (198, 1342, 4, 4, 'available', NULL::text, '2026-06-26 00:46:37.373818'),
  (198, 1342, 8, 8, 'available', NULL::text, '2026-06-26 00:46:37.382132'),
  (198, 1365, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.391322'),
  (198, 1394, 1, 1, 'available', NULL::text, '2026-06-26 00:46:37.399732'),
  (198, 1408, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.408258'),
  (199, 922, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.420791'),
  (199, 922, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.429535'),
  (199, 945, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.437692'),
  (199, 966, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.446404'),
  (199, 964, 4, 4, 'available', NULL::text, '2026-06-26 00:46:37.455307'),
  (199, 1089, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.465281'),
  (199, 1143, 8, 8, 'available', NULL::text, '2026-06-26 00:46:37.475266'),
  (199, 1175, 8, 8, 'available', NULL::text, '2026-06-26 00:46:37.48336'),
  (199, 1176, 8, 8, 'available', NULL::text, '2026-06-26 00:46:37.492382'),
  (199, 1288, 3, 3, 'available', NULL::text, '2026-06-26 00:46:37.501788'),
  (199, 1311, 3, 3, 'available', NULL::text, '2026-06-26 00:46:37.510222'),
  (199, 1368, 3, 3, 'available', NULL::text, '2026-06-26 00:46:37.518384'),
  (200, 922, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.530689'),
  (200, 958, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.539148'),
  (200, 975, 3, 3, 'available', NULL::text, '2026-06-26 00:46:37.547314'),
  (200, 1036, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.557802'),
  (200, 1039, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.565984'),
  (200, 1055, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.575011'),
  (200, 1088, 8, 8, 'available', NULL::text, '2026-06-26 00:46:37.583656'),
  (200, 1097, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.59665'),
  (200, 1108, 10, 10, 'available', NULL::text, '2026-06-26 00:46:37.604953'),
  (200, 1159, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.614359'),
  (200, 1175, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.622753'),
  (200, 1176, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.631447'),
  (200, 1292, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.641162'),
  (200, 1365, 3, 3, 'available', NULL::text, '2026-06-26 00:46:37.64999'),
  (201, 922, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.662264'),
  (201, 937, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.670962'),
  (201, 958, 1, 1, 'available', NULL::text, '2026-06-26 00:46:37.680151'),
  (201, 958, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.688571'),
  (201, 980, 3, 3, 'available', NULL::text, '2026-06-26 00:46:37.696737'),
  (201, 1023, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.705684'),
  (201, 1036, 4, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:37.714482'),
  (201, 1088, 10, 10, 'available', NULL::text, '2026-06-26 00:46:37.716937'),
  (201, 1097, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.725424'),
  (201, 1108, 10, 10, 'available', NULL::text, '2026-06-26 00:46:37.733911'),
  (201, 1116, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.742715'),
  (201, 1148, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.751057'),
  (201, 1159, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.761182'),
  (201, 1164, 8, 8, 'available', NULL::text, '2026-06-26 00:46:37.769489'),
  (201, 1175, 8, 8, 'available', NULL::text, '2026-06-26 00:46:37.777417'),
  (201, 1176, 8, 8, 'available', NULL::text, '2026-06-26 00:46:37.785336'),
  (201, 1195, 8, 8, 'available', NULL::text, '2026-06-26 00:46:37.79312'),
  (202, 922, 1, 1, 'available', NULL::text, '2026-06-26 00:46:37.806804'),
  (202, 935, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.81551'),
  (202, 937, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.823708'),
  (202, 958, 3, 3, 'available', NULL::text, '2026-06-26 00:46:37.832262'),
  (202, 958, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.840109'),
  (202, 980, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.848381'),
  (202, 1023, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.857028'),
  (202, 1036, 4, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:37.865041'),
  (202, 1088, 8, 8, 'available', NULL::text, '2026-06-26 00:46:37.867662'),
  (202, 1097, 4, 4, 'available', NULL::text, '2026-06-26 00:46:37.87588'),
  (202, 1108, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.883866'),
  (202, 1114, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.891388'),
  (202, 1148, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.899062'),
  (202, 1159, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.907093'),
  (202, 1164, 6, 6, 'available', NULL::text, '2026-06-26 00:46:37.914763'),
  (202, 1175, 8, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:37.922951'),
  (202, 1176, 8, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:37.926012'),
  (202, 1292, 2, 2, 'available', NULL::text, '2026-06-26 00:46:37.929301'),
  (203, 966, 3, 3, 'available', NULL::text, '2026-06-26 00:46:37.94172'),
  (203, 964, 3, 3, 'available', NULL::text, '2026-06-26 00:46:37.950388'),
  (203, 1041, 8, 8, 'available', NULL::text, '2026-06-26 00:46:37.959554'),
  (203, 1091, 15, 15, 'available', NULL::text, '2026-06-26 00:46:37.967738'),
  (203, 1088, 90, 90, 'available', NULL::text, '2026-06-26 00:46:37.976189'),
  (203, 1176, 10, 10, 'available', NULL::text, '2026-06-26 00:46:37.984621'),
  (203, 1311, 5, 5, 'available', NULL::text, '2026-06-26 00:46:37.993069'),
  (203, 1342, 15, 15, 'available', NULL::text, '2026-06-26 00:46:38.001293'),
  (204, 1288, 4, 4, 'available', NULL::text, '2026-06-26 00:46:38.014402'),
  (205, 959, 3, 3, 'available', NULL::text, '2026-06-26 00:46:38.027403'),
  (205, 1087, 6, 6, 'available', NULL::text, '2026-06-26 00:46:38.036895'),
  (205, 1308, 4, 4, 'available', NULL::text, '2026-06-26 00:46:38.045909'),
  (206, 935, 2, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:38.0577'),
  (206, 973, 2, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:38.060101'),
  (206, 1042, 6, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:38.064046'),
  (206, 1288, 3, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:38.068111'),
  (206, 1306, 2, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:38.071557'),
  (206, 1323, 3, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:38.077393'),
  (206, 1408, 1, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:38.148994'),
  (207, 935, 4, 4, 'available', NULL::text, '2026-06-26 00:46:38.162503'),
  (207, 958, 3, 3, 'available', NULL::text, '2026-06-26 00:46:38.171091'),
  (207, 1088, 10, 10, 'available', NULL::text, '2026-06-26 00:46:38.183689'),
  (207, 1108, 10, 10, 'available', NULL::text, '2026-06-26 00:46:38.192204'),
  (207, 1159, 8, 8, 'available', NULL::text, '2026-06-26 00:46:38.201368'),
  (207, 1175, 8, 8, 'available', NULL::text, '2026-06-26 00:46:38.209785'),
  (207, 1176, 8, 8, 'available', NULL::text, '2026-06-26 00:46:38.21996'),
  (208, 947, 1, 1, 'available', NULL::text, '2026-06-26 00:46:38.23189'),
  (208, 950, 2, 2, 'available', NULL::text, '2026-06-26 00:46:38.240051'),
  (208, 985, 1, 1, 'available', NULL::text, '2026-06-26 00:46:38.250349'),
  (208, 1039, 4, 4, 'available', NULL::text, '2026-06-26 00:46:38.259518'),
  (208, 1048, 6, 6, 'available', NULL::text, '2026-06-26 00:46:38.267363'),
  (208, 1183, 3, 3, 'available', NULL::text, '2026-06-26 00:46:38.275942'),
  (208, 1271, 2, 2, 'available', NULL::text, '2026-06-26 00:46:38.288876'),
  (208, 1314, 2, 2, 'available', NULL::text, '2026-06-26 00:46:38.304646'),
  (208, 1306, 2, 2, 'available', NULL::text, '2026-06-26 00:46:38.314643'),
  (209, 1026, 3, 3, 'available', NULL::text, '2026-06-26 00:46:38.327537'),
  (210, 958, 2, 2, 'available', NULL::text, '2026-06-26 00:46:38.341918'),
  (210, 1055, 8, 8, 'available', NULL::text, '2026-06-26 00:46:38.351295'),
  (210, 1089, 8, 8, 'available', NULL::text, '2026-06-26 00:46:38.363375'),
  (210, 1103, 6, 6, 'available', NULL::text, '2026-06-26 00:46:38.373319'),
  (210, 1108, 10, 10, 'available', NULL::text, '2026-06-26 00:46:38.381788'),
  (211, 958, 2, 2, 'available', NULL::text, '2026-06-26 00:46:38.401831'),
  (211, 1055, 6, 6, 'available', NULL::text, '2026-06-26 00:46:38.410571'),
  (211, 1164, 6, 6, 'available', NULL::text, '2026-06-26 00:46:38.420318'),
  (212, 1108, 12, 12, 'available', NULL::text, '2026-06-26 00:46:38.43376'),
  (212, 1175, 8, 8, 'available', NULL::text, '2026-06-26 00:46:38.442531'),
  (212, 1176, 8, 8, 'available', NULL::text, '2026-06-26 00:46:38.450889'),
  (212, 1342, 6, 6, 'available', NULL::text, '2026-06-26 00:46:38.459565'),
  (212, 1325, 6, 6, 'available', NULL::text, '2026-06-26 00:46:38.467943'),
  (213, 959, 2, 2, 'available', NULL::text, '2026-06-26 00:46:38.481097'),
  (214, 958, 4, 4, 'available', NULL::text, '2026-06-26 00:46:38.493819'),
  (214, 958, 3, 3, 'available', NULL::text, '2026-06-26 00:46:38.502376'),
  (214, 964, 2, 2, 'available', NULL::text, '2026-06-26 00:46:38.510835'),
  (214, 958, 2, 2, 'available', NULL::text, '2026-06-26 00:46:38.519638'),
  (214, 1026, 2, 2, 'available', NULL::text, '2026-06-26 00:46:38.528817'),
  (214, 1023, 3, 3, 'available', NULL::text, '2026-06-26 00:46:38.536628'),
  (214, 1039, 6, 6, 'available', NULL::text, '2026-06-26 00:46:38.545412'),
  (214, 1055, 6, 6, 'available', NULL::text, '2026-06-26 00:46:38.553475'),
  (214, 1055, 12, 12, 'available', NULL::text, '2026-06-26 00:46:38.565675'),
  (214, 1089, 8, 8, 'available', NULL::text, '2026-06-26 00:46:38.573823'),
  (214, 1103, 6, 6, 'available', NULL::text, '2026-06-26 00:46:38.582312'),
  (214, 1143, 6, 6, 'available', NULL::text, '2026-06-26 00:46:38.594736'),
  (214, 1156, 6, 6, 'available', NULL::text, '2026-06-26 00:46:38.608716'),
  (214, 1159, 10, 10, 'available', NULL::text, '2026-06-26 00:46:38.618665'),
  (214, 1167, 8, 8, 'available', NULL::text, '2026-06-26 00:46:38.626861'),
  (214, 1175, 6, 6, 'available', NULL::text, '2026-06-26 00:46:38.635733'),
  (214, 1288, 3, 3, 'available', NULL::text, '2026-06-26 00:46:38.961423'),
  (214, 1308, 4, 4, 'available', NULL::text, '2026-06-26 00:46:38.971429'),
  (214, 1311, 3, 3, 'available', NULL::text, '2026-06-26 00:46:38.980301'),
  (214, 1365, 3, 3, 'available', NULL::text, '2026-06-26 00:46:38.989791'),
  (215, 966, 3, 3, 'available', NULL::text, '2026-06-26 00:46:39.136736'),
  (215, 973, 2, 2, 'available', NULL::text, '2026-06-26 00:46:39.145432'),
  (215, 1041, 15, 15, 'available', NULL::text, '2026-06-26 00:46:39.156914'),
  (215, 1055, 8, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:39.166571'),
  (215, 1087, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.170306'),
  (215, 1091, 48, 48, 'available', NULL::text, '2026-06-26 00:46:39.179247'),
  (215, 1088, 10, 10, 'available', NULL::text, '2026-06-26 00:46:39.188821'),
  (215, 1101, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.198321'),
  (215, 1103, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.207774'),
  (215, 1111, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.217337'),
  (215, 1108, 10, 10, 'available', NULL::text, '2026-06-26 00:46:39.226386'),
  (215, 1197, 10, 10, 'available', NULL::text, '2026-06-26 00:46:39.235331'),
  (215, 1159, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.244497'),
  (215, 1167, 8, 8, 'available', NULL::text, '2026-06-26 00:46:39.253012'),
  (215, 1176, 10, 10, 'available', NULL::text, '2026-06-26 00:46:39.262925'),
  (215, 1143, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.271513'),
  (215, 1278, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.28228'),
  (215, 1288, 4, 4, 'available', NULL::text, '2026-06-26 00:46:39.291772'),
  (215, 1311, 4, 4, 'available', NULL::text, '2026-06-26 00:46:39.300858'),
  (215, 1342, 20, 20, 'available', NULL::text, '2026-06-26 00:46:39.310058'),
  (215, 1370, 4, 4, 'available', NULL::text, '2026-06-26 00:46:39.320706'),
  (217, 1055, 14, 14, 'available', NULL::text, '2026-06-26 00:46:39.33761'),
  (217, 1143, 2, 2, 'available', NULL::text, '2026-06-26 00:46:39.346311'),
  (217, 1342, 4, 4, 'available', NULL::text, '2026-06-26 00:46:39.355503'),
  (217, 1323, 2, 2, 'available', NULL::text, '2026-06-26 00:46:39.366114'),
  (219, 1599, 3, 3, 'available', NULL::text, '2026-06-26 00:46:39.416806'),
  (219, 1545, 15, 15, 'available', NULL::text, '2026-06-26 00:46:39.426912'),
  (219, 1612, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.435791'),
  (219, 1613, 8, 8, 'available', NULL::text, '2026-06-26 00:46:39.449719'),
  (219, 1617, 8, 8, 'available', NULL::text, '2026-06-26 00:46:39.460784'),
  (219, 1585, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.470322'),
  (220, 1546, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.486096'),
  (220, 1559, 2, 2, 'available', NULL::text, '2026-06-26 00:46:39.495106'),
  (220, 1599, 2, 2, 'available', NULL::text, '2026-06-26 00:46:39.504353'),
  (220, 1591, 2, 2, 'available', NULL::text, '2026-06-26 00:46:39.513441'),
  (220, 1545, 8, 8, 'available', NULL::text, '2026-06-26 00:46:39.522624'),
  (220, 1636, 20, 20, 'available', NULL::text, '2026-06-26 00:46:39.532055'),
  (220, 1613, 6, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:39.541978'),
  (220, 1613, 8, 8, 'available', NULL::text, '2026-06-26 00:46:39.54465'),
  (220, 1592, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.55405'),
  (221, 1559, 3, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:39.569214'),
  (221, 1585, 10, 10, 'available', NULL::text, '2026-06-26 00:46:39.573705'),
  (222, 1591, 2, 2, 'available', NULL::text, '2026-06-26 00:46:39.588713'),
  (222, 1545, 10, 10, 'available', NULL::text, '2026-06-26 00:46:39.59882'),
  (222, 1612, 8, 8, 'available', NULL::text, '2026-06-26 00:46:39.608122'),
  (222, 1636, 30, 30, 'available', NULL::text, '2026-06-26 00:46:39.61718'),
  (222, 1613, 15, 15, 'available', NULL::text, '2026-06-26 00:46:39.630626'),
  (222, 1613, 4, 4, 'available', NULL::text, '2026-06-26 00:46:39.640464'),
  (222, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.648965'),
  (222, 1592, 10, 10, 'available', NULL::text, '2026-06-26 00:46:39.657004'),
  (222, 1637, 25, 25, 'available', NULL::text, '2026-06-26 00:46:39.665853'),
  (223, 1612, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.680935'),
  (223, 1636, 15, 15, 'available', NULL::text, '2026-06-26 00:46:39.689495'),
  (223, 1613, 30, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:39.699318'),
  (223, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.701997'),
  (223, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.710135'),
  (223, 1637, 10, 10, 'available', NULL::text, '2026-06-26 00:46:39.719711'),
  (224, 1546, 12, 12, 'available', NULL::text, '2026-06-26 00:46:39.732445'),
  (224, 1546, 5, 5, 'available', NULL::text, '2026-06-26 00:46:39.74033'),
  (224, 1612, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.749219'),
  (224, 1636, 72, 72, 'available', NULL::text, '2026-06-26 00:46:39.758204'),
  (224, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.76718'),
  (224, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.77787'),
  (225, 1546, 1, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:39.792227'),
  (225, 1546, 2, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:39.794822'),
  (226, 1546, 3, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:39.801646'),
  (226, 1609, 2, 2, 'available', NULL::text, '2026-06-26 00:46:39.804458'),
  (226, 1599, 3, 3, 'available', NULL::text, '2026-06-26 00:46:39.812859'),
  (226, 1599, 3, 3, 'available', NULL::text, '2026-06-26 00:46:39.821139'),
  (226, 1599, 2, 2, 'available', NULL::text, '2026-06-26 00:46:39.830144'),
  (226, 1626, 12, 12, 'available', NULL::text, '2026-06-26 00:46:39.843604'),
  (226, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.85287'),
  (227, 1546, 1, 1, 'available', NULL::text, '2026-06-26 00:46:39.867491'),
  (227, 1635, 3, 3, 'available', NULL::text, '2026-06-26 00:46:39.878861'),
  (227, 1545, 25, 25, 'available', NULL::text, '2026-06-26 00:46:39.888736'),
  (227, 1636, 8, 8, 'available', NULL::text, '2026-06-26 00:46:39.898205'),
  (227, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.90782'),
  (227, 1613, 8, 8, 'available', NULL::text, '2026-06-26 00:46:39.917402'),
  (227, 1637, 20, 20, 'available', NULL::text, '2026-06-26 00:46:39.92771'),
  (228, 1559, 2, 2, 'available', NULL::text, '2026-06-26 00:46:39.944144'),
  (228, 1599, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:39.954029'),
  (228, 1599, 2, 2, 'available', NULL::text, '2026-06-26 00:46:39.956886'),
  (228, 1591, 2, 2, 'available', NULL::text, '2026-06-26 00:46:39.966211'),
  (228, 1545, 15, 15, 'available', NULL::text, '2026-06-26 00:46:39.976089'),
  (228, 1545, 6, 6, 'available', NULL::text, '2026-06-26 00:46:39.989359'),
  (228, 1636, 15, 15, 'available', NULL::text, '2026-06-26 00:46:39.999684'),
  (228, 1626, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.010275'),
  (228, 1613, 12, 12, 'available', NULL::text, '2026-06-26 00:46:40.021061'),
  (229, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.038689'),
  (230, 1599, 3, 3, 'available', NULL::text, '2026-06-26 00:46:40.058275'),
  (230, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.069685'),
  (230, 1592, 10, 10, 'available', NULL::text, '2026-06-26 00:46:40.07962'),
  (231, 1545, 25, 25, 'available', NULL::text, '2026-06-26 00:46:40.094435'),
  (231, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.103964'),
  (231, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.112644'),
  (232, 1609, 4, 4, 'available', NULL::text, '2026-06-26 00:46:40.128249'),
  (232, 1599, 2, 2, 'available', NULL::text, '2026-06-26 00:46:40.137751'),
  (232, 1599, 2, 2, 'available', NULL::text, '2026-06-26 00:46:40.145842'),
  (232, 1626, 8, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:40.154527'),
  (233, 1612, 4, 4, 'available', NULL::text, '2026-06-26 00:46:40.163008'),
  (234, 1599, 4, 4, 'available', NULL::text, '2026-06-26 00:46:40.178192'),
  (234, 1599, 4, 4, 'available', NULL::text, '2026-06-26 00:46:40.186596'),
  (234, 1599, 2, 2, 'available', NULL::text, '2026-06-26 00:46:40.195624'),
  (234, 1545, 12, 12, 'available', NULL::text, '2026-06-26 00:46:40.203439'),
  (234, 1612, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.212491'),
  (234, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.223657'),
  (234, 1585, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.232009'),
  (235, 1545, 30, 30, 'available', NULL::text, '2026-06-26 00:46:40.246282'),
  (235, 1592, 15, 15, 'available', NULL::text, '2026-06-26 00:46:40.258175'),
  (235, 1585, 8, 8, 'available', NULL::text, '2026-06-26 00:46:40.267924'),
  (236, 1599, 3, 3, 'available', NULL::text, '2026-06-26 00:46:40.283643'),
  (236, 1545, 25, 25, 'available', NULL::text, '2026-06-26 00:46:40.293307'),
  (236, 1612, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.303091'),
  (236, 1612, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.311858'),
  (236, 1584, 8, 8, 'available', NULL::text, '2026-06-26 00:46:40.322016'),
  (236, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.331329'),
  (236, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.340066'),
  (236, 1585, 5, 5, 'available', NULL::text, '2026-06-26 00:46:40.350057'),
  (237, 1545, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.363383'),
  (237, 1636, 15, 15, 'available', NULL::text, '2026-06-26 00:46:40.372137'),
  (237, 1613, 10, 10, 'available', NULL::text, '2026-06-26 00:46:40.382258'),
  (237, 1637, 15, 15, 'available', NULL::text, '2026-06-26 00:46:40.391526'),
  (238, 1599, 3, 3, 'available', NULL::text, '2026-06-26 00:46:40.404272'),
  (238, 1545, 10, 10, 'available', NULL::text, '2026-06-26 00:46:40.414305'),
  (238, 1612, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.424128'),
  (238, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.433909'),
  (238, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.442211'),
  (239, 1599, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.454328'),
  (239, 1545, 20, 20, 'available', NULL::text, '2026-06-26 00:46:40.462544'),
  (239, 1637, 8, 8, 'available', NULL::text, '2026-06-26 00:46:40.472325'),
  (240, 1617, 6, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:40.493672'),
  (241, 1636, 8, 8, 'available', NULL::text, '2026-06-26 00:46:40.501806'),
  (241, 1584, 5, 5, 'available', NULL::text, '2026-06-26 00:46:40.510504'),
  (241, 1613, 4, 4, 'available', NULL::text, '2026-06-26 00:46:40.518709'),
  (241, 1637, 8, 8, 'available', NULL::text, '2026-06-26 00:46:40.529088'),
  (242, 1635, 2, 2, 'available', NULL::text, '2026-06-26 00:46:40.543695'),
  (242, 1636, 10, 10, 'available', NULL::text, '2026-06-26 00:46:40.553359'),
  (242, 1584, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.563272'),
  (242, 1613, 4, 4, 'available', NULL::text, '2026-06-26 00:46:40.573966'),
  (242, 1637, 10, 10, 'available', NULL::text, '2026-06-26 00:46:40.584424'),
  (243, 1545, 10, 10, 'available', NULL::text, '2026-06-26 00:46:40.599664'),
  (243, 1612, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.609798'),
  (243, 1613, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.624096'),
  (243, 1592, 4, 4, 'available', NULL::text, '2026-06-26 00:46:40.633085'),
  (244, 1636, 15, 15, 'available', NULL::text, '2026-06-26 00:46:40.6482'),
  (244, 1613, 10, 10, 'available', NULL::text, '2026-06-26 00:46:40.657664'),
  (246, 1, 2, 2, 'available', NULL::text, '2026-06-26 00:46:40.692926'),
  (246, 3, 5, 5, 'available', NULL::text, '2026-06-26 00:46:40.702769'),
  (246, 16, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.711697'),
  (246, 18, 3, 3, 'available', NULL::text, '2026-06-26 00:46:40.721978'),
  (246, 24, 10, 10, 'available', NULL::text, '2026-06-26 00:46:40.731317'),
  (246, 27, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.741687'),
  (246, 30, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.750988'),
  (247, 1, 2, 2, 'available', NULL::text, '2026-06-26 00:46:40.767033'),
  (247, 3, 2, 2, 'available', NULL::text, '2026-06-26 00:46:40.776275'),
  (247, 18, 10, 10, 'available', NULL::text, '2026-06-26 00:46:40.785215'),
  (247, 24, 10, 10, 'available', NULL::text, '2026-06-26 00:46:40.795975'),
  (247, 29, 10, 10, 'available', NULL::text, '2026-06-26 00:46:40.806084'),
  (247, 36, 2, 2, 'available', NULL::text, '2026-06-26 00:46:40.819763'),
  (247, 37, 4, 4, 'available', NULL::text, '2026-06-26 00:46:40.829631'),
  (248, 1, 4, 4, 'available', NULL::text, '2026-06-26 00:46:40.843373'),
  (248, 3, 4, 4, 'available', NULL::text, '2026-06-26 00:46:40.852544'),
  (248, 13, 23, 23, 'available', NULL::text, '2026-06-26 00:46:40.86202'),
  (248, 21, 5, 5, 'available', NULL::text, '2026-06-26 00:46:40.871811'),
  (248, 24, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.881279'),
  (248, 36, 3, 3, 'available', NULL::text, '2026-06-26 00:46:40.894832'),
  (248, 37, 4, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:40.904409'),
  (249, 1, 2, 2, 'available', NULL::text, '2026-06-26 00:46:40.912093'),
  (249, 13, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.922731'),
  (249, 16, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.93258'),
  (249, 17, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.944097'),
  (249, 18, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.957861'),
  (249, 21, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.967906'),
  (249, 22, 6, 6, 'available', NULL::text, '2026-06-26 00:46:40.980613'),
  (249, 23, 10, 10, 'available', NULL::text, '2026-06-26 00:46:40.990367'),
  (249, 24, 10, 10, 'available', NULL::text, '2026-06-26 00:46:40.99953'),
  (249, 30, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.008198'),
  (250, 1, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.022182'),
  (250, 36, 1, 1, 'available', NULL::text, '2026-06-26 00:46:41.031623'),
  (250, 37, 5, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:41.040545'),
  (251, 1, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.047737'),
  (251, 7, 6, 6, 'available', NULL::text, '2026-06-26 00:46:41.056426'),
  (251, 11, 4, 4, 'available', NULL::text, '2026-06-26 00:46:41.065321'),
  (251, 15, 5, 5, 'available', NULL::text, '2026-06-26 00:46:41.075916'),
  (251, 17, 5, 5, 'available', NULL::text, '2026-06-26 00:46:41.086864'),
  (251, 18, 5, 5, 'available', NULL::text, '2026-06-26 00:46:41.095815'),
  (251, 24, 10, 10, 'available', NULL::text, '2026-06-26 00:46:41.103998'),
  (251, 29, 5, 5, 'available', NULL::text, '2026-06-26 00:46:41.113859'),
  (251, 30, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.122779'),
  (251, 30, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.131662'),
  (251, 32, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.141197'),
  (251, 33, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.152015'),
  (251, 38, 5, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:41.161506'),
  (252, 1, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.169178'),
  (252, 4, 1, 1, 'available', NULL::text, '2026-06-26 00:46:41.179933'),
  (252, 13, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.189208'),
  (252, 14, 19, 19, 'available', NULL::text, '2026-06-26 00:46:41.200632'),
  (253, 1, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.215456'),
  (253, 18, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.225071'),
  (253, 24, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.236327'),
  (253, 36, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.246327'),
  (254, 1, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.26158'),
  (255, 1, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.276377'),
  (255, 36, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.289137'),
  (256, 1, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.303397'),
  (256, 4, 1, 1, 'available', NULL::text, '2026-06-26 00:46:41.315771'),
  (256, 9, 5, 5, 'available', NULL::text, '2026-06-26 00:46:41.328119'),
  (256, 678, 6, 6, 'available', NULL::text, '2026-06-26 00:46:41.337983'),
  (256, 7, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.348537'),
  (256, 16, 6, 6, 'available', NULL::text, '2026-06-26 00:46:41.361314'),
  (256, 7, 6, 6, 'available', NULL::text, '2026-06-26 00:46:41.372861'),
  (256, 7, 6, 6, 'available', NULL::text, '2026-06-26 00:46:41.384292'),
  (256, 27, 6, 6, 'available', NULL::text, '2026-06-26 00:46:41.394522'),
  (256, 28, 8, 8, 'available', NULL::text, '2026-06-26 00:46:41.40592'),
  (256, 29, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.416054'),
  (256, 32, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.426363'),
  (256, 35, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.435406'),
  (256, 36, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.444811'),
  (256, 37, 4, 4, 'available', NULL::text, '2026-06-26 00:46:41.453953'),
  (257, 1, 4, 4, 'available', NULL::text, '2026-06-26 00:46:41.467299'),
  (257, 4, 1, 1, 'available', NULL::text, '2026-06-26 00:46:41.476285'),
  (257, 9, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.485273'),
  (257, 7, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.495287'),
  (257, 7, 6, 6, 'available', NULL::text, '2026-06-26 00:46:41.504303'),
  (257, 27, 6, 6, 'available', NULL::text, '2026-06-26 00:46:41.513182'),
  (257, 30, 4, 4, 'available', NULL::text, '2026-06-26 00:46:41.521948'),
  (257, 32, 6, 6, 'available', NULL::text, '2026-06-26 00:46:41.531982'),
  (257, 36, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.540801'),
  (257, 37, 4, 4, 'available', NULL::text, '2026-06-26 00:46:41.55018'),
  (257, 39, 8, 8, 'available', NULL::text, '2026-06-26 00:46:41.558701'),
  (258, 1, 5, 5, 'available', NULL::text, '2026-06-26 00:46:41.571548'),
  (258, 4, 1, 1, 'available', NULL::text, '2026-06-26 00:46:41.579547'),
  (258, 9, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.588189'),
  (258, 13, 17, 17, 'available', NULL::text, '2026-06-26 00:46:41.596863'),
  (258, 7, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.605463'),
  (258, 7, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.613554'),
  (258, 27, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.621738'),
  (258, 28, 4, 4, 'available', NULL::text, '2026-06-26 00:46:41.630642'),
  (258, 30, 5, 5, 'available', NULL::text, '2026-06-26 00:46:41.640118'),
  (258, 32, 6, 6, 'available', NULL::text, '2026-06-26 00:46:41.64902'),
  (258, 36, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.65776'),
  (258, 37, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.665898'),
  (258, 39, 10, 10, 'available', NULL::text, '2026-06-26 00:46:41.673831'),
  (259, 1, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.68734'),
  (259, 6, 6, 6, 'available', NULL::text, '2026-06-26 00:46:41.696004'),
  (259, 9, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.704318'),
  (259, 13, 6, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:41.712616'),
  (259, 7, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.715796'),
  (259, 7, 4, 4, 'available', NULL::text, '2026-06-26 00:46:41.724268'),
  (259, 7, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.733104'),
  (259, 27, 6, 6, 'available', NULL::text, '2026-06-26 00:46:41.741443'),
  (259, 28, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.750516'),
  (259, 30, 2, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:41.758899'),
  (259, 32, 4, NULL::int, 'partial', NULL::text, '2026-06-26 00:46:41.761438'),
  (259, 34, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.764166'),
  (259, 30, 2, 2, 'available', NULL::text, '2026-06-26 00:46:41.772579'),
  (260, 5, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.785176'),
  (260, 13, 5, 5, 'available', NULL::text, '2026-06-26 00:46:41.793789'),
  (260, 16, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.803303'),
  (260, 18, 4, 4, 'available', NULL::text, '2026-06-26 00:46:41.812826'),
  (260, 20, 5, 5, 'available', NULL::text, '2026-06-26 00:46:41.821911'),
  (260, 23, 7, 7, 'available', NULL::text, '2026-06-26 00:46:41.829803'),
  (260, 28, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.83885'),
  (260, 29, 4, 4, 'available', NULL::text, '2026-06-26 00:46:41.847026'),
  (260, 37, 6, 6, 'available', NULL::text, '2026-06-26 00:46:41.855492'),
  (260, 39, 10, 10, 'available', NULL::text, '2026-06-26 00:46:41.866152'),
  (261, 6, 11, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:41.878405'),
  (261, 18, 4, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:41.880971'),
  (261, 19, 4, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:41.883456'),
  (261, 23, 8, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:41.885854'),
  (261, 24, 8, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:41.888613'),
  (261, 30, 2, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:41.891293'),
  (261, 38, 5, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:41.89388'),
  (262, 8, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.900197'),
  (262, 9, 5, 5, 'available', NULL::text, '2026-06-26 00:46:41.909118'),
  (262, 10, 6, 6, 'available', NULL::text, '2026-06-26 00:46:41.917139'),
  (262, 11, 3, 3, 'available', NULL::text, '2026-06-26 00:46:41.925476'),
  (262, 13, 6, 6, 'available', NULL::text, '2026-06-26 00:46:41.933369'),
  (262, 16, 5, 5, 'available', NULL::text, '2026-06-26 00:46:41.942825'),
  (262, 21, 10, 10, 'available', NULL::text, '2026-06-26 00:46:41.952185'),
  (262, 23, 5, 5, 'available', NULL::text, '2026-06-26 00:46:41.961058'),
  (262, 24, 10, 10, 'available', NULL::text, '2026-06-26 00:46:41.969409'),
  (262, 26, 5, 5, 'available', NULL::text, '2026-06-26 00:46:41.97775'),
  (262, 28, 5, 5, 'available', NULL::text, '2026-06-26 00:46:41.989848'),
  (263, 8, 4, 4, 'available', NULL::text, '2026-06-26 00:46:42.004071'),
  (263, 9, 4, 4, 'available', NULL::text, '2026-06-26 00:46:42.012575'),
  (263, 12, 5, 5, 'available', NULL::text, '2026-06-26 00:46:42.021655'),
  (263, 17, 4, 4, 'available', NULL::text, '2026-06-26 00:46:42.029777'),
  (263, 18, 4, 4, 'available', NULL::text, '2026-06-26 00:46:42.037966'),
  (263, 25, 4, 4, 'available', NULL::text, '2026-06-26 00:46:42.046439'),
  (263, 28, 3, 3, 'available', NULL::text, '2026-06-26 00:46:42.055172'),
  (263, 32, 3, 3, 'available', NULL::text, '2026-06-26 00:46:42.063415'),
  (263, 33, 3, 3, 'available', NULL::text, '2026-06-26 00:46:42.071239'),
  (263, 34, 3, 3, 'available', NULL::text, '2026-06-26 00:46:42.080013'),
  (263, 35, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.088912'),
  (263, 36, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.097203'),
  (263, 37, 4, 4, 'available', NULL::text, '2026-06-26 00:46:42.105459'),
  (263, 38, 4, 4, 'available', NULL::text, '2026-06-26 00:46:42.116892'),
  (264, 7, 7, NULL::int, 'pending', NULL::text, '2026-06-26 00:46:42.129685'),
  (265, 18, 9, 9, 'available', NULL::text, '2026-06-26 00:46:42.136106'),
  (265, 24, 56, 56, 'available', NULL::text, '2026-06-26 00:46:42.144776'),
  (266, 23, 10, 10, 'available', NULL::text, '2026-06-26 00:46:42.157276'),
  (267, 40, 10, 10, 'available', NULL::text, '2026-06-26 00:46:42.171313'),
  (268, 45, 3, 3, 'available', NULL::text, '2026-06-26 00:46:42.188196'),
  (268, 60, 21, 21, 'available', NULL::text, '2026-06-26 00:46:42.197888'),
  (269, 45, 3, 3, 'available', NULL::text, '2026-06-26 00:46:42.211193'),
  (269, 60, 12, 12, 'available', NULL::text, '2026-06-26 00:46:42.220427'),
  (270, 46, 7, 7, 'available', NULL::text, '2026-06-26 00:46:42.23332'),
  (270, 47, 5, 5, 'available', NULL::text, '2026-06-26 00:46:42.241736'),
  (270, 60, 15, 15, 'available', NULL::text, '2026-06-26 00:46:42.250428'),
  (272, 60, 10, 10, 'available', NULL::text, '2026-06-26 00:46:42.268741'),
  (273, 60, 30, 30, 'available', NULL::text, '2026-06-26 00:46:42.281359'),
  (274, 60, 20, 20, 'available', NULL::text, '2026-06-26 00:46:42.294792'),
  (275, 60, 10, 10, 'available', NULL::text, '2026-06-26 00:46:42.308054'),
  (277, 60, 20, 20, 'available', NULL::text, '2026-06-26 00:46:42.326459'),
  (279, 85, 4, 4, 'available', NULL::text, '2026-06-26 00:46:42.344924'),
  (280, 85, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.357653'),
  (280, 113, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.366501'),
  (280, 114, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.374505'),
  (280, 116, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.382857'),
  (280, 117, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.391225'),
  (280, 118, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.399863'),
  (280, 119, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.408829'),
  (280, 120, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.417329'),
  (281, 87, 5, 5, 'available', NULL::text, '2026-06-26 00:46:42.431894'),
  (281, 115, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.449046'),
  (281, 116, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.461734'),
  (281, 117, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.473297'),
  (281, 118, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.484071'),
  (281, 119, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.49282'),
  (282, 87, 3, 3, 'available', NULL::text, '2026-06-26 00:46:42.506422'),
  (282, 90, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.514723'),
  (282, 93, 3, 3, 'available', NULL::text, '2026-06-26 00:46:42.526477'),
  (282, 103, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.535327'),
  (282, 112, 6, 6, 'available', NULL::text, '2026-06-26 00:46:42.54477'),
  (282, 113, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.553876'),
  (282, 116, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.56229'),
  (283, 87, 6, 6, 'available', NULL::text, '2026-06-26 00:46:42.574761'),
  (284, 87, 12, 12, 'available', NULL::text, '2026-06-26 00:46:42.587834'),
  (284, 92, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.595792'),
  (284, 100, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.604402'),
  (284, 108, 3, 3, 'available', NULL::text, '2026-06-26 00:46:42.612954'),
  (284, 111, 3, 3, 'available', NULL::text, '2026-06-26 00:46:42.627101'),
  (284, 113, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.635836'),
  (284, 114, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.644145'),
  (284, 115, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.653218'),
  (284, 116, 3, 3, 'available', NULL::text, '2026-06-26 00:46:42.66116'),
  (284, 117, 6, 6, 'available', NULL::text, '2026-06-26 00:46:42.669525'),
  (284, 118, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.678616'),
  (284, 119, 4, 4, 'available', NULL::text, '2026-06-26 00:46:42.686603'),
  (284, 120, 5, 5, 'available', NULL::text, '2026-06-26 00:46:42.695478'),
  (285, 87, 5, 5, 'available', NULL::text, '2026-06-26 00:46:42.708006'),
  (285, 89, 3, 3, 'available', NULL::text, '2026-06-26 00:46:42.716321'),
  (285, 97, 3, 3, 'available', NULL::text, '2026-06-26 00:46:42.726017'),
  (285, 114, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.734188'),
  (285, 115, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.743707'),
  (285, 116, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.751863'),
  (285, 118, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.760302'),
  (285, 120, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.768892'),
  (286, 87, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.782212'),
  (286, 94, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.790044'),
  (286, 130, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.798235'),
  (287, 113, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.812059'),
  (287, 114, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.820599'),
  (287, 115, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.82955'),
  (287, 116, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.838344'),
  (287, 117, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.846898'),
  (287, 118, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.854975'),
  (287, 119, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.86376'),
  (287, 120, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.872911'),
  (288, 113, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.886124'),
  (288, 114, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.894689'),
  (288, 115, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.903123'),
  (288, 116, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.917201'),
  (288, 117, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.930288'),
  (288, 118, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.938679'),
  (288, 119, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.94711'),
  (288, 120, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.955422'),
  (289, 114, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.969176'),
  (289, 115, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.977952'),
  (289, 116, 2, 2, 'available', NULL::text, '2026-06-26 00:46:42.986182'),
  (289, 117, 1, 1, 'available', NULL::text, '2026-06-26 00:46:42.995024'),
  (289, 118, 2, 2, 'available', NULL::text, '2026-06-26 00:46:43.003884'),
  (289, 119, 1, 1, 'available', NULL::text, '2026-06-26 00:46:43.013118'),
  (289, 129, 2, 2, 'available', NULL::text, '2026-06-26 00:46:43.02253'),
  (289, 130, 2, 2, 'available', NULL::text, '2026-06-26 00:46:43.031175'),
  (290, 114, 2, 2, 'available', NULL::text, '2026-06-26 00:46:43.044279'),
  (290, 116, 2, 2, 'available', NULL::text, '2026-06-26 00:46:43.052542'),
  (290, 117, 2, 2, 'available', NULL::text, '2026-06-26 00:46:43.060541'),
  (290, 118, 2, 2, 'available', NULL::text, '2026-06-26 00:46:43.069353'),
  (290, 119, 3, 3, 'available', NULL::text, '2026-06-26 00:46:43.079993'),
  (290, 120, 2, 2, 'available', NULL::text, '2026-06-26 00:46:43.088253'),
  (290, 129, 2, 2, 'available', NULL::text, '2026-06-26 00:46:43.096345'),
  (290, 130, 2, 2, 'available', NULL::text, '2026-06-26 00:46:43.105983'),
  (291, 116, 2, 2, 'available', NULL::text, '2026-06-26 00:46:43.119319'),
  (291, 117, 1, 1, 'available', NULL::text, '2026-06-26 00:46:43.128193'),
  (291, 118, 1, 1, 'available', NULL::text, '2026-06-26 00:46:43.137046'),
  (291, 119, 1, 1, 'available', NULL::text, '2026-06-26 00:46:43.145889'),
  (291, 120, 2, 2, 'available', NULL::text, '2026-06-26 00:46:43.153998'),
  (292, 131, 2, 2, 'available', NULL::text, '2026-06-26 00:46:43.170373'),
  (292, 142, 8, 8, 'available', NULL::text, '2026-06-26 00:46:43.178858'),
  (293, 134, 24, 24, 'available', NULL::text, '2026-06-26 00:46:43.192537'),
  (293, 138, 24, 24, 'available', NULL::text, '2026-06-26 00:46:43.201224'),
  (293, 139, 12, 12, 'available', NULL::text, '2026-06-26 00:46:43.21018'),
  (293, 142, 8, 8, 'available', NULL::text, '2026-06-26 00:46:43.219464'),
  (293, 157, 5, 5, 'available', NULL::text, '2026-06-26 00:46:43.228233'),
  (293, 160, 8, 8, 'available', NULL::text, '2026-06-26 00:46:43.237366'),
  (293, 167, 6, 6, 'available', NULL::text, '2026-06-26 00:46:43.245624'),
  (293, 171, 2, 2, 'available', NULL::text, '2026-06-26 00:46:43.253864'),
  (294, 136, 2, 2, 'available', NULL::text, '2026-06-26 00:46:43.270699'),
  (294, 137, 2, 2, 'available', NULL::text, '2026-06-26 00:46:43.279799'),
  (294, 141, 6, 6, 'available', NULL::text, '2026-06-26 00:46:43.288768'),
  (294, 142, 6, 6, 'available', NULL::text, '2026-06-26 00:46:43.297875'),
  (294, 150, 4, 4, 'available', NULL::text, '2026-06-26 00:46:43.30669'),
  (294, 158, 12, 12, 'available', NULL::text, '2026-06-26 00:46:43.314986'),
  (294, 159, 20, 20, 'available', NULL::text, '2026-06-26 00:46:43.323467'),
  (294, 166, 1, 1, 'available', NULL::text, '2026-06-26 00:46:43.334846'),
  (295, 139, 6, 6, 'available', NULL::text, '2026-06-26 00:46:43.351818'),
  (295, 142, 6, 6, 'available', NULL::text, '2026-06-26 00:46:43.36221'),
  (296, 142, 6, 6, 'available', NULL::text, '2026-06-26 00:46:43.375839'),
  (296, 142, 6, 6, 'available', NULL::text, '2026-06-26 00:46:43.389507'),
  (296, 142, 6, 6, 'available', NULL::text, '2026-06-26 00:46:43.397946'),
  (296, 148, 6, 6, 'available', NULL::text, '2026-06-26 00:46:43.407666'),
  (297, 145, 10, 10, 'available', NULL::text, '2026-06-26 00:46:43.421035'),
  (297, 146, 10, 10, 'available', NULL::text, '2026-06-26 00:46:43.429476'),
  (297, 148, 15, 15, 'available', NULL::text, '2026-06-26 00:46:43.443239'),
  (297, 150, 8, 8, 'available', NULL::text, '2026-06-26 00:46:43.453837'),
  (297, 157, 10, 10, 'available', NULL::text, '2026-06-26 00:46:43.462496'),
  (297, 163, 4, 4, 'available', NULL::text, '2026-06-26 00:46:43.473657'),
  (298, 145, 10, 10, 'available', NULL::text, '2026-06-26 00:46:43.486521'),
  (298, 146, 10, 10, 'available', NULL::text, '2026-06-26 00:46:43.495435'),
  (298, 148, 15, 15, 'available', NULL::text, '2026-06-26 00:46:43.50373'),
  (298, 150, 8, 8, 'available', NULL::text, '2026-06-26 00:46:43.511842'),
  (298, 163, 4, 4, 'available', NULL::text, '2026-06-26 00:46:43.521562'),
  (299, 148, 4, 4, 'available', NULL::text, '2026-06-26 00:46:43.534737'),
  (299, 163, 4, 4, 'available', NULL::text, '2026-06-26 00:46:43.54395'),
  (299, 170, 6, 6, 'available', NULL::text, '2026-06-26 00:46:43.553121'),
  (300, 150, 1, 1, 'available', NULL::text, '2026-06-26 00:46:43.565998')
) AS i(order_id, product_id, quantity_ordered, quantity_confirmed, availability, notes, created_at)
JOIN order_id_map m ON m.old_id = i.order_id;

INSERT INTO inventory_transactions (product_id, vendor_id, order_id, type, quantity, notes, created_at)
SELECT t.product_id, t.vendor_id, m.new_id, t.type, t.quantity, t.notes, t.created_at
FROM (VALUES
  (172, 6, 11, 'receive', 80, 'Historical import', '2026-06-26 00:46:09.874225'),
  (172, 6, 12, 'receive', 240, 'Historical import', '2026-06-26 00:46:26.149364'),
  (174, 6, 12, 'receive', 96, 'Historical import', '2026-06-26 00:46:26.161572'),
  (172, 6, 13, 'receive', 60, 'Historical import', '2026-06-26 00:46:26.180013'),
  (174, 6, 13, 'receive', 48, 'Historical import', '2026-06-26 00:46:26.190376'),
  (189, 7, 14, 'receive', 1, 'Historical import', '2026-06-26 00:46:26.208072'),
  (190, 7, 14, 'receive', 2, 'Historical import', '2026-06-26 00:46:26.216015'),
  (194, 7, 14, 'receive', 6, 'Historical import', '2026-06-26 00:46:26.225726'),
  (195, 7, 14, 'receive', 6, 'Historical import', '2026-06-26 00:46:26.235152'),
  (196, 7, 14, 'receive', 6, 'Historical import', '2026-06-26 00:46:26.243982'),
  (197, 7, 14, 'receive', 6, 'Historical import', '2026-06-26 00:46:26.252411'),
  (198, 7, 14, 'receive', 1, 'Historical import', '2026-06-26 00:46:26.261269'),
  (199, 7, 14, 'receive', 2, 'Historical import', '2026-06-26 00:46:26.270795'),
  (201, 7, 14, 'receive', 5, 'Historical import', '2026-06-26 00:46:26.280784'),
  (202, 7, 14, 'receive', 5, 'Historical import', '2026-06-26 00:46:26.288554'),
  (189, 7, 15, 'receive', 1, 'Historical import', '2026-06-26 00:46:26.304543'),
  (190, 7, 15, 'receive', 7, 'Historical import', '2026-06-26 00:46:26.312915'),
  (194, 7, 15, 'receive', 12, 'Historical import', '2026-06-26 00:46:26.321131'),
  (195, 7, 15, 'receive', 6, 'Historical import', '2026-06-26 00:46:26.330155'),
  (196, 7, 15, 'receive', 10, 'Historical import', '2026-06-26 00:46:26.339607'),
  (198, 7, 15, 'receive', 1, 'Historical import', '2026-06-26 00:46:26.348193'),
  (199, 7, 15, 'receive', 11, 'Historical import', '2026-06-26 00:46:26.35868'),
  (200, 7, 15, 'receive', 5, 'Historical import', '2026-06-26 00:46:26.368324'),
  (201, 7, 15, 'receive', 90, 'Historical import', '2026-06-26 00:46:26.379281'),
  (202, 7, 15, 'receive', 30, 'Historical import', '2026-06-26 00:46:26.387102'),
  (196, 7, 15, 'receive', 5, 'Historical import', '2026-06-26 00:46:26.396275'),
  (197, 7, 15, 'receive', 10, 'Historical import', '2026-06-26 00:46:26.404738'),
  (189, 7, 16, 'receive', 1, 'Historical import', '2026-06-26 00:46:26.421307'),
  (190, 7, 16, 'receive', 1, 'Historical import', '2026-06-26 00:46:26.429551'),
  (191, 7, 16, 'receive', 1, 'Historical import', '2026-06-26 00:46:26.438736'),
  (194, 7, 16, 'receive', 12, 'Historical import', '2026-06-26 00:46:26.447918'),
  (189, 7, 17, 'receive', 1, 'Historical import', '2026-06-26 00:46:26.461155'),
  (190, 7, 17, 'receive', 3, 'Historical import', '2026-06-26 00:46:26.471795'),
  (191, 7, 17, 'receive', 1, 'Historical import', '2026-06-26 00:46:26.479613'),
  (194, 7, 17, 'receive', 12, 'Historical import', '2026-06-26 00:46:26.487044'),
  (196, 7, 17, 'receive', 3, 'Historical import', '2026-06-26 00:46:26.496504'),
  (190, 7, 18, 'receive', 15, 'Historical import', '2026-06-26 00:46:26.507543'),
  (194, 7, 18, 'receive', 3, 'Historical import', '2026-06-26 00:46:26.516036'),
  (190, 7, 19, 'receive', 3, 'Historical import', '2026-06-26 00:46:26.528358'),
  (190, 7, 20, 'receive', 2, 'Historical import', '2026-06-26 00:46:26.544364'),
  (196, 7, 20, 'receive', 15, 'Historical import', '2026-06-26 00:46:26.557002'),
  (198, 7, 21, 'receive', 2, 'Historical import', '2026-06-26 00:46:26.576387'),
  (199, 7, 21, 'receive', 7, 'Historical import', '2026-06-26 00:46:26.586477'),
  (201, 7, 21, 'receive', 15, 'Historical import', '2026-06-26 00:46:26.595566'),
  (198, 7, 22, 'receive', 2, 'Historical import', '2026-06-26 00:46:26.608832'),
  (199, 7, 22, 'receive', 9, 'Historical import', '2026-06-26 00:46:26.617643'),
  (200, 7, 22, 'receive', 3, 'Historical import', '2026-06-26 00:46:26.626327'),
  (201, 7, 22, 'receive', 25, 'Historical import', '2026-06-26 00:46:26.634822'),
  (202, 7, 22, 'receive', 40, 'Historical import', '2026-06-26 00:46:26.643313'),
  (196, 7, 22, 'receive', 5, 'Historical import', '2026-06-26 00:46:26.651015'),
  (197, 7, 22, 'receive', 10, 'Historical import', '2026-06-26 00:46:26.659326'),
  (198, 7, 23, 'receive', 1, 'Historical import', '2026-06-26 00:46:26.67058'),
  (199, 7, 23, 'receive', 2, 'Historical import', '2026-06-26 00:46:26.678634'),
  (201, 7, 23, 'receive', 5, 'Historical import', '2026-06-26 00:46:26.686661'),
  (197, 7, 23, 'receive', 10, 'Historical import', '2026-06-26 00:46:26.695383'),
  (203, 8, 24, 'receive', 21, 'Historical import', '2026-06-26 00:46:26.711164'),
  (218, 8, 24, 'receive', 12, 'Historical import', '2026-06-26 00:46:26.720449'),
  (232, 8, 24, 'receive', 6, 'Historical import', '2026-06-26 00:46:26.728873'),
  (204, 8, 25, 'receive', 2, 'Historical import', '2026-06-26 00:46:26.740608'),
  (205, 8, 25, 'receive', 2, 'Historical import', '2026-06-26 00:46:26.748495'),
  (206, 8, 25, 'receive', 2, 'Historical import', '2026-06-26 00:46:26.75638'),
  (207, 8, 25, 'receive', 2, 'Historical import', '2026-06-26 00:46:26.764404'),
  (211, 8, 25, 'receive', 2, 'Historical import', '2026-06-26 00:46:26.771824'),
  (212, 8, 25, 'receive', 2, 'Historical import', '2026-06-26 00:46:26.779872'),
  (214, 8, 25, 'receive', 2, 'Historical import', '2026-06-26 00:46:26.890489'),
  (211, 8, 25, 'receive', 2, 'Historical import', '2026-06-26 00:46:26.901265'),
  (216, 8, 25, 'receive', 2, 'Historical import', '2026-06-26 00:46:26.910538'),
  (217, 8, 25, 'receive', 3, 'Historical import', '2026-06-26 00:46:26.919423'),
  (218, 8, 25, 'receive', 12, 'Historical import', '2026-06-26 00:46:26.928427'),
  (225, 8, 25, 'receive', 6, 'Historical import', '2026-06-26 00:46:26.938292'),
  (226, 8, 25, 'receive', 6, 'Historical import', '2026-06-26 00:46:26.946953'),
  (228, 8, 25, 'receive', 6, 'Historical import', '2026-06-26 00:46:26.955135'),
  (231, 8, 25, 'receive', 6, 'Historical import', '2026-06-26 00:46:26.963206'),
  (232, 8, 25, 'receive', 3, 'Historical import', '2026-06-26 00:46:26.973458'),
  (233, 8, 25, 'receive', 6, 'Historical import', '2026-06-26 00:46:26.980855'),
  (234, 8, 25, 'receive', 6, 'Historical import', '2026-06-26 00:46:26.989461'),
  (237, 8, 25, 'receive', 6, 'Historical import', '2026-06-26 00:46:26.997841'),
  (239, 8, 25, 'receive', 10, 'Historical import', '2026-06-26 00:46:27.006713'),
  (240, 8, 25, 'receive', 5, 'Historical import', '2026-06-26 00:46:27.015067'),
  (246, 8, 25, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.023642'),
  (248, 8, 25, 'receive', 15, 'Historical import', '2026-06-26 00:46:27.032061'),
  (249, 8, 25, 'receive', 15, 'Historical import', '2026-06-26 00:46:27.041128'),
  (250, 8, 25, 'receive', 5, 'Historical import', '2026-06-26 00:46:27.048695'),
  (252, 8, 25, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.057373'),
  (204, 8, 26, 'receive', 4, 'Historical import', '2026-06-26 00:46:27.069208'),
  (205, 8, 26, 'receive', 3, 'Historical import', '2026-06-26 00:46:27.07789'),
  (206, 8, 26, 'receive', 3, 'Historical import', '2026-06-26 00:46:27.086025'),
  (207, 8, 26, 'receive', 2, 'Historical import', '2026-06-26 00:46:27.09326'),
  (214, 8, 26, 'receive', 4, 'Historical import', '2026-06-26 00:46:27.109966'),
  (211, 8, 26, 'receive', 3, 'Historical import', '2026-06-26 00:46:27.119234'),
  (216, 8, 26, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.128009'),
  (217, 8, 26, 'receive', 3, 'Historical import', '2026-06-26 00:46:27.136948'),
  (218, 8, 26, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.146375'),
  (225, 8, 26, 'receive', 12, 'Historical import', '2026-06-26 00:46:27.155042'),
  (226, 8, 26, 'receive', 12, 'Historical import', '2026-06-26 00:46:27.163696'),
  (228, 8, 26, 'receive', 12, 'Historical import', '2026-06-26 00:46:27.173183'),
  (233, 8, 26, 'receive', 18, 'Historical import', '2026-06-26 00:46:27.181184'),
  (234, 8, 26, 'receive', 18, 'Historical import', '2026-06-26 00:46:27.190096'),
  (237, 8, 26, 'receive', 15, 'Historical import', '2026-06-26 00:46:27.199302'),
  (246, 8, 26, 'receive', 20, 'Historical import', '2026-06-26 00:46:27.210036'),
  (249, 8, 26, 'receive', 25, 'Historical import', '2026-06-26 00:46:27.219662'),
  (250, 8, 26, 'receive', 15, 'Historical import', '2026-06-26 00:46:27.227932'),
  (252, 8, 26, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.236812'),
  (208, 8, 27, 'receive', 4, 'Historical import', '2026-06-26 00:46:27.250899'),
  (213, 8, 27, 'receive', 2, 'Historical import', '2026-06-26 00:46:27.260311'),
  (214, 8, 27, 'receive', 1, 'Historical import', '2026-06-26 00:46:27.268746'),
  (216, 8, 27, 'receive', 2, 'Historical import', '2026-06-26 00:46:27.277721'),
  (237, 8, 27, 'receive', 15, 'Historical import', '2026-06-26 00:46:27.285792'),
  (249, 8, 27, 'receive', 50, 'Historical import', '2026-06-26 00:46:27.295832'),
  (209, 8, 28, 'receive', 4, 'Historical import', '2026-06-26 00:46:27.309069'),
  (246, 8, 28, 'receive', 40, 'Historical import', '2026-06-26 00:46:27.31962'),
  (210, 8, 29, 'receive', 15, 'Historical import', '2026-06-26 00:46:27.335124'),
  (210, 8, 30, 'receive', 5, 'Historical import', '2026-06-26 00:46:27.347348'),
  (220, 8, 30, 'receive', 50, 'Historical import', '2026-06-26 00:46:27.356736'),
  (228, 8, 30, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.366547'),
  (232, 8, 30, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.376896'),
  (239, 8, 30, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.388776'),
  (220, 8, 31, 'receive', 100, 'Historical import', '2026-06-26 00:46:27.403319'),
  (248, 8, 31, 'receive', 50, 'Historical import', '2026-06-26 00:46:27.410862'),
  (252, 8, 31, 'receive', 3, 'Historical import', '2026-06-26 00:46:27.421474'),
  (220, 8, 32, 'receive', 50, 'Historical import', '2026-06-26 00:46:27.434349'),
  (220, 8, 33, 'receive', 25, 'Historical import', '2026-06-26 00:46:27.445259'),
  (223, 8, 34, 'receive', 3, 'Historical import', '2026-06-26 00:46:27.456977'),
  (224, 8, 34, 'receive', 3, 'Historical import', '2026-06-26 00:46:27.465458'),
  (229, 8, 34, 'receive', 10, 'Historical import', '2026-06-26 00:46:27.473327'),
  (233, 8, 34, 'receive', 10, 'Historical import', '2026-06-26 00:46:27.484197'),
  (235, 8, 34, 'receive', 10, 'Historical import', '2026-06-26 00:46:27.492251'),
  (228, 8, 36, 'receive', 12, 'Historical import', '2026-06-26 00:46:27.510719'),
  (249, 8, 36, 'receive', 10, 'Historical import', '2026-06-26 00:46:27.519105'),
  (261, 10, 37, 'receive', 1, 'Historical import', '2026-06-26 00:46:27.585056'),
  (261, 10, 39, 'receive', 2, 'Historical import', '2026-06-26 00:46:27.629482'),
  (270, 10, 39, 'receive', 2, 'Historical import', '2026-06-26 00:46:27.637222'),
  (276, 10, 39, 'receive', 2, 'Historical import', '2026-06-26 00:46:27.645111'),
  (280, 10, 39, 'receive', 3, 'Historical import', '2026-06-26 00:46:27.652764'),
  (283, 10, 39, 'receive', 2, 'Historical import', '2026-06-26 00:46:27.661524'),
  (284, 10, 39, 'receive', 3, 'Historical import', '2026-06-26 00:46:27.672281'),
  (286, 10, 39, 'receive', 5, 'Historical import', '2026-06-26 00:46:27.681041'),
  (290, 10, 39, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.69112'),
  (293, 10, 39, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.700548'),
  (296, 10, 39, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.712637'),
  (303, 10, 39, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.727273'),
  (307, 10, 39, 'receive', 3, 'Historical import', '2026-06-26 00:46:27.741948'),
  (308, 10, 39, 'receive', 3, 'Historical import', '2026-06-26 00:46:27.751738'),
  (309, 10, 39, 'receive', 3, 'Historical import', '2026-06-26 00:46:27.761985'),
  (312, 10, 39, 'receive', 3, 'Historical import', '2026-06-26 00:46:27.77194'),
  (315, 10, 39, 'receive', 2, 'Historical import', '2026-06-26 00:46:27.784785'),
  (319, 10, 39, 'receive', 3, 'Historical import', '2026-06-26 00:46:27.797489'),
  (324, 10, 39, 'receive', 10, 'Historical import', '2026-06-26 00:46:27.807462'),
  (326, 10, 39, 'receive', 10, 'Historical import', '2026-06-26 00:46:27.817015'),
  (261, 10, 40, 'receive', 2, 'Historical import', '2026-06-26 00:46:27.83541'),
  (270, 10, 40, 'receive', 2, 'Historical import', '2026-06-26 00:46:27.846456'),
  (276, 10, 40, 'receive', 2, 'Historical import', '2026-06-26 00:46:27.855662'),
  (280, 10, 40, 'receive', 2, 'Historical import', '2026-06-26 00:46:27.86693'),
  (283, 10, 40, 'receive', 2, 'Historical import', '2026-06-26 00:46:27.876798'),
  (284, 10, 40, 'receive', 4, 'Historical import', '2026-06-26 00:46:27.887992'),
  (285, 10, 40, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.897037'),
  (286, 10, 40, 'receive', 5, 'Historical import', '2026-06-26 00:46:27.906946'),
  (290, 10, 40, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.917209'),
  (291, 10, 40, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.927075'),
  (293, 10, 40, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.936984'),
  (294, 10, 40, 'receive', 5, 'Historical import', '2026-06-26 00:46:27.954898'),
  (295, 10, 40, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.965482'),
  (296, 10, 40, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.975529'),
  (298, 10, 40, 'receive', 6, 'Historical import', '2026-06-26 00:46:27.990526'),
  (303, 10, 40, 'receive', 6, 'Historical import', '2026-06-26 00:46:28.00645'),
  (307, 10, 40, 'receive', 2, 'Historical import', '2026-06-26 00:46:28.016546'),
  (308, 10, 40, 'receive', 3, 'Historical import', '2026-06-26 00:46:28.026029'),
  (312, 10, 40, 'receive', 3, 'Historical import', '2026-06-26 00:46:28.035731'),
  (315, 10, 40, 'receive', 3, 'Historical import', '2026-06-26 00:46:28.045753'),
  (319, 10, 40, 'receive', 4, 'Historical import', '2026-06-26 00:46:28.055346'),
  (324, 10, 40, 'receive', 10, 'Historical import', '2026-06-26 00:46:28.065208'),
  (326, 10, 40, 'receive', 10, 'Historical import', '2026-06-26 00:46:28.074805'),
  (264, 10, 41, 'receive', 2, 'Historical import', '2026-06-26 00:46:28.098966'),
  (295, 10, 41, 'receive', 14, 'Historical import', '2026-06-26 00:46:28.110165'),
  (261, 10, 42, 'receive', 1, 'Historical import', '2026-06-26 00:46:28.126693'),
  (269, 10, 42, 'receive', 10, 'Historical import', '2026-06-26 00:46:28.13811'),
  (307, 10, 42, 'receive', 5, 'Historical import', '2026-06-26 00:46:28.287123'),
  (319, 10, 42, 'receive', 20, 'Historical import', '2026-06-26 00:46:28.298117'),
  (323, 10, 42, 'receive', 11, 'Historical import', '2026-06-26 00:46:28.311558'),
  (262, 10, 43, 'receive', 18, 'Historical import', '2026-06-26 00:46:28.326083'),
  (269, 10, 43, 'receive', 8, 'Historical import', '2026-06-26 00:46:28.334513'),
  (319, 10, 43, 'receive', 2, 'Historical import', '2026-06-26 00:46:28.343219'),
  (323, 10, 43, 'receive', 6, 'Historical import', '2026-06-26 00:46:28.353404'),
  (324, 10, 43, 'receive', 6, 'Historical import', '2026-06-26 00:46:28.362745'),
  (293, 10, 44, 'receive', 3, 'Historical import', '2026-06-26 00:46:28.377831'),
  (294, 10, 44, 'receive', 3, 'Historical import', '2026-06-26 00:46:28.387022'),
  (297, 10, 44, 'receive', 6, 'Historical import', '2026-06-26 00:46:28.510214'),
  (299, 10, 44, 'receive', 3, 'Historical import', '2026-06-26 00:46:28.520774'),
  (300, 10, 44, 'receive', 8, 'Historical import', '2026-06-26 00:46:28.53027'),
  (309, 10, 44, 'receive', 2, 'Historical import', '2026-06-26 00:46:28.539777'),
  (312, 10, 44, 'receive', 2, 'Historical import', '2026-06-26 00:46:28.550117'),
  (313, 10, 44, 'receive', 3, 'Historical import', '2026-06-26 00:46:28.561729'),
  (319, 10, 44, 'receive', 3, 'Historical import', '2026-06-26 00:46:28.570498'),
  (324, 10, 44, 'receive', 5, 'Historical import', '2026-06-26 00:46:28.588746'),
  (290, 10, 45, 'receive', 2, 'Historical import', '2026-06-26 00:46:28.606223'),
  (291, 10, 45, 'receive', 3, 'Historical import', '2026-06-26 00:46:28.616698'),
  (294, 10, 45, 'receive', 3, 'Historical import', '2026-06-26 00:46:28.625672'),
  (296, 10, 45, 'receive', 3, 'Historical import', '2026-06-26 00:46:28.634213'),
  (298, 10, 45, 'receive', 6, 'Historical import', '2026-06-26 00:46:28.643501'),
  (302, 10, 45, 'receive', 4, 'Historical import', '2026-06-26 00:46:28.651786'),
  (305, 10, 45, 'receive', 2, 'Historical import', '2026-06-26 00:46:28.660914'),
  (319, 10, 45, 'receive', 3, 'Historical import', '2026-06-26 00:46:28.669603'),
  (291, 10, 47, 'receive', 5, 'Historical import', '2026-06-26 00:46:28.697292'),
  (295, 10, 47, 'receive', 5, 'Historical import', '2026-06-26 00:46:28.705477'),
  (302, 10, 47, 'receive', 5, 'Historical import', '2026-06-26 00:46:28.713924'),
  (324, 10, 47, 'receive', 9, 'Historical import', '2026-06-26 00:46:28.722251'),
  (269, 10, 48, 'receive', 2, 'Historical import', '2026-06-26 00:46:28.736218'),
  (291, 10, 48, 'receive', 5, 'Historical import', '2026-06-26 00:46:28.745483'),
  (294, 10, 48, 'receive', 5, 'Historical import', '2026-06-26 00:46:28.754292'),
  (300, 10, 48, 'receive', 4, 'Historical import', '2026-06-26 00:46:28.76406'),
  (309, 10, 48, 'receive', 3, 'Historical import', '2026-06-26 00:46:28.77253'),
  (311, 10, 48, 'receive', 4, 'Historical import', '2026-06-26 00:46:28.781895'),
  (324, 10, 48, 'receive', 10, 'Historical import', '2026-06-26 00:46:28.793064'),
  (326, 10, 48, 'receive', 11, 'Historical import', '2026-06-26 00:46:28.806327'),
  (269, 10, 49, 'receive', 2, 'Historical import', '2026-06-26 00:46:28.821669'),
  (314, 10, 49, 'receive', 6, 'Historical import', '2026-06-26 00:46:28.836559'),
  (319, 10, 49, 'receive', 4, 'Historical import', '2026-06-26 00:46:28.846522'),
  (321, 10, 49, 'receive', 2, 'Historical import', '2026-06-26 00:46:28.855812'),
  (324, 10, 49, 'receive', 10, 'Historical import', '2026-06-26 00:46:28.864995'),
  (325, 10, 49, 'receive', 2, 'Historical import', '2026-06-26 00:46:28.87385'),
  (326, 10, 49, 'receive', 10, 'Historical import', '2026-06-26 00:46:28.883196'),
  (269, 10, 50, 'receive', 1, 'Historical import', '2026-06-26 00:46:28.900488'),
  (313, 10, 50, 'receive', 3, 'Historical import', '2026-06-26 00:46:28.911332'),
  (269, 10, 51, 'receive', 4, 'Historical import', '2026-06-26 00:46:28.930956'),
  (314, 10, 51, 'receive', 10, 'Historical import', '2026-06-26 00:46:28.939541'),
  (319, 10, 51, 'receive', 4, 'Historical import', '2026-06-26 00:46:28.949758'),
  (269, 10, 52, 'receive', 2, 'Historical import', '2026-06-26 00:46:28.962527'),
  (314, 10, 52, 'receive', 3, 'Historical import', '2026-06-26 00:46:28.975269'),
  (326, 10, 52, 'receive', 6, 'Historical import', '2026-06-26 00:46:28.98756'),
  (269, 10, 53, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.006781'),
  (317, 10, 53, 'receive', 6, 'Historical import', '2026-06-26 00:46:29.031059'),
  (319, 10, 53, 'receive', 3, 'Historical import', '2026-06-26 00:46:29.041083'),
  (275, 10, 54, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.057414'),
  (291, 10, 54, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.066318'),
  (296, 10, 54, 'receive', 3, 'Historical import', '2026-06-26 00:46:29.074822'),
  (314, 10, 54, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.084721'),
  (320, 10, 54, 'receive', 3, 'Historical import', '2026-06-26 00:46:29.097001'),
  (324, 10, 54, 'receive', 5, 'Historical import', '2026-06-26 00:46:29.105659'),
  (291, 10, 55, 'receive', 8, 'Historical import', '2026-06-26 00:46:29.118413'),
  (310, 10, 55, 'receive', 22, 'Historical import', '2026-06-26 00:46:29.127406'),
  (314, 10, 55, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.136968'),
  (316, 10, 55, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.145386'),
  (317, 10, 55, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.154826'),
  (320, 10, 55, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.163901'),
  (324, 10, 55, 'receive', 5, 'Historical import', '2026-06-26 00:46:29.173268'),
  (326, 10, 55, 'receive', 12, 'Historical import', '2026-06-26 00:46:29.182104'),
  (327, 10, 55, 'receive', 4, 'Historical import', '2026-06-26 00:46:29.191816'),
  (305, 10, 56, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.205075'),
  (311, 10, 56, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.21362'),
  (312, 10, 56, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.222977'),
  (290, 10, 57, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.23914'),
  (293, 10, 57, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.256519'),
  (313, 10, 57, 'receive', 3, 'Historical import', '2026-06-26 00:46:29.705516'),
  (317, 10, 57, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.714943'),
  (294, 10, 58, 'receive', 4, 'Historical import', '2026-06-26 00:46:29.7289'),
  (296, 10, 58, 'receive', 6, 'Historical import', '2026-06-26 00:46:29.739779'),
  (300, 10, 58, 'receive', 5, 'Historical import', '2026-06-26 00:46:29.749422'),
  (311, 10, 58, 'receive', 3, 'Historical import', '2026-06-26 00:46:29.758914'),
  (312, 10, 58, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.7686'),
  (305, 10, 58, 'receive', 4, 'Historical import', '2026-06-26 00:46:29.778127'),
  (314, 10, 58, 'receive', 5, 'Historical import', '2026-06-26 00:46:29.789463'),
  (323, 10, 58, 'receive', 12, 'Historical import', '2026-06-26 00:46:29.800466'),
  (320, 10, 60, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.835392'),
  (325, 10, 60, 'receive', 6, 'Historical import', '2026-06-26 00:46:29.850996'),
  (326, 10, 60, 'receive', 5, 'Historical import', '2026-06-26 00:46:29.861241'),
  (328, 11, 63, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.894868'),
  (332, 11, 63, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.903636'),
  (333, 11, 63, 'receive', 3, 'Historical import', '2026-06-26 00:46:29.913676'),
  (336, 11, 63, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.922997'),
  (347, 11, 63, 'receive', 20, 'Historical import', '2026-06-26 00:46:29.933108'),
  (348, 11, 63, 'receive', 20, 'Historical import', '2026-06-26 00:46:29.942813'),
  (328, 11, 64, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.958072'),
  (333, 11, 64, 'receive', 3, 'Historical import', '2026-06-26 00:46:29.968131'),
  (336, 11, 64, 'receive', 3, 'Historical import', '2026-06-26 00:46:29.97725'),
  (343, 11, 64, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.987779'),
  (344, 11, 64, 'receive', 2, 'Historical import', '2026-06-26 00:46:29.997784'),
  (328, 11, 65, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.011109'),
  (333, 11, 65, 'receive', 3, 'Historical import', '2026-06-26 00:46:30.020539'),
  (336, 11, 65, 'receive', 3, 'Historical import', '2026-06-26 00:46:30.029691'),
  (343, 11, 65, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.038061'),
  (344, 11, 65, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.048168'),
  (336, 11, 66, 'receive', 3, 'Historical import', '2026-06-26 00:46:30.070564'),
  (331, 11, 68, 'receive', 5, 'Historical import', '2026-06-26 00:46:30.125669'),
  (338, 11, 68, 'receive', 5, 'Historical import', '2026-06-26 00:46:30.134491'),
  (339, 11, 68, 'receive', 1, 'Historical import', '2026-06-26 00:46:30.143653'),
  (340, 11, 68, 'receive', 1, 'Historical import', '2026-06-26 00:46:30.151751'),
  (347, 11, 68, 'receive', 1, 'Historical import', '2026-06-26 00:46:30.161133'),
  (329, 11, 69, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.175183'),
  (330, 11, 69, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.183866'),
  (344, 11, 69, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.206245'),
  (346, 11, 69, 'receive', 10, 'Historical import', '2026-06-26 00:46:30.214654'),
  (348, 11, 69, 'receive', 10, 'Historical import', '2026-06-26 00:46:30.224745'),
  (331, 11, 70, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.237946'),
  (338, 11, 70, 'receive', 3, 'Historical import', '2026-06-26 00:46:30.246613'),
  (344, 11, 70, 'receive', 4, 'Historical import', '2026-06-26 00:46:30.256274'),
  (347, 11, 70, 'receive', 12, 'Historical import', '2026-06-26 00:46:30.264593'),
  (348, 11, 70, 'receive', 12, 'Historical import', '2026-06-26 00:46:30.274389'),
  (331, 11, 71, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.287904'),
  (336, 11, 71, 'receive', 3, 'Historical import', '2026-06-26 00:46:30.30266'),
  (338, 11, 71, 'receive', 3, 'Historical import', '2026-06-26 00:46:30.311482'),
  (343, 11, 71, 'receive', 3, 'Historical import', '2026-06-26 00:46:30.321693'),
  (346, 11, 71, 'receive', 15, 'Historical import', '2026-06-26 00:46:30.333042'),
  (333, 11, 72, 'receive', 5, 'Historical import', '2026-06-26 00:46:30.352506'),
  (338, 11, 72, 'receive', 5, 'Historical import', '2026-06-26 00:46:30.362098'),
  (343, 11, 72, 'receive', 1, 'Historical import', '2026-06-26 00:46:30.372392'),
  (347, 11, 72, 'receive', 12, 'Historical import', '2026-06-26 00:46:30.381139'),
  (336, 11, 73, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.399793'),
  (343, 11, 73, 'receive', 4, 'Historical import', '2026-06-26 00:46:30.408373'),
  (348, 11, 73, 'receive', 20, 'Historical import', '2026-06-26 00:46:30.423727'),
  (348, 11, 73, 'receive', 3, 'Historical import', '2026-06-26 00:46:30.432427'),
  (336, 11, 74, 'receive', 3, 'Historical import', '2026-06-26 00:46:30.446473'),
  (338, 11, 74, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.456641'),
  (338, 11, 75, 'receive', 3, 'Historical import', '2026-06-26 00:46:30.471354'),
  (344, 11, 75, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.480538'),
  (348, 11, 75, 'receive', 6, 'Historical import', '2026-06-26 00:46:30.489528'),
  (338, 11, 76, 'receive', 3, 'Historical import', '2026-06-26 00:46:30.503297'),
  (343, 11, 76, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.511971'),
  (344, 11, 76, 'receive', 4, 'Historical import', '2026-06-26 00:46:30.522001'),
  (347, 11, 76, 'receive', 12, 'Historical import', '2026-06-26 00:46:30.531058'),
  (348, 11, 76, 'receive', 12, 'Historical import', '2026-06-26 00:46:30.540418'),
  (349, 12, 78, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.717295'),
  (351, 12, 78, 'receive', 26, 'Historical import', '2026-06-26 00:46:30.727285'),
  (353, 12, 78, 'receive', 200, 'Historical import', '2026-06-26 00:46:30.736261'),
  (354, 12, 78, 'receive', 40, 'Historical import', '2026-06-26 00:46:30.745408'),
  (349, 12, 79, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.760334'),
  (351, 12, 79, 'receive', 29, 'Historical import', '2026-06-26 00:46:30.769853'),
  (353, 12, 79, 'receive', 180, 'Historical import', '2026-06-26 00:46:30.779371'),
  (354, 12, 79, 'receive', 65, 'Historical import', '2026-06-26 00:46:30.788361'),
  (349, 12, 80, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.804545'),
  (351, 12, 80, 'receive', 30, 'Historical import', '2026-06-26 00:46:30.818123'),
  (353, 12, 80, 'receive', 230, 'Historical import', '2026-06-26 00:46:30.827455'),
  (354, 12, 80, 'receive', 100, 'Historical import', '2026-06-26 00:46:30.836876'),
  (349, 12, 81, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.851068'),
  (351, 12, 81, 'receive', 28, 'Historical import', '2026-06-26 00:46:30.86003'),
  (353, 12, 81, 'receive', 230, 'Historical import', '2026-06-26 00:46:30.871464'),
  (354, 12, 81, 'receive', 100, 'Historical import', '2026-06-26 00:46:30.880801'),
  (349, 12, 82, 'receive', 1, 'Historical import', '2026-06-26 00:46:30.894863'),
  (353, 12, 82, 'receive', 150, 'Historical import', '2026-06-26 00:46:30.904259'),
  (354, 12, 82, 'receive', 75, 'Historical import', '2026-06-26 00:46:30.913833'),
  (349, 12, 83, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.933166'),
  (351, 12, 83, 'receive', 33, 'Historical import', '2026-06-26 00:46:30.942501'),
  (353, 12, 83, 'receive', 250, 'Historical import', '2026-06-26 00:46:30.951921'),
  (354, 12, 83, 'receive', 80, 'Historical import', '2026-06-26 00:46:30.963756'),
  (349, 12, 84, 'receive', 2, 'Historical import', '2026-06-26 00:46:30.978999'),
  (351, 12, 84, 'receive', 33, 'Historical import', '2026-06-26 00:46:30.988999'),
  (353, 12, 84, 'receive', 300, 'Historical import', '2026-06-26 00:46:30.997947'),
  (354, 12, 84, 'receive', 95, 'Historical import', '2026-06-26 00:46:31.007442'),
  (349, 12, 85, 'receive', 3, 'Historical import', '2026-06-26 00:46:31.02243'),
  (351, 12, 85, 'receive', 35, 'Historical import', '2026-06-26 00:46:31.031288'),
  (353, 12, 85, 'receive', 300, 'Historical import', '2026-06-26 00:46:31.041154'),
  (354, 12, 85, 'receive', 75, 'Historical import', '2026-06-26 00:46:31.050088'),
  (349, 12, 86, 'receive', 4, 'Historical import', '2026-06-26 00:46:31.063547'),
  (351, 12, 86, 'receive', 36, 'Historical import', '2026-06-26 00:46:31.074931'),
  (352, 12, 86, 'receive', 6, 'Historical import', '2026-06-26 00:46:31.083814'),
  (353, 12, 86, 'receive', 300, 'Historical import', '2026-06-26 00:46:31.094294'),
  (354, 12, 86, 'receive', 90, 'Historical import', '2026-06-26 00:46:31.103508'),
  (349, 12, 87, 'receive', 5, 'Historical import', '2026-06-26 00:46:31.117217'),
  (351, 12, 87, 'receive', 30, 'Historical import', '2026-06-26 00:46:31.126971'),
  (352, 12, 87, 'receive', 6, 'Historical import', '2026-06-26 00:46:31.135805'),
  (353, 12, 87, 'receive', 250, 'Historical import', '2026-06-26 00:46:31.149161'),
  (354, 12, 87, 'receive', 70, 'Historical import', '2026-06-26 00:46:31.159484'),
  (349, 12, 88, 'receive', 3, 'Historical import', '2026-06-26 00:46:31.173217'),
  (351, 12, 88, 'receive', 30, 'Historical import', '2026-06-26 00:46:31.183025'),
  (353, 12, 88, 'receive', 250, 'Historical import', '2026-06-26 00:46:31.193382'),
  (354, 12, 88, 'receive', 70, 'Historical import', '2026-06-26 00:46:31.20288'),
  (349, 12, 89, 'receive', 3, 'Historical import', '2026-06-26 00:46:31.216143'),
  (351, 12, 89, 'receive', 30, 'Historical import', '2026-06-26 00:46:31.224788'),
  (353, 12, 89, 'receive', 200, 'Historical import', '2026-06-26 00:46:31.235737'),
  (354, 12, 89, 'receive', 65, 'Historical import', '2026-06-26 00:46:31.244764'),
  (349, 12, 90, 'receive', 5, 'Historical import', '2026-06-26 00:46:31.257793'),
  (351, 12, 90, 'receive', 26, 'Historical import', '2026-06-26 00:46:31.266878'),
  (353, 12, 90, 'receive', 150, 'Historical import', '2026-06-26 00:46:31.274971'),
  (354, 12, 90, 'receive', 50, 'Historical import', '2026-06-26 00:46:31.284'),
  (349, 12, 91, 'receive', 10, 'Historical import', '2026-06-26 00:46:31.300123'),
  (351, 12, 91, 'receive', 39, 'Historical import', '2026-06-26 00:46:31.312397'),
  (353, 12, 91, 'receive', 250, 'Historical import', '2026-06-26 00:46:31.321562'),
  (354, 12, 91, 'receive', 100, 'Historical import', '2026-06-26 00:46:31.330614'),
  (349, 12, 92, 'receive', 3, 'Historical import', '2026-06-26 00:46:31.344058'),
  (351, 12, 92, 'receive', 30, 'Historical import', '2026-06-26 00:46:31.353909'),
  (353, 12, 92, 'receive', 200, 'Historical import', '2026-06-26 00:46:31.362996'),
  (354, 12, 92, 'receive', 75, 'Historical import', '2026-06-26 00:46:31.372145'),
  (349, 12, 93, 'receive', 4, 'Historical import', '2026-06-26 00:46:31.388602'),
  (350, 12, 93, 'receive', 2, 'Historical import', '2026-06-26 00:46:31.398369'),
  (351, 12, 93, 'receive', 33, 'Historical import', '2026-06-26 00:46:31.408545'),
  (353, 12, 93, 'receive', 250, 'Historical import', '2026-06-26 00:46:31.417474'),
  (354, 12, 93, 'receive', 60, 'Historical import', '2026-06-26 00:46:31.426661'),
  (349, 12, 94, 'receive', 3, 'Historical import', '2026-06-26 00:46:31.440814'),
  (350, 12, 94, 'receive', 2, 'Historical import', '2026-06-26 00:46:31.454056'),
  (351, 12, 94, 'receive', 30, 'Historical import', '2026-06-26 00:46:31.463133'),
  (353, 12, 94, 'receive', 200, 'Historical import', '2026-06-26 00:46:31.473689'),
  (354, 12, 94, 'receive', 60, 'Historical import', '2026-06-26 00:46:31.482787'),
  (349, 12, 95, 'receive', 10, 'Historical import', '2026-06-26 00:46:31.498603'),
  (350, 12, 95, 'receive', 2, 'Historical import', '2026-06-26 00:46:31.507594'),
  (351, 12, 95, 'receive', 25, 'Historical import', '2026-06-26 00:46:31.519304'),
  (353, 12, 95, 'receive', 160, 'Historical import', '2026-06-26 00:46:31.530204'),
  (354, 12, 95, 'receive', 40, 'Historical import', '2026-06-26 00:46:31.539537'),
  (349, 12, 96, 'receive', 5, 'Historical import', '2026-06-26 00:46:31.552449'),
  (350, 12, 96, 'receive', 2, 'Historical import', '2026-06-26 00:46:31.651901'),
  (351, 12, 96, 'receive', 25, 'Historical import', '2026-06-26 00:46:31.661279'),
  (353, 12, 96, 'receive', 200, 'Historical import', '2026-06-26 00:46:31.670184'),
  (354, 12, 96, 'receive', 50, 'Historical import', '2026-06-26 00:46:31.679409'),
  (349, 12, 97, 'receive', 8, 'Historical import', '2026-06-26 00:46:31.694428'),
  (350, 12, 97, 'receive', 1, 'Historical import', '2026-06-26 00:46:31.703355'),
  (351, 12, 97, 'receive', 20, 'Historical import', '2026-06-26 00:46:31.712466'),
  (353, 12, 97, 'receive', 150, 'Historical import', '2026-06-26 00:46:31.721677'),
  (354, 12, 97, 'receive', 40, 'Historical import', '2026-06-26 00:46:31.731072'),
  (349, 12, 98, 'receive', 2, 'Historical import', '2026-06-26 00:46:31.745876'),
  (351, 12, 98, 'receive', 20, 'Historical import', '2026-06-26 00:46:31.754742'),
  (353, 12, 98, 'receive', 175, 'Historical import', '2026-06-26 00:46:31.764187'),
  (354, 12, 98, 'receive', 80, 'Historical import', '2026-06-26 00:46:31.772978'),
  (349, 12, 99, 'receive', 3, 'Historical import', '2026-06-26 00:46:31.786623'),
  (350, 12, 99, 'receive', 1, 'Historical import', '2026-06-26 00:46:31.796312'),
  (351, 12, 99, 'receive', 25, 'Historical import', '2026-06-26 00:46:31.806113'),
  (353, 12, 99, 'receive', 200, 'Historical import', '2026-06-26 00:46:31.814887'),
  (354, 12, 99, 'receive', 100, 'Historical import', '2026-06-26 00:46:31.825275'),
  (351, 12, 100, 'receive', 20, 'Historical import', '2026-06-26 00:46:31.843142'),
  (353, 12, 100, 'receive', 200, 'Historical import', '2026-06-26 00:46:31.852347'),
  (354, 12, 100, 'receive', 80, 'Historical import', '2026-06-26 00:46:31.862162'),
  (351, 12, 101, 'receive', 25, 'Historical import', '2026-06-26 00:46:31.87651'),
  (353, 12, 101, 'receive', 250, 'Historical import', '2026-06-26 00:46:31.887759'),
  (354, 12, 101, 'receive', 80, 'Historical import', '2026-06-26 00:46:31.897469'),
  (351, 12, 102, 'receive', 25, 'Historical import', '2026-06-26 00:46:31.911794'),
  (353, 12, 102, 'receive', 200, 'Historical import', '2026-06-26 00:46:31.920815'),
  (354, 12, 102, 'receive', 70, 'Historical import', '2026-06-26 00:46:31.93044'),
  (355, 13, 105, 'receive', 5, 'Historical import', '2026-06-26 00:46:32.023478'),
  (368, 13, 105, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.035163'),
  (375, 13, 105, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.04453'),
  (382, 13, 105, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.055011'),
  (392, 13, 105, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.064487'),
  (393, 13, 105, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.078244'),
  (405, 13, 105, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.088615'),
  (410, 13, 105, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.098212'),
  (413, 13, 105, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.106455'),
  (414, 13, 105, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.115921'),
  (422, 13, 105, 'receive', 15, 'Historical import', '2026-06-26 00:46:32.123905'),
  (355, 13, 106, 'receive', 5, 'Historical import', '2026-06-26 00:46:32.137751'),
  (373, 13, 106, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.150313'),
  (384, 13, 106, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.166653'),
  (388, 13, 106, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.176047'),
  (389, 13, 106, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.185304'),
  (422, 13, 106, 'receive', 15, 'Historical import', '2026-06-26 00:46:32.195859'),
  (355, 13, 107, 'receive', 5, 'Historical import', '2026-06-26 00:46:32.209209'),
  (373, 13, 107, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.222241'),
  (381, 13, 107, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.23195'),
  (386, 13, 107, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.246774'),
  (416, 13, 107, 'receive', 1, 'Historical import', '2026-06-26 00:46:32.256889'),
  (419, 13, 107, 'receive', 1, 'Historical import', '2026-06-26 00:46:32.265449'),
  (355, 13, 108, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.27848'),
  (358, 13, 108, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.287852'),
  (359, 13, 108, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.2972'),
  (371, 13, 108, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.30681'),
  (382, 13, 108, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.320562'),
  (388, 13, 108, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.334333'),
  (391, 13, 108, 'receive', 4, 'Historical import', '2026-06-26 00:46:32.343414'),
  (396, 13, 108, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.352807'),
  (408, 13, 108, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.36173'),
  (409, 13, 108, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.371449'),
  (416, 13, 108, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.379786'),
  (419, 13, 108, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.389862'),
  (421, 13, 108, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.399039'),
  (422, 13, 108, 'receive', 10, 'Historical import', '2026-06-26 00:46:32.408949'),
  (355, 13, 109, 'receive', 9, 'Historical import', '2026-06-26 00:46:32.422822'),
  (369, 13, 109, 'receive', 7, 'Historical import', '2026-06-26 00:46:32.431467'),
  (375, 13, 109, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.441367'),
  (381, 13, 109, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.449664'),
  (382, 13, 109, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.460277'),
  (385, 13, 109, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.470285'),
  (388, 13, 109, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.479122'),
  (393, 13, 109, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.492457'),
  (396, 13, 109, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.505926'),
  (405, 13, 109, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.515894'),
  (411, 13, 109, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.524382'),
  (412, 13, 109, 'receive', 1, 'Historical import', '2026-06-26 00:46:32.534755'),
  (416, 13, 109, 'receive', 1, 'Historical import', '2026-06-26 00:46:32.542976'),
  (419, 13, 109, 'receive', 1, 'Historical import', '2026-06-26 00:46:32.550748'),
  (421, 13, 109, 'receive', 1, 'Historical import', '2026-06-26 00:46:32.560725'),
  (422, 13, 109, 'receive', 15, 'Historical import', '2026-06-26 00:46:32.569158'),
  (355, 13, 110, 'receive', 4, 'Historical import', '2026-06-26 00:46:32.58118'),
  (373, 13, 110, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.589217'),
  (375, 13, 110, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.598401'),
  (382, 13, 110, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.608412'),
  (388, 13, 110, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.619933'),
  (391, 13, 110, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.628862'),
  (396, 13, 110, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.637147'),
  (422, 13, 110, 'receive', 15, 'Historical import', '2026-06-26 00:46:32.645361'),
  (355, 13, 111, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.658474'),
  (362, 13, 111, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.666941'),
  (369, 13, 111, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.675092'),
  (375, 13, 111, 'receive', 5, 'Historical import', '2026-06-26 00:46:32.683156'),
  (388, 13, 111, 'receive', 5, 'Historical import', '2026-06-26 00:46:32.691651'),
  (389, 13, 111, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.704261'),
  (392, 13, 111, 'receive', 5, 'Historical import', '2026-06-26 00:46:32.712801'),
  (396, 13, 111, 'receive', 5, 'Historical import', '2026-06-26 00:46:32.721902'),
  (405, 13, 111, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.730637'),
  (416, 13, 111, 'receive', 1, 'Historical import', '2026-06-26 00:46:32.738972'),
  (421, 13, 111, 'receive', 1, 'Historical import', '2026-06-26 00:46:32.747605'),
  (422, 13, 111, 'receive', 20, 'Historical import', '2026-06-26 00:46:32.756061'),
  (355, 13, 112, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.768259'),
  (357, 13, 112, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.777316'),
  (404, 13, 112, 'receive', 1, 'Historical import', '2026-06-26 00:46:32.786923'),
  (406, 13, 112, 'receive', 1, 'Historical import', '2026-06-26 00:46:32.796457'),
  (410, 13, 112, 'receive', 5, 'Historical import', '2026-06-26 00:46:32.805235'),
  (412, 13, 112, 'receive', 1, 'Historical import', '2026-06-26 00:46:32.813984'),
  (416, 13, 112, 'receive', 2, 'Historical import', '2026-06-26 00:46:32.823032'),
  (419, 13, 112, 'receive', 1, 'Historical import', '2026-06-26 00:46:32.832136'),
  (421, 13, 112, 'receive', 1, 'Historical import', '2026-06-26 00:46:32.84175'),
  (422, 13, 112, 'receive', 20, 'Historical import', '2026-06-26 00:46:32.850157'),
  (355, 13, 113, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.86191'),
  (369, 13, 113, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.87033'),
  (385, 13, 113, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.880941'),
  (386, 13, 113, 'receive', 5, 'Historical import', '2026-06-26 00:46:32.88915'),
  (388, 13, 113, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.897374'),
  (393, 13, 113, 'receive', 4, 'Historical import', '2026-06-26 00:46:32.906425'),
  (398, 13, 113, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.914751'),
  (406, 13, 113, 'receive', 4, 'Historical import', '2026-06-26 00:46:32.923067'),
  (408, 13, 113, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.931991'),
  (411, 13, 113, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.940112'),
  (412, 13, 113, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.948865'),
  (416, 13, 113, 'receive', 1, 'Historical import', '2026-06-26 00:46:32.958092'),
  (419, 13, 113, 'receive', 1, 'Historical import', '2026-06-26 00:46:32.966789'),
  (422, 13, 113, 'receive', 15, 'Historical import', '2026-06-26 00:46:32.979737'),
  (355, 13, 114, 'receive', 3, 'Historical import', '2026-06-26 00:46:32.99413'),
  (356, 13, 114, 'receive', 1, 'Historical import', '2026-06-26 00:46:33.002401'),
  (362, 13, 114, 'receive', 1, 'Historical import', '2026-06-26 00:46:33.010685'),
  (363, 13, 114, 'receive', 1, 'Historical import', '2026-06-26 00:46:33.019722'),
  (372, 13, 114, 'receive', 5, 'Historical import', '2026-06-26 00:46:33.03206'),
  (381, 13, 114, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.040638'),
  (385, 13, 114, 'receive', 5, 'Historical import', '2026-06-26 00:46:33.206133'),
  (386, 13, 114, 'receive', 3, 'Historical import', '2026-06-26 00:46:33.21609'),
  (389, 13, 114, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.226688'),
  (394, 13, 114, 'receive', 3, 'Historical import', '2026-06-26 00:46:33.235767'),
  (396, 13, 114, 'receive', 5, 'Historical import', '2026-06-26 00:46:33.244955'),
  (406, 13, 114, 'receive', 3, 'Historical import', '2026-06-26 00:46:33.253486'),
  (422, 13, 114, 'receive', 15, 'Historical import', '2026-06-26 00:46:33.263753'),
  (355, 13, 115, 'receive', 20, 'Historical import', '2026-06-26 00:46:33.277312'),
  (357, 13, 115, 'receive', 1, 'Historical import', '2026-06-26 00:46:33.289902'),
  (369, 13, 115, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.299403'),
  (372, 13, 115, 'receive', 3, 'Historical import', '2026-06-26 00:46:33.308205'),
  (386, 13, 115, 'receive', 3, 'Historical import', '2026-06-26 00:46:33.316765'),
  (389, 13, 115, 'receive', 4, 'Historical import', '2026-06-26 00:46:33.328315'),
  (415, 13, 115, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.339214'),
  (416, 13, 115, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.348564'),
  (418, 13, 115, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.358082'),
  (419, 13, 115, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.366752'),
  (421, 13, 115, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.37698'),
  (422, 13, 115, 'receive', 20, 'Historical import', '2026-06-26 00:46:33.385544'),
  (355, 13, 116, 'receive', 5, 'Historical import', '2026-06-26 00:46:33.398519'),
  (369, 13, 116, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.408003'),
  (378, 13, 116, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.417829'),
  (387, 13, 116, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.428635'),
  (391, 13, 116, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.437255'),
  (399, 13, 116, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.4465'),
  (416, 13, 116, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.454834'),
  (419, 13, 116, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.467398'),
  (421, 13, 116, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.482147'),
  (422, 13, 116, 'receive', 25, 'Historical import', '2026-06-26 00:46:33.492437'),
  (355, 13, 117, 'receive', 5, 'Historical import', '2026-06-26 00:46:33.508284'),
  (369, 13, 117, 'receive', 3, 'Historical import', '2026-06-26 00:46:33.524495'),
  (385, 13, 117, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.649394'),
  (387, 13, 117, 'receive', 1, 'Historical import', '2026-06-26 00:46:33.659109'),
  (397, 13, 117, 'receive', 3, 'Historical import', '2026-06-26 00:46:33.668184'),
  (416, 13, 117, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.676624'),
  (422, 13, 117, 'receive', 20, 'Historical import', '2026-06-26 00:46:33.686996'),
  (355, 13, 118, 'receive', 5, 'Historical import', '2026-06-26 00:46:33.700843'),
  (357, 13, 118, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.711295'),
  (416, 13, 118, 'receive', 4, 'Historical import', '2026-06-26 00:46:33.720966'),
  (419, 13, 118, 'receive', 3, 'Historical import', '2026-06-26 00:46:33.730488'),
  (421, 13, 118, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.739941'),
  (422, 13, 118, 'receive', 25, 'Historical import', '2026-06-26 00:46:33.749158'),
  (355, 13, 119, 'receive', 4, 'Historical import', '2026-06-26 00:46:33.763574'),
  (416, 13, 119, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.772224'),
  (419, 13, 119, 'receive', 1, 'Historical import', '2026-06-26 00:46:33.781311'),
  (421, 13, 119, 'receive', 3, 'Historical import', '2026-06-26 00:46:33.79062'),
  (422, 13, 119, 'receive', 15, 'Historical import', '2026-06-26 00:46:33.799755'),
  (355, 13, 120, 'receive', 4, 'Historical import', '2026-06-26 00:46:33.813705'),
  (356, 13, 120, 'receive', 1, 'Historical import', '2026-06-26 00:46:33.822384'),
  (357, 13, 120, 'receive', 1, 'Historical import', '2026-06-26 00:46:33.830934'),
  (369, 13, 120, 'receive', 1, 'Historical import', '2026-06-26 00:46:33.838784'),
  (406, 13, 120, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.847421'),
  (411, 13, 120, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.857335'),
  (422, 13, 120, 'receive', 15, 'Historical import', '2026-06-26 00:46:33.86619'),
  (355, 13, 121, 'receive', 5, 'Historical import', '2026-06-26 00:46:33.879141'),
  (356, 13, 121, 'receive', 1, 'Historical import', '2026-06-26 00:46:33.888006'),
  (357, 13, 121, 'receive', 1, 'Historical import', '2026-06-26 00:46:33.89712'),
  (369, 13, 121, 'receive', 6, 'Historical import', '2026-06-26 00:46:33.908551'),
  (405, 13, 121, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.917439'),
  (411, 13, 121, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.925721'),
  (417, 13, 121, 'receive', 1, 'Historical import', '2026-06-26 00:46:33.934629'),
  (422, 13, 121, 'receive', 15, 'Historical import', '2026-06-26 00:46:33.942657'),
  (355, 13, 122, 'receive', 5, 'Historical import', '2026-06-26 00:46:33.957985'),
  (357, 13, 122, 'receive', 1, 'Historical import', '2026-06-26 00:46:33.966678'),
  (369, 13, 122, 'receive', 2, 'Historical import', '2026-06-26 00:46:33.974743'),
  (391, 13, 122, 'receive', 3, 'Historical import', '2026-06-26 00:46:33.983799'),
  (417, 13, 122, 'receive', 1, 'Historical import', '2026-06-26 00:46:33.992208'),
  (422, 13, 122, 'receive', 10, 'Historical import', '2026-06-26 00:46:34.001525'),
  (355, 13, 123, 'receive', 5, 'Historical import', '2026-06-26 00:46:34.01454'),
  (388, 13, 123, 'receive', 3, 'Historical import', '2026-06-26 00:46:34.028381'),
  (391, 13, 123, 'receive', 2, 'Historical import', '2026-06-26 00:46:34.040323'),
  (397, 13, 123, 'receive', 3, 'Historical import', '2026-06-26 00:46:34.052268'),
  (398, 13, 123, 'receive', 3, 'Historical import', '2026-06-26 00:46:34.061551'),
  (417, 13, 123, 'receive', 2, 'Historical import', '2026-06-26 00:46:34.069736'),
  (422, 13, 123, 'receive', 14, 'Historical import', '2026-06-26 00:46:34.082775'),
  (355, 13, 124, 'receive', 1, 'Historical import', '2026-06-26 00:46:34.095837'),
  (375, 13, 124, 'receive', 3, 'Historical import', '2026-06-26 00:46:34.104842'),
  (383, 13, 124, 'receive', 3, 'Historical import', '2026-06-26 00:46:34.113836'),
  (388, 13, 124, 'receive', 3, 'Historical import', '2026-06-26 00:46:34.12218'),
  (397, 13, 124, 'receive', 2, 'Historical import', '2026-06-26 00:46:34.130982'),
  (401, 13, 124, 'receive', 2, 'Historical import', '2026-06-26 00:46:34.13932'),
  (422, 13, 124, 'receive', 10, 'Historical import', '2026-06-26 00:46:34.148989'),
  (369, 13, 125, 'receive', 2, 'Historical import', '2026-06-26 00:46:34.161225'),
  (389, 13, 125, 'receive', 3, 'Historical import', '2026-06-26 00:46:34.16948'),
  (400, 13, 125, 'receive', 3, 'Historical import', '2026-06-26 00:46:34.17834'),
  (416, 13, 125, 'receive', 2, 'Historical import', '2026-06-26 00:46:34.186513'),
  (422, 13, 125, 'receive', 10, 'Historical import', '2026-06-26 00:46:34.196358'),
  (369, 13, 126, 'receive', 7, 'Historical import', '2026-06-26 00:46:34.208782'),
  (388, 13, 126, 'receive', 5, 'Historical import', '2026-06-26 00:46:34.216886'),
  (408, 13, 126, 'receive', 3, 'Historical import', '2026-06-26 00:46:34.401717'),
  (411, 13, 126, 'receive', 3, 'Historical import', '2026-06-26 00:46:34.411266'),
  (416, 13, 126, 'receive', 3, 'Historical import', '2026-06-26 00:46:34.42045'),
  (419, 13, 126, 'receive', 3, 'Historical import', '2026-06-26 00:46:34.430039'),
  (421, 13, 126, 'receive', 3, 'Historical import', '2026-06-26 00:46:34.439193'),
  (422, 13, 126, 'receive', 15, 'Historical import', '2026-06-26 00:46:34.447762'),
  (419, 13, 128, 'receive', 3, 'Historical import', '2026-06-26 00:46:34.47221'),
  (421, 13, 128, 'receive', 2, 'Historical import', '2026-06-26 00:46:34.481827'),
  (422, 13, 128, 'receive', 10, 'Historical import', '2026-06-26 00:46:34.490677'),
  (420, 13, 129, 'receive', 4, 'Historical import', '2026-06-26 00:46:34.503659'),
  (422, 13, 129, 'receive', 15, 'Historical import', '2026-06-26 00:46:34.51307'),
  (887, 16, 169, 'receive', 1, 'Historical import', '2026-06-26 00:46:34.841383'),
  (855, 16, 169, 'receive', 12, 'Historical import', '2026-06-26 00:46:34.850817'),
  (867, 16, 169, 'receive', 6, 'Historical import', '2026-06-26 00:46:34.859725'),
  (871, 16, 169, 'receive', 5, 'Historical import', '2026-06-26 00:46:34.868221'),
  (880, 16, 169, 'receive', 20, 'Historical import', '2026-06-26 00:46:34.876957'),
  (900, 16, 169, 'receive', 6, 'Historical import', '2026-06-26 00:46:34.885657'),
  (901, 16, 169, 'receive', 6, 'Historical import', '2026-06-26 00:46:34.894545'),
  (865, 16, 170, 'receive', 8, 'Historical import', '2026-06-26 00:46:34.907975'),
  (903, 16, 170, 'receive', 3, 'Historical import', '2026-06-26 00:46:34.916537'),
  (894, 16, 171, 'receive', 2, 'Historical import', '2026-06-26 00:46:34.929708'),
  (894, 16, 171, 'receive', 2, 'Historical import', '2026-06-26 00:46:34.938132'),
  (894, 16, 171, 'receive', 2, 'Historical import', '2026-06-26 00:46:34.947412'),
  (894, 16, 171, 'receive', 4, 'Historical import', '2026-06-26 00:46:34.957256'),
  (899, 16, 171, 'receive', 10, 'Historical import', '2026-06-26 00:46:34.966812'),
  (855, 16, 171, 'receive', 8, 'Historical import', '2026-06-26 00:46:34.976266'),
  (869, 16, 171, 'receive', 6, 'Historical import', '2026-06-26 00:46:34.989432'),
  (871, 16, 171, 'receive', 8, 'Historical import', '2026-06-26 00:46:34.999567'),
  (888, 16, 171, 'receive', 8, 'Historical import', '2026-06-26 00:46:35.008503'),
  (900, 16, 171, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.018201'),
  (872, 16, 171, 'receive', 3, 'Historical import', '2026-06-26 00:46:35.02824'),
  (882, 16, 171, 'receive', 8, 'Historical import', '2026-06-26 00:46:35.038093'),
  (883, 16, 171, 'receive', 8, 'Historical import', '2026-06-26 00:46:35.048229'),
  (901, 16, 171, 'receive', 4, 'Historical import', '2026-06-26 00:46:35.055682'),
  (894, 16, 172, 'receive', 1, 'Historical import', '2026-06-26 00:46:35.067979'),
  (894, 16, 172, 'receive', 2, 'Historical import', '2026-06-26 00:46:35.076219'),
  (899, 16, 172, 'receive', 8, 'Historical import', '2026-06-26 00:46:35.084545'),
  (855, 16, 172, 'receive', 4, 'Historical import', '2026-06-26 00:46:35.093172'),
  (865, 16, 172, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.102868'),
  (867, 16, 172, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.110659'),
  (871, 16, 172, 'receive', 3, 'Historical import', '2026-06-26 00:46:35.118322'),
  (871, 16, 172, 'receive', 8, 'Historical import', '2026-06-26 00:46:35.126241'),
  (871, 16, 172, 'receive', 8, 'Historical import', '2026-06-26 00:46:35.134298'),
  (888, 16, 172, 'receive', 4, 'Historical import', '2026-06-26 00:46:35.143186'),
  (900, 16, 172, 'receive', 8, 'Historical import', '2026-06-26 00:46:35.151664'),
  (899, 16, 173, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.164574'),
  (866, 16, 173, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.173232'),
  (867, 16, 173, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.182307'),
  (871, 16, 173, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.192561'),
  (871, 16, 173, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.206869'),
  (900, 16, 173, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.215811'),
  (884, 16, 173, 'receive', 3, 'Historical import', '2026-06-26 00:46:35.224089'),
  (901, 16, 173, 'receive', 2, 'Historical import', '2026-06-26 00:46:35.233305'),
  (901, 16, 173, 'receive', 2, 'Historical import', '2026-06-26 00:46:35.241601'),
  (887, 16, 174, 'receive', 2, 'Historical import', '2026-06-26 00:46:35.254111'),
  (871, 16, 174, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.26224'),
  (888, 16, 174, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.269677'),
  (901, 16, 174, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.278184'),
  (887, 16, 175, 'receive', 2, 'Historical import', '2026-06-26 00:46:35.289646'),
  (894, 16, 175, 'receive', 2, 'Historical import', '2026-06-26 00:46:35.299524'),
  (894, 16, 175, 'receive', 3, 'Historical import', '2026-06-26 00:46:35.308396'),
  (855, 16, 175, 'receive', 8, 'Historical import', '2026-06-26 00:46:35.319409'),
  (871, 16, 175, 'receive', 12, 'Historical import', '2026-06-26 00:46:35.327735'),
  (900, 16, 175, 'receive', 20, 'Historical import', '2026-06-26 00:46:35.33562'),
  (855, 16, 176, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.358078'),
  (865, 16, 176, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.367452'),
  (866, 16, 176, 'receive', 8, 'Historical import', '2026-06-26 00:46:35.376122'),
  (869, 16, 176, 'receive', 8, 'Historical import', '2026-06-26 00:46:35.386888'),
  (900, 16, 176, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.395302'),
  (900, 16, 176, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.403628'),
  (894, 16, 177, 'receive', 1, 'Historical import', '2026-06-26 00:46:35.417165'),
  (894, 16, 177, 'receive', 1, 'Historical import', '2026-06-26 00:46:35.426361'),
  (894, 16, 177, 'receive', 3, 'Historical import', '2026-06-26 00:46:35.434768'),
  (894, 16, 177, 'receive', 2, 'Historical import', '2026-06-26 00:46:35.443297'),
  (894, 16, 177, 'receive', 3, 'Historical import', '2026-06-26 00:46:35.452811'),
  (899, 16, 177, 'receive', 8, 'Historical import', '2026-06-26 00:46:35.461925'),
  (855, 16, 177, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.470532'),
  (865, 16, 177, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.478808'),
  (868, 16, 177, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.487976'),
  (871, 16, 177, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.496485'),
  (871, 16, 177, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.50564'),
  (900, 16, 177, 'receive', 25, 'Historical import', '2026-06-26 00:46:35.513772'),
  (900, 16, 177, 'receive', 15, 'Historical import', '2026-06-26 00:46:35.521822'),
  (902, 16, 177, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.532921'),
  (879, 16, 177, 'receive', 2, 'Historical import', '2026-06-26 00:46:35.540305'),
  (883, 16, 177, 'receive', 4, 'Historical import', '2026-06-26 00:46:35.548448'),
  (901, 16, 177, 'receive', 3, 'Historical import', '2026-06-26 00:46:35.557441'),
  (901, 16, 177, 'receive', 3, 'Historical import', '2026-06-26 00:46:35.565195'),
  (894, 16, 178, 'receive', 2, 'Historical import', '2026-06-26 00:46:35.576905'),
  (894, 16, 178, 'receive', 4, 'Historical import', '2026-06-26 00:46:35.584296'),
  (899, 16, 178, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.593043'),
  (855, 16, 178, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.600482'),
  (869, 16, 178, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.609164'),
  (871, 16, 178, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.616546'),
  (900, 16, 178, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.625278'),
  (882, 16, 178, 'receive', 4, 'Historical import', '2026-06-26 00:46:35.633929'),
  (883, 16, 178, 'receive', 39, 'Historical import', '2026-06-26 00:46:35.641343'),
  (894, 16, 179, 'receive', 3, 'Historical import', '2026-06-26 00:46:35.652546'),
  (899, 16, 179, 'receive', 8, 'Historical import', '2026-06-26 00:46:35.660761'),
  (855, 16, 179, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.678297'),
  (869, 16, 179, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.691572'),
  (900, 16, 179, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.700067'),
  (900, 16, 179, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.708013'),
  (879, 16, 179, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.717943'),
  (901, 16, 179, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.726874'),
  (894, 16, 180, 'receive', 2, 'Historical import', '2026-06-26 00:46:35.741248'),
  (894, 16, 180, 'receive', 3, 'Historical import', '2026-06-26 00:46:35.750277'),
  (855, 16, 180, 'receive', 12, 'Historical import', '2026-06-26 00:46:35.758911'),
  (901, 16, 180, 'receive', 4, 'Historical import', '2026-06-26 00:46:35.767844'),
  (901, 16, 180, 'receive', 4, 'Historical import', '2026-06-26 00:46:35.776817'),
  (894, 16, 182, 'receive', 4, 'Historical import', '2026-06-26 00:46:35.819109'),
  (899, 16, 182, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.827942'),
  (855, 16, 182, 'receive', 8, 'Historical import', '2026-06-26 00:46:35.837736'),
  (867, 16, 182, 'receive', 8, 'Historical import', '2026-06-26 00:46:35.847403'),
  (900, 16, 182, 'receive', 12, 'Historical import', '2026-06-26 00:46:35.856479'),
  (901, 16, 182, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.865632'),
  (889, 16, 182, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.874955'),
  (894, 16, 183, 'receive', 2, 'Historical import', '2026-06-26 00:46:35.888182'),
  (859, 16, 183, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.89741'),
  (866, 16, 183, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.907483'),
  (869, 16, 183, 'receive', 8, 'Historical import', '2026-06-26 00:46:35.916705'),
  (888, 16, 183, 'receive', 8, 'Historical import', '2026-06-26 00:46:35.92874'),
  (900, 16, 183, 'receive', 15, 'Historical import', '2026-06-26 00:46:35.938788'),
  (900, 16, 183, 'receive', 10, 'Historical import', '2026-06-26 00:46:35.94813'),
  (901, 16, 183, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.957805'),
  (900, 16, 184, 'receive', 35, 'Historical import', '2026-06-26 00:46:35.971767'),
  (879, 16, 184, 'receive', 6, 'Historical import', '2026-06-26 00:46:35.981662'),
  (900, 16, 185, 'receive', 20, 'Historical import', '2026-06-26 00:46:35.996231'),
  (879, 16, 185, 'receive', 3, 'Historical import', '2026-06-26 00:46:36.005542'),
  (866, 16, 186, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.020716'),
  (869, 16, 186, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.029082'),
  (900, 16, 186, 'receive', 15, 'Historical import', '2026-06-26 00:46:36.037923'),
  (900, 16, 186, 'receive', 15, 'Historical import', '2026-06-26 00:46:36.046404'),
  (889, 16, 186, 'receive', 4, 'Historical import', '2026-06-26 00:46:36.054618'),
  (899, 16, 187, 'receive', 8, 'Historical import', '2026-06-26 00:46:36.068199'),
  (869, 16, 187, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.077624'),
  (900, 16, 187, 'receive', 10, 'Historical import', '2026-06-26 00:46:36.08668'),
  (855, 16, 189, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.110012'),
  (871, 16, 189, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.118046'),
  (871, 16, 189, 'receive', 8, 'Historical import', '2026-06-26 00:46:36.12604'),
  (879, 16, 189, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.135038'),
  (889, 16, 189, 'receive', 12, 'Historical import', '2026-06-26 00:46:36.14292'),
  (855, 16, 190, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.154949'),
  (867, 16, 190, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.162796'),
  (880, 16, 190, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.173123'),
  (901, 16, 190, 'receive', 3, 'Historical import', '2026-06-26 00:46:36.372783'),
  (867, 16, 191, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.39117'),
  (900, 16, 191, 'receive', 8, 'Historical import', '2026-06-26 00:46:36.40086'),
  (883, 16, 191, 'receive', 10, 'Historical import', '2026-06-26 00:46:36.410119'),
  (901, 16, 191, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.419622'),
  (865, 16, 192, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.432149'),
  (884, 16, 192, 'receive', 4, 'Historical import', '2026-06-26 00:46:36.44105'),
  (881, 16, 193, 'receive', 1, 'Historical import', '2026-06-26 00:46:36.454218'),
  (1311, 17, 194, 'receive', 2, 'Historical import', '2026-06-26 00:46:36.613933'),
  (922, 17, 194, 'receive', 1, 'Historical import', '2026-06-26 00:46:36.624278'),
  (935, 17, 194, 'receive', 2, 'Historical import', '2026-06-26 00:46:36.633125'),
  (958, 17, 194, 'receive', 1, 'Historical import', '2026-06-26 00:46:36.643131'),
  (985, 17, 194, 'receive', 2, 'Historical import', '2026-06-26 00:46:36.651997'),
  (1041, 17, 194, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.663626'),
  (1055, 17, 194, 'receive', 4, 'Historical import', '2026-06-26 00:46:36.673392'),
  (1055, 17, 194, 'receive', 4, 'Historical import', '2026-06-26 00:46:36.683601'),
  (1087, 17, 194, 'receive', 4, 'Historical import', '2026-06-26 00:46:36.69755'),
  (1097, 17, 194, 'receive', 4, 'Historical import', '2026-06-26 00:46:36.708732'),
  (1111, 17, 194, 'receive', 4, 'Historical import', '2026-06-26 00:46:36.718322'),
  (1143, 17, 194, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.729864'),
  (1143, 17, 194, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.739791'),
  (1278, 17, 194, 'receive', 4, 'Historical import', '2026-06-26 00:46:36.749095'),
  (1291, 17, 194, 'receive', 2, 'Historical import', '2026-06-26 00:46:36.758955'),
  (918, 17, 195, 'receive', 2, 'Historical import', '2026-06-26 00:46:36.771392'),
  (922, 17, 195, 'receive', 2, 'Historical import', '2026-06-26 00:46:36.779233'),
  (935, 17, 195, 'receive', 3, 'Historical import', '2026-06-26 00:46:36.787059'),
  (959, 17, 195, 'receive', 1, 'Historical import', '2026-06-26 00:46:36.796424'),
  (958, 17, 195, 'receive', 1, 'Historical import', '2026-06-26 00:46:36.804047'),
  (958, 17, 195, 'receive', 1, 'Historical import', '2026-06-26 00:46:36.812552'),
  (958, 17, 195, 'receive', 2, 'Historical import', '2026-06-26 00:46:36.820685'),
  (1039, 17, 195, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.831178'),
  (1051, 17, 195, 'receive', 4, 'Historical import', '2026-06-26 00:46:36.840003'),
  (1055, 17, 195, 'receive', 24, 'Historical import', '2026-06-26 00:46:36.85232'),
  (1055, 17, 195, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.860381'),
  (1103, 17, 195, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.870258'),
  (1108, 17, 195, 'receive', 8, 'Historical import', '2026-06-26 00:46:36.878634'),
  (1143, 17, 195, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.887361'),
  (1167, 17, 195, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.895794'),
  (1175, 17, 195, 'receive', 10, 'Historical import', '2026-06-26 00:46:36.904631'),
  (1143, 17, 195, 'receive', 4, 'Historical import', '2026-06-26 00:46:36.912969'),
  (1306, 17, 195, 'receive', 2, 'Historical import', '2026-06-26 00:46:36.922711'),
  (1308, 17, 195, 'receive', 2, 'Historical import', '2026-06-26 00:46:36.930792'),
  (1311, 17, 195, 'receive', 8, 'Historical import', '2026-06-26 00:46:36.938849'),
  (1408, 17, 195, 'receive', 2, 'Historical import', '2026-06-26 00:46:36.948042'),
  (918, 17, 196, 'receive', 2, 'Historical import', '2026-06-26 00:46:36.96072'),
  (935, 17, 196, 'receive', 3, 'Historical import', '2026-06-26 00:46:36.969285'),
  (958, 17, 196, 'receive', 3, 'Historical import', '2026-06-26 00:46:36.977693'),
  (973, 17, 196, 'receive', 3, 'Historical import', '2026-06-26 00:46:36.986416'),
  (1055, 17, 196, 'receive', 6, 'Historical import', '2026-06-26 00:46:36.996472'),
  (1055, 17, 196, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.004809'),
  (1088, 17, 196, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.013872'),
  (1097, 17, 196, 'receive', 4, 'Historical import', '2026-06-26 00:46:37.023377'),
  (1143, 17, 196, 'receive', 4, 'Historical import', '2026-06-26 00:46:37.031853'),
  (1342, 17, 196, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.042746'),
  (1323, 17, 196, 'receive', 3, 'Historical import', '2026-06-26 00:46:37.051413'),
  (918, 17, 197, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.063422'),
  (959, 17, 197, 'receive', 3, 'Historical import', '2026-06-26 00:46:37.071545'),
  (973, 17, 197, 'receive', 3, 'Historical import', '2026-06-26 00:46:37.079817'),
  (1021, 17, 197, 'receive', 3, 'Historical import', '2026-06-26 00:46:37.088362'),
  (1087, 17, 197, 'receive', 4, 'Historical import', '2026-06-26 00:46:37.09691'),
  (1111, 17, 197, 'receive', 4, 'Historical import', '2026-06-26 00:46:37.105466'),
  (1278, 17, 197, 'receive', 4, 'Historical import', '2026-06-26 00:46:37.114893'),
  (1342, 17, 197, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.122936'),
  (1323, 17, 197, 'receive', 3, 'Historical import', '2026-06-26 00:46:37.131613'),
  (918, 17, 198, 'receive', 1, 'Historical import', '2026-06-26 00:46:37.143865'),
  (935, 17, 198, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.154497'),
  (959, 17, 198, 'receive', 1, 'Historical import', '2026-06-26 00:46:37.162553'),
  (958, 17, 198, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.170999'),
  (969, 17, 198, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.179229'),
  (983, 17, 198, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.187713'),
  (1039, 17, 198, 'receive', 4, 'Historical import', '2026-06-26 00:46:37.197579'),
  (1033, 17, 198, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.206103'),
  (1054, 17, 198, 'receive', 4, 'Historical import', '2026-06-26 00:46:37.214499'),
  (1055, 17, 198, 'receive', 4, 'Historical import', '2026-06-26 00:46:37.222981'),
  (1055, 17, 198, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.23122'),
  (1097, 17, 198, 'receive', 4, 'Historical import', '2026-06-26 00:46:37.240948'),
  (1108, 17, 198, 'receive', 4, 'Historical import', '2026-06-26 00:46:37.251067'),
  (1119, 17, 198, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.259706'),
  (1143, 17, 198, 'receive', 3, 'Historical import', '2026-06-26 00:46:37.268194'),
  (1148, 17, 198, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.276686'),
  (1156, 17, 198, 'receive', 4, 'Historical import', '2026-06-26 00:46:37.28462'),
  (1167, 17, 198, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.293216'),
  (1175, 17, 198, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.301438'),
  (1176, 17, 198, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.31115'),
  (1177, 17, 198, 'receive', 4, 'Historical import', '2026-06-26 00:46:37.319284'),
  (1263, 17, 198, 'receive', 1, 'Historical import', '2026-06-26 00:46:37.334455'),
  (1271, 17, 198, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.342447'),
  (1278, 17, 198, 'receive', 4, 'Historical import', '2026-06-26 00:46:37.350178'),
  (1306, 17, 198, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.359475'),
  (1308, 17, 198, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.367454'),
  (1342, 17, 198, 'receive', 4, 'Historical import', '2026-06-26 00:46:37.376344'),
  (1342, 17, 198, 'receive', 8, 'Historical import', '2026-06-26 00:46:37.384827'),
  (1365, 17, 198, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.393948'),
  (1394, 17, 198, 'receive', 1, 'Historical import', '2026-06-26 00:46:37.402451'),
  (1408, 17, 198, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.410965'),
  (922, 17, 199, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.423368'),
  (922, 17, 199, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.432132'),
  (945, 17, 199, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.44016'),
  (966, 17, 199, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.449156'),
  (964, 17, 199, 'receive', 4, 'Historical import', '2026-06-26 00:46:37.457992'),
  (1089, 17, 199, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.46945'),
  (1143, 17, 199, 'receive', 8, 'Historical import', '2026-06-26 00:46:37.477718'),
  (1175, 17, 199, 'receive', 8, 'Historical import', '2026-06-26 00:46:37.486437'),
  (1176, 17, 199, 'receive', 8, 'Historical import', '2026-06-26 00:46:37.494637'),
  (1288, 17, 199, 'receive', 3, 'Historical import', '2026-06-26 00:46:37.504265'),
  (1311, 17, 199, 'receive', 3, 'Historical import', '2026-06-26 00:46:37.512845'),
  (1368, 17, 199, 'receive', 3, 'Historical import', '2026-06-26 00:46:37.520878'),
  (922, 17, 200, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.533397'),
  (958, 17, 200, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.541701'),
  (975, 17, 200, 'receive', 3, 'Historical import', '2026-06-26 00:46:37.549743'),
  (1036, 17, 200, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.560136'),
  (1039, 17, 200, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.568576'),
  (1055, 17, 200, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.577466'),
  (1088, 17, 200, 'receive', 8, 'Historical import', '2026-06-26 00:46:37.586236'),
  (1097, 17, 200, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.599058'),
  (1108, 17, 200, 'receive', 10, 'Historical import', '2026-06-26 00:46:37.608226'),
  (1159, 17, 200, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.617081'),
  (1175, 17, 200, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.625367'),
  (1176, 17, 200, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.63397'),
  (1292, 17, 200, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.643852'),
  (1365, 17, 200, 'receive', 3, 'Historical import', '2026-06-26 00:46:37.652524'),
  (922, 17, 201, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.664631'),
  (937, 17, 201, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.673665'),
  (958, 17, 201, 'receive', 1, 'Historical import', '2026-06-26 00:46:37.682769'),
  (958, 17, 201, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.691185'),
  (980, 17, 201, 'receive', 3, 'Historical import', '2026-06-26 00:46:37.699184'),
  (1023, 17, 201, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.708756'),
  (1088, 17, 201, 'receive', 10, 'Historical import', '2026-06-26 00:46:37.719475'),
  (1097, 17, 201, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.727979'),
  (1108, 17, 201, 'receive', 10, 'Historical import', '2026-06-26 00:46:37.73661'),
  (1116, 17, 201, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.745321'),
  (1148, 17, 201, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.754418'),
  (1159, 17, 201, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.763836'),
  (1164, 17, 201, 'receive', 8, 'Historical import', '2026-06-26 00:46:37.771908'),
  (1175, 17, 201, 'receive', 8, 'Historical import', '2026-06-26 00:46:37.779784'),
  (1176, 17, 201, 'receive', 8, 'Historical import', '2026-06-26 00:46:37.787745'),
  (1195, 17, 201, 'receive', 8, 'Historical import', '2026-06-26 00:46:37.795641'),
  (922, 17, 202, 'receive', 1, 'Historical import', '2026-06-26 00:46:37.809474'),
  (935, 17, 202, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.818068'),
  (937, 17, 202, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.826342'),
  (958, 17, 202, 'receive', 3, 'Historical import', '2026-06-26 00:46:37.834627'),
  (958, 17, 202, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.842714'),
  (980, 17, 202, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.850809'),
  (1023, 17, 202, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.859627'),
  (1088, 17, 202, 'receive', 8, 'Historical import', '2026-06-26 00:46:37.870117'),
  (1097, 17, 202, 'receive', 4, 'Historical import', '2026-06-26 00:46:37.878208'),
  (1108, 17, 202, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.886211'),
  (1114, 17, 202, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.893924'),
  (1148, 17, 202, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.901423'),
  (1159, 17, 202, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.909314'),
  (1164, 17, 202, 'receive', 6, 'Historical import', '2026-06-26 00:46:37.917429'),
  (1292, 17, 202, 'receive', 2, 'Historical import', '2026-06-26 00:46:37.932114'),
  (966, 17, 203, 'receive', 3, 'Historical import', '2026-06-26 00:46:37.94457'),
  (964, 17, 203, 'receive', 3, 'Historical import', '2026-06-26 00:46:37.952907'),
  (1041, 17, 203, 'receive', 8, 'Historical import', '2026-06-26 00:46:37.962107'),
  (1091, 17, 203, 'receive', 15, 'Historical import', '2026-06-26 00:46:37.970128'),
  (1088, 17, 203, 'receive', 90, 'Historical import', '2026-06-26 00:46:37.979242'),
  (1176, 17, 203, 'receive', 10, 'Historical import', '2026-06-26 00:46:37.98698'),
  (1311, 17, 203, 'receive', 5, 'Historical import', '2026-06-26 00:46:37.995688'),
  (1342, 17, 203, 'receive', 15, 'Historical import', '2026-06-26 00:46:38.003701'),
  (1288, 17, 204, 'receive', 4, 'Historical import', '2026-06-26 00:46:38.017132'),
  (959, 17, 205, 'receive', 3, 'Historical import', '2026-06-26 00:46:38.030042'),
  (1087, 17, 205, 'receive', 6, 'Historical import', '2026-06-26 00:46:38.039733'),
  (1308, 17, 205, 'receive', 4, 'Historical import', '2026-06-26 00:46:38.048601'),
  (935, 17, 207, 'receive', 4, 'Historical import', '2026-06-26 00:46:38.165056'),
  (958, 17, 207, 'receive', 3, 'Historical import', '2026-06-26 00:46:38.177833'),
  (1088, 17, 207, 'receive', 10, 'Historical import', '2026-06-26 00:46:38.186347'),
  (1108, 17, 207, 'receive', 10, 'Historical import', '2026-06-26 00:46:38.194786'),
  (1159, 17, 207, 'receive', 8, 'Historical import', '2026-06-26 00:46:38.203938'),
  (1175, 17, 207, 'receive', 8, 'Historical import', '2026-06-26 00:46:38.212287'),
  (1176, 17, 207, 'receive', 8, 'Historical import', '2026-06-26 00:46:38.222426'),
  (947, 17, 208, 'receive', 1, 'Historical import', '2026-06-26 00:46:38.234351'),
  (950, 17, 208, 'receive', 2, 'Historical import', '2026-06-26 00:46:38.244545'),
  (985, 17, 208, 'receive', 1, 'Historical import', '2026-06-26 00:46:38.252916'),
  (1039, 17, 208, 'receive', 4, 'Historical import', '2026-06-26 00:46:38.262046'),
  (1048, 17, 208, 'receive', 6, 'Historical import', '2026-06-26 00:46:38.269997'),
  (1183, 17, 208, 'receive', 3, 'Historical import', '2026-06-26 00:46:38.280203'),
  (1271, 17, 208, 'receive', 2, 'Historical import', '2026-06-26 00:46:38.294983'),
  (1314, 17, 208, 'receive', 2, 'Historical import', '2026-06-26 00:46:38.307453'),
  (1306, 17, 208, 'receive', 2, 'Historical import', '2026-06-26 00:46:38.317137'),
  (1026, 17, 209, 'receive', 3, 'Historical import', '2026-06-26 00:46:38.33019'),
  (958, 17, 210, 'receive', 2, 'Historical import', '2026-06-26 00:46:38.344842'),
  (1055, 17, 210, 'receive', 8, 'Historical import', '2026-06-26 00:46:38.35651'),
  (1089, 17, 210, 'receive', 8, 'Historical import', '2026-06-26 00:46:38.366672'),
  (1103, 17, 210, 'receive', 6, 'Historical import', '2026-06-26 00:46:38.376047'),
  (1108, 17, 210, 'receive', 10, 'Historical import', '2026-06-26 00:46:38.390503'),
  (958, 17, 211, 'receive', 2, 'Historical import', '2026-06-26 00:46:38.404187'),
  (1055, 17, 211, 'receive', 6, 'Historical import', '2026-06-26 00:46:38.414164'),
  (1164, 17, 211, 'receive', 6, 'Historical import', '2026-06-26 00:46:38.423'),
  (1108, 17, 212, 'receive', 12, 'Historical import', '2026-06-26 00:46:38.436735'),
  (1175, 17, 212, 'receive', 8, 'Historical import', '2026-06-26 00:46:38.445358'),
  (1176, 17, 212, 'receive', 8, 'Historical import', '2026-06-26 00:46:38.453422'),
  (1342, 17, 212, 'receive', 6, 'Historical import', '2026-06-26 00:46:38.46245'),
  (1325, 17, 212, 'receive', 6, 'Historical import', '2026-06-26 00:46:38.470823'),
  (959, 17, 213, 'receive', 2, 'Historical import', '2026-06-26 00:46:38.483643'),
  (958, 17, 214, 'receive', 4, 'Historical import', '2026-06-26 00:46:38.496402'),
  (958, 17, 214, 'receive', 3, 'Historical import', '2026-06-26 00:46:38.505131'),
  (964, 17, 214, 'receive', 2, 'Historical import', '2026-06-26 00:46:38.513531'),
  (958, 17, 214, 'receive', 2, 'Historical import', '2026-06-26 00:46:38.522129'),
  (1026, 17, 214, 'receive', 2, 'Historical import', '2026-06-26 00:46:38.531322'),
  (1023, 17, 214, 'receive', 3, 'Historical import', '2026-06-26 00:46:38.539459'),
  (1039, 17, 214, 'receive', 6, 'Historical import', '2026-06-26 00:46:38.547941'),
  (1055, 17, 214, 'receive', 6, 'Historical import', '2026-06-26 00:46:38.558846'),
  (1055, 17, 214, 'receive', 12, 'Historical import', '2026-06-26 00:46:38.568091'),
  (1089, 17, 214, 'receive', 8, 'Historical import', '2026-06-26 00:46:38.576366'),
  (1103, 17, 214, 'receive', 6, 'Historical import', '2026-06-26 00:46:38.584891'),
  (1143, 17, 214, 'receive', 6, 'Historical import', '2026-06-26 00:46:38.597238'),
  (1156, 17, 214, 'receive', 6, 'Historical import', '2026-06-26 00:46:38.611849'),
  (1159, 17, 214, 'receive', 10, 'Historical import', '2026-06-26 00:46:38.621122'),
  (1167, 17, 214, 'receive', 8, 'Historical import', '2026-06-26 00:46:38.629498'),
  (1175, 17, 214, 'receive', 6, 'Historical import', '2026-06-26 00:46:38.809082'),
  (1288, 17, 214, 'receive', 3, 'Historical import', '2026-06-26 00:46:38.965132'),
  (1308, 17, 214, 'receive', 4, 'Historical import', '2026-06-26 00:46:38.973983'),
  (1311, 17, 214, 'receive', 3, 'Historical import', '2026-06-26 00:46:38.983371'),
  (1365, 17, 214, 'receive', 3, 'Historical import', '2026-06-26 00:46:38.9926'),
  (966, 17, 215, 'receive', 3, 'Historical import', '2026-06-26 00:46:39.139147'),
  (973, 17, 215, 'receive', 2, 'Historical import', '2026-06-26 00:46:39.148462'),
  (1041, 17, 215, 'receive', 15, 'Historical import', '2026-06-26 00:46:39.159649'),
  (1087, 17, 215, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.173105'),
  (1091, 17, 215, 'receive', 48, 'Historical import', '2026-06-26 00:46:39.182484'),
  (1088, 17, 215, 'receive', 10, 'Historical import', '2026-06-26 00:46:39.19149'),
  (1101, 17, 215, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.201523'),
  (1103, 17, 215, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.210608'),
  (1111, 17, 215, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.220298'),
  (1108, 17, 215, 'receive', 10, 'Historical import', '2026-06-26 00:46:39.229035'),
  (1197, 17, 215, 'receive', 10, 'Historical import', '2026-06-26 00:46:39.238239'),
  (1159, 17, 215, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.246944'),
  (1167, 17, 215, 'receive', 8, 'Historical import', '2026-06-26 00:46:39.256067'),
  (1176, 17, 215, 'receive', 10, 'Historical import', '2026-06-26 00:46:39.265473'),
  (1143, 17, 215, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.274573'),
  (1278, 17, 215, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.284943'),
  (1288, 17, 215, 'receive', 4, 'Historical import', '2026-06-26 00:46:39.29499'),
  (1311, 17, 215, 'receive', 4, 'Historical import', '2026-06-26 00:46:39.303423'),
  (1342, 17, 215, 'receive', 20, 'Historical import', '2026-06-26 00:46:39.313184'),
  (1370, 17, 215, 'receive', 4, 'Historical import', '2026-06-26 00:46:39.323042'),
  (1055, 17, 217, 'receive', 14, 'Historical import', '2026-06-26 00:46:39.340541'),
  (1143, 17, 217, 'receive', 2, 'Historical import', '2026-06-26 00:46:39.348935'),
  (1342, 17, 217, 'receive', 4, 'Historical import', '2026-06-26 00:46:39.359491'),
  (1323, 17, 217, 'receive', 2, 'Historical import', '2026-06-26 00:46:39.368569'),
  (1599, 18, 219, 'receive', 3, 'Historical import', '2026-06-26 00:46:39.42048'),
  (1545, 18, 219, 'receive', 15, 'Historical import', '2026-06-26 00:46:39.429402'),
  (1612, 18, 219, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.438562'),
  (1613, 18, 219, 'receive', 8, 'Historical import', '2026-06-26 00:46:39.452861'),
  (1617, 18, 219, 'receive', 8, 'Historical import', '2026-06-26 00:46:39.463927'),
  (1585, 18, 219, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.472964'),
  (1546, 18, 220, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.488841'),
  (1559, 18, 220, 'receive', 2, 'Historical import', '2026-06-26 00:46:39.498043'),
  (1599, 18, 220, 'receive', 2, 'Historical import', '2026-06-26 00:46:39.506865'),
  (1591, 18, 220, 'receive', 2, 'Historical import', '2026-06-26 00:46:39.516413'),
  (1545, 18, 220, 'receive', 8, 'Historical import', '2026-06-26 00:46:39.525198'),
  (1636, 18, 220, 'receive', 20, 'Historical import', '2026-06-26 00:46:39.535085'),
  (1613, 18, 220, 'receive', 8, 'Historical import', '2026-06-26 00:46:39.547741'),
  (1592, 18, 220, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.556624'),
  (1585, 18, 221, 'receive', 10, 'Historical import', '2026-06-26 00:46:39.576897'),
  (1591, 18, 222, 'receive', 2, 'Historical import', '2026-06-26 00:46:39.591837'),
  (1545, 18, 222, 'receive', 10, 'Historical import', '2026-06-26 00:46:39.601431'),
  (1612, 18, 222, 'receive', 8, 'Historical import', '2026-06-26 00:46:39.611166'),
  (1636, 18, 222, 'receive', 30, 'Historical import', '2026-06-26 00:46:39.620079'),
  (1613, 18, 222, 'receive', 15, 'Historical import', '2026-06-26 00:46:39.634818'),
  (1613, 18, 222, 'receive', 4, 'Historical import', '2026-06-26 00:46:39.642702'),
  (1613, 18, 222, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.651692'),
  (1592, 18, 222, 'receive', 10, 'Historical import', '2026-06-26 00:46:39.659275'),
  (1637, 18, 222, 'receive', 25, 'Historical import', '2026-06-26 00:46:39.669059'),
  (1612, 18, 223, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.683542'),
  (1636, 18, 223, 'receive', 15, 'Historical import', '2026-06-26 00:46:39.691934'),
  (1613, 18, 223, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.704364'),
  (1613, 18, 223, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.712746'),
  (1637, 18, 223, 'receive', 10, 'Historical import', '2026-06-26 00:46:39.72266'),
  (1546, 18, 224, 'receive', 12, 'Historical import', '2026-06-26 00:46:39.734537'),
  (1546, 18, 224, 'receive', 5, 'Historical import', '2026-06-26 00:46:39.743339'),
  (1612, 18, 224, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.751516'),
  (1636, 18, 224, 'receive', 72, 'Historical import', '2026-06-26 00:46:39.760967'),
  (1613, 18, 224, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.771523'),
  (1613, 18, 224, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.780414'),
  (1609, 18, 226, 'receive', 2, 'Historical import', '2026-06-26 00:46:39.807123'),
  (1599, 18, 226, 'receive', 3, 'Historical import', '2026-06-26 00:46:39.815298'),
  (1599, 18, 226, 'receive', 3, 'Historical import', '2026-06-26 00:46:39.82385'),
  (1599, 18, 226, 'receive', 2, 'Historical import', '2026-06-26 00:46:39.83295'),
  (1626, 18, 226, 'receive', 12, 'Historical import', '2026-06-26 00:46:39.846359'),
  (1613, 18, 226, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.855452'),
  (1546, 18, 227, 'receive', 1, 'Historical import', '2026-06-26 00:46:39.870465'),
  (1635, 18, 227, 'receive', 3, 'Historical import', '2026-06-26 00:46:39.881963'),
  (1545, 18, 227, 'receive', 25, 'Historical import', '2026-06-26 00:46:39.89157'),
  (1636, 18, 227, 'receive', 8, 'Historical import', '2026-06-26 00:46:39.900952'),
  (1613, 18, 227, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.910843'),
  (1613, 18, 227, 'receive', 8, 'Historical import', '2026-06-26 00:46:39.920379'),
  (1637, 18, 227, 'receive', 20, 'Historical import', '2026-06-26 00:46:39.931993'),
  (1559, 18, 228, 'receive', 2, 'Historical import', '2026-06-26 00:46:39.947404'),
  (1599, 18, 228, 'receive', 2, 'Historical import', '2026-06-26 00:46:39.959572'),
  (1591, 18, 228, 'receive', 2, 'Historical import', '2026-06-26 00:46:39.968911'),
  (1545, 18, 228, 'receive', 15, 'Historical import', '2026-06-26 00:46:39.978768'),
  (1545, 18, 228, 'receive', 6, 'Historical import', '2026-06-26 00:46:39.992252'),
  (1636, 18, 228, 'receive', 15, 'Historical import', '2026-06-26 00:46:40.002937'),
  (1626, 18, 228, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.012983'),
  (1613, 18, 228, 'receive', 12, 'Historical import', '2026-06-26 00:46:40.023732'),
  (1613, 18, 229, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.043192'),
  (1599, 18, 230, 'receive', 3, 'Historical import', '2026-06-26 00:46:40.061276'),
  (1613, 18, 230, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.072766'),
  (1592, 18, 230, 'receive', 10, 'Historical import', '2026-06-26 00:46:40.082441'),
  (1545, 18, 231, 'receive', 25, 'Historical import', '2026-06-26 00:46:40.097194'),
  (1613, 18, 231, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.106822'),
  (1613, 18, 231, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.115311'),
  (1609, 18, 232, 'receive', 4, 'Historical import', '2026-06-26 00:46:40.131265'),
  (1599, 18, 232, 'receive', 2, 'Historical import', '2026-06-26 00:46:40.140387'),
  (1599, 18, 232, 'receive', 2, 'Historical import', '2026-06-26 00:46:40.148302'),
  (1612, 18, 233, 'receive', 4, 'Historical import', '2026-06-26 00:46:40.165727'),
  (1599, 18, 234, 'receive', 4, 'Historical import', '2026-06-26 00:46:40.180924'),
  (1599, 18, 234, 'receive', 4, 'Historical import', '2026-06-26 00:46:40.19'),
  (1599, 18, 234, 'receive', 2, 'Historical import', '2026-06-26 00:46:40.198046'),
  (1545, 18, 234, 'receive', 12, 'Historical import', '2026-06-26 00:46:40.206018'),
  (1612, 18, 234, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.215102'),
  (1613, 18, 234, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.22603'),
  (1585, 18, 234, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.234676'),
  (1545, 18, 235, 'receive', 30, 'Historical import', '2026-06-26 00:46:40.250258'),
  (1592, 18, 235, 'receive', 15, 'Historical import', '2026-06-26 00:46:40.26163'),
  (1585, 18, 235, 'receive', 8, 'Historical import', '2026-06-26 00:46:40.27137'),
  (1599, 18, 236, 'receive', 3, 'Historical import', '2026-06-26 00:46:40.2865'),
  (1545, 18, 236, 'receive', 25, 'Historical import', '2026-06-26 00:46:40.296036'),
  (1612, 18, 236, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.305813'),
  (1612, 18, 236, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.314715'),
  (1584, 18, 236, 'receive', 8, 'Historical import', '2026-06-26 00:46:40.325479'),
  (1613, 18, 236, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.333996'),
  (1613, 18, 236, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.342946'),
  (1585, 18, 236, 'receive', 5, 'Historical import', '2026-06-26 00:46:40.352742'),
  (1545, 18, 237, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.366142'),
  (1636, 18, 237, 'receive', 15, 'Historical import', '2026-06-26 00:46:40.37533'),
  (1613, 18, 237, 'receive', 10, 'Historical import', '2026-06-26 00:46:40.385099'),
  (1637, 18, 237, 'receive', 15, 'Historical import', '2026-06-26 00:46:40.394348'),
  (1599, 18, 238, 'receive', 3, 'Historical import', '2026-06-26 00:46:40.406881'),
  (1545, 18, 238, 'receive', 10, 'Historical import', '2026-06-26 00:46:40.416904'),
  (1612, 18, 238, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.426812'),
  (1613, 18, 238, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.43649'),
  (1613, 18, 238, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.444608'),
  (1599, 18, 239, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.456867'),
  (1545, 18, 239, 'receive', 20, 'Historical import', '2026-06-26 00:46:40.465022'),
  (1637, 18, 239, 'receive', 8, 'Historical import', '2026-06-26 00:46:40.476226'),
  (1636, 18, 241, 'receive', 8, 'Historical import', '2026-06-26 00:46:40.504213'),
  (1584, 18, 241, 'receive', 5, 'Historical import', '2026-06-26 00:46:40.513171'),
  (1613, 18, 241, 'receive', 4, 'Historical import', '2026-06-26 00:46:40.521154'),
  (1637, 18, 241, 'receive', 8, 'Historical import', '2026-06-26 00:46:40.532158'),
  (1635, 18, 242, 'receive', 2, 'Historical import', '2026-06-26 00:46:40.546719'),
  (1636, 18, 242, 'receive', 10, 'Historical import', '2026-06-26 00:46:40.55634'),
  (1584, 18, 242, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.567315'),
  (1613, 18, 242, 'receive', 4, 'Historical import', '2026-06-26 00:46:40.577027'),
  (1637, 18, 242, 'receive', 10, 'Historical import', '2026-06-26 00:46:40.587429'),
  (1545, 18, 243, 'receive', 10, 'Historical import', '2026-06-26 00:46:40.602472'),
  (1612, 18, 243, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.612628'),
  (1613, 18, 243, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.626914'),
  (1592, 18, 243, 'receive', 4, 'Historical import', '2026-06-26 00:46:40.635649'),
  (1636, 18, 244, 'receive', 15, 'Historical import', '2026-06-26 00:46:40.650783'),
  (1613, 18, 244, 'receive', 10, 'Historical import', '2026-06-26 00:46:40.661056'),
  (1, 1, 246, 'receive', 2, 'Historical import', '2026-06-26 00:46:40.695851'),
  (3, 1, 246, 'receive', 5, 'Historical import', '2026-06-26 00:46:40.705948'),
  (16, 1, 246, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.714182'),
  (18, 1, 246, 'receive', 3, 'Historical import', '2026-06-26 00:46:40.724488'),
  (24, 1, 246, 'receive', 10, 'Historical import', '2026-06-26 00:46:40.734434'),
  (27, 1, 246, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.74472'),
  (30, 1, 246, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.753947'),
  (1, 1, 247, 'receive', 2, 'Historical import', '2026-06-26 00:46:40.769899'),
  (3, 1, 247, 'receive', 2, 'Historical import', '2026-06-26 00:46:40.779126'),
  (18, 1, 247, 'receive', 10, 'Historical import', '2026-06-26 00:46:40.789023'),
  (24, 1, 247, 'receive', 10, 'Historical import', '2026-06-26 00:46:40.799521'),
  (29, 1, 247, 'receive', 10, 'Historical import', '2026-06-26 00:46:40.809716'),
  (36, 1, 247, 'receive', 2, 'Historical import', '2026-06-26 00:46:40.822772'),
  (37, 1, 247, 'receive', 4, 'Historical import', '2026-06-26 00:46:40.832745'),
  (1, 1, 248, 'receive', 4, 'Historical import', '2026-06-26 00:46:40.846164'),
  (3, 1, 248, 'receive', 4, 'Historical import', '2026-06-26 00:46:40.855811'),
  (13, 1, 248, 'receive', 23, 'Historical import', '2026-06-26 00:46:40.865551'),
  (21, 1, 248, 'receive', 5, 'Historical import', '2026-06-26 00:46:40.8749'),
  (24, 1, 248, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.888271'),
  (36, 1, 248, 'receive', 3, 'Historical import', '2026-06-26 00:46:40.897734'),
  (1, 1, 249, 'receive', 2, 'Historical import', '2026-06-26 00:46:40.915115'),
  (13, 1, 249, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.925736'),
  (16, 1, 249, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.935475'),
  (17, 1, 249, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.950771'),
  (18, 1, 249, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.961126'),
  (21, 1, 249, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.971375'),
  (22, 1, 249, 'receive', 6, 'Historical import', '2026-06-26 00:46:40.983613'),
  (23, 1, 249, 'receive', 10, 'Historical import', '2026-06-26 00:46:40.993143'),
  (24, 1, 249, 'receive', 10, 'Historical import', '2026-06-26 00:46:41.002316'),
  (30, 1, 249, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.010873'),
  (1, 1, 250, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.025017'),
  (36, 1, 250, 'receive', 1, 'Historical import', '2026-06-26 00:46:41.034322'),
  (1, 1, 251, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.050628'),
  (7, 1, 251, 'receive', 6, 'Historical import', '2026-06-26 00:46:41.059097'),
  (11, 1, 251, 'receive', 4, 'Historical import', '2026-06-26 00:46:41.067766'),
  (15, 1, 251, 'receive', 5, 'Historical import', '2026-06-26 00:46:41.080898'),
  (17, 1, 251, 'receive', 5, 'Historical import', '2026-06-26 00:46:41.089619'),
  (18, 1, 251, 'receive', 5, 'Historical import', '2026-06-26 00:46:41.098279'),
  (24, 1, 251, 'receive', 10, 'Historical import', '2026-06-26 00:46:41.106665'),
  (29, 1, 251, 'receive', 5, 'Historical import', '2026-06-26 00:46:41.116409'),
  (30, 1, 251, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.125945'),
  (30, 1, 251, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.134398'),
  (32, 1, 251, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.145256'),
  (33, 1, 251, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.155005'),
  (1, 1, 252, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.172599'),
  (4, 1, 252, 'receive', 1, 'Historical import', '2026-06-26 00:46:41.182888'),
  (13, 1, 252, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.193654'),
  (14, 1, 252, 'receive', 19, 'Historical import', '2026-06-26 00:46:41.204162'),
  (1, 1, 253, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.218367'),
  (18, 1, 253, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.22984'),
  (24, 1, 253, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.239442'),
  (36, 1, 253, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.249115'),
  (1, 1, 254, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.264639'),
  (1, 1, 255, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.279068'),
  (36, 1, 255, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.292233'),
  (1, 1, 256, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.308212'),
  (4, 1, 256, 'receive', 1, 'Historical import', '2026-06-26 00:46:41.318975'),
  (9, 1, 256, 'receive', 5, 'Historical import', '2026-06-26 00:46:41.33118'),
  (678, 1, 256, 'receive', 6, 'Historical import', '2026-06-26 00:46:41.341808'),
  (7, 1, 256, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.35152'),
  (16, 1, 256, 'receive', 6, 'Historical import', '2026-06-26 00:46:41.364456'),
  (7, 1, 256, 'receive', 6, 'Historical import', '2026-06-26 00:46:41.375942'),
  (7, 1, 256, 'receive', 6, 'Historical import', '2026-06-26 00:46:41.38757'),
  (27, 1, 256, 'receive', 6, 'Historical import', '2026-06-26 00:46:41.397985'),
  (28, 1, 256, 'receive', 8, 'Historical import', '2026-06-26 00:46:41.408897'),
  (29, 1, 256, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.419243'),
  (32, 1, 256, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.429316'),
  (35, 1, 256, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.438035'),
  (36, 1, 256, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.447732'),
  (37, 1, 256, 'receive', 4, 'Historical import', '2026-06-26 00:46:41.456967'),
  (1, 1, 257, 'receive', 4, 'Historical import', '2026-06-26 00:46:41.470203'),
  (4, 1, 257, 'receive', 1, 'Historical import', '2026-06-26 00:46:41.478894'),
  (9, 1, 257, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.488063'),
  (7, 1, 257, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.497966'),
  (7, 1, 257, 'receive', 6, 'Historical import', '2026-06-26 00:46:41.507152'),
  (27, 1, 257, 'receive', 6, 'Historical import', '2026-06-26 00:46:41.515822'),
  (30, 1, 257, 'receive', 4, 'Historical import', '2026-06-26 00:46:41.524707'),
  (32, 1, 257, 'receive', 6, 'Historical import', '2026-06-26 00:46:41.534873'),
  (36, 1, 257, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.543353'),
  (37, 1, 257, 'receive', 4, 'Historical import', '2026-06-26 00:46:41.552928'),
  (39, 1, 257, 'receive', 8, 'Historical import', '2026-06-26 00:46:41.561302'),
  (1, 1, 258, 'receive', 5, 'Historical import', '2026-06-26 00:46:41.57408'),
  (4, 1, 258, 'receive', 1, 'Historical import', '2026-06-26 00:46:41.582144'),
  (9, 1, 258, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.59069'),
  (13, 1, 258, 'receive', 17, 'Historical import', '2026-06-26 00:46:41.599529'),
  (7, 1, 258, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.607984'),
  (7, 1, 258, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.616072'),
  (27, 1, 258, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.624384'),
  (28, 1, 258, 'receive', 4, 'Historical import', '2026-06-26 00:46:41.633568'),
  (30, 1, 258, 'receive', 5, 'Historical import', '2026-06-26 00:46:41.643057'),
  (32, 1, 258, 'receive', 6, 'Historical import', '2026-06-26 00:46:41.651521'),
  (36, 1, 258, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.66035'),
  (37, 1, 258, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.668212'),
  (39, 1, 258, 'receive', 10, 'Historical import', '2026-06-26 00:46:41.676405'),
  (1, 1, 259, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.690135'),
  (6, 1, 259, 'receive', 6, 'Historical import', '2026-06-26 00:46:41.698529'),
  (9, 1, 259, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.706917'),
  (7, 1, 259, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.718543'),
  (7, 1, 259, 'receive', 4, 'Historical import', '2026-06-26 00:46:41.72748'),
  (7, 1, 259, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.735551'),
  (27, 1, 259, 'receive', 6, 'Historical import', '2026-06-26 00:46:41.74401'),
  (28, 1, 259, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.753094'),
  (34, 1, 259, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.766497'),
  (30, 1, 259, 'receive', 2, 'Historical import', '2026-06-26 00:46:41.775666'),
  (5, 1, 260, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.787748'),
  (13, 1, 260, 'receive', 5, 'Historical import', '2026-06-26 00:46:41.7963'),
  (16, 1, 260, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.806866'),
  (18, 1, 260, 'receive', 4, 'Historical import', '2026-06-26 00:46:41.815407'),
  (20, 1, 260, 'receive', 5, 'Historical import', '2026-06-26 00:46:41.824302'),
  (23, 1, 260, 'receive', 7, 'Historical import', '2026-06-26 00:46:41.8325'),
  (28, 1, 260, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.841555'),
  (29, 1, 260, 'receive', 4, 'Historical import', '2026-06-26 00:46:41.849854'),
  (37, 1, 260, 'receive', 6, 'Historical import', '2026-06-26 00:46:41.858251'),
  (39, 1, 260, 'receive', 10, 'Historical import', '2026-06-26 00:46:41.868766'),
  (8, 1, 262, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.902782'),
  (9, 1, 262, 'receive', 5, 'Historical import', '2026-06-26 00:46:41.911494'),
  (10, 1, 262, 'receive', 6, 'Historical import', '2026-06-26 00:46:41.919702'),
  (11, 1, 262, 'receive', 3, 'Historical import', '2026-06-26 00:46:41.928063'),
  (13, 1, 262, 'receive', 6, 'Historical import', '2026-06-26 00:46:41.936444'),
  (16, 1, 262, 'receive', 5, 'Historical import', '2026-06-26 00:46:41.945392'),
  (21, 1, 262, 'receive', 10, 'Historical import', '2026-06-26 00:46:41.955432'),
  (23, 1, 262, 'receive', 5, 'Historical import', '2026-06-26 00:46:41.963472'),
  (24, 1, 262, 'receive', 10, 'Historical import', '2026-06-26 00:46:41.972009'),
  (26, 1, 262, 'receive', 5, 'Historical import', '2026-06-26 00:46:41.980309'),
  (28, 1, 262, 'receive', 5, 'Historical import', '2026-06-26 00:46:41.992449'),
  (8, 1, 263, 'receive', 4, 'Historical import', '2026-06-26 00:46:42.00667'),
  (9, 1, 263, 'receive', 4, 'Historical import', '2026-06-26 00:46:42.015307'),
  (12, 1, 263, 'receive', 5, 'Historical import', '2026-06-26 00:46:42.023968'),
  (17, 1, 263, 'receive', 4, 'Historical import', '2026-06-26 00:46:42.032247'),
  (18, 1, 263, 'receive', 4, 'Historical import', '2026-06-26 00:46:42.040431'),
  (25, 1, 263, 'receive', 4, 'Historical import', '2026-06-26 00:46:42.049118'),
  (28, 1, 263, 'receive', 3, 'Historical import', '2026-06-26 00:46:42.057706'),
  (32, 1, 263, 'receive', 3, 'Historical import', '2026-06-26 00:46:42.065781'),
  (33, 1, 263, 'receive', 3, 'Historical import', '2026-06-26 00:46:42.073987'),
  (34, 1, 263, 'receive', 3, 'Historical import', '2026-06-26 00:46:42.082824'),
  (35, 1, 263, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.091331'),
  (36, 1, 263, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.09993'),
  (37, 1, 263, 'receive', 4, 'Historical import', '2026-06-26 00:46:42.107843'),
  (38, 1, 263, 'receive', 4, 'Historical import', '2026-06-26 00:46:42.119438'),
  (18, 1, 265, 'receive', 9, 'Historical import', '2026-06-26 00:46:42.13925'),
  (24, 1, 265, 'receive', 56, 'Historical import', '2026-06-26 00:46:42.147302'),
  (23, 1, 266, 'receive', 10, 'Historical import', '2026-06-26 00:46:42.159936'),
  (40, 1, 267, 'receive', 10, 'Historical import', '2026-06-26 00:46:42.173908'),
  (45, 3, 268, 'receive', 3, 'Historical import', '2026-06-26 00:46:42.191316'),
  (60, 3, 268, 'receive', 21, 'Historical import', '2026-06-26 00:46:42.200544'),
  (45, 3, 269, 'receive', 3, 'Historical import', '2026-06-26 00:46:42.214035'),
  (60, 3, 269, 'receive', 12, 'Historical import', '2026-06-26 00:46:42.223154'),
  (46, 3, 270, 'receive', 7, 'Historical import', '2026-06-26 00:46:42.235551'),
  (47, 3, 270, 'receive', 5, 'Historical import', '2026-06-26 00:46:42.244515'),
  (60, 3, 270, 'receive', 15, 'Historical import', '2026-06-26 00:46:42.253278'),
  (60, 3, 272, 'receive', 10, 'Historical import', '2026-06-26 00:46:42.27108'),
  (60, 3, 273, 'receive', 30, 'Historical import', '2026-06-26 00:46:42.284067'),
  (60, 3, 274, 'receive', 20, 'Historical import', '2026-06-26 00:46:42.297284'),
  (60, 3, 275, 'receive', 10, 'Historical import', '2026-06-26 00:46:42.310695'),
  (60, 3, 277, 'receive', 20, 'Historical import', '2026-06-26 00:46:42.329038'),
  (85, 4, 279, 'receive', 4, 'Historical import', '2026-06-26 00:46:42.348004'),
  (85, 4, 280, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.360865'),
  (113, 4, 280, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.368873'),
  (114, 4, 280, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.377031'),
  (116, 4, 280, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.385245'),
  (117, 4, 280, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.393968'),
  (118, 4, 280, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.402538'),
  (119, 4, 280, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.411558'),
  (120, 4, 280, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.419992'),
  (87, 4, 281, 'receive', 5, 'Historical import', '2026-06-26 00:46:42.434411'),
  (115, 4, 281, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.455958'),
  (116, 4, 281, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.464343'),
  (117, 4, 281, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.47607'),
  (118, 4, 281, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.486828'),
  (119, 4, 281, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.495463'),
  (87, 4, 282, 'receive', 3, 'Historical import', '2026-06-26 00:46:42.509018'),
  (90, 4, 282, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.517388'),
  (93, 4, 282, 'receive', 3, 'Historical import', '2026-06-26 00:46:42.529091'),
  (103, 4, 282, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.538061'),
  (112, 4, 282, 'receive', 6, 'Historical import', '2026-06-26 00:46:42.547731'),
  (113, 4, 282, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.556264'),
  (116, 4, 282, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.564984'),
  (87, 4, 283, 'receive', 6, 'Historical import', '2026-06-26 00:46:42.577284'),
  (87, 4, 284, 'receive', 12, 'Historical import', '2026-06-26 00:46:42.590225'),
  (92, 4, 284, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.598991'),
  (100, 4, 284, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.607226'),
  (108, 4, 284, 'receive', 3, 'Historical import', '2026-06-26 00:46:42.619695'),
  (111, 4, 284, 'receive', 3, 'Historical import', '2026-06-26 00:46:42.63021'),
  (113, 4, 284, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.638475'),
  (114, 4, 284, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.647177'),
  (115, 4, 284, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.655571'),
  (116, 4, 284, 'receive', 3, 'Historical import', '2026-06-26 00:46:42.663545'),
  (117, 4, 284, 'receive', 6, 'Historical import', '2026-06-26 00:46:42.672017'),
  (118, 4, 284, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.681026'),
  (119, 4, 284, 'receive', 4, 'Historical import', '2026-06-26 00:46:42.690017'),
  (120, 4, 284, 'receive', 5, 'Historical import', '2026-06-26 00:46:42.698816'),
  (87, 4, 285, 'receive', 5, 'Historical import', '2026-06-26 00:46:42.710362'),
  (89, 4, 285, 'receive', 3, 'Historical import', '2026-06-26 00:46:42.718846'),
  (97, 4, 285, 'receive', 3, 'Historical import', '2026-06-26 00:46:42.728406'),
  (114, 4, 285, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.737338'),
  (115, 4, 285, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.746293'),
  (116, 4, 285, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.754628'),
  (118, 4, 285, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.762755'),
  (120, 4, 285, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.771669'),
  (87, 4, 286, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.784635'),
  (94, 4, 286, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.792723'),
  (130, 4, 286, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.801287'),
  (113, 4, 287, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.814472'),
  (114, 4, 287, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.82301'),
  (115, 4, 287, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.832353'),
  (116, 4, 287, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.840964'),
  (117, 4, 287, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.849606'),
  (118, 4, 287, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.857791'),
  (119, 4, 287, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.866525'),
  (120, 4, 287, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.875437'),
  (113, 4, 288, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.88885'),
  (114, 4, 288, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.897428'),
  (115, 4, 288, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.906269'),
  (116, 4, 288, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.921544'),
  (117, 4, 288, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.93282'),
  (118, 4, 288, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.941224'),
  (119, 4, 288, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.949489'),
  (120, 4, 288, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.958451'),
  (114, 4, 289, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.971678'),
  (115, 4, 289, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.980532'),
  (116, 4, 289, 'receive', 2, 'Historical import', '2026-06-26 00:46:42.988778'),
  (117, 4, 289, 'receive', 1, 'Historical import', '2026-06-26 00:46:42.997884'),
  (118, 4, 289, 'receive', 2, 'Historical import', '2026-06-26 00:46:43.007436'),
  (119, 4, 289, 'receive', 1, 'Historical import', '2026-06-26 00:46:43.016114'),
  (129, 4, 289, 'receive', 2, 'Historical import', '2026-06-26 00:46:43.025173'),
  (130, 4, 289, 'receive', 2, 'Historical import', '2026-06-26 00:46:43.034098'),
  (114, 4, 290, 'receive', 2, 'Historical import', '2026-06-26 00:46:43.046758'),
  (116, 4, 290, 'receive', 2, 'Historical import', '2026-06-26 00:46:43.055185'),
  (117, 4, 290, 'receive', 2, 'Historical import', '2026-06-26 00:46:43.063245'),
  (118, 4, 290, 'receive', 2, 'Historical import', '2026-06-26 00:46:43.074083'),
  (119, 4, 290, 'receive', 3, 'Historical import', '2026-06-26 00:46:43.082739'),
  (120, 4, 290, 'receive', 2, 'Historical import', '2026-06-26 00:46:43.090857'),
  (129, 4, 290, 'receive', 2, 'Historical import', '2026-06-26 00:46:43.099379'),
  (130, 4, 290, 'receive', 2, 'Historical import', '2026-06-26 00:46:43.108528'),
  (116, 4, 291, 'receive', 2, 'Historical import', '2026-06-26 00:46:43.121866'),
  (117, 4, 291, 'receive', 1, 'Historical import', '2026-06-26 00:46:43.130788'),
  (118, 4, 291, 'receive', 1, 'Historical import', '2026-06-26 00:46:43.139825'),
  (119, 4, 291, 'receive', 1, 'Historical import', '2026-06-26 00:46:43.148483'),
  (120, 4, 291, 'receive', 2, 'Historical import', '2026-06-26 00:46:43.156568'),
  (131, 5, 292, 'receive', 2, 'Historical import', '2026-06-26 00:46:43.17313'),
  (142, 5, 292, 'receive', 8, 'Historical import', '2026-06-26 00:46:43.181332'),
  (134, 5, 293, 'receive', 24, 'Historical import', '2026-06-26 00:46:43.195158'),
  (138, 5, 293, 'receive', 24, 'Historical import', '2026-06-26 00:46:43.203903'),
  (139, 5, 293, 'receive', 12, 'Historical import', '2026-06-26 00:46:43.213601'),
  (142, 5, 293, 'receive', 8, 'Historical import', '2026-06-26 00:46:43.222195'),
  (157, 5, 293, 'receive', 5, 'Historical import', '2026-06-26 00:46:43.231429'),
  (160, 5, 293, 'receive', 8, 'Historical import', '2026-06-26 00:46:43.240015'),
  (167, 5, 293, 'receive', 6, 'Historical import', '2026-06-26 00:46:43.247904'),
  (171, 5, 293, 'receive', 2, 'Historical import', '2026-06-26 00:46:43.257323'),
  (136, 5, 294, 'receive', 2, 'Historical import', '2026-06-26 00:46:43.273804'),
  (137, 5, 294, 'receive', 2, 'Historical import', '2026-06-26 00:46:43.282575'),
  (141, 5, 294, 'receive', 6, 'Historical import', '2026-06-26 00:46:43.291942'),
  (142, 5, 294, 'receive', 6, 'Historical import', '2026-06-26 00:46:43.300408'),
  (150, 5, 294, 'receive', 4, 'Historical import', '2026-06-26 00:46:43.309152'),
  (158, 5, 294, 'receive', 12, 'Historical import', '2026-06-26 00:46:43.317618'),
  (159, 5, 294, 'receive', 20, 'Historical import', '2026-06-26 00:46:43.326458'),
  (166, 5, 294, 'receive', 1, 'Historical import', '2026-06-26 00:46:43.337624'),
  (139, 5, 295, 'receive', 6, 'Historical import', '2026-06-26 00:46:43.35437'),
  (142, 5, 295, 'receive', 6, 'Historical import', '2026-06-26 00:46:43.364976'),
  (142, 5, 296, 'receive', 6, 'Historical import', '2026-06-26 00:46:43.379455'),
  (142, 5, 296, 'receive', 6, 'Historical import', '2026-06-26 00:46:43.392129'),
  (142, 5, 296, 'receive', 6, 'Historical import', '2026-06-26 00:46:43.400991'),
  (148, 5, 296, 'receive', 6, 'Historical import', '2026-06-26 00:46:43.410173'),
  (145, 5, 297, 'receive', 10, 'Historical import', '2026-06-26 00:46:43.423575'),
  (146, 5, 297, 'receive', 10, 'Historical import', '2026-06-26 00:46:43.432158'),
  (148, 5, 297, 'receive', 15, 'Historical import', '2026-06-26 00:46:43.445894'),
  (150, 5, 297, 'receive', 8, 'Historical import', '2026-06-26 00:46:43.456686'),
  (157, 5, 297, 'receive', 10, 'Historical import', '2026-06-26 00:46:43.465045'),
  (163, 5, 297, 'receive', 4, 'Historical import', '2026-06-26 00:46:43.476394'),
  (145, 5, 298, 'receive', 10, 'Historical import', '2026-06-26 00:46:43.489335'),
  (146, 5, 298, 'receive', 10, 'Historical import', '2026-06-26 00:46:43.497937'),
  (148, 5, 298, 'receive', 15, 'Historical import', '2026-06-26 00:46:43.506095'),
  (150, 5, 298, 'receive', 8, 'Historical import', '2026-06-26 00:46:43.515002'),
  (163, 5, 298, 'receive', 4, 'Historical import', '2026-06-26 00:46:43.524018'),
  (148, 5, 299, 'receive', 4, 'Historical import', '2026-06-26 00:46:43.537348'),
  (163, 5, 299, 'receive', 4, 'Historical import', '2026-06-26 00:46:43.546652'),
  (170, 5, 299, 'receive', 6, 'Historical import', '2026-06-26 00:46:43.555607'),
  (150, 5, 300, 'receive', 1, 'Historical import', '2026-06-26 00:46:43.568923')
) AS t(product_id, vendor_id, order_id, type, quantity, notes, created_at)
JOIN order_id_map m ON m.old_id = t.order_id;

COMMIT;

SELECT 'Import complete. Orders: ' || COUNT(*) FROM orders;