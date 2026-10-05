CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_apis_slug ON apis(slug);
CREATE INDEX IF NOT EXISTS idx_apis_provider ON apis(provider_id);
CREATE INDEX IF NOT EXISTS idx_subs_key_prefix ON subscriptions(api_key_prefix);
CREATE INDEX IF NOT EXISTS idx_subs_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_sub_created ON usage_events(subscription_id, created_at);
