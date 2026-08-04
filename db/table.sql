




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




CREATE TABLE public.category_sub_category (
    category_id uuid NOT NULL,
    sub_category_id uuid NOT NULL
);




CREATE TABLE public.color (
    color_id uuid DEFAULT gen_random_uuid() NOT NULL,
    color_name character varying(100) NOT NULL,
    color_description text
);



CREATE TABLE public.country_with_currencies (
    country_id bigint NOT NULL,
    country_code character varying(10),
    country character varying(250),
    currency character varying(250),
    currency_code character varying(100),
    symbol character varying(100)
);



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



CREATE TABLE public.department_category (
    department_id uuid NOT NULL,
    category_id uuid NOT NULL
);


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


CREATE TABLE public.product_type_material (
    product_type_id uuid NOT NULL,
    material_id uuid NOT NULL
);



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


CREATE TABLE public.refresh_tokens (
    refresh_tokens_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    token_hash character varying,
    is_revoked boolean DEFAULT false,
    expires_at timestamp with time zone
);


CREATE TABLE public.role_permissions (
    role_id uuid,
    permission_id uuid
);


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


CREATE TABLE public.size (
    size_id uuid DEFAULT gen_random_uuid() NOT NULL,
    size_name character varying(100) NOT NULL,
    size_description text
);



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


CREATE TABLE public.subcategory_product_type (
    sub_category_id uuid NOT NULL,
    product_type_id uuid NOT NULL
);

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



CREATE TABLE public.user_roles (
    user_id uuid,
    role_id uuid
);


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



INSERT INTO public.roles (role_id, role_name, description, is_active, modified_at, created_by, modified_by, created_at) VALUES
	('82f8a7f4-a087-4e53-8c0a-a51de3ac8b97', 'Admin', 'An Administrator (Admin) is the highest-level role in an application, designed for full system management. They have complete visibility and control over app settings, infrastructure, and user data.', true, '2026-06-21 07:33:26.353687+00', '395a9a91-2d67-4e3c-8261-3c08093d4042', '395a9a91-2d67-4e3c-8261-3c08093d4042', '2026-06-06 18:11:44.021131+00') ON CONFLICT DO NOTHING;



INSERT INTO public.user_roles (user_id, role_id) VALUES
	('395a9a91-2d67-4e3c-8261-3c08093d4042', '82f8a7f4-a087-4e53-8c0a-a51de3ac8b97'),
	('c81a9d88-3f92-4846-b18f-71ee843dd50a', '82f8a7f4-a087-4e53-8c0a-a51de3ac8b97'),
	('40cd76ee-8148-4e97-bb6f-c2d0d7c77908', '82f8a7f4-a087-4e53-8c0a-a51de3ac8b97') ON CONFLICT DO NOTHING;


INSERT INTO public.users (user_id, first_name, last_name, password_hash, gender, created_at, created_by, modified_at, modified_by, is_active, email) VALUES
	('c81a9d88-3f92-4846-b18f-71ee843dd50a', 'System', '.', '$2b$12$C7IegHYNzyG6WK66JQxjB.QLYM6dyYtoI.qlEN823fIWxMGR086Pe', 'S', '2026-06-06 19:44:00.779922+00', NULL, NULL, NULL, true, 'systemQuantra@gmail.com'),
	('40cd76ee-8148-4e97-bb6f-c2d0d7c77908', 'John', 'Doe', '$2b$12$YmoMoy/JPw4WsnodCzBXyuCxgspflMg9q.bemD4ZdUjV79/ylvsRi', 'M', '2026-06-15 09:57:19.296766+00', '395a9a91-2d67-4e3c-8261-3c08093d4042', '2026-06-15 14:23:49.587858+00', NULL, true, 'johnDoe@quantra.com'),
	('395a9a91-2d67-4e3c-8261-3c08093d4042', 'quantra-system', 'core', '$2b$12$C7IegHYNzyG6WK66JQxjB.QLYM6dyYtoI.qlEN823fIWxMGR086Pe', 'O', '2026-06-06 18:07:39.344282+00', NULL, '2026-06-15 15:48:24.776356+00', '395a9a91-2d67-4e3c-8261-3c08093d4042', true, 'quantra.core@gmail.com') ON CONFLICT DO NOTHING;


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
INSERT INTO color (color_id,color_name, color_description) VALUES
(gen_random_uuid(),'Black', '#000000'),
(gen_random_uuid(),'White', '#FFFFFF'),
(gen_random_uuid(),'Red', '#FF0000'),
(gen_random_uuid(),'Lime', '#00FF00'),
(gen_random_uuid(),'Blue', '#0000FF'),
(gen_random_uuid(),'Yellow', '#FFFF00'),
(gen_random_uuid(),'Cyan', '#00FFFF'),
(gen_random_uuid(),'Magenta', '#FF00FF'),
(gen_random_uuid(),'Silver', '#C0C0C0'),
(gen_random_uuid(),'Gray', '#808080'),
(gen_random_uuid(),'Maroon', '#800000'),
(gen_random_uuid(),'Olive', '#808000'),
(gen_random_uuid(),'Green', '#008000'),
(gen_random_uuid(),'Purple', '#800080'),
(gen_random_uuid(),'Teal', '#008080'),
(gen_random_uuid(),'Navy', '#000080'),
(gen_random_uuid(),'Orange', '#FFA500'),
(gen_random_uuid(),'Brown', '#A52A2A'),
(gen_random_uuid(),'Gold', '#FFD700'),
(gen_random_uuid(),'Pink', '#FFC0CB'),
(gen_random_uuid(),'Coral', '#FF7F50'),
(gen_random_uuid(),'Turquoise', '#40E0D0'),
(gen_random_uuid(),'Lavender', '#E6E6FA'),
(gen_random_uuid(),'Salmon', '#FA8072');

