--
-- PostgreSQL database dump
--

\restrict 7xPX85DifFplYkpgT2SURteUDHzTduA1AN8n4M3xRkeAQjal6WCXD4tJ3QCy31u

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-04-27 19:13:07

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 860 (class 1247 OID 16438)
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'EMPLOYEE',
    'MANAGER',
    'HR'
);


ALTER TYPE public."enum_Users_role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16461)
-- Name: Attendances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Attendances" (
    id integer NOT NULL,
    user_id integer,
    date date,
    check_in timestamp with time zone,
    check_out timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Attendances" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16460)
-- Name: Attendances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Attendances_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Attendances_id_seq" OWNER TO postgres;

--
-- TOC entry 4958 (class 0 OID 0)
-- Dependencies: 221
-- Name: Attendances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Attendances_id_seq" OWNED BY public."Attendances".id;


--
-- TOC entry 226 (class 1259 OID 16484)
-- Name: LeaveTypes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LeaveTypes" (
    id integer NOT NULL,
    name character varying(255),
    quota integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."LeaveTypes" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16483)
-- Name: LeaveTypes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."LeaveTypes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."LeaveTypes_id_seq" OWNER TO postgres;

--
-- TOC entry 4959 (class 0 OID 0)
-- Dependencies: 225
-- Name: LeaveTypes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."LeaveTypes_id_seq" OWNED BY public."LeaveTypes".id;


--
-- TOC entry 224 (class 1259 OID 16471)
-- Name: Leaves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Leaves" (
    id integer NOT NULL,
    user_id integer,
    leave_type character varying(255),
    start_date date,
    end_date date,
    reason character varying(255),
    status character varying(255) DEFAULT 'PENDING'::character varying,
    remark character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    leave_type_id integer
);


ALTER TABLE public."Leaves" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16470)
-- Name: Leaves_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Leaves_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Leaves_id_seq" OWNER TO postgres;

--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 223
-- Name: Leaves_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Leaves_id_seq" OWNED BY public."Leaves".id;


--
-- TOC entry 227 (class 1259 OID 16511)
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16446)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    password character varying(255),
    role public."enum_Users_role",
    manager_id integer,
    is_active boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16445)
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO postgres;

--
-- TOC entry 4961 (class 0 OID 0)
-- Dependencies: 219
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- TOC entry 4779 (class 2604 OID 16464)
-- Name: Attendances id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attendances" ALTER COLUMN id SET DEFAULT nextval('public."Attendances_id_seq"'::regclass);


--
-- TOC entry 4782 (class 2604 OID 16487)
-- Name: LeaveTypes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LeaveTypes" ALTER COLUMN id SET DEFAULT nextval('public."LeaveTypes_id_seq"'::regclass);


--
-- TOC entry 4780 (class 2604 OID 16474)
-- Name: Leaves id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Leaves" ALTER COLUMN id SET DEFAULT nextval('public."Leaves_id_seq"'::regclass);


--
-- TOC entry 4777 (class 2604 OID 16449)
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- TOC entry 4947 (class 0 OID 16461)
-- Dependencies: 222
-- Data for Name: Attendances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Attendances" (id, user_id, date, check_in, check_out, "createdAt", "updatedAt") FROM stdin;
1	1	2026-04-25	2026-04-25 23:32:32.292+05:30	2026-04-25 23:34:25.841+05:30	2026-04-25 23:32:32.294+05:30	2026-04-25 23:34:25.841+05:30
2	11	2026-04-26	2026-04-26 14:52:56.105+05:30	2026-04-26 14:53:09.896+05:30	2026-04-26 14:52:56.115+05:30	2026-04-26 14:53:09.899+05:30
3	13	2026-04-26	2026-04-26 22:08:41.607+05:30	2026-04-26 22:09:08.105+05:30	2026-04-26 22:08:41.611+05:30	2026-04-26 22:09:08.105+05:30
4	12	2026-04-26	2026-04-26 23:07:39.036+05:30	2026-04-26 23:09:14.731+05:30	2026-04-26 23:07:39.037+05:30	2026-04-26 23:09:14.731+05:30
5	14	2026-04-26	2026-04-26 23:25:43.743+05:30	2026-04-26 23:31:32.173+05:30	2026-04-26 23:25:43.743+05:30	2026-04-26 23:31:32.173+05:30
6	21	2026-04-26	2026-04-27 00:02:01.548+05:30	2026-04-27 00:02:03.492+05:30	2026-04-27 00:02:01.549+05:30	2026-04-27 00:02:03.492+05:30
7	22	2026-04-27	2026-04-27 12:01:48.044+05:30	2026-04-27 12:01:55.217+05:30	2026-04-27 12:01:48.045+05:30	2026-04-27 12:01:55.218+05:30
8	23	2026-04-27	2026-04-27 12:41:11.113+05:30	\N	2026-04-27 12:41:11.114+05:30	2026-04-27 12:41:11.114+05:30
9	1	2026-04-27	2026-04-27 14:07:53.826+05:30	\N	2026-04-27 14:07:53.831+05:30	2026-04-27 14:07:53.831+05:30
10	12	2026-04-27	2026-04-27 16:20:07.328+05:30	2026-04-27 18:00:28.103+05:30	2026-04-27 16:20:07.328+05:30	2026-04-27 18:00:28.107+05:30
\.


