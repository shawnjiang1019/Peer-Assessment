--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

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

ALTER TABLE ONLY public.student_survey DROP CONSTRAINT student_survey_question_id_fkey;
ALTER TABLE ONLY public.student_survey DROP CONSTRAINT student_survey_group_id_fkey;
ALTER TABLE ONLY public.student_survey DROP CONSTRAINT student_survey_evaluator_id_fkey;
ALTER TABLE ONLY public.student_survey DROP CONSTRAINT student_survey_evaluatee_id_fkey;
ALTER TABLE ONLY public.student_survey DROP CONSTRAINT student_survey_course_id_fkey;
ALTER TABLE ONLY public.student_group DROP CONSTRAINT student_group_student_id_fkey;
ALTER TABLE ONLY public.student_group DROP CONSTRAINT student_group_group_id_fkey;
ALTER TABLE ONLY public.student_adjustment_factors DROP CONSTRAINT student_adjustment_factors_utorid_fkey;
ALTER TABLE ONLY public.student_adjustment_factors DROP CONSTRAINT student_adjustment_factors_courseid_fkey;
ALTER TABLE ONLY public.enrolledin DROP CONSTRAINT enrolledin_student_id_fkey;
ALTER TABLE ONLY public.enrolledin DROP CONSTRAINT enrolledin_course_id_fkey;
ALTER TABLE ONLY public.courses DROP CONSTRAINT courses_lecturer_id_fkey;
DROP INDEX public.ix_users_id;
DROP INDEX public.ix_student_adjustment_factors_id;
DROP INDEX public.ix_groups_id;
DROP INDEX public.ix_courses_code;
ALTER TABLE ONLY public.students DROP CONSTRAINT utorid_unique_constraint;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.students DROP CONSTRAINT students_student_id_key;
ALTER TABLE ONLY public.students DROP CONSTRAINT students_pkey;
ALTER TABLE ONLY public.student_survey DROP CONSTRAINT student_survey_pkey;
ALTER TABLE ONLY public.student_group DROP CONSTRAINT student_group_pkey;
ALTER TABLE ONLY public.student_adjustment_factors DROP CONSTRAINT student_adjustment_factors_pkey;
ALTER TABLE ONLY public.question DROP CONSTRAINT question_pkey;
ALTER TABLE ONLY public.groups DROP CONSTRAINT groups_pkey;
ALTER TABLE ONLY public.enrolledin DROP CONSTRAINT enrolledin_pkey;
ALTER TABLE ONLY public.courses DROP CONSTRAINT courses_pkey;
ALTER TABLE ONLY public.alembic_version DROP CONSTRAINT alembic_version_pkc;
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.students ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.student_survey ALTER COLUMN survey_response_id DROP DEFAULT;
ALTER TABLE public.student_adjustment_factors ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.groups ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.enrolledin ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.courses ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE public.users_id_seq;
DROP TABLE public.users;
DROP SEQUENCE public.students_id_seq;
DROP TABLE public.students;
DROP SEQUENCE public.student_survey_survey_response_id_seq;
DROP TABLE public.student_survey;
DROP TABLE public.student_group;
DROP SEQUENCE public.student_adjustment_factors_id_seq;
DROP TABLE public.student_adjustment_factors;
DROP TABLE public.question;
DROP SEQUENCE public.groups_id_seq;
DROP TABLE public.groups;
DROP SEQUENCE public.enrolledin_id_seq;
DROP TABLE public.enrolledin;
DROP SEQUENCE public.courses_id_seq;
DROP TABLE public.courses;
DROP TABLE public.alembic_version;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    code character varying,
    session character varying,
    lecturer_id integer
);


--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: enrolledin; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enrolledin (
    id integer NOT NULL,
    student_id integer,
    course_id integer
);


--
-- Name: enrolledin_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.enrolledin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: enrolledin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.enrolledin_id_seq OWNED BY public.enrolledin.id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    "courseCode" character varying,
    "groupNumber" integer,
    "courseID" integer NOT NULL
);


