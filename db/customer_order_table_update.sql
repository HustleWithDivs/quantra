DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customer_order_history;
DROP TABLE IF EXISTS customers;



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
