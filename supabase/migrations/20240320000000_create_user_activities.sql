-- Create enum for activity types
CREATE TYPE activity_type AS ENUM (
  'PROFILE_UPDATE',
  'PRODUCT_CREATE',
  'PRODUCT_UPDATE',
  'COMPANY_UPDATE',
  'AVATAR_UPDATE',
  'COMPANY_LOGO_UPDATE'
);

-- Create enum for entity types
CREATE TYPE entity_type AS ENUM (
  'PROFILE',
  'PRODUCT',
  'COMPANY'
);

-- Create user activities table
CREATE TABLE user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  entity_id UUID,
  entity_type entity_type,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on user_id and created_at for faster queries
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at DESC);

-- Enable RLS
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own activities"
  ON user_activities
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
  ON user_activities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to record activity
CREATE OR REPLACE FUNCTION record_user_activity(
  _user_id UUID,
  _activity_type activity_type,
  _description TEXT,
  _entity_id UUID DEFAULT NULL,
  _entity_type entity_type DEFAULT NULL,
  _metadata JSONB DEFAULT NULL
)
RETURNS user_activities
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inserted_activity user_activities;
BEGIN
  INSERT INTO user_activities (
    user_id,
    activity_type,
    entity_id,
    entity_type,
    description,
    metadata
  )
  VALUES (
    _user_id,
    _activity_type,
    _entity_id,
    _entity_type,
    _description,
    _metadata
  )
  RETURNING * INTO inserted_activity;

  RETURN inserted_activity;
END;
$$; 