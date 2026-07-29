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