--
-- TOC entry 4951 (class 0 OID 16484)
-- Dependencies: 226
-- Data for Name: LeaveTypes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LeaveTypes" (id, name, quota, "createdAt", "updatedAt") FROM stdin;
1	Sick Leave	10	2026-04-27 16:11:56.224+05:30	2026-04-27 16:11:56.224+05:30
2	Sick leave	6	2026-04-27 16:17:09.573+05:30	2026-04-27 16:17:09.573+05:30
3	personal leave	6	2026-04-27 16:18:29.622+05:30	2026-04-27 16:18:29.622+05:30
\.


--
-- TOC entry 4949 (class 0 OID 16471)
-- Dependencies: 224
-- Data for Name: Leaves; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Leaves" (id, user_id, leave_type, start_date, end_date, reason, status, remark, "createdAt", "updatedAt", leave_type_id) FROM stdin;
1	12	Sick Leave	2026-04-28	2026-04-29	Personal work	PENDING	\N	2026-04-27 17:25:55.701+05:30	2026-04-27 17:25:55.701+05:30	1
2	1	Sick leave	2026-04-27	2026-04-28	not well	PENDING	\N	2026-04-27 17:29:52.266+05:30	2026-04-27 17:29:52.266+05:30	2
\.


--
-- TOC entry 4952 (class 0 OID 16511)
-- Dependencies: 227
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
202604260001-create-users.js
202604260002-create-attendance.js
202604260003-create-leaves.js
202604260004-create-leavetypes.js
\.