--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- Name: question; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.question (
    qid character varying NOT NULL,
    options integer[]
);


--
-- Name: student_adjustment_factors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_adjustment_factors (
    id integer NOT NULL,
    name character varying,
    "courseCode" character varying,
    utorid character varying,
    courseid integer,
    "groupNumber" integer,
    "factorWithSelf" double precision,
    "factorWithoutSelf" double precision
);


--
-- Name: student_adjustment_factors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_adjustment_factors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_adjustment_factors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_adjustment_factors_id_seq OWNED BY public.student_adjustment_factors.id;


--
-- Name: student_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_group (
    student_id integer NOT NULL,
    group_id integer NOT NULL
);


--
-- Name: student_survey; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_survey (
    survey_response_id integer NOT NULL,
    evaluator_id integer,
    evaluatee_id integer,
    question_id character varying,
    answer integer,
    group_id integer,
    course_id integer,
    course_code character varying
);


--
-- Name: student_survey_survey_response_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_survey_survey_response_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_survey_survey_response_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_survey_survey_response_id_seq OWNED BY public.student_survey.survey_response_id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.students (
    id integer NOT NULL,
    student_id integer,
    email character varying,
    name character varying,
    firstname character varying,
    lastname character varying,
    utorid character varying
);


--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying,
    email character varying,
    auth0_id character varying,
    role character varying(255)
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: enrolledin id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrolledin ALTER COLUMN id SET DEFAULT nextval('public.enrolledin_id_seq'::regclass);


--
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- Name: student_adjustment_factors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_adjustment_factors ALTER COLUMN id SET DEFAULT nextval('public.student_adjustment_factors_id_seq'::regclass);


