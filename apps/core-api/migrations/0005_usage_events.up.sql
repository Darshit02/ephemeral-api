CREATE TABLE IF NOT EXISTS usage_events (
    id BIGSERIAL,
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    api_id UUID NOT NULL REFERENCES apis(id) ON DELETE CASCADE,
    endpoint VARCHAR(1024) NOT NULL,
    method VARCHAR(16) NOT NULL,
    response_status INT NOT NULL,
    response_time_ms INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Default partition to catch any unmatched dates
CREATE TABLE IF NOT EXISTS usage_events_default PARTITION OF usage_events DEFAULT;

-- Partitions for 2026 and 2027
CREATE TABLE IF NOT EXISTS usage_events_y2026m09 PARTITION OF usage_events
    FOR VALUES FROM ('2026-09-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS usage_events_y2026m10 PARTITION OF usage_events
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2026-11-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS usage_events_y2026m11 PARTITION OF usage_events
    FOR VALUES FROM ('2026-11-01 00:00:00+00') TO ('2026-12-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS usage_events_y2026m12 PARTITION OF usage_events
    FOR VALUES FROM ('2026-12-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS usage_events_y2027m01 PARTITION OF usage_events
    FOR VALUES FROM ('2027-01-01 00:00:00+00') TO ('2027-02-01 00:00:00+00');