--
-- TOC entry 4945 (class 0 OID 16446)
-- Dependencies: 220
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, name, email, password, role, manager_id, is_active, "createdAt", "updatedAt") FROM stdin;
1	John	john@gmail.com	$2b$10$44ILTczcVX6eowN9nF1TvuSC2BqFNh.SR7UnR6ntnohOefj.Y2GX.	MANAGER	\N	t	2026-04-25 23:06:55.851+05:30	2026-04-25 23:06:55.851+05:30
6	singh	singh@gmail.com	$2b$10$tJVGiojWA3rLfTbpeLE5ju4RBbPBxGV96mkjXne27dGeRrZpsS9e.	MANAGER	2	t	2026-04-26 01:50:51.358+05:30	2026-04-26 01:50:51.358+05:30
7		john1@gmail.com	$2b$10$1t28Tbr5GKFr1nv72LIYuucJ6zPyZhUx3gE/IWsi/7SW7puiiSGqC	EMPLOYEE	\N	t	2026-04-26 14:16:22.201+05:30	2026-04-26 14:16:22.201+05:30
8		john3@gmail.com	$2b$10$MehKk6jMSwU0fLprckAiaeq/FAL7MCrOe56ucacOVfcDe1FveFc3q	HR	\N	t	2026-04-26 14:18:02.656+05:30	2026-04-26 14:18:02.656+05:30
11		pradnya@gmail.com	$2b$10$Y3pCOhL0hAwKTMKgB1eyUOYYE3ggnddlwhcsHIiUYj2.CXXOuRno.	EMPLOYEE	\N	t	2026-04-26 14:28:12.011+05:30	2026-04-26 14:28:12.011+05:30
12	abhishek	abhishek@gmail.com	$2b$10$dF9nVEv2CDICd.bjQ71N0OG1O5t8aUlZVwgG9vwOnpbbHfB.XEcsu	EMPLOYEE	\N	t	2026-04-26 15:46:20.503+05:30	2026-04-26 15:46:20.503+05:30
13	abhishek1	abhishek1@gmail.com	$2b$10$uju1xVmV0EEc1/oz9DUnNe5WQ3c6AJR9IKQxdmL7fn7wO8adj.68K	EMPLOYEE	1	t	2026-04-26 15:53:57.65+05:30	2026-04-26 15:53:57.65+05:30
15	abc	abc@gmail.com	$2b$10$9pLP1OP15gSzWeIRCDt3suSBPO1/LxiTjsevgYjhvr33XGsJImhQG	HR	\N	t	2026-04-26 23:40:52.601+05:30	2026-04-26 23:40:52.601+05:30
14	ps	yyyhjhntf@gmail.com	$2b$10$MvfB7Zu8noVTPoTUw6fWBueEYEteLjTFxCjI5ujZevSgf/G87gfly	EMPLOYEE	1	f	2026-04-26 23:25:12.818+05:30	2026-04-26 23:47:08.732+05:30
17	asd	asd@gmail.com	$2b$10$HTlT/BrKIMY1FaKP3yxX2uGWnBXuIBT7AwLH/wk.niJGhkNfnTljC	MANAGER	111	t	2026-04-27 00:00:22.692+05:30	2026-04-27 00:00:22.692+05:30
21	pradnya1	pradnya1@gmail.com	$2b$10$j1QeppQDXUGXB.a4N.jpSOzsdr4rHr8nvpbHSZ5HmUAyuf3.gReUq	MANAGER	\N	t	2026-04-27 00:01:43.375+05:30	2026-04-27 00:01:43.375+05:30
16	qwe	qwe@gmail.com	$2b$10$WlZd7bL25G4GHEVdoW3zjenxCG38kmkfF1.1PpaDK2vvDyFvvX7wu	EMPLOYEE	21	t	2026-04-26 23:55:40.58+05:30	2026-04-27 00:08:03.075+05:30
22	kirti	kirti@gmail.com	$2b$10$2CUq0S7Q9uVA4cSpcpperejxLuCgxEcWJBiXeNBIydE.Y5LQJm5jS	HR	\N	t	2026-04-27 11:47:08.797+05:30	2026-04-27 11:47:08.797+05:30
23	suraj	suraj@gmail.com	$2b$10$UwXEvs45YLjnTYI4IKDw.ejhK71ZC949E24A3QzN9lvOHH/WpJ11O	MANAGER	\N	t	2026-04-27 12:39:41.634+05:30	2026-04-27 12:39:41.634+05:30
\.


--
-- TOC entry 4962 (class 0 OID 0)
-- Dependencies: 221
-- Name: Attendances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Attendances_id_seq"', 10, true);


--
-- TOC entry 4963 (class 0 OID 0)
-- Dependencies: 225
-- Name: LeaveTypes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."LeaveTypes_id_seq"', 3, true);


--
-- TOC entry 4964 (class 0 OID 0)
-- Dependencies: 223
-- Name: Leaves_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Leaves_id_seq"', 2, true);


--
-- TOC entry 4965 (class 0 OID 0)
-- Dependencies: 219
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 23, true);


--
-- TOC entry 4790 (class 2606 OID 16469)
-- Name: Attendances Attendances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attendances"
    ADD CONSTRAINT "Attendances_pkey" PRIMARY KEY (id);


--
-- TOC entry 4794 (class 2606 OID 16492)
-- Name: LeaveTypes LeaveTypes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LeaveTypes"
    ADD CONSTRAINT "LeaveTypes_pkey" PRIMARY KEY (id);


--
-- TOC entry 4792 (class 2606 OID 16482)
-- Name: Leaves Leaves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Leaves"
    ADD CONSTRAINT "Leaves_pkey" PRIMARY KEY (id);


--
-- TOC entry 4796 (class 2606 OID 16516)
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- TOC entry 4784 (class 2606 OID 16496)
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- TOC entry 4786 (class 2606 OID 16498)
-- Name: Users Users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key1" UNIQUE (email);


--
-- TOC entry 4788 (class 2606 OID 16457)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


-- Completed on 2026-04-27 19:13:08

--
-- PostgreSQL database dump complete
--

\unrestrict 7xPX85DifFplYkpgT2SURteUDHzTduA1AN8n4M3xRkeAQjal6WCXD4tJ3QCy31u

