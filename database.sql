CREATE DATABASE IF NOT EXISTS apothecaryapp;
USE apothecaryapp;

-- ==========================================
-- 1. USERS TABLE
-- ==========================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    favorite_episode VARCHAR(50) DEFAULT 'None',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from users;

-- ==========================================
-- 2. FEEDBACK & HISTORY
-- ==========================================
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) DEFAULT 'Anonymous',
    comment_text TEXT NOT NULL,
    season INT NOT NULL,
    episode INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE watch_history (
    user_id INT PRIMARY KEY,
    season INT NOT NULL,
    episode INT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. CONTENT (Manga & Anime)
-- ==========================================
CREATE TABLE manga_chapters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_number DECIMAL(5,1) NOT NULL,
    drive_link TEXT NOT NULL
);

select * from manga_chapters;

INSERT INTO manga_chapters (chapter_number, drive_link) VALUES 
(1, 'https://drive.google.com/file/d/1ODYeg8unRL2D3ya8wZU0FdG9agmgcRbv/view?usp=sharing'),
(2, 'https://drive.google.com/file/d/1LkRNUZ1VneH3mJS6RKnO-zxeRFUBdiR2/view?usp=sharing'),
(3, 'https://drive.google.com/file/d/1itU2HOZQG6FlhHsH7uZw_fWb1Mlm9waA/view?usp=sharing'),
(4, 'https://drive.google.com/file/d/1zKnvXX7GFtfMEtUn4woEH_vuLDBp09rh/view?usp=sharing'),
(5, 'https://drive.google.com/file/d/1rIlN8GylsX_fBG62NInqHhuVOsnQ9Taj/view?usp=sharing'),
(6, 'https://drive.google.com/file/d/1Vb8pMcPP2Yv_2OvURRoI-7SP5JFPnT1D/view?usp=sharing'),
(7, 'https://drive.google.com/file/d/1R07P-kC3QNJ3msMTFkvi3LjNHdVFrrgT/view?usp=sharing'),
(8, 'https://drive.google.com/file/d/1-JC-TddW_xztHzWSw2LK-JHMG2HHpbaj/view?usp=sharing'),
(9, 'https://drive.google.com/file/d/1NoyNDYbGhrtlW3XNTKwjoSIpjcig3zhS/view?usp=sharing'),
(10, 'https://drive.google.com/file/d/1ywKTJI7PODbRHB8qdsEpwLU4MXZzwYvI/view?usp=sharing'),
(11, 'https://drive.google.com/file/d/1wfWSwe-atMJzb4RmcyFoJqPyqME3xAXB/view?usp=sharing'),
(12, 'https://drive.google.com/file/d/1fcItEp_m3UDgGFsbWlevL4Ekcmf27zEv/view?usp=sharing'),
(13, 'https://drive.google.com/file/d/1UPlDPnl_Jf45FA1P-cgxtShWoH5DT7Iv/view?usp=sharing'),
(14, 'https://drive.google.com/file/d/1ndCLdj_EWx6AtYCe98PFntKSzkDzuIqM/view?usp=sharing'),
(15, 'https://drive.google.com/file/d/1yZ23eNkAgluhL0Ot15WV9LfQzaC5u98l/view?usp=sharing'),
(16, 'https://drive.google.com/file/d/1vGeGH02wsdh2v_twBD4mWu5nzAL7pG1-/view?usp=sharing'),
(17, 'https://drive.google.com/file/d/1DPATzeg9OsEeeuc_ouduITZaJHlknTUz/view?usp=sharing'),
(18, 'https://drive.google.com/file/d/1Xia3RwjBkbBuXa9ba7U8sgf9aVLUKCOI/view?usp=sharing'),
(19, 'https://drive.google.com/file/d/1pg3Tid1FuisISewi1vcawjr90pTvkv0l/view?usp=sharing'),
(20, 'https://drive.google.com/file/d/182AydDHbdPhlGnq5Pqf1jxIw-QRnqffY/view?usp=sharing'),
(21, 'https://drive.google.com/file/d/18kwkRNxXEqERc5Am-fKMfgJh91_c6qJy/view?usp=sharing'),
(22, 'https://drive.google.com/file/d/1GC4LAdsqNZKGKjsc0h9USG3rS9wE3Au9/view?usp=sharing'),
(23, 'https://drive.google.com/file/d/10RyrcxXBiPu8IYenyGypHqdIYY4zVIgg/view?usp=sharing'),
(24, 'https://drive.google.com/file/d/11_ddO5CqOEba76xLYOlf3AfEyz2nIrQF/view?usp=sharing'),
(25, 'https://drive.google.com/file/d/1NUhLAuN2mAvCqA7WF6AccneFKPrd6pHk/view?usp=sharing'),
(26, 'https://drive.google.com/file/d/1445hWIq10ZtZ11fCkwFSPwBJoXJn36P1/view?usp=sharing'),
(27, 'https://drive.google.com/file/d/1pCaDc8JK6DY8lQLvRFzxbX7aZFwbtUsv/view?usp=sharing'),
(28, 'https://drive.google.com/file/d/1YrFuXpflaPN950i1nysFY19wYQAZDPmr/view?usp=sharing'),
(29, 'https://drive.google.com/file/d/1Yqrn5mzKktO1-INQYoCOANyWE80hTnVe/view?usp=sharing'),
(30, 'https://drive.google.com/file/d/1mBOO_UCkLgmkAK7qcvzPj-lOzva4nkXo/view?usp=sharing'),
(31, 'https://drive.google.com/file/d/1q0PeU1cdBq7tX9N6vkvTwwnly6M-fYF-/view?usp=sharing'),
(32, 'https://drive.google.com/file/d/1r0UC3LhMnAATb1_APyRUZISwJ2WII0Az/view?usp=sharing'),
(33, 'https://drive.google.com/file/d/1Q-jsHrFFfThyJM34a1mtE6jnXJe1V8CA/view?usp=sharing'),
(34, 'https://drive.google.com/file/d/178Py0OrkXhMLPi9dq82WmNSYArpbmu_k/view?usp=sharing'),
(35, 'https://drive.google.com/file/d/13mKEwpm4C3s-pl2tJDhO_7CGvXT2CXBg/view?usp=sharing'),
(36, 'https://drive.google.com/file/d/1GnpK4V6sisnJi14np5uH1MeJzjwPUdAQ/view?usp=sharing'),
(37, 'https://drive.google.com/file/d/1suJs8iZCmde9C2kzQB5fHHwI0WSZ4vHJ/view?usp=sharing'),
(38, 'https://drive.google.com/file/d/19m5rTncYg4RkDWc0GXurbMf5Y_llm4--/view?usp=sharing'),
(39, 'https://drive.google.com/file/d/1NxSNNautu6AJrBDU3zBzkWelwf9zX7k0/view?usp=sharing'),
(40, 'https://drive.google.com/file/d/1NzubgFq5TZOQXb0ccfOGDKPlB5e9NCu2/view?usp=sharing'),
(41, 'https://drive.google.com/file/d/1sf51dXWCi44vD5J719jsZQMIvRbktG5Z/view?usp=sharing'),
(42, 'https://drive.google.com/file/d/1CQIUOSH99fIm4uGuj7Dylj3ee-9RqTms/view?usp=sharing'),
(43, 'https://drive.google.com/file/d/1j4vVIuzDFLdwD-1vl2e5g8gs7bla74k6/view?usp=sharing'),
(43.1, 'https://drive.google.com/file/d/1nXx69VFm3y5WoD76D_qxrleF_DhiULoL/view?usp=sharing'),
(43.2, 'https://drive.google.com/file/d/1KE6jG-cTbquX5-xuUeElq2HZJPQYyt3H/view?usp=sharing'),
(44.1, 'https://drive.google.com/file/d/1ejN4PFeQB1RZ5a2tuShzDL50HngZoM_-/view?usp=sharing'),
(44.2, 'https://drive.google.com/file/d/1P6r2uCtcHJDubZvkfRM5I5PJ8WCnXdXu/view?usp=sharing'),
(45, 'https://drive.google.com/file/d/12PDVd8aRDlqVcD8oueSnSO4ClMb9iMB_/view?usp=sharing'),
(45.2, 'https://drive.google.com/file/d/1QGbRUwjBlzN7AqwSlmvi4TY7_hH0d0vJ/view?usp=sharing'),
(46, 'https://drive.google.com/file/d/1Lb9xmWCE1D7j8FHvAD2PLu6nxM2WrGgx/view?usp=sharing'),
(47.1, 'https://drive.google.com/file/d/1u8OIaZ2JzS0bAFFMN8nTbjkJ5ngKubN6/view?usp=sharing'),
(48.1, 'https://drive.google.com/file/d/1aaU2T6n9geti6cecTVGQMesFFhZTjNEK/view?usp=sharing'),
(48.2, 'https://drive.google.com/file/d/17o04rC-oVxx5nJMQCwbbpcNm64XgJ4d7/view?usp=sharing'),
(49, 'https://drive.google.com/file/d/1r-N_FHahFCZC5uXA8iTMrvCuMBSzzjsy/view?usp=sharing'),
(50, 'https://drive.google.com/file/d/19glVrHMBo6BJv--4gwnRxvBujObcRLY2/view?usp=sharing'),
(51, 'https://drive.google.com/file/d/1bVfWK-lIoSu7vZ5x4gygQcELA2QW-DBL/view?usp=sharing'),
(52, 'https://drive.google.com/file/d/132PdLBPmDdHD8nA4O4X8V_Aj4rwsd7Yq/view?usp=sharing'),
(52.2, 'https://drive.google.com/file/d/1rd6acXmLJxIGOuTwp9cwQIYVA3A4Fu-S/view?usp=sharing'),
(53.1, 'https://drive.google.com/file/d/1PMQSOMNfqfdPGAsj9zCqN5ntIMf5ezDy/view?usp=sharing'),
(53.2, 'https://drive.google.com/file/d/1xTp8C-W1ABOONZTjstdd9cyEDkZBVSe4/view?usp=sharing'),
(55, 'https://drive.google.com/file/d/1rJWXjsazMlo85fESsclYcS7U5IgXOh4p/view?usp=sharing'),
(55.2, 'https://drive.google.com/file/d/1gkcs4sMcYZytCdyXucPflyW-HdYi4mSy/view?usp=sharing'),
(56, 'https://drive.google.com/file/d/1PybYRDPT5HxJXYOU-LzQLg-rSb4JNn0x/view?usp=sharing'),
(57, 'https://drive.google.com/file/d/15pXcSjtx0ELLv-N3LANISpon_qc8yKD9/view?usp=sharing'),
(58, 'https://drive.google.com/file/d/13U_A0uSV15zmg1h8uR6_XmcGc9YZWGTy/view?usp=sharing'),
(59, 'https://drive.google.com/file/d/1dVn8G3QDXTvz2XmcIZRMUSMddGDaHKul/view?usp=sharing'),
(59.2, 'https://drive.google.com/file/d/1Kc9asNtsjN3HvVmrwBqDBa29AbE4Ekc8/view?usp=sharing'),
(60, 'https://drive.google.com/file/d/1vwApV5LKrK5mqRbJQj9rfHSBa3IcwGmo/view?usp=sharing'),
(60.1, 'https://drive.google.com/file/d/1c0w0wrarYhMnY6oHta0ZbQqdYLyYSQdd/view?usp=sharing'),
(60.2, 'https://drive.google.com/file/d/1xJXdX2B6NduhYBhCsQ5vOFUGvRFIKwNq/view?usp=sharing'),
(61, 'https://drive.google.com/file/d/16p-VCYY82ac-Y8hadIo6jyf7VBMuBwiQ/view?usp=sharing'),
(62, 'https://drive.google.com/file/d/1GBNUq2rAweWs272Ove2oHrcbKGYCJOd1/view?usp=sharing'),
(63, 'https://drive.google.com/file/d/1umeusPdZLRalFQtK5qSt6hKlsJbzwEgz/view?usp=sharing'),
(63.2, 'https://drive.google.com/file/d/1sTJ8qMID0OdnKdn9KsW_wEDuKE9-wdIx/view?usp=sharing'),
(64, 'https://drive.google.com/file/d/19SBpdZuaSA-apu8_XECLCxheKtd1PnRU/view?usp=sharing'),
(65, 'https://drive.google.com/file/d/1b8jqQqnuz0mRVk0w1-hArEFoQvszwS3z/view?usp=sharing'),
(66, 'https://drive.google.com/file/d/1_GlepZ35Hm2FrsHl2jqYwe1IO5-j2ypy/view?usp=sharing'),
(67, 'https://drive.google.com/file/d/1TydGU-CBeUC-BzqPUvSAfpXxK3yHohTf/view?usp=sharing'),
(68, 'https://drive.google.com/file/d/1dbxtWYfMLxR7UnyeRrdX3hxKc1KZYesl/view?usp=sharing'),
(69, 'https://drive.google.com/file/d/1xYfJ56Cx3ptvjX3FnNKjcu-rL4HPI-h3/view?usp=sharing'),
(70, 'https://drive.google.com/file/d/1fze77M5JlR1R5t89Jtk4tWyERMUI-gYo/view?usp=sharing'),
(71, 'https://drive.google.com/file/d/1Jbh-Ss8xXmHRdUAz0yDf2vricfkA2zVy/view?usp=sharing'),
(72, 'https://drive.google.com/file/d/1vFjLbJXOojKQWgkfIXyBx_dY9ObsH-xK/view?usp=sharing'),
(73, 'https://drive.google.com/file/d/1R5ZjmV5swJw0Nm-O2HajPoK51jDYjFN7/view?usp=sharing'),
(74, 'https://drive.google.com/file/d/1ZPQ1HILh-YYFqjTmkhJMWfJIcY5tsmqE/view?usp=sharing'),
(75, 'https://drive.google.com/file/d/1wrgkKZM8fq4MGixi6OacEFullXAQhyCh/view?usp=sharing'),
(75.1, 'https://drive.google.com/file/d/136ONA2ugmbVjVGoJwLP8luYkaz4OqIPW/view?usp=sharing'),
(76, 'https://drive.google.com/file/d/1iU1LNI-QZm_Y3fOO_e9OKh30htf4kjBl/view?usp=sharing'),
(77, 'https://drive.google.com/file/d/12MykmJpVtf-5qalTip169YCQwBGhoccF/view?usp=sharing'),
(78, 'https://drive.google.com/file/d/1QAkXIO3By3LjM3yMz9MJ5XLU6bSjALvf/view?usp=sharing'),
(79, 'https://drive.google.com/file/d/1BJMA1UuZpIZj4OizknIPGHYXTLOVlOaI/view?usp=sharing'),
(80, 'https://drive.google.com/file/d/1ETQEtD-Q3fdWTAxDR3tHxopZ-mECPpa6/view?usp=sharing'),
(81, 'https://drive.google.com/file/d/1t6-YSil44GSXwWI0kruKV_hQg-xP6gcZ/view?usp=sharing');