--
-- Name: student_survey survey_response_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_survey ALTER COLUMN survey_response_id SET DEFAULT nextval('public.student_survey_survey_response_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.alembic_version (version_num) FROM stdin;
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.courses (id, code, session, lecturer_id) FROM stdin;
1	CSCC01	Fall 2025	2
2	STAC67	Fall 2025	2
\.


--
-- Data for Name: enrolledin; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.enrolledin (id, student_id, course_id) FROM stdin;
22	409358	2
23	523617	2
24	520185	2
25	818446	2
26	616305	2
27	834976	2
28	606785	2
29	850450	2
30	495391	2
31	740151	2
32	743517	2
33	608005	2
34	492774	2
35	313785	2
36	621625	2
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.groups (id, "courseCode", "groupNumber", "courseID") FROM stdin;
17	STAC67	1	2
18	STAC67	2	2
34	STAC67	3	2
\.


--
-- Data for Name: question; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.question (qid, options) FROM stdin;
q1	{1,2,3,4,5}
q2	{1,2,3,4,5}
q3	{1,2,3,4,5}
q4	{1,2,3,4,5}
q5	{1,2,3,4,5}
\.


--
-- Data for Name: student_adjustment_factors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_adjustment_factors (id, name, "courseCode", utorid, courseid, "groupNumber", "factorWithSelf", "factorWithoutSelf") FROM stdin;
28	test test	STAC67	jian1251	2	3	1	0
29	Dong Chen	STAC67	chendo37	2	3	1	1
30	Hale Chen	STAC67	chen1268	2	3	1	1
31	Yuening Chen	STAC67	cheny654	2	3	1	1
32	Allan Cheng	STAC67	cheng438	2	3	1	1
\.


--
-- Data for Name: student_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_group (student_id, group_id) FROM stdin;
409358	17
523617	17
520185	17
818446	17
616305	17
834976	17
606785	18
850450	18
495391	18
740151	18
743517	18
608005	34
492774	34
313785	34
621625	34
123456	34
\.


--
-- Data for Name: student_survey; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_survey (survey_response_id, evaluator_id, evaluatee_id, question_id, answer, group_id, course_id, course_code) FROM stdin;
54	123456	123456	q1	5	34	2	STAC67
55	123456	123456	q2	5	34	2	STAC67
56	123456	123456	q3	5	34	2	STAC67
57	123456	123456	q4	5	34	2	STAC67
58	123456	608005	q1	5	34	2	STAC67
59	123456	608005	q2	5	34	2	STAC67
60	123456	608005	q3	5	34	2	STAC67
61	123456	608005	q4	5	34	2	STAC67
62	123456	492774	q1	5	34	2	STAC67
63	123456	492774	q2	5	34	2	STAC67
64	123456	492774	q3	5	34	2	STAC67
65	123456	492774	q4	5	34	2	STAC67
66	123456	313785	q1	5	34	2	STAC67
67	123456	313785	q2	5	34	2	STAC67
68	123456	313785	q3	5	34	2	STAC67
69	123456	313785	q4	5	34	2	STAC67
70	123456	621625	q1	5	34	2	STAC67
71	123456	621625	q2	5	34	2	STAC67
72	123456	621625	q3	5	34	2	STAC67
73	123456	621625	q4	5	34	2	STAC67
74	123456	123456	q1	4	34	2	STAC67
75	123456	123456	q2	3	34	2	STAC67
76	123456	123456	q3	3	34	2	STAC67
77	123456	123456	q4	4	34	2	STAC67
78	123456	608005	q1	5	34	2	STAC67
79	123456	608005	q2	5	34	2	STAC67
80	123456	608005	q3	5	34	2	STAC67
81	123456	608005	q4	5	34	2	STAC67
82	123456	492774	q1	5	34	2	STAC67
83	123456	492774	q2	5	34	2	STAC67
84	123456	492774	q3	5	34	2	STAC67
85	123456	492774	q4	5	34	2	STAC67
86	123456	313785	q1	5	34	2	STAC67
87	123456	313785	q2	5	34	2	STAC67
88	123456	313785	q3	5	34	2	STAC67
89	123456	313785	q4	5	34	2	STAC67
90	123456	621625	q1	1	34	2	STAC67
91	123456	621625	q2	1	34	2	STAC67
92	123456	621625	q3	1	34	2	STAC67
93	123456	621625	q4	1	34	2	STAC67
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.students (id, student_id, email, name, firstname, lastname, utorid) FROM stdin;
123456	1009878517	unreachablestatement@gmail.com	test test	test	test	jian1251
409358	1007403383	wafa.abbas@mail.utoronto.ca	Wafa Abbas	Wafa	Abbas	abbaswaf
523617	1008347576	aidana.abdykerim@mail.utoronto.ca	Aidana Abdykerim	Aidana	Abdykerim	abdyker1
520185	1008318893	aamna.ahmed@mail.utoronto.ca	Aamna Ahmed	Aamna	Ahmed	ahmedaa7
818446	1010920452	andrea.ahumadaampudia@mail.utoronto.ca	Andrea Ahumada Ampudia	Andrea	Ahumada Ampudia	ahumadaa
616305	1007288775	jimin.an@mail.utoronto.ca	Jimin An	Jimin	An	anjimin
834976	1011265989	mikaela.antao@mail.utoronto.ca	Mikaela Antao	Mikaela	Antao	antaomik
606785	1009153568	muhammad.arham@mail.utoronto.ca	Muhammad Arham	Muhammad	Arham	arhammu3
850450	1011377216	kareem.babwah@mail.utoronto.ca	Kareem Babwah	Kareem	Babwah	babwahka
495391	1007672065	a.bridger@mail.utoronto.ca	Aidan Bridger	Aidan	Bridger	bridgerw
740151	1010389107	clarisse.chan@mail.utoronto.ca	Clarisse Chan	Clarisse	Chan	chancl38
743517	1010407631	josephchang.chang@mail.utoronto.ca	Joseph Chang	Joseph	Chang	chang328
608005	1009264369	chendong.chen@mail.utoronto.ca	Dong Chen	Dong	Chen	chendo37
492774	1007668659	hale.chen@mail.utoronto.ca	Hale Chen	Hale	Chen	chen1268
313785	1004985643	jeslyn.chen@mail.utoronto.ca	Yuening Chen	Yuening	Chen	cheny654
621625	1009125206	allanabc.cheng@mail.utoronto.ca	Allan Cheng	Allan	Cheng	cheng438
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, auth0_id, role) FROM stdin;
1	Shawn	test@gmail.com	\N	student
2	shawn.jiang@mail.utoronto.ca	shawn.jiang@mail.utoronto.ca	auth0|683cf8a756dc358480d48ba0	instructor
6	unreachablestatement@gmail.com	unreachablestatement@gmail.com	auth0|684ef011816b31469401095d	student
\.


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.courses_id_seq', 1, false);


