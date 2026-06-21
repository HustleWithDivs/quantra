--
-- PostgreSQL database dump
--

\restrict CkUH3gVx9mYxPSbbuS8ka3A9dRzXdbuBktBI5iPy6QtfpDmq88089oe5FzTzVaZ

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.17

-- Started on 2026-06-21 11:33:17 UTC

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

DROP DATABASE IF EXISTS quantra_ops;
--
-- TOC entry 3702 (class 1262 OID 16384)
-- Name: quantra_ops; Type: DATABASE; Schema: -; Owner: quantra
--

CREATE DATABASE quantra_ops WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE quantra_ops OWNER TO quantra;

\unrestrict CkUH3gVx9mYxPSbbuS8ka3A9dRzXdbuBktBI5iPy6QtfpDmq88089oe5FzTzVaZ
\connect quantra_ops
\restrict CkUH3gVx9mYxPSbbuS8ka3A9dRzXdbuBktBI5iPy6QtfpDmq88089oe5FzTzVaZ

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

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3703 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16675)
-- Name: brand; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.brand (
    brand_id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    modified_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    modified_by uuid
);


ALTER TABLE public.brand OWNER TO quantra;

--
-- TOC entry 225 (class 1259 OID 16686)
-- Name: business_category; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.business_category (
    business_category_id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_category_name character varying(100) NOT NULL,
    business_category_description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    modified_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    modified_by uuid
);


ALTER TABLE public.business_category OWNER TO quantra;

--
-- TOC entry 226 (class 1259 OID 16697)
-- Name: category; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.category (
    category_id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_name character varying(100) NOT NULL,
    category_description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    modified_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    modified_by uuid
);


ALTER TABLE public.category OWNER TO quantra;

--
-- TOC entry 227 (class 1259 OID 16708)
-- Name: category_sub_category; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.category_sub_category (
    category_id uuid NOT NULL,
    sub_category_id uuid NOT NULL
);


ALTER TABLE public.category_sub_category OWNER TO quantra;

--
-- TOC entry 228 (class 1259 OID 16711)
-- Name: color; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.color (
    color_id uuid DEFAULT gen_random_uuid() NOT NULL,
    color_name character varying(100) NOT NULL,
    color_description text
);


ALTER TABLE public.color OWNER TO quantra;

--
-- TOC entry 214 (class 1259 OID 16452)
-- Name: country_with_currencies; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.country_with_currencies (
    country_id bigint NOT NULL,
    country_code character varying(10),
    country character varying(250),
    currency character varying(250),
    currency_code character varying(100),
    symbol character varying(100)
);


ALTER TABLE public.country_with_currencies OWNER TO quantra;

--
-- TOC entry 215 (class 1259 OID 16543)
-- Name: customer_order_history; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.customer_order_history (
    order_id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid,
    is_discounted boolean,
    price numeric(2,10) DEFAULT 0.00,
    quantity bigint,
    is_active boolean,
    created_at timestamp with time zone,
    created_by uuid,
    modified_by uuid,
    modified_at timestamp with time zone,
    total numeric(2,10) DEFAULT 0.00
);


ALTER TABLE public.customer_order_history OWNER TO quantra;

--
-- TOC entry 216 (class 1259 OID 16551)
-- Name: customers; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.customers (
    customer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(500) NOT NULL,
    telephone character varying(15) NOT NULL,
    address text,
    city character varying(500),
    country bigint,
    gender "char",
    date_of_birth date,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by uuid,
    modified_by uuid,
    modified_at timestamp with time zone
);


ALTER TABLE public.customers OWNER TO quantra;

--
-- TOC entry 229 (class 1259 OID 16719)
-- Name: department; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.department (
    department_id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_category_id uuid,
    department_name character varying(100) NOT NULL,
    department_description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    modified_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    modified_by uuid
);


ALTER TABLE public.department OWNER TO quantra;

--
-- TOC entry 230 (class 1259 OID 16730)
-- Name: department_category; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.department_category (
    department_id uuid NOT NULL,
    category_id uuid NOT NULL
);


ALTER TABLE public.department_category OWNER TO quantra;

--
-- TOC entry 231 (class 1259 OID 16733)
-- Name: material; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.material (
    material_id uuid DEFAULT gen_random_uuid() NOT NULL,
    material_name character varying(100) NOT NULL,
    material_description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    modified_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    modified_by uuid
);


ALTER TABLE public.material OWNER TO quantra;

--
-- TOC entry 217 (class 1259 OID 16561)
-- Name: order; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public."order" (
    order_id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_number character varying(50) NOT NULL,
    customer_id uuid,
    cart_value numeric(2,10) DEFAULT 0.00,
    total_amount numeric(2,10) DEFAULT 0.00,
    discount numeric(2,10) DEFAULT 0.00,
    coupon_applied numeric(2,10) DEFAULT 0.00,
    status bigint,
    currency bigint,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone,
    created_by uuid,
    modified_by uuid,
    modified_at timestamp with time zone
);


ALTER TABLE public."order" OWNER TO quantra;

--
-- TOC entry 218 (class 1259 OID 16572)
-- Name: permissions; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.permissions (
    permission_id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_by uuid,
    modified_by uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_at timestamp with time zone
);


ALTER TABLE public.permissions OWNER TO quantra;

--
-- TOC entry 232 (class 1259 OID 16744)
-- Name: product; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.product (
    product_id uuid DEFAULT gen_random_uuid() NOT NULL,
    sku character varying(100) NOT NULL,
    upc_ean character varying(100),
    product_name character varying(255) NOT NULL,
    short_description text,
    long_description text,
    business_category_id uuid,
    department_id uuid,
    category_id uuid,
    sub_category_id uuid,
    product_type_id uuid,
    brand_id uuid,
    supplier_id uuid,
    material_id uuid,
    cost_price numeric(12,2),
    selling_price numeric(12,2),
    stock_qty integer DEFAULT 0,
    barcode character varying(100),
    min_order_qty integer DEFAULT 1,
    weight numeric(10,3),
    dimensions character varying(255),
    is_active boolean DEFAULT true,
    is_taxable boolean DEFAULT true,
    is_perishable boolean DEFAULT false,
    expiry_date date,
    uom character varying(50),
    created_at timestamp with time zone DEFAULT now(),
    modified_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    modified_by uuid
);


ALTER TABLE public.product OWNER TO quantra;

--
-- TOC entry 233 (class 1259 OID 16759)
-- Name: product_type; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.product_type (
    product_type_id uuid DEFAULT gen_random_uuid() NOT NULL,
    sub_category_id uuid,
    product_type character varying(100) NOT NULL,
    product_type_description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    modified_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    modified_by uuid
);


ALTER TABLE public.product_type OWNER TO quantra;

--
-- TOC entry 234 (class 1259 OID 16770)
-- Name: product_type_material; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.product_type_material (
    product_type_id uuid NOT NULL,
    material_id uuid NOT NULL
);


ALTER TABLE public.product_type_material OWNER TO quantra;

--
-- TOC entry 235 (class 1259 OID 16773)
-- Name: product_variant; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.product_variant (
    product_variant_id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid NOT NULL,
    color_id uuid,
    size_id uuid,
    product_images text,
    created_at timestamp with time zone DEFAULT now(),
    modified_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    modified_by uuid
);


ALTER TABLE public.product_variant OWNER TO quantra;

--
-- TOC entry 219 (class 1259 OID 16582)
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.refresh_tokens (
    refresh_tokens_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    token_hash character varying,
    is_revoked boolean DEFAULT false,
    expires_at timestamp with time zone
);


ALTER TABLE public.refresh_tokens OWNER TO quantra;

--
-- TOC entry 220 (class 1259 OID 16591)
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.role_permissions (
    role_id uuid,
    permission_id uuid
);


ALTER TABLE public.role_permissions OWNER TO quantra;