INSERT INTO size (size_id, size_name, size_description) VALUES
(gen_random_uuid(), 'XXS','Extra Extra Small'),
(gen_random_uuid(), 'XS','Extra Small'),
(gen_random_uuid(), 'S','Small'),
(gen_random_uuid(), 'M','Medium'),
(gen_random_uuid(), 'L', 'Large'),
(gen_random_uuid(), 'XL', 'Extra Large'),
(gen_random_uuid(), 'XXL','Extra Extra Large');
-- Ensure the UUID extension is enabled in your PostgreSQL instance
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the Ingestion Template Master Storage Table
CREATE TABLE IF NOT EXISTS ingestion_template (
    template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name VARCHAR(155) UNIQUE NOT NULL,
    column_mapping JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP WITH TIME ZONE
);

-- Add explicit performance indexing for lookup constraints on file upload matches
CREATE INDEX IF NOT EXISTS idx_ingestion_template_name ON ingestion_template (template_name);
CREATE INDEX IF NOT EXISTS idx_ingestion_template_active ON ingestion_template (is_active);

-- Optional: Add a comment describing the operational utility of this schema node
COMMENT ON TABLE ingestion_template IS 'Stores user-configured column map schemas matching supplier spreadsheet headers directly to internal database product properties.';
DROP TABLE IF EXISTS forecast_values CASCADE;
DROP TABLE IF EXISTS forecast_runs CASCADE;

CREATE TABLE forecast_runs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
    level VARCHAR(50) NOT NULL,
    selection_uuid UUID NULL,
    model_version VARCHAR(50) NOT NULL DEFAULT 'xgboost_v1.0',
    days_forecasted INTEGER NOT NULL DEFAULT 15
);

CREATE INDEX idx_forecast_runs_uuid_lookup ON forecast_runs(level, selection_uuid, created_at DESC);

CREATE TABLE forecast_values (
    id SERIAL PRIMARY KEY,
    run_id INTEGER NOT NULL,
    forecast_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    predicted_quantity DOUBLE PRECISION NOT NULL,
    CONSTRAINT fk_forecast_run FOREIGN KEY(run_id) REFERENCES forecast_runs(id) ON DELETE CASCADE
);

CREATE INDEX idx_forecast_values_run_date ON forecast_values(run_id, forecast_date);
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customer_order_history CASCADE;
DROP TABLE IF EXISTS customers CASCADE;



CREATE TABLE IF NOT EXISTS public.customers
(
    customer_id uuid NOT NULL DEFAULT gen_random_uuid(),
    first_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(500) COLLATE pg_catalog."default" NOT NULL,
    telephone character varying(15) COLLATE pg_catalog."default" NOT NULL,
    address text COLLATE pg_catalog."default",
    city character varying(500) COLLATE pg_catalog."default",
    country bigint,
    gender "char",
    date_of_birth date,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    modified_by uuid,
    modified_at timestamp with time zone,
    source character varying(500) COLLATE pg_catalog."default",
    source_customer_id character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT customers_pkey PRIMARY KEY (customer_id),
    CONSTRAINT country_id FOREIGN KEY (country)
        REFERENCES public.country_with_currencies (country_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT created_by FOREIGN KEY (created_by)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT modified_by FOREIGN KEY (modified_by)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE IF NOT EXISTS orders
(
    order_id uuid NOT NULL,
    invoice_number character varying(100) COLLATE pg_catalog."default" NOT NULL,
    customer_id uuid NOT NULL,
    cart_value numeric(10,2),
    total_amount numeric(10,2),
    discount numeric(10,2),
    coupon_applied character varying(100) COLLATE pg_catalog."default",
    status character varying(50) COLLATE pg_catalog."default",
    is_active boolean NOT NULL,
    currency character varying(10) COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL,
    created_by uuid,
    modified_by uuid,
    modified_at timestamp with time zone,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id),
    CONSTRAINT orders_invoice_number_key UNIQUE (invoice_number),
    CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id)
        REFERENCES public.customers (customer_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);


CREATE TABLE IF NOT EXISTS customer_order_history
(
    order_id uuid NOT NULL DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL,
    is_discounted boolean,
    price numeric(10,2) DEFAULT 0.00,
    quantity bigint,
    is_active boolean,
    created_at timestamp with time zone,
    created_by uuid,
    modified_by uuid,
    modified_at timestamp with time zone,
    total numeric(10,2) DEFAULT 0.00,
    sales_price numeric(10,2) DEFAULT 0.00,
    CONSTRAINT customer_order_history_pkey PRIMARY KEY (order_id, product_id)
);


