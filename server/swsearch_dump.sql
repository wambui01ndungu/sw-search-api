--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: swuser
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO swuser;

--
-- Name: search_cache; Type: TABLE; Schema: public; Owner: swuser
--

CREATE TABLE public.search_cache (
    id integer NOT NULL,
    "timestamp" timestamp without time zone,
    search_term character varying NOT NULL,
    results json NOT NULL,
    use_id integer
);


ALTER TABLE public.search_cache OWNER TO swuser;

--
-- Name: search_cache_id_seq; Type: SEQUENCE; Schema: public; Owner: swuser
--

CREATE SEQUENCE public.search_cache_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.search_cache_id_seq OWNER TO swuser;

--
-- Name: search_cache_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: swuser
--

ALTER SEQUENCE public.search_cache_id_seq OWNED BY public.search_cache.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: swuser
--

CREATE TABLE public.users (
    id integer NOT NULL,
    firstname character varying NOT NULL,
    surname character varying NOT NULL,
    email character varying(234) NOT NULL,
    password_hash character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO swuser;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: swuser
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO swuser;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: swuser
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: search_cache id; Type: DEFAULT; Schema: public; Owner: swuser
--

ALTER TABLE ONLY public.search_cache ALTER COLUMN id SET DEFAULT nextval('public.search_cache_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: swuser
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: swuser
--

COPY public.alembic_version (version_num) FROM stdin;
5801e45ba3f7
\.


--
-- Data for Name: search_cache; Type: TABLE DATA; Schema: public; Owner: swuser
--

COPY public.search_cache (id, "timestamp", search_term, results, use_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: swuser
--

COPY public.users (id, firstname, surname, email, password_hash) FROM stdin;
7	Margaret	Wambui	wambuindungu4967@gmail.com	$2b$12$FiVsf4h2XEEF33OaBlRY.OV7ChU1nofD3nYAHA.FU3jhhgK/CAmI.
\.


--
-- Name: search_cache_id_seq; Type: SEQUENCE SET; Schema: public; Owner: swuser
--

SELECT pg_catalog.setval('public.search_cache_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: swuser
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: swuser
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: search_cache search_cache_pkey; Type: CONSTRAINT; Schema: public; Owner: swuser
--

ALTER TABLE ONLY public.search_cache
    ADD CONSTRAINT search_cache_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: swuser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: swuser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: search_cache search_cache_use_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: swuser
--

ALTER TABLE ONLY public.search_cache
    ADD CONSTRAINT search_cache_use_id_fkey FOREIGN KEY (use_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

