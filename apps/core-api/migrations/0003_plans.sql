CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_id UUID NOT NULL REFERENCES apis(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price_cents INT NOT NULL DEFAULT 0,
    rate_limit_per_hour INT NOT NULL DEFAULT 1000,
    monthly_quota INT,
    stripe_price_id VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