--
-- TOC entry 221 (class 1259 OID 16594)
-- Name: roles; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.roles (
    role_id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_name character varying(200) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    modified_at timestamp with time zone,
    created_by uuid,
    modified_by uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.roles OWNER TO quantra;

--
-- TOC entry 236 (class 1259 OID 16783)
-- Name: size; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.size (
    size_id uuid DEFAULT gen_random_uuid() NOT NULL,
    size_name character varying(100) NOT NULL,
    size_description text
);


ALTER TABLE public.size OWNER TO quantra;

--
-- TOC entry 237 (class 1259 OID 16791)
-- Name: sub_category; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.sub_category (
    sub_category_id uuid DEFAULT gen_random_uuid() NOT NULL,
    sub_category_name character varying(255) NOT NULL,
    sub_category_description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    modified_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    modified_by uuid
);


ALTER TABLE public.sub_category OWNER TO quantra;

--
-- TOC entry 238 (class 1259 OID 16802)
-- Name: subcategory_product_type; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.subcategory_product_type (
    sub_category_id uuid NOT NULL,
    product_type_id uuid NOT NULL
);


ALTER TABLE public.subcategory_product_type OWNER TO quantra;

--
-- TOC entry 239 (class 1259 OID 16805)
-- Name: supplier; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.supplier (
    supplier_id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_code character varying(50),
    supplier_name character varying(255) NOT NULL,
    contact_person character varying(255),
    email character varying(255),
    phone character varying(20),
    address text,
    city character varying(100),
    state character varying(100),
    gst_number character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    modified_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    modified_by uuid,
    country_id bigint
);


ALTER TABLE public.supplier OWNER TO quantra;

--
-- TOC entry 222 (class 1259 OID 16604)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.user_roles (
    user_id uuid,
    role_id uuid
);


ALTER TABLE public.user_roles OWNER TO quantra;

--
-- TOC entry 223 (class 1259 OID 16607)
-- Name: users; Type: TABLE; Schema: public; Owner: quantra
--

CREATE TABLE public.users (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    password_hash character varying NOT NULL,
    gender "char" NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by uuid,
    modified_at timestamp with time zone,
    modified_by uuid,
    is_active boolean DEFAULT true NOT NULL,
    email character varying(500) NOT NULL
);


ALTER TABLE public.users OWNER TO quantra;

--
-- TOC entry 3681 (class 0 OID 16675)
-- Dependencies: 224
-- Data for Name: brand; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3682 (class 0 OID 16686)
-- Dependencies: 225
-- Data for Name: business_category; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3683 (class 0 OID 16697)
-- Dependencies: 226
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3684 (class 0 OID 16708)
-- Dependencies: 227
-- Data for Name: category_sub_category; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3685 (class 0 OID 16711)
-- Dependencies: 228
-- Data for Name: color; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3671 (class 0 OID 16452)
-- Dependencies: 214
-- Data for Name: country_with_currencies; Type: TABLE DATA; Schema: public; Owner: quantra
--

INSERT INTO public.country_with_currencies (country_id, country_code, country, currency, currency_code, symbol) VALUES
	(1, 'AF', 'Afghanistan', 'Afghani', 'AFN', '؋'),
	(2, 'AX', 'Åland Islands', 'Euro', 'EUR', '€'),
	(3, 'AL', 'Albania', 'Lek', 'ALL', 'Lek'),
	(4, 'DZ', 'Algeria', 'Algerian Dinar', 'DZD', NULL),
	(5, 'AS', 'American Samoa', 'US Dollar', 'USD', '$'),
	(6, 'AD', 'Andorra', 'Euro', 'EUR', '€'),
	(7, 'AO', 'Angola', 'Kwanza', 'AOA', NULL),
	(8, 'AI', 'Anguilla', 'East Caribbean Dollar', 'XCD', NULL),
	(9, 'AG', 'Antigua And Barbuda', 'East Caribbean Dollar', 'XCD', NULL),
	(10, 'AR', 'Argentina', 'Argentine Peso', 'ARS', '$'),
	(11, 'AM', 'Armenia', 'Armenian Dram', 'AMD', NULL),
	(12, 'AW', 'Aruba', 'Aruban Florin', 'AWG', NULL),
	(13, 'AU', 'Australia', 'Australian Dollar', 'AUD', '$'),
	(14, 'AT', 'Austria', 'Euro', 'EUR', '€'),
	(15, 'AZ', 'Azerbaijan', 'Azerbaijan Manat', 'AZN', NULL),
	(16, 'BS', 'Bahamas', 'Bahamian Dollar', 'BSD', '$'),
	(17, 'BH', 'Bahrain', 'Bahraini Dinar', 'BHD', NULL),
	(18, 'BD', 'Bangladesh', 'Taka', 'BDT', '৳'),
	(19, 'BB', 'Barbados', 'Barbados Dollar', 'BBD', '$'),
	(20, 'BY', 'Belarus', 'Belarusian Ruble', 'BYN', NULL),
	(21, 'BE', 'Belgium', 'Euro', 'EUR', '€'),
	(22, 'BZ', 'Belize', 'Belize Dollar', 'BZD', 'BZ$'),
	(23, 'BJ', 'Benin', 'CFA Franc BCEAO', 'XOF', NULL),
	(24, 'BM', 'Bermuda', 'Bermudian Dollar', 'BMD', NULL),
	(25, 'BT', 'Bhutan', 'Ngultrum', 'BTN', NULL),
	(26, 'BO', 'Bolivia', 'Boliviano', 'BOB', NULL),
	(27, 'BQ', 'Bonaire, Sint Eustatius And Saba', 'US Dollar', 'USD', '$'),
	(28, 'BA', 'Bosnia And Herzegovina', 'Convertible Mark', 'BAM', NULL),
	(29, 'BW', 'Botswana', 'Pula', 'BWP', NULL),
	(30, 'BV', 'Bouvet Island', 'Norwegian Krone', 'NOK', NULL),
	(31, 'BR', 'Brazil', 'Brazilian Real', 'BRL', 'R$'),
	(32, 'IO', 'British Indian Ocean Territory', 'US Dollar', 'USD', '$'),
	(33, 'BN', 'Brunei Darussalam', 'Brunei Dollar', 'BND', NULL),
	(34, 'BG', 'Bulgaria', 'Bulgarian Lev', 'BGN', 'лв'),
	(35, 'BF', 'Burkina Faso', 'CFA Franc BCEAO', 'XOF', NULL),
	(36, 'BI', 'Burundi', 'Burundi Franc', 'BIF', NULL),
	(37, 'CV', 'Cabo Verde', 'Cabo Verde Escudo', 'CVE', NULL),
	(38, 'KH', 'Cambodia', 'Riel', 'KHR', '៛'),
	(39, 'CM', 'Cameroon', 'CFA Franc BEAC', 'XAF', NULL),
	(40, 'CA', 'Canada', 'Canadian Dollar', 'CAD', '$'),
	(41, 'KY', 'Cayman Islands', 'Cayman Islands Dollar', 'KYD', NULL),
	(42, 'CF', 'Central African Republic', 'CFA Franc BEAC', 'XAF', NULL),
	(43, 'TD', 'Chad', 'CFA Franc BEAC', 'XAF', NULL),
	(44, 'CL', 'Chile', 'Chilean Peso', 'CLP', '$'),
	(45, 'CN', 'China', 'Yuan Renminbi', 'CNY', '¥'),
	(46, 'CX', 'Christmas Island', 'Australian Dollar', 'AUD', NULL),
	(47, 'CC', 'Cocos (keeling) Islands', 'Australian Dollar', 'AUD', NULL),
	(48, 'CO', 'Colombia', 'Colombian Peso', 'COP', '$'),
	(49, 'KM', 'Comoros', 'Comorian Franc', 'KMF', NULL),
	(50, 'CD', 'Congo (the Democratic Republic Of The)', 'Congolese Franc', 'CDF', NULL),
	(51, 'CG', 'Congo', 'CFA Franc BEAC', 'XAF', NULL),
	(52, 'CK', 'Cook Islands', 'New Zealand Dollar', 'NZD', '$'),
	(53, 'CR', 'Costa Rica', 'Costa Rican Colon', 'CRC', NULL),
	(54, 'CI', 'Côte D''ivoire', 'CFA Franc BCEAO', 'XOF', NULL),
	(55, 'HR', 'Croatia', 'Kuna', 'HRK', 'kn'),
	(56, 'CU', 'Cuba', 'Cuban Peso', 'CUP', NULL),
	(57, 'CW', 'Curaçao', 'Netherlands Antillean Guilder', 'ANG', NULL),
	(58, 'CY', 'Cyprus', 'Euro', 'EUR', '€'),
	(59, 'CZ', 'Czechia', 'Czech Koruna', 'CZK', 'Kč'),
	(60, 'DK', 'Denmark', 'Danish Krone', 'DKK', 'kr'),
	(61, 'DJ', 'Djibouti', 'Djibouti Franc', 'DJF', NULL),
	(62, 'DM', 'Dominica', 'East Caribbean Dollar', 'XCD', NULL),
	(63, 'DO', 'Dominican Republic', 'Dominican Peso', 'DOP', NULL),
	(64, 'EC', 'Ecuador', 'US Dollar', 'USD', '$'),
	(65, 'EG', 'Egypt', 'Egyptian Pound', 'EGP', NULL),
	(66, 'SV', 'El Salvador', 'El Salvador Colon', 'SVC', NULL),
	(67, 'GQ', 'Equatorial Guinea', 'CFA Franc BEAC', 'XAF', NULL),
	(68, 'ER', 'Eritrea', 'Nakfa', 'ERN', NULL),
	(69, 'EE', 'Estonia', 'Euro', 'EUR', '€'),
	(70, 'SZ', 'Eswatini', 'Lilangeni', 'SZL', NULL),
	(71, 'ET', 'Ethiopia', 'Ethiopian Birr', 'ETB', NULL),
	(72, 'FK', 'Falkland Islands [Malvinas]', 'Falkland Islands Pound', 'FKP', NULL),
	(73, 'FO', 'Faroe Islands', 'Danish Krone', 'DKK', NULL),
	(74, 'FJ', 'Fiji', 'Fiji Dollar', 'FJD', NULL),
	(75, 'FI', 'Finland', 'Euro', 'EUR', '€'),
	(76, 'FR', 'France', 'Euro', 'EUR', '€'),
	(77, 'GF', 'French Guiana', 'Euro', 'EUR', '€'),
	(78, 'PF', 'French Polynesia', 'CFP Franc', 'XPF', NULL),
	(79, 'TF', 'French Southern Territories', 'Euro', 'EUR', '€'),
	(80, 'GA', 'Gabon', 'CFA Franc BEAC', 'XAF', NULL),
	(81, 'GM', 'Gambia', 'Dalasi', 'GMD', NULL),
	(82, 'GE', 'Georgia', 'Lari', 'GEL', '₾'),
	(83, 'DE', 'Germany', 'Euro', 'EUR', '€'),
	(84, 'GH', 'Ghana', 'Ghana Cedi', 'GHS', NULL),
	(85, 'GI', 'Gibraltar', 'Gibraltar Pound', 'GIP', NULL),
	(86, 'GR', 'Greece', 'Euro', 'EUR', '€'),
	(87, 'GL', 'Greenland', 'Danish Krone', 'DKK', NULL),
	(88, 'GD', 'Grenada', 'East Caribbean Dollar', 'XCD', NULL),
	(89, 'GP', 'Guadeloupe', 'Euro', 'EUR', '€'),
	(90, 'GU', 'Guam', 'US Dollar', 'USD', '$'),
	(91, 'GT', 'Guatemala', 'Quetzal', 'GTQ', NULL),
	(92, 'GG', 'Guernsey', 'Pound Sterling', 'GBP', '£'),
	(93, 'GN', 'Guinea', 'Guinean Franc', 'GNF', NULL),
	(94, 'GW', 'Guinea-bissau', 'CFA Franc BCEAO', 'XOF', NULL),
	(95, 'GY', 'Guyana', 'Guyana Dollar', 'GYD', NULL),
	(96, 'HT', 'Haiti', 'Gourde', 'HTG', NULL),
	(97, 'HM', 'Heard Island And Mcdonald Islands', 'Australian Dollar', 'AUD', NULL),
	(98, 'VA', 'Holy See (Vatican)', 'Euro', 'EUR', '€'),
	(99, 'HN', 'Honduras', 'Lempira', 'HNL', NULL),
	(100, 'HK', 'Hong Kong', 'Hong Kong Dollar', 'HKD', '$'),
	(101, 'HU', 'Hungary', 'Forint', 'HUF', 'ft'),
	(102, 'IS', 'Iceland', 'Iceland Krona', 'ISK', NULL),
	(103, 'IN', 'India', 'Indian Rupee', 'INR', '₹'),
	(104, 'ID', 'Indonesia', 'Rupiah', 'IDR', 'Rp'),
	(105, 'IR', 'International Monetary Fund (IMF)', 'SDR (Special Drawing Right)', 'XDR', NULL),
	(106, 'IR', 'Iran', 'Iranian Rial', 'IRR', NULL),
	(107, 'IQ', 'Iraq', 'Iraqi Dinar', 'IQD', NULL),
	(108, 'IE', 'Ireland', 'Euro', 'EUR', '€'),
	(109, 'IM', 'Isle Of Man', 'Pound Sterling', 'GBP', '£'),
	(110, 'IL', 'Israel', 'New Israeli Sheqel', 'ILS', '₪'),
	(111, 'IT', 'Italy', 'Euro', 'EUR', '€'),
	(112, 'JM', 'Jamaica', 'Jamaican Dollar', 'JMD', NULL),
	(113, 'JP', 'Japan', 'Yen', 'JPY', '¥'),
	(114, 'JE', 'Jersey', 'Pound Sterling', 'GBP', '£'),
	(115, 'JO', 'Jordan', 'Jordanian Dinar', 'JOD', NULL),
	(116, 'KZ', 'Kazakhstan', 'Tenge', 'KZT', NULL),
	(117, 'KE', 'Kenya', 'Kenyan Shilling', 'KES', 'Ksh'),
	(118, 'KI', 'Kiribati', 'Australian Dollar', 'AUD', NULL),
	(119, 'KP', 'Korea (the Democratic People’s Republic Of)', 'North Korean Won', 'KPW', NULL),
	(120, 'KR', 'Korea (the Republic Of)', 'Won', 'KRW', '₩'),
	(121, 'KW', 'Kuwait', 'Kuwaiti Dinar', 'KWD', NULL),
	(122, 'KG', 'Kyrgyzstan', 'Som', 'KGS', NULL),
	(123, 'LA', 'Lao People’s Democratic Republic', 'Lao Kip', 'LAK', NULL),
	(124, 'LV', 'Latvia', 'Euro', 'EUR', '€'),
	(125, 'LB', 'Lebanon', 'Lebanese Pound', 'LBP', NULL),
	(126, 'LS', 'Lesotho', 'Loti', 'LSL', NULL),
	(127, 'LR', 'Liberia', 'Liberian Dollar', 'LRD', NULL),
	(128, 'LY', 'Libya', 'Libyan Dinar', 'LYD', NULL),
	(129, 'LI', 'Liechtenstein', 'Swiss Franc', 'CHF', NULL),
	(130, 'LT', 'Lithuania', 'Euro', 'EUR', '€'),
	(131, 'LU', 'Luxembourg', 'Euro', 'EUR', '€'),
	(132, 'MO', 'Macao', 'Pataca', 'MOP', NULL),
	(133, 'MK', 'North Macedonia', 'Denar', 'MKD', NULL),
	(134, 'MG', 'Madagascar', 'Malagasy Ariary', 'MGA', NULL),
	(135, 'MW', 'Malawi', 'Malawi Kwacha', 'MWK', NULL),
	(136, 'MY', 'Malaysia', 'Malaysian Ringgit', 'MYR', 'RM'),
	(137, 'MV', 'Maldives', 'Rufiyaa', 'MVR', NULL),
	(138, 'ML', 'Mali', 'CFA Franc BCEAO', 'XOF', NULL),
	(139, 'MT', 'Malta', 'Euro', 'EUR', '€'),
	(140, 'MH', 'Marshall Islands', 'US Dollar', 'USD', '$'),
	(141, 'MQ', 'Martinique', 'Euro', 'EUR', '€'),
	(142, 'MR', 'Mauritania', 'Ouguiya', 'MRU', NULL),
	(143, 'YT', 'Mayotte', 'Euro', 'EUR', '€'),
	(144, 'MX', 'Mexico', 'Mexican Peso', 'MXN', '$'),
	(145, 'FM', 'Micronesia', 'US Dollar', 'USD', '$'),
	(146, 'MD', 'Moldova', 'Moldovan Leu', 'MDL', NULL),
	(147, 'MC', 'Monaco', 'Euro', 'EUR', '€'),
	(148, 'MN', 'Mongolia', 'Tugrik', 'MNT', NULL),
	(149, 'ME', 'Montenegro', 'Euro', 'EUR', '€'),
	(150, 'MS', 'Montserrat', 'East Caribbean Dollar', 'XCD', NULL),
	(151, 'MA', 'Morocco', 'Moroccan Dirham', 'MAD', '.د.م'),
	(152, 'MZ', 'Mozambique', 'Mozambique Metical', 'MZN', NULL),
	(153, 'MM', 'Myanmar', 'Kyat', 'MMK', NULL),
	(154, 'NA', 'Namibia', 'Namibia Dollar', 'NAD', NULL),
	(155, 'NR', 'Nauru', 'Australian Dollar', 'AUD', NULL),
	(156, 'NP', 'Nepal', 'Nepalese Rupee', 'NPR', NULL),
	(157, 'NL', 'Netherlands', 'Euro', 'EUR', '€'),
	(158, 'NC', 'New Caledonia', 'CFP Franc', 'XPF', NULL),
	(159, 'NZ', 'New Zealand', 'New Zealand Dollar', 'NZD', '$'),
	(160, 'NI', 'Nicaragua', 'Cordoba Oro', 'NIO', NULL),
	(161, 'NE', 'Niger', 'CFA Franc BCEAO', 'XOF', NULL),
	(162, 'NG', 'Nigeria', 'Naira', 'NGN', '₦'),
	(163, 'NU', 'Niue', 'New Zealand Dollar', 'NZD', '$'),
	(164, 'NF', 'Norfolk Island', 'Australian Dollar', 'AUD', NULL),
	(165, 'MP', 'Northern Mariana Islands', 'US Dollar', 'USD', '$'),
	(166, 'NO', 'Norway', 'Norwegian Krone', 'NOK', 'kr'),
	(167, 'OM', 'Oman', 'Rial Omani', 'OMR', NULL),
	(168, 'PK', 'Pakistan', 'Pakistan Rupee', 'PKR', 'Rs'),
	(169, 'PW', 'Palau', 'US Dollar', 'USD', '$'),
	(170, 'PA', 'Panama', 'US Dollar', 'USD', '$'),
	(171, 'PG', 'Papua New Guinea', 'Kina', 'PGK', NULL),
	(172, 'PY', 'Paraguay', 'Guarani', 'PYG', NULL),
	(173, 'PE', 'Peru', 'Sol', 'PEN', 'S'),
	(174, 'PH', 'Philippines', 'Philippine Peso', 'PHP', '₱'),
	(175, 'PN', 'Pitcairn', 'New Zealand Dollar', 'NZD', '$'),
	(176, 'PL', 'Poland', 'Zloty', 'PLN', 'zł'),
	(177, 'PT', 'Portugal', 'Euro', 'EUR', '€'),
	(178, 'PR', 'Puerto Rico', 'US Dollar', 'USD', '$'),
	(179, 'QA', 'Qatar', 'Qatari Rial', 'QAR', NULL),
	(180, 'RE', 'Réunion', 'Euro', 'EUR', '€'),
	(181, 'RO', 'Romania', 'Romanian Leu', 'RON', 'lei'),
	(182, 'RU', 'Russian Federation', 'Russian Ruble', 'RUB', '₽'),
	(183, 'RW', 'Rwanda', 'Rwanda Franc', 'RWF', NULL),
	(184, 'BL', 'Saint Barthélemy', 'Euro', 'EUR', '€'),
	(185, 'SH', 'Saint Helena, Ascension And Tristan Da Cunha', 'Saint Helena Pound', 'SHP', NULL),
	(186, 'KN', 'Saint Kitts And Nevis', 'East Caribbean Dollar', 'XCD', NULL),
	(187, 'LC', 'Saint Lucia', 'East Caribbean Dollar', 'XCD', NULL),
	(188, 'MF', 'Saint Martin (French Part)', 'Euro', 'EUR', '€'),
	(189, 'PM', 'Saint Pierre And Miquelon', 'Euro', 'EUR', '€'),
	(190, 'VC', 'Saint Vincent And The Grenadines', 'East Caribbean Dollar', 'XCD', NULL),
	(191, 'WS', 'Samoa', 'Tala', 'WST', NULL),
	(192, 'SM', 'San Marino', 'Euro', 'EUR', '€'),
	(193, 'ST', 'Sao Tome And Principe', 'Dobra', 'STN', NULL),
	(194, 'SA', 'Saudi Arabia', 'Saudi Riyal', 'SAR', NULL),
	(195, 'SN', 'Senegal', 'CFA Franc BCEAO', 'XOF', NULL),
	(196, 'RS', 'Serbia', 'Serbian Dinar', 'RSD', NULL),
	(197, 'SC', 'Seychelles', 'Seychelles Rupee', 'SCR', NULL),
	(198, 'SL', 'Sierra Leone', 'Leone', 'SLL', NULL),
	(199, 'SG', 'Singapore', 'Singapore Dollar', 'SGD', '$'),
	(200, 'SX', 'Sint Maarten (Dutch Part)', 'Netherlands Antillean Guilder', 'ANG', NULL),
	(201, 'SK', 'Slovakia', 'Euro', 'EUR', '€'),
	(202, 'SI', 'Slovenia', 'Euro', 'EUR', '€'),
	(203, 'SB', 'Solomon Islands', 'Solomon Islands Dollar', 'SBD', NULL),
	(204, 'SO', 'Somalia', 'Somali Shilling', 'SOS', NULL),
	(205, 'ZA', 'South Africa', 'Rand', 'ZAR', 'R'),
	(206, 'SS', 'South Sudan', 'South Sudanese Pound', 'SSP', NULL),
	(207, 'ES', 'Spain', 'Euro', 'EUR', '€'),
	(208, 'LK', 'Sri Lanka', 'Sri Lanka Rupee', 'LKR', 'Rs'),
	(209, 'SD', 'Sudan (the)', 'Sudanese Pound', 'SDG', NULL),
	(210, 'SR', 'Suriname', 'Surinam Dollar', 'SRD', NULL),
	(211, 'SJ', 'Svalbard And Jan Mayen', 'Norwegian Krone', 'NOK', NULL),
	(212, 'SE', 'Sweden', 'Swedish Krona', 'SEK', 'kr'),
	(213, 'SY', 'Syrian Arab Republic', 'Syrian Pound', 'SYP', NULL),
	(214, 'TW', 'Taiwan', 'New Taiwan Dollar', 'TWD', NULL),
	(215, 'TJ', 'Tajikistan', 'Somoni', 'TJS', NULL),
	(216, 'TZ', 'Tanzania, United Republic Of', 'Tanzanian Shilling', 'TZS', NULL),
	(217, 'TH', 'Thailand', 'Baht', 'THB', '฿'),
	(218, 'TL', 'Timor-leste', 'US Dollar', 'USD', '$'),
	(219, 'TG', 'Togo', 'CFA Franc BCEAO', 'XOF', NULL),
	(220, 'TK', 'Tokelau', 'New Zealand Dollar', 'NZD', NULL),
	(221, 'TO', 'Tonga', 'Pa’anga', 'TOP', NULL),
	(222, 'TT', 'Trinidad And Tobago', 'Trinidad and Tobago Dollar', 'TTD', NULL),
	(223, 'TN', 'Tunisia', 'Tunisian Dinar', 'TND', NULL),
	(224, 'TR', 'Türkiye', 'Turkish Lira', 'TRY', '₺'),
	(225, 'TM', 'Turkmenistan', 'Turkmenistan New Manat', 'TMT', NULL),
	(246, 'CH', 'Switzerland', 'Swiss Franc', 'CHF', NULL),
	(226, 'TC', 'Turks And Caicos Islands', 'US Dollar', 'USD', NULL),
	(227, 'TV', 'Tuvalu', 'Australian Dollar', 'AUD', NULL),
	(228, 'UG', 'Uganda', 'Uganda Shilling', 'UGX', NULL),
	(229, 'UA', 'Ukraine', 'Hryvnia', 'UAH', '₴'),
	(230, 'AE', 'United Arab Emirates', 'UAE Dirham', 'AED', 'د.إ'),
	(231, 'GB', 'United Kingdom Of Great Britain And Northern Ireland', 'Pound Sterling', 'GBP', '£'),
	(232, 'UM', 'United States Minor Outlying Islands', 'US Dollar', 'USD', '$'),
	(233, 'US', 'United States Of America', 'US Dollar', 'USD', '$'),
	(234, 'UY', 'Uruguay', 'Peso Uruguayo', 'UYU', NULL),
	(235, 'UZ', 'Uzbekistan', 'Uzbekistan Sum', 'UZS', NULL),
	(236, 'VU', 'Vanuatu', 'Vatu', 'VUV', NULL),
	(237, 'VE', 'Venezuela', 'Bolívar Soberano', 'VES', NULL),
	(238, 'VN', 'Vietnam', 'Dong', 'VND', '₫'),
	(239, 'VG', 'Virgin Islands (British)', 'US Dollar', 'USD', NULL),
	(240, 'VI', 'Virgin Islands (U.S.)', 'US Dollar', 'USD', '$'),
	(241, 'WF', 'Wallis And Futuna', 'CFP Franc', 'XPF', NULL),
	(242, 'EH', 'Western Sahara', 'Moroccan Dirham', 'MAD', NULL),
	(243, 'YE', 'Yemen', 'Yemeni Rial', 'YER', NULL),
	(244, 'ZM', 'Zambia', 'Zambian Kwacha', 'ZMW', NULL),
	(245, 'ZW', 'Zimbabwe', 'Zimbabwe Dollar', 'ZWL', NULL),
	(247, 'MU', 'Mauritius', 'Mauritius Rupee', 'MUR', NULL) ON CONFLICT DO NOTHING;


--
-- TOC entry 3672 (class 0 OID 16543)
-- Dependencies: 215
-- Data for Name: customer_order_history; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3673 (class 0 OID 16551)
-- Dependencies: 216
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3686 (class 0 OID 16719)
-- Dependencies: 229
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3687 (class 0 OID 16730)
-- Dependencies: 230
-- Data for Name: department_category; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3688 (class 0 OID 16733)
-- Dependencies: 231
-- Data for Name: material; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3674 (class 0 OID 16561)
-- Dependencies: 217
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3675 (class 0 OID 16572)
-- Dependencies: 218
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: quantra
--

INSERT INTO public.permissions (permission_id, slug, description, is_active, created_by, modified_by, created_at, modified_at) VALUES
	('925cab35-dcc3-442c-a997-d37dffca9efc', 'dashboard:view_dashboard', 'Allows the user to view the main dashboard metrics and analytics.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('7551e975-cac2-45ee-94db-bb1c369fab88', 'users:view_user', 'Allows the user to view user profiles and details.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('e02681d7-2a0d-455d-8ac2-b5af1a11a441', 'users:create_user', 'Allows the user to create and register new user accounts.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('31f82192-5314-488e-870d-f068c2efb3da', 'users:update_user', 'Allows the user to modify and update existing user accounts.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('2d276da2-eeb2-4424-bf77-352a0bc6578d', 'users:delete_users', 'Allows the user to permanently delete or deactivate user accounts.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('8361d26c-82ea-49d5-8aa0-0c4b48a38905', 'roles:view_role', 'Allows the user to view existing roles and their assigned permissions.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('68aed616-660c-4772-88f6-4fe6a6e324f9', 'roles:create_role', 'Allows the user to create new roles within the system.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('bb2a394f-c8e8-4e7e-ab6b-afc60c839ff9', 'roles:update_role', 'Allows the user to modify permissions and metadata of existing roles.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('c4b1fadc-6824-477b-a30c-284c45fed384', 'roles:delete_role', 'Allows the user to remove or delete existing system roles.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('aa911737-cd10-432e-986f-13a7fa6836b9', 'customers:view_customer', 'Allows the user to view customer details.', true, NULL, NULL, '2026-06-06 17:24:54.47144+00', NULL),
	('50b0b21c-39bb-4c32-816c-7efda5ea4c65', 'customers:view_order', 'Allows the user to view order detatils of existing customer details.', true, NULL, NULL, '2026-06-06 17:24:54.47144+00', NULL),
	('f8c25a5b-a515-4a01-a581-597b7821e59e', 'brand:view_brand', 'Allows the user to view brand details.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('c35aa7ee-3e2a-47a0-bf58-b0c0042fd026', 'brand:create_brand', 'Allows the user to create new brand.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('d316a520-b3cf-4e7a-b593-39c314915162', 'brand:update_brand', 'Allows the user to modify and update existing brands.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('8e6aabdc-42af-40d9-b919-5af6942016f9', 'brand:delete_brand', 'Allows the user to permanently delete brands.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('92002254-7eac-4c50-9e7a-0027adf1a3ae', 'supplier:view_supplier', 'Allows the user to view supplier details.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('b8a05f54-81dc-4fa6-b011-99b32f599116', 'supplier:create_supplier', 'Allows the user to create new supplier.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('4c251cc0-bb2d-4330-94cb-eb3233544072', 'supplier:update_supplier', 'Allows the user to modify and update existing suppliers.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('07ce3be8-ca42-4367-8f97-6f9a8365ab32', 'supplier:delete_supplier', 'Allows the user to permanently delete suppliers.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('c89bfac1-b14e-44f5-93a6-34f304571bfc', 'business_category:view_business_category', 'Allows the user to view business category details.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('8612e223-7f30-447b-86da-946fba0ad943', 'business_category:create_business_category', 'Allows the user to create new business category.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('9a4892b5-723b-4db6-89ac-473dbcb9a29f', 'business_category:delete_business_category', 'Allows the user to permanently delete business categories.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('26c344cf-3c8c-440d-8b01-203144f0af3e', 'department:view_department', 'Allows the user to view department details.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('b08af966-aa22-4189-9b76-2d32aa74ebf2', 'department:create_department', 'Allows the user to create new department.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('83e758c5-d472-41d2-8427-97d33e752ac0', 'department:update_department', 'Allows the user to modify and update existing departments.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('2b90e950-274a-448b-95da-b475d4a3e903', 'department:delete_department', 'Allows the user to permanently delete departments.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('81024839-6efe-4cbd-a180-3281123b1a11', 'category:view_category', 'Allows the user to view category details.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('3dad7778-bbcc-4009-bf83-b71cc923487a', 'category:create_category', 'Allows the user to create new category.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('27ef67dd-b462-4506-9fa5-b69061dad70d', 'category:update_category', 'Allows the user to modify and update existing categories.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('10337808-f79b-4e87-8548-8e9542643abe', 'category:delete_category', 'Allows the user to permanently delete categories.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('718e7dec-763d-46dc-ae83-e033b02865ae', 'sub_category:view_sub_category', 'Allows the user to view sub category details.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('c91fb5cb-406f-47e3-ae97-c40b9dd9739d', 'sub_category:create_sub_category', 'Allows the user to create new sub category.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('126c0b67-a05b-4eab-a668-28d8c542bc18', 'sub_category:update_sub_category', 'Allows the user to modify and update existing sub categories.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('573d9378-3d6b-4669-b958-71801e67e601', 'sub_category:delete_sub_category', 'Allows the user to permanently delete sub categories.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('87222271-8e78-46ea-8b74-6017fce56368', 'product_type:view_product_type', 'Allows the user to view product type details.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('9d087180-8895-49b6-a96d-d9ebacedb827', 'product_type:create_product_type', 'Allows the user to create new product type.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('d99fc0a9-6f29-4f20-87d2-765ce00b69c4', 'product_type:update_product_type', 'Allows the user to modify and update existing product types.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('3cf7be07-437e-4822-9f2f-49aeeb61baec', 'product_type:delete_product_type', 'Allows the user to permanently delete product types.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('8548c899-2c9d-4d2b-a00b-49bce1765597', 'business_category:update_business_category', 'Allows the user to modify and update existing business categories.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('3c0b44b8-5305-401d-8f92-d5a67b78733c', 'product:view_product', 'Allows the user to view product details.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('fa6fe182-d831-4d73-a588-e71ac45dfeaf', 'product:create_product', 'Allows the user to create product brand.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('7cc0a711-3b26-469c-930f-42df866b85df', 'product:update_product', 'Allows the user to modify and update existing products.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL),
	('7cae6fe8-93c1-4e80-90ff-173f00231e2b', 'product:delete_product', 'Allows the user to permanently delete products.', true, NULL, NULL, '2026-06-06 14:46:52.730177+00', NULL) ON CONFLICT DO NOTHING;


--
-- TOC entry 3689 (class 0 OID 16744)
-- Dependencies: 232
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3690 (class 0 OID 16759)
-- Dependencies: 233
-- Data for Name: product_type; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3691 (class 0 OID 16770)
-- Dependencies: 234
-- Data for Name: product_type_material; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3692 (class 0 OID 16773)
-- Dependencies: 235
-- Data for Name: product_variant; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3676 (class 0 OID 16582)
-- Dependencies: 219
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: quantra
--

INSERT INTO public.refresh_tokens (refresh_tokens_id, user_id, token_hash, is_revoked, expires_at) VALUES
	('26fd1fd5-818c-4cc7-9c0c-1017f0ecf2e5', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODEzNzU0MzB9.MjLyXwnEdBurLJQxvnS8M6LyECtvegnGTWADDG2pn2g', false, '2026-06-13 18:30:30.715942+00'),
	('2b243fcd-1739-4c8e-8854-4d0c966d52ef', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODEzNzU3OTh9.91FTkRn23Nr65OEWg1PIczo3IEc16b_-x_j6w2kehbg', false, '2026-06-13 18:36:38.166211+00'),
	('ac133273-f182-4339-b9e6-0e87bd3848b3', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODEzNzgxNTd9.lPiLSRlOxq_sisULiOwjH723xr2UEB8b9BpjT3LYVkY', false, '2026-06-13 19:15:57.247247+00'),
	('ac8dbc2e-2bb7-4406-8cae-ea0c019bf0dd', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODEzNzg3NzJ9.O0Mu62hMG34UemBzOoev5r11uKmIoRjCLKl09Yxn7gc', false, '2026-06-13 19:26:12.254226+00'),
	('e18066ba-9db5-469c-9a52-94329fec3148', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODEzNzg5MDJ9.9MljhS2f41f0K8kUkTJnAu8vvIABqJC43xUIPM1RWkM', false, '2026-06-13 19:28:22.993493+00'),
	('4549de6b-c349-445a-9887-2aa305512f48', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODEzNzk5NDh9.B9al6aKYuf_BqvXXe2UqY9C_JteHTfT2ju_DXKAPWqM', false, '2026-06-13 19:45:48.052425+00'),
	('30afe635-ac4a-450e-8ee4-ec36ad4765a9', 'c81a9d88-3f92-4846-b18f-71ee843dd50a', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjODFhOWQ4OC0zZjkyLTQ4NDYtYjE4Zi03MWVlODQzZGQ1MGEiLCJleHAiOjE3ODE0NTkzMDJ9.PxWWCdvramQSYVnc0z98AH5Nk2qBE9rZmUcSK_nIlWo', false, '2026-06-14 17:48:22.192579+00'),
	('43a8f3d7-31f3-412b-bb4f-b133368fe95f', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDU5MDZ9.5v9XOBNvK8Zkax2JeTNNy7MLgpoM3b_yflUu-Y07qAQ', false, '2026-06-22 05:25:06.218578+00'),
	('34967963-718c-40f8-8dd8-1c727c31f6fa', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDYwNzZ9.y0nj-NBOGb8-MDVxru1gpSoEzanaWDQljlbsd5gcxlo', false, '2026-06-22 05:27:56.138059+00'),
	('12ccdb6b-8332-4b96-b127-aaf855531eeb', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDYxNjN9.Xkeqqzgfltm65Gd1unlU0pqn5gxBekmABJO-xYE8GKc', false, '2026-06-22 05:29:23.319876+00'),
	('66436689-ad9f-4c63-8c23-48f0f5e33195', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDYxODd9.OwIH1XSbpYQeAxP0WybjdLo1VIhO0HxXHRTq5D5TjVU', false, '2026-06-22 05:29:47.624927+00'),
	('3c899f7d-dfc8-48fb-ae71-ff0c4ac9748b', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDYxOTl9.Vb1afDutTEJejbwue05Fw0SgpTYkmKwqFikpEiyz6pM', false, '2026-06-22 05:29:59.345101+00'),
	('d7225c2b-f613-47db-8569-15961edd9fac', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDYyMTh9.B1MkdWPPgwV8PL0PZCLEFgUJ02p76kOJ2jjTtvdD3CM', false, '2026-06-22 05:30:18.819328+00'),
	('ea23247a-6068-4c67-ac20-56ee1e48d15d', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDYyMzh9.nqH2huYIk_0lIpts3ITzS10K2rlC6Y_GO0YGMweIEgw', false, '2026-06-22 05:30:38.166539+00'),
	('4634c4c8-23c9-4d04-b88a-f554b9218109', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDY2ODB9.SoWEmMq4IeQzhaBIjDd2SF8jw_OH7n8vr0M5ON5khcc', false, '2026-06-22 05:38:00.562408+00'),
	('fcb4dc34-041d-4f4e-9280-31fcd54ffdce', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDY3ODl9.UmL_n2vFl7AeElNPFOwdbORKMFIvmESJGDOtv0To4OY', false, '2026-06-22 05:39:49.875801+00'),
	('84069e7f-da29-4d3f-b6da-a09d88667d62', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDY4MzB9.aHyTbOVBNijHeyROQmK-Z0O-JjHJwXh4k7T3U0BK3HY', false, '2026-06-22 05:40:30.604677+00'),
	('f501b0ac-c2b5-428d-ad5b-d92bec2f3140', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDY4Njh9.74Adyu0Dkp_JEMjFsBv6S3Dh-q0OUKStqz3ZrsNAkhg', false, '2026-06-22 05:41:08.394267+00'),
	('d8cc31d7-cb47-4f32-8a3f-6d71ce2f6b76', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDY5ODJ9.kHpauUZf3gjq9C-pfLDvKFuO2dfylAAw-S1LsUCD0IE', false, '2026-06-22 05:43:02.226734+00'),
	('8a07d111-e14c-4cce-ae8b-095d41f78fa4', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDczMTB9.DBaYcQozTsLHOn3_xANd1VJ6VSZhrosJ9BIVIAL8Lws', false, '2026-06-22 05:48:30.253868+00'),
	('b922ec2c-cf8b-4bf6-88a6-aad0c416a0d1', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDc1NDV9._xJ8l7LGhxg4exnJz9sU1sMNWRLwg1wCb_-39eC7S_M', false, '2026-06-22 05:52:25.796035+00'),
	('3e754675-8ef3-4650-81e1-9814dc910a68', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDgwNjR9.aoPgTkjA3WkquNlp7CHa_7CZPDw7TEhUa5ur9gjmoH8', false, '2026-06-22 06:01:04.309839+00'),
	('8ce96245-03ec-40cd-a12c-2a7048b9b71a', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDgxMDV9.C4iLBK_Ia8A39Jf7mppw0lBDWsqJPFdkmEFI2Vi0RhY', false, '2026-06-22 06:01:45.07018+00'),
	('31ebabaa-3575-411d-81d2-231dd132fc5a', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDgxMzR9.ivWY_A28JjIBGnkMp9804btuiWw8Y7Ncnb_JZpHDZbc', false, '2026-06-22 06:02:14.914065+00'),
	('3e9c9c30-af6a-4881-96ee-50b7dc9c4cd2', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDgzMDZ9.cOINx5ywz6FmuXQ9Zi6kd__pN2aoDE033mUEY15htng', false, '2026-06-22 06:05:06.402372+00'),
	('6a9e08ac-ee03-4d62-93ac-82f2a73b0154', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDgzNjZ9.heFXDR5RUCAMt46Kx0dGCpvRV1OI3UhHJuZ7n4FhHkY', false, '2026-06-22 06:06:06.869907+00'),
	('dacbdf1e-975a-4a93-b6b7-0c46b88e7905', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDg1Nzh9.saKmhOihkKsY8G1I37TP2zHGR6GdeePeSeNp9kEHhys', false, '2026-06-22 06:09:38.622901+00'),
	('cfde61da-2d3c-458a-94a4-19023e090f6c', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDg3NzR9.8whS0YyY2BP4I0mykAA-vGMgbxgJpXwUR1kEzUc3Cfk', false, '2026-06-22 06:12:54.097808+00'),
	('f9e8f707-03d2-4858-b7f6-0f9cd6ca41a1', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDg5Mzh9.nqFBG_qwKBvJpP8jMPvKq2oDi6k_51GT0XwpfbcCTak', false, '2026-06-22 06:15:38.708241+00'),
	('23ac3e83-e778-4450-bb27-503544e3deee', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDkxMzV9.EVwsvbDQGL8c60JBBVHeOUKq81xvX6pWqjxCjZjoAIE', false, '2026-06-22 06:18:55.845657+00'),
	('a8d648f0-15b5-4320-8d2c-143f4f699a52', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDk3OTZ9.zw_hhCQa_Ko1g4BpGuedydBBPyqniRs3Do2H3QJLjzM', false, '2026-06-22 06:29:56.054182+00'),
	('0825ce41-de3a-4b84-a6b5-e9ee8d684893', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDk4Njh9.MXsIyWIbhAu2T6zowhq3y8ij_HZCuzwcLzPrTpARwHA', false, '2026-06-22 06:31:08.691928+00'),
	('2d00d435-4d39-4026-86cf-232d347aa41a', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDk5MTV9.KuXHvTG2sTWR5bdTAe67eNqZ_iqHy5LqMM9LXidPsVY', false, '2026-06-22 06:31:55.418803+00'),
	('deaa8edc-e4d2-408f-a1d8-3b99cb5a278f', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMDk5OTl9.LLNvUjCHzsksV6kwFGgugb7yIVp2djVNQBndqZWvUZ8', false, '2026-06-22 06:33:19.791743+00'),
	('ad8f5ec8-ee6d-4b87-9fb2-a512fbf9e3c5', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMTAzOTZ9.j1IAhoTIaM3f8pqwmdQ8xEgt9e1XbyDUK-YJS_Qe1a0', false, '2026-06-22 06:39:56.030278+00'),
	('274b3b8c-3ab0-4b28-953c-176f764f9afc', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMTI1Mzh9.bZfYtcol0tPCU7wSY0Yqm-eIViPl9usrrZK3j7_PuWE', false, '2026-06-22 07:15:38.523397+00'),
	('facc489c-adcb-4e0a-b0dc-c89548b77eef', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMTMyMjR9.N0nYS4MWhvD_2Om-iKJsr0xCe9esp_cZqsdy6GiyoQ8', false, '2026-06-22 07:27:04.739469+00'),
	('575005e6-6788-4677-978a-39b92a799fe4', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMTM1Nzd9.MWf7oh-z7NDf8xW0TsYx500ESls54A5TnwsS-JL-uK4', false, '2026-06-22 07:32:57.900592+00'),
	('65991d0d-a9be-466a-a2b6-b61725ca5a6e', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMTQxNTF9.92IfOs8YD9lMVnyHKaolHJF-Iewc8YtrGNkmGLMjJBA', false, '2026-06-22 07:42:31.930079+00'),
	('aa061213-5f6c-4376-9834-dbcb8a3372bd', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMTQyNjF9.mXNh0TQ2GvqX43NsdYv2hYGd0HDkG8JBbjDIxi9MGhg', false, '2026-06-22 07:44:21.613282+00'),
	('99d9b389-e03d-4cf1-b57a-688d0caa4014', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMTQzOTN9.KLT1qUS5zRBt8iLZRTYn1XARVDpYDUJpliZhVX6z8Ks', false, '2026-06-22 07:46:33.974156+00'),
	('e993ad0a-0bf5-4bb9-86f2-d7ea17c0240a', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMTUwNzZ9.PwNs3mSylVXIqifDoLUJZfadzJXA2cG0g1C9VBIExd4', false, '2026-06-22 07:57:56.274718+00'),
	('2d4516bb-0237-417e-9db1-23fafe3fae4b', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMTYyNDV9.UDZSRuBLSCtz-3zq2nlVdWAVzSQCLXU21Wb338lTMSk', false, '2026-06-22 08:17:25.835844+00'),
	('38e0281e-bdb5-4129-a37d-909a379c15b4', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMTgzNzh9.E3O7-r3dV3xQLXn8dte3RicH-B73RHG0X2nPq_jOWKY', false, '2026-06-22 08:52:58.708985+00'),
	('884b631b-6929-4d35-95f6-c7090cb49f24', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMjAxOTN9.x9YmAf_kkNAvNKbWMLS-Ef8oOASazVjbN7KZicODWkM', false, '2026-06-22 09:23:13.278239+00'),
	('53fe7d11-7a3c-4a0e-8156-1296069809f6', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMjIwNjV9.C_IaSOZDEyXuhnWJg1IYCL0aDIei2V4DOHVoS3w-9-s', false, '2026-06-22 09:54:25.483805+00'),
	('6043289f-afff-4c13-8505-e67b121f1f9a', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMjI2MDZ9.rj9pynSe2XUR49aBpyn50Qg-04pR-0j8PKkl6COCuNU', false, '2026-06-22 10:03:26.371378+00'),
	('cbe5233a-1f8c-4606-aa7f-ffcc85116352', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMjk4NTF9.WKACDS76YdS5l5EiGhOvQ2vMPhWzfQUWklxWmSV3YLE', false, '2026-06-22 12:04:11.218329+00'),
	('bc9787b1-a5aa-4d8c-bde0-7692fa29f662', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMzA1ODN9._PhyzUl_7r_a5oZyxXXr_zwvzXZthTLySBtQzSNqROQ', false, '2026-06-22 12:16:23.511857+00'),
	('03386928-6137-4f0b-9961-c356c5eaa839', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMzEzNjF9.ypa9ne2P185Q0Hy-tZXx5PrgqYSsR2DCtpN8U5p0fE0', false, '2026-06-22 12:29:21.027875+00'),
	('9ab2d3dd-8aac-4302-b61c-7e99461d068f', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMzMyNjF9.TMqZRCbp17bFJH44CknPeagd5C8kx4PQYtlPfVEcb3c', false, '2026-06-22 13:01:01.964341+00'),
	('c7d482e8-b9d3-42e2-a552-27a5cae49219', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMzUxMjJ9.rRuBg4Um9qMiPg-JuRwTIUuEbZPvdE4yMIBqvH3sKKo', true, '2026-06-22 13:32:02.362864+00'),
	('398e2e8d-b483-429f-9ff5-bf9776bf544c', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMzU4OTd9.YikTGOGudBaaGBl6yAtTz-CdxGiJ18LkuxqxAUl3Scw', true, '2026-06-22 13:44:57.939532+00'),
	('58fb15a7-34ec-4533-a0ed-34204522fea3', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMzU5NDR9.BuiHRUNBoKRPKkm0ri8gdLpQExQeZJ6WOt-HyA5Go-w', true, '2026-06-22 13:45:44.164712+00'),
	('9f157a9d-4e7d-4d0b-8922-669301353ff1', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMzY3NTd9.FiYeqaFiTSil6VXXOQQDq2UJGpaWmcDNJKQT8hpZOIU', false, '2026-06-22 13:59:17.796038+00'),
	('cab78181-6822-4640-810a-d12f96434043', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMzcwNjJ9.skK4npmABemOdKuZI9zNomRF6trUmxffoJOEvcl_5v0', false, '2026-06-22 14:04:22.227153+00'),
	('d8562a10-6dea-4b3b-8e21-fa054ebfac50', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMzgwMjR9.OF3UZyTETTgBDkQ1ea4Pjgs0nEfludklWyfE9aE4Bh4', false, '2026-06-22 14:20:24.446617+00'),
	('9bba2169-4bfe-4ab2-976e-d7fdc6745217', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMzg3MDV9.ENdZR3sJMwTNxRQUA5vI9Rtf73FCz0ymF2T0nlJdawY', false, '2026-06-22 14:31:45.629526+00'),
	('b47f948d-7f82-4463-be44-b7fda6204f1d', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMzkzMDV9.ZhQ3qRixq-oM4nycvg1YGU7E8UjF-gEehe21nYxZDlE', false, '2026-06-22 14:41:45.823705+00'),
	('03786b59-a403-46e0-8484-a5de5a87c6b1', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMzkzMjB9.aEQQdyG_LTtmf4XqQ_PUWE28pv4DAvEtq_Deo5XHKTU', false, '2026-06-22 14:42:00.608023+00'),
	('1a7d4961-82d9-4967-884c-95102e50dcc1', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMzk1Mzd9.SLsEvlkULpTbhl1wX8AcCB4SR6oJVaKcTigvekvCs2g', false, '2026-06-22 14:45:37.790053+00'),
	('a04bdfdd-63ab-4870-bab7-782285eb322d', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxMzk4NDJ9.vfxdu0yaIOFbfxv_LaqHD3JDGPj681j2qRD-wJtPs4E', false, '2026-06-22 14:50:42.134366+00'),
	('58e00827-85db-4ab5-b323-f8cff6cc97f0', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxNDAxOTF9.ED4bOqtmL-KUnsPcIgiV-7BOWykkN_ZFqd2XlIFEVIs', false, '2026-06-22 14:56:31.046411+00'),
	('6db46024-7244-4521-b300-76ec757f5cef', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODIxNDIwMjV9.YPzz-wtXzjDDmVMfePff1l1ZuEEAhahj0R3sE-LVMdQ', false, '2026-06-22 15:27:05.385908+00'),
	('d0a978b9-a5ed-4a0f-96f6-b30519b535d7', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODI1NDYyNTJ9.nXxtLC_IX2AA8orq90eqX7Cf7RBVL0hj1Ocn2e-piuQ', true, '2026-06-27 07:44:12.53423+00'),
	('833a155d-f6c7-4e01-906b-8b0cf4921041', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODI1NDkxMTN9.xvyYKLkPhe-Ox48l0EYAW0qIUDGDig47I0LkiyIXMoc', false, '2026-06-27 08:31:53.357875+00'),
	('592c3521-4bb1-463c-8dff-3300f07dc7a9', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODI1NTExMzl9.0cBfaXUvKzqxlT3oFL8Mn5jgf8lwBluFfkmpYr1oi54', false, '2026-06-27 09:05:39.361531+00'),
	('40c41550-ca41-46de-bde7-22496ab65b1a', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODI1NTgwMTZ9.EWXKXdy-4I-I2Za6z6EEf0o2XGdh7YJn619w5i1UYpk', true, '2026-06-27 11:00:16.18041+00'),
	('5e7c842e-7f78-4c0e-880e-7dc7ea279e63', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODI2MjQ0MTN9.jzG4V91XtE2bfTcQ0QQ3J0DpR4wnuI-RLtr2FnV2ze8', true, '2026-06-28 05:26:53.437715+00'),
	('c43589c2-83d6-4b73-a527-b69a5a86a54f', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODI2MjQ0ODZ9.wN4_XHpmeqt9BNfTXjafEuTPSbbLfo5rN0oJ6Jn6_Lk', true, '2026-06-28 05:28:06.911511+00'),
	('73d38705-b114-4c63-babb-cfa3f5edc208', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODI2MjUxNTl9.Yu5SO9CxC4fPQ7Jyqf900pPJ_LmqxzofeZq9woL3yMI', false, '2026-06-28 05:39:19.01978+00'),
	('5fad742c-ecc0-451e-8a7e-cce391d48d7e', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODI2MjUzNjB9.YdF67jZQPXEO5fANYYpP25QwBpANGIU98wDq08kwKnE', false, '2026-06-28 05:42:40.597804+00'),
	('4582e91d-9806-4ead-85fb-c1bab5f2e20b', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODI2MzAwMDN9.vmj4_IJNTfyR-k_0kso_zRX4TkL0NAk7uF2i0K1pi84', false, '2026-06-28 07:00:03.721349+00'),
	('29305863-d921-4502-94ec-26e2f197599b', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODI2MzE5NDR9.2nyBgv_s2kfIrrwwJwjeVgNRSAthLXKYMhv5E9R6TsA', false, '2026-06-28 07:32:24.037225+00'),
	('77558ddb-dc29-41aa-bf5a-252e9ea7e26e', '395a9a91-2d67-4e3c-8261-3c08093d4042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTVhOWE5MS0yZDY3LTRlM2MtODI2MS0zYzA4MDkzZDQwNDIiLCJleHAiOjE3ODI2NDQzNzV9.ppmMszmNXhEoC5nbbnFPmrvwcujFlQX8vcJoAAn7W0s', false, '2026-06-28 10:59:35.573459+00') ON CONFLICT DO NOTHING;


--
-- TOC entry 3677 (class 0 OID 16591)
-- Dependencies: 220
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: quantra
--

INSERT INTO public.role_permissions (role_id, permission_id) VALUES
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '925cab35-dcc3-442c-a997-d37dffca9efc'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '7551e975-cac2-45ee-94db-bb1c369fab88'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', 'e02681d7-2a0d-455d-8ac2-b5af1a11a441'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '31f82192-5314-488e-870d-f068c2efb3da'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '2d276da2-eeb2-4424-bf77-352a0bc6578d'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '8361d26c-82ea-49d5-8aa0-0c4b48a38905'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '68aed616-660c-4772-88f6-4fe6a6e324f9'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', 'bb2a394f-c8e8-4e7e-ab6b-afc60c839ff9'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', 'c4b1fadc-6824-477b-a30c-284c45fed384'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', 'aa911737-cd10-432e-986f-13a7fa6836b9'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '50b0b21c-39bb-4c32-816c-7efda5ea4c65'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', 'c35aa7ee-3e2a-47a0-bf58-b0c0042fd026'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '8e6aabdc-42af-40d9-b919-5af6942016f9'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', 'f8c25a5b-a515-4a01-a581-597b7821e59e'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', 'd316a520-b3cf-4e7a-b593-39c314915162'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '8612e223-7f30-447b-86da-946fba0ad943'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '9a4892b5-723b-4db6-89ac-473dbcb9a29f'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '8548c899-2c9d-4d2b-a00b-49bce1765597'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', 'c89bfac1-b14e-44f5-93a6-34f304571bfc'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '3dad7778-bbcc-4009-bf83-b71cc923487a'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '10337808-f79b-4e87-8548-8e9542643abe'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '27ef67dd-b462-4506-9fa5-b69061dad70d'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '81024839-6efe-4cbd-a180-3281123b1a11'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', 'b08af966-aa22-4189-9b76-2d32aa74ebf2'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '2b90e950-274a-448b-95da-b475d4a3e903'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '83e758c5-d472-41d2-8427-97d33e752ac0'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '26c344cf-3c8c-440d-8b01-203144f0af3e'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '9d087180-8895-49b6-a96d-d9ebacedb827'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '3cf7be07-437e-4822-9f2f-49aeeb61baec'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', 'd99fc0a9-6f29-4f20-87d2-765ce00b69c4'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '87222271-8e78-46ea-8b74-6017fce56368'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', 'c91fb5cb-406f-47e3-ae97-c40b9dd9739d'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '573d9378-3d6b-4669-b958-71801e67e601'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '126c0b67-a05b-4eab-a668-28d8c542bc18'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '718e7dec-763d-46dc-ae83-e033b02865ae'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', 'b8a05f54-81dc-4fa6-b011-99b32f599116'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '07ce3be8-ca42-4367-8f97-6f9a8365ab32'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '4c251cc0-bb2d-4330-94cb-eb3233544072'),
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', '92002254-7eac-4c50-9e7a-0027adf1a3ae') ON CONFLICT DO NOTHING;


--
-- TOC entry 3678 (class 0 OID 16594)
-- Dependencies: 221
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: quantra
--

INSERT INTO public.roles (role_id, role_name, description, is_active, modified_at, created_by, modified_by, created_at) VALUES
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', 'Admin', 'An Administrator (Admin) is the highest-level role in an application, designed for full system management. They have complete visibility and control over app settings, infrastructure, and user data.', true, '2026-06-21 07:33:26.353687+00', '395a9a91-2d67-4e3c-8261-3c08093d4042', '395a9a91-2d67-4e3c-8261-3c08093d4042', '2026-06-06 18:11:44.021131+00') ON CONFLICT DO NOTHING;


--
-- TOC entry 3693 (class 0 OID 16783)
-- Dependencies: 236
-- Data for Name: size; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3694 (class 0 OID 16791)
-- Dependencies: 237
-- Data for Name: sub_category; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3695 (class 0 OID 16802)
-- Dependencies: 238
-- Data for Name: subcategory_product_type; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3696 (class 0 OID 16805)
-- Dependencies: 239
-- Data for Name: supplier; Type: TABLE DATA; Schema: public; Owner: quantra
--



--
-- TOC entry 3679 (class 0 OID 16604)
-- Dependencies: 222
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: quantra
--

INSERT INTO public.user_roles (user_id, role_id) VALUES
	('395a9a91-2d67-4e3c-8261-3c08093d4042', '82f8a7f4-a087-4e53-8c0a-a51de3ac8b97'),
	('c81a9d88-3f92-4846-b18f-71ee843dd50a', '82f8a7f4-a087-4e53-8c0a-a51de3ac8b97'),
	('40cd76ee-8148-4e97-bb6f-c2d0d7c77908', '82f8a7f4-a087-4e53-8c0a-a51de3ac8b97') ON CONFLICT DO NOTHING;


--
-- TOC entry 3680 (class 0 OID 16607)
-- Dependencies: 223
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: quantra
--

INSERT INTO public.users (user_id, first_name, last_name, password_hash, gender, created_at, created_by, modified_at, modified_by, is_active, email) VALUES
	('c81a9d88-3f92-4846-b18f-71ee843dd50a', 'System', '.', '$2b$12$C7IegHYNzyG6WK66JQxjB.QLYM6dyYtoI.qlEN823fIWxMGR086Pe', 'S', '2026-06-06 19:44:00.779922+00', NULL, NULL, NULL, true, 'systemQuantra@gmail.com'),
	('40cd76ee-8148-4e97-bb6f-c2d0d7c77908', 'John', 'Doe', '$2b$12$YmoMoy/JPw4WsnodCzBXyuCxgspflMg9q.bemD4ZdUjV79/ylvsRi', 'M', '2026-06-15 09:57:19.296766+00', '395a9a91-2d67-4e3c-8261-3c08093d4042', '2026-06-15 14:23:49.587858+00', NULL, true, 'johnDoe@quantra.com'),
	('395a9a91-2d67-4e3c-8261-3c08093d4042', 'quantra-system', 'core', '$2b$12$C7IegHYNzyG6WK66JQxjB.QLYM6dyYtoI.qlEN823fIWxMGR086Pe', 'O', '2026-06-06 18:07:39.344282+00', NULL, '2026-06-15 15:48:24.776356+00', '395a9a91-2d67-4e3c-8261-3c08093d4042', true, 'quantra.core@gmail.com') ON CONFLICT DO NOTHING;


--
-- TOC entry 3452 (class 2606 OID 16685)
-- Name: brand brand_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_pkey PRIMARY KEY (brand_id);


--
-- TOC entry 3454 (class 2606 OID 16696)
-- Name: business_category business_category_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.business_category
    ADD CONSTRAINT business_category_pkey PRIMARY KEY (business_category_id);


--
-- TOC entry 3456 (class 2606 OID 16707)
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (category_id);


--
-- TOC entry 3458 (class 2606 OID 16718)
-- Name: color color_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.color
    ADD CONSTRAINT color_pkey PRIMARY KEY (color_id);


--
-- TOC entry 3428 (class 2606 OID 16952)
-- Name: country_with_currencies country_with_currencies_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.country_with_currencies
    ADD CONSTRAINT country_with_currencies_pkey PRIMARY KEY (country_id);


--
-- TOC entry 3430 (class 2606 OID 16550)
-- Name: customer_order_history customer_order_history_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.customer_order_history
    ADD CONSTRAINT customer_order_history_pkey PRIMARY KEY (order_id);


--
-- TOC entry 3432 (class 2606 OID 16560)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);


--
-- TOC entry 3460 (class 2606 OID 16729)
-- Name: department department_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (department_id);


--
-- TOC entry 3462 (class 2606 OID 16743)
-- Name: material material_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (material_id);


--
-- TOC entry 3434 (class 2606 OID 16571)
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (order_id);


--
-- TOC entry 3436 (class 2606 OID 16618)
-- Name: permissions permission_id; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permission_id UNIQUE (permission_id) INCLUDE (permission_id);


--
-- TOC entry 3438 (class 2606 OID 16581)
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (permission_id);


--
-- TOC entry 3464 (class 2606 OID 16758)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (product_id);


--
-- TOC entry 3466 (class 2606 OID 16769)
-- Name: product_type product_type_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product_type
    ADD CONSTRAINT product_type_pkey PRIMARY KEY (product_type_id);


--
-- TOC entry 3468 (class 2606 OID 16782)
-- Name: product_variant product_variant_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT product_variant_pkey PRIMARY KEY (product_variant_id);


--
-- TOC entry 3440 (class 2606 OID 16590)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (refresh_tokens_id);


--
-- TOC entry 3442 (class 2606 OID 16620)
-- Name: roles role_id; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT role_id UNIQUE (role_id) INCLUDE (role_id);


--
-- TOC entry 3444 (class 2606 OID 16603)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- TOC entry 3470 (class 2606 OID 16790)
-- Name: size size_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.size
    ADD CONSTRAINT size_pkey PRIMARY KEY (size_id);


--
-- TOC entry 3472 (class 2606 OID 16801)
-- Name: sub_category sub_category_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.sub_category
    ADD CONSTRAINT sub_category_pkey PRIMARY KEY (sub_category_id);


--
-- TOC entry 3474 (class 2606 OID 16815)
-- Name: supplier supplier_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.supplier
    ADD CONSTRAINT supplier_pkey PRIMARY KEY (supplier_id);


--
-- TOC entry 3446 (class 2606 OID 16624)
-- Name: users user_id; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_id UNIQUE (user_id) INCLUDE (user_id);


--
-- TOC entry 3448 (class 2606 OID 16622)
-- Name: users user_unique; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_unique UNIQUE (email);


--
-- TOC entry 3450 (class 2606 OID 16616)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3502 (class 2606 OID 17043)
-- Name: product brand_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT brand_id FOREIGN KEY (brand_id) REFERENCES public.brand(brand_id) NOT VALID;


--
-- TOC entry 3503 (class 2606 OID 17018)
-- Name: product business_category_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT business_category_id FOREIGN KEY (business_category_id) REFERENCES public.business_category(business_category_id) NOT VALID;


--
-- TOC entry 3494 (class 2606 OID 16852)
-- Name: category_sub_category category_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.category_sub_category
    ADD CONSTRAINT category_id FOREIGN KEY (category_id) REFERENCES public.category(category_id) NOT VALID;


--
-- TOC entry 3498 (class 2606 OID 16872)
-- Name: department_category category_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.department_category
    ADD CONSTRAINT category_id FOREIGN KEY (category_id) REFERENCES public.category(category_id) NOT VALID;


--
-- TOC entry 3504 (class 2606 OID 17028)
-- Name: product category_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT category_id FOREIGN KEY (category_id) REFERENCES public.category(category_id) NOT VALID;


--
-- TOC entry 3517 (class 2606 OID 17003)
-- Name: product_variant color_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT color_id FOREIGN KEY (color_id) REFERENCES public.color(color_id) NOT VALID;


--
-- TOC entry 3475 (class 2606 OID 16968)
-- Name: customers country_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT country_id FOREIGN KEY (country) REFERENCES public.country_with_currencies(country_id) NOT VALID;


--
-- TOC entry 3526 (class 2606 OID 16953)
-- Name: supplier country_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.supplier
    ADD CONSTRAINT country_id FOREIGN KEY (country_id) REFERENCES public.country_with_currencies(country_id) NOT VALID;


--
-- TOC entry 3488 (class 2606 OID 16822)
-- Name: brand created_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT created_by FOREIGN KEY (created_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3490 (class 2606 OID 16832)
-- Name: business_category created_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.business_category
    ADD CONSTRAINT created_by FOREIGN KEY (created_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3492 (class 2606 OID 16842)
-- Name: category created_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT created_by FOREIGN KEY (created_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3476 (class 2606 OID 16973)
-- Name: customers created_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT created_by FOREIGN KEY (created_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3496 (class 2606 OID 16862)
-- Name: department created_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT created_by FOREIGN KEY (created_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3500 (class 2606 OID 16882)
-- Name: material created_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT created_by FOREIGN KEY (created_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3479 (class 2606 OID 16625)
-- Name: permissions created_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT created_by FOREIGN KEY (created_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3505 (class 2606 OID 17008)
-- Name: product created_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT created_by FOREIGN KEY (created_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3512 (class 2606 OID 16892)
-- Name: product_type created_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product_type
    ADD CONSTRAINT created_by FOREIGN KEY (created_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3518 (class 2606 OID 16983)
-- Name: product_variant created_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT created_by FOREIGN KEY (created_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3484 (class 2606 OID 16630)
-- Name: roles created_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT created_by FOREIGN KEY (created_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3522 (class 2606 OID 16917)
-- Name: sub_category created_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.sub_category
    ADD CONSTRAINT created_by FOREIGN KEY (created_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3527 (class 2606 OID 16937)
-- Name: supplier created_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.supplier
    ADD CONSTRAINT created_by FOREIGN KEY (created_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3478 (class 2606 OID 16635)
-- Name: order customer_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT customer_id FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


--
-- TOC entry 3499 (class 2606 OID 16877)
-- Name: department_category department_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.department_category
    ADD CONSTRAINT department_id FOREIGN KEY (department_id) REFERENCES public.department(department_id) NOT VALID;


--
-- TOC entry 3506 (class 2606 OID 17023)
-- Name: product department_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT department_id FOREIGN KEY (department_id) REFERENCES public.department(department_id) NOT VALID;


--
-- TOC entry 3507 (class 2606 OID 17053)
-- Name: product material_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT material_id FOREIGN KEY (material_id) REFERENCES public.material(material_id) NOT VALID;


--
-- TOC entry 3515 (class 2606 OID 16912)
-- Name: product_type_material material_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product_type_material
    ADD CONSTRAINT material_id FOREIGN KEY (material_id) REFERENCES public.material(material_id) NOT VALID;


--
-- TOC entry 3489 (class 2606 OID 16827)
-- Name: brand modified_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT modified_by FOREIGN KEY (modified_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3491 (class 2606 OID 16837)
-- Name: business_category modified_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.business_category
    ADD CONSTRAINT modified_by FOREIGN KEY (modified_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3493 (class 2606 OID 16847)
-- Name: category modified_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT modified_by FOREIGN KEY (modified_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3477 (class 2606 OID 16978)
-- Name: customers modified_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT modified_by FOREIGN KEY (modified_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3497 (class 2606 OID 16867)
-- Name: department modified_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT modified_by FOREIGN KEY (modified_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3501 (class 2606 OID 16887)
-- Name: material modified_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT modified_by FOREIGN KEY (modified_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3480 (class 2606 OID 16640)
-- Name: permissions modified_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT modified_by FOREIGN KEY (modified_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3508 (class 2606 OID 17013)
-- Name: product modified_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT modified_by FOREIGN KEY (modified_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3513 (class 2606 OID 16897)
-- Name: product_type modified_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product_type
    ADD CONSTRAINT modified_by FOREIGN KEY (modified_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3519 (class 2606 OID 16988)
-- Name: product_variant modified_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT modified_by FOREIGN KEY (modified_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3485 (class 2606 OID 16645)
-- Name: roles modified_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT modified_by FOREIGN KEY (modified_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3523 (class 2606 OID 16922)
-- Name: sub_category modified_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.sub_category
    ADD CONSTRAINT modified_by FOREIGN KEY (modified_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3528 (class 2606 OID 16942)
-- Name: supplier modified_by; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.supplier
    ADD CONSTRAINT modified_by FOREIGN KEY (modified_by) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3482 (class 2606 OID 16650)
-- Name: role_permissions permission_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT permission_id FOREIGN KEY (permission_id) REFERENCES public.permissions(permission_id);


--
-- TOC entry 3520 (class 2606 OID 16998)
-- Name: product_variant product_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES public.product(product_id) NOT VALID;


--
-- TOC entry 3509 (class 2606 OID 17038)
-- Name: product product_type_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_type_id FOREIGN KEY (product_type_id) REFERENCES public.product_type(product_type_id) NOT VALID;


--
-- TOC entry 3516 (class 2606 OID 16907)
-- Name: product_type_material product_type_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product_type_material
    ADD CONSTRAINT product_type_id FOREIGN KEY (product_type_id) REFERENCES public.product_type(product_type_id) NOT VALID;


--
-- TOC entry 3524 (class 2606 OID 16932)
-- Name: subcategory_product_type product_type_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.subcategory_product_type
    ADD CONSTRAINT product_type_id FOREIGN KEY (product_type_id) REFERENCES public.product_type(product_type_id) NOT VALID;


--
-- TOC entry 3483 (class 2606 OID 16655)
-- Name: role_permissions role_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_id FOREIGN KEY (role_id) REFERENCES public.roles(role_id);


--
-- TOC entry 3486 (class 2606 OID 16660)
-- Name: user_roles role_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT role_id FOREIGN KEY (role_id) REFERENCES public.roles(role_id);


--
-- TOC entry 3521 (class 2606 OID 16993)
-- Name: product_variant size_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT size_id FOREIGN KEY (size_id) REFERENCES public.size(size_id) NOT VALID;


--
-- TOC entry 3495 (class 2606 OID 16857)
-- Name: category_sub_category sub_category_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.category_sub_category
    ADD CONSTRAINT sub_category_id FOREIGN KEY (sub_category_id) REFERENCES public.sub_category(sub_category_id) NOT VALID;


--
-- TOC entry 3510 (class 2606 OID 17033)
-- Name: product sub_category_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT sub_category_id FOREIGN KEY (sub_category_id) REFERENCES public.sub_category(sub_category_id) NOT VALID;


--
-- TOC entry 3514 (class 2606 OID 16902)
-- Name: product_type sub_category_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product_type
    ADD CONSTRAINT sub_category_id FOREIGN KEY (sub_category_id) REFERENCES public.sub_category(sub_category_id) NOT VALID;


--
-- TOC entry 3525 (class 2606 OID 16927)
-- Name: subcategory_product_type sub_category_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.subcategory_product_type
    ADD CONSTRAINT sub_category_id FOREIGN KEY (sub_category_id) REFERENCES public.sub_category(sub_category_id) NOT VALID;


--
-- TOC entry 3511 (class 2606 OID 17048)
-- Name: product supplier_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT supplier_id FOREIGN KEY (supplier_id) REFERENCES public.supplier(supplier_id) NOT VALID;


--
-- TOC entry 3481 (class 2606 OID 16665)
-- Name: refresh_tokens user_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 3487 (class 2606 OID 16670)
-- Name: user_roles user_id; Type: FK CONSTRAINT; Schema: public; Owner: quantra
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id);


-- Completed on 2026-06-21 11:33:17 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict CkUH3gVx9mYxPSbbuS8ka3A9dRzXdbuBktBI5iPy6QtfpDmq88089oe5FzTzVaZ