CREATE TABLE anime_episodes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    season INT NOT NULL,
    episode INT NOT NULL,
    drive_link TEXT NOT NULL
);

INSERT INTO anime_episodes (season, episode, drive_link) VALUES 
(1, 1, 'https://drive.google.com/file/d/1USAn35mJBimLB2NykSCQ1d92Dsa2XWld/view?usp=sharing'),
(1, 2, 'https://drive.google.com/file/d/1fBRnlwjLKbQjdfsoLaSKKZ-fGZy_E0Th/view?usp=sharing'),
(1, 3, 'https://drive.google.com/file/d/1yufCBvgBSyqW038-dE4Orpl7yJKuswMo/view?usp=sharing'),
(1, 4, 'https://drive.google.com/file/d/1VlNf_gZDSdpqrP78BpjaAIVkYGoIQQj5/view?usp=sharing'),
(1, 5, 'https://drive.google.com/file/d/1Gq8UNzopdq2aD9wq8SbtUQvn51uuFgYI/view?usp=sharing'),
(1, 6, 'https://drive.google.com/file/d/1W6jfB1g6-XnwkGg20JcTpyd89E7VcNPS/view?usp=sharing'),
(1, 7, 'https://drive.google.com/file/d/1wFrkFbp4PoMbPr4ouP0yHa5SHk0Viy-9/view?usp=sharing'),
(1, 8, 'https://drive.google.com/file/d/1RozkO2WNCHQ__sYFZQAHewS4CU0rJYWX/view?usp=sharing'),
(1, 9, 'https://drive.google.com/file/d/1TGT8bMHhH28g2VVG7VMaHOE3_CcwSHER/view?usp=sharing'),
(1, 10, 'https://drive.google.com/file/d/1Q0pvpR7vbsdpqavUoIcjyrbjwOT3BIB5/view?usp=sharing'),
(1, 11, 'https://drive.google.com/file/d/1dHmWKJMJHIHIQwHs4Nx71T1rv1T9asta/view?usp=sharing'),
(1, 12, 'https://drive.google.com/file/d/1e9Th-pSCbbyVmbnkgoIKUUIH4Ap47rOz/view?usp=sharing'),
(1, 13, 'https://drive.google.com/file/d/13obBVfYhl1YEd6sCvEzkwiatKTts4-ps/view?usp=sharing'),
(1, 14, 'https://drive.google.com/file/d/1XkKB2bEFdI_yTU7r3b7VLdhpr1TxYVzJ/view?usp=sharing'),
(1, 15, 'https://drive.google.com/file/d/1gAVybCDl9qzO4xJpVl7vW2K-1alM3hOZ/view?usp=sharing'),
(1, 16, 'https://drive.google.com/file/d/1r4NOXuH5lLKlvqjBTex60BLt5Y6ERUbG/view?usp=sharing'),
(1, 17, 'https://drive.google.com/file/d/1EhzFjbhfLRwQr8ZBv91jR-veLai668rx/view?usp=sharing'),
(1, 18, 'https://drive.google.com/file/d/1lFbHTq579dp1CKT7V2JmOvAyhCnJwGiP/view?usp=sharing'),
(1, 19, 'https://drive.google.com/file/d/1-D_0pnxliHhsNkmULZI7KTil_LlOgWla/view?usp=sharing'),
(1, 20, 'https://drive.google.com/file/d/1V0dIRDt-6guigC5m6spnzzv4eiC9nrPT/view?usp=sharing'),
(1, 21, 'https://drive.google.com/file/d/17ZsO9UrSdpBfSXyK4MLqmzkxarT3Okrl/view?usp=sharing'),
(1, 22, 'https://drive.google.com/file/d/1rFVgXOfJ1_pcZwoK5G_LLJXNZHHc3YeK/view?usp=sharing'),
(1, 23, 'https://drive.google.com/file/d/1o5gifZ_IJu4TKo1ErmjxC9bfheb_tGYu/view?usp=sharing'),
(1, 24, 'https://drive.google.com/file/d/1N5Tf87fT-NGnLJ44dA39d8d3orPg2c9T/view?usp=sharing'),
(2, 1, 'https://drive.google.com/file/d/1ynBOkQJCaAVN49y4x1J4psJHIt51bjPd/view?usp=sharing'),
(2, 2, 'https://drive.google.com/file/d/1_dexKKoVXevPLNvRd9iiEjhj7by-5W5v/view?usp=sharing'),
(2, 3, 'https://drive.google.com/file/d/1jvvah4ER5sOnL4IcbKS-0_OiJTk3QdOx/view?usp=sharing'),
(2, 4, 'https://drive.google.com/file/d/1sgZVepYkLCwkM2Rceb-7kRDMNQjSNyaa/view?usp=sharing'),
(2, 5, 'https://drive.google.com/file/d/14aH_1ORCqWAljDugN4ZuE8GeVnT5JhpQ/view?usp=sharing'),
(2, 6, 'https://drive.google.com/file/d/17XOExJKdntO8aZGXM8C-0eTn5WYlORbJ/view?usp=sharing'),
(2, 7, 'https://drive.google.com/file/d/1sDOhP5jh_QP4jv-LBDz-sdbDFOI6jGiq/view?usp=sharing'),
(2, 8, 'https://drive.google.com/file/d/1zPLqsSVl1oEE0BrHo-n-nwm2SFS3s3Mb/view?usp=sharing'),
(2, 9, 'https://drive.google.com/file/d/175UGLQpZAPqrKaIiNCkT7iipd1yYRv3i/view?usp=sharing'),
(2, 10, 'https://drive.google.com/file/d/1R3AMF-surXTkCasuFvP1Jasain5Rld2M/view?usp=sharing'),
(2, 11, 'https://drive.google.com/file/d/1MKzDdW8qGVF-Zp3VG69RElmqQYdZMOXI/view?usp=sharing'),
(2, 12, 'https://drive.google.com/file/d/1ErZSATe3bagy26FoNcbqQUaHVIdXY8n-/view?usp=sharing'),
(2, 13, 'https://drive.google.com/file/d/1WRS67HiOzhnhVPfYddB-5lF-RIO4tL67/view?usp=sharing'),
(2, 14, 'https://drive.google.com/file/d/1AhfA0TH5MONuqQLnmBkcqbKxnLbX6rlV/view?usp=sharing'),
(2, 15, 'https://drive.google.com/file/d/13fI4L8z4XvStj5F450CBZP7jiclmz73n/view?usp=sharing'),
(2, 16, 'https://drive.google.com/file/d/1hv1ojRc0Pm6PjyQxc8FB_SNHHQXatCm_/view?usp=sharing'),
(2, 17, 'https://drive.google.com/file/d/13g8ynpqJjxFJ1dYZRogNuJRmZ4Fn8P1a/view?usp=sharing'),
(2, 18, 'https://drive.google.com/file/d/1mdKkBZa5XNrfGit52HapMTm7ZVZXXWj1/view?usp=sharing'),
(2, 19, 'https://drive.google.com/file/d/14uRFpE3nUDEiiTPLZIzuOb0NJuaLNWxf/view?usp=sharing'),
(2, 20, 'https://drive.google.com/file/d/1G6DNNHaRenT3iXSrNsyN7dRUwTBd0S7S/view?usp=sharing'),
(2, 21, 'https://drive.google.com/file/d/1xwlZVybtb4p0sfl94vUzT6fwJjxwqem4/view?usp=sharing'),
(2, 22, 'https://drive.google.com/file/d/1xD2dWpHiuV5E5_EnAvV31Dm0BUDoe75V/view?usp=sharing'),
(2, 23, 'https://drive.google.com/file/d/1K3Y0aIsSaRqwMflDVhzr6N9p9j_pgO8v/view?usp=sharing'),
(2, 24, 'https://drive.google.com/file/d/16Be5Q28OqvvRC4pqx_Rfss_uYh8ciMPg/view?usp=sharing');

select * from anime_episodes;

UPDATE anime_episodes 
SET drive_link = 'https://drive.google.com/file/d/1X_v0VdpPUWeeS6ffzVZchndYLX_TsEg_/view?usp=sharing' 
WHERE id=40;