--
-- Name: enrolledin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.enrolledin_id_seq', 36, true);


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.groups_id_seq', 34, true);


--
-- Name: student_adjustment_factors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.student_adjustment_factors_id_seq', 32, true);


--
-- Name: student_survey_survey_response_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.student_survey_survey_response_id_seq', 93, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.students_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: enrolledin enrolledin_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrolledin
    ADD CONSTRAINT enrolledin_pkey PRIMARY KEY (id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: question question_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT question_pkey PRIMARY KEY (qid);


--
-- Name: student_adjustment_factors student_adjustment_factors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_adjustment_factors
    ADD CONSTRAINT student_adjustment_factors_pkey PRIMARY KEY (id);


--
-- Name: student_group student_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_group
    ADD CONSTRAINT student_group_pkey PRIMARY KEY (student_id, group_id);


--
-- Name: student_survey student_survey_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_survey
    ADD CONSTRAINT student_survey_pkey PRIMARY KEY (survey_response_id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: students students_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_student_id_key UNIQUE (student_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: students utorid_unique_constraint; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT utorid_unique_constraint UNIQUE (utorid);


--
-- Name: ix_courses_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_courses_code ON public.courses USING btree (code);


--
-- Name: ix_groups_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_groups_id ON public.groups USING btree (id);


--
-- Name: ix_student_adjustment_factors_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_student_adjustment_factors_id ON public.student_adjustment_factors USING btree (id);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: courses courses_lecturer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_lecturer_id_fkey FOREIGN KEY (lecturer_id) REFERENCES public.users(id);


--
-- Name: enrolledin enrolledin_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrolledin
    ADD CONSTRAINT enrolledin_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: enrolledin enrolledin_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrolledin
    ADD CONSTRAINT enrolledin_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_adjustment_factors student_adjustment_factors_courseid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_adjustment_factors
    ADD CONSTRAINT student_adjustment_factors_courseid_fkey FOREIGN KEY (courseid) REFERENCES public.courses(id);


--
-- Name: student_adjustment_factors student_adjustment_factors_utorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_adjustment_factors
    ADD CONSTRAINT student_adjustment_factors_utorid_fkey FOREIGN KEY (utorid) REFERENCES public.students(utorid);


--
-- Name: student_group student_group_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_group
    ADD CONSTRAINT student_group_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: student_group student_group_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_group
    ADD CONSTRAINT student_group_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_survey student_survey_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_survey
    ADD CONSTRAINT student_survey_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: student_survey student_survey_evaluatee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_survey
    ADD CONSTRAINT student_survey_evaluatee_id_fkey FOREIGN KEY (evaluatee_id) REFERENCES public.students(id);


--
-- Name: student_survey student_survey_evaluator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_survey
    ADD CONSTRAINT student_survey_evaluator_id_fkey FOREIGN KEY (evaluator_id) REFERENCES public.students(id);


--
-- Name: student_survey student_survey_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_survey
    ADD CONSTRAINT student_survey_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: student_survey student_survey_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_survey
    ADD CONSTRAINT student_survey_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.question(qid);


--
-- PostgreSQL database dump complete
--

