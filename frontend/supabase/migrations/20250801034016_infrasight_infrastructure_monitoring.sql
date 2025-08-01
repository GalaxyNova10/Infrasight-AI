-- Location: supabase/migrations/20250801034016_infrasight_infrastructure_monitoring.sql
-- InfraSight AI Infrastructure Monitoring Platform Schema
-- Integration Type: Complete new schema for infrastructure monitoring
-- Dependencies: auth.users (Supabase provided)

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'city_official', 'department_head', 'maintenance_crew', 'citizen');
CREATE TYPE public.issue_status AS ENUM ('detected', 'verified', 'in_progress', 'resolved', 'false_positive');
CREATE TYPE public.issue_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.issue_type AS ENUM ('pothole', 'water_leak', 'garbage_overflow', 'streetlight_fault', 'traffic_signal', 'road_damage', 'sidewalk_issue', 'other');
CREATE TYPE public.department_type AS ENUM ('public_works', 'utilities', 'transportation', 'sanitation', 'parks_recreation');
CREATE TYPE public.detection_source AS ENUM ('ai_camera', 'citizen_report', 'sensor', 'manual_inspection');

-- 2. Core Tables

-- User profiles table (intermediary for auth relationships)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'citizen'::public.user_role,
    department public.department_type,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Video feeds and monitoring locations
CREATE TABLE public.video_feeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location_name TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    stream_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    ai_detection_enabled BOOLEAN DEFAULT true,
    department public.department_type DEFAULT 'public_works'::public.department_type,
    installation_date DATE,
    last_maintenance DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Infrastructure issues detected or reported
CREATE TABLE public.infrastructure_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    issue_type public.issue_type NOT NULL,
    status public.issue_status DEFAULT 'detected'::public.issue_status,
    priority public.issue_priority DEFAULT 'medium'::public.issue_priority,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    detection_source public.detection_source NOT NULL,
    video_feed_id UUID REFERENCES public.video_feeds(id) ON DELETE SET NULL,
    reported_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    department public.department_type,
    estimated_cost DECIMAL(10, 2),
    detected_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Issue media attachments (photos, videos from detection)
CREATE TABLE public.issue_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID REFERENCES public.infrastructure_issues(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL, -- 'image' or 'video'
    file_size INTEGER,
    description TEXT,
    taken_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    uploaded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Work orders for issue resolution
CREATE TABLE public.work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID REFERENCES public.infrastructure_issues(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    department public.department_type NOT NULL,
    estimated_hours DECIMAL(5, 2),
    actual_hours DECIMAL(5, 2),
    materials_cost DECIMAL(10, 2),
    labor_cost DECIMAL(10, 2),
    scheduled_date DATE,
    completed_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- AI detection events log
CREATE TABLE public.ai_detections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_feed_id UUID REFERENCES public.video_feeds(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES public.infrastructure_issues(id) ON DELETE SET NULL,
    detection_type public.issue_type NOT NULL,
    confidence_score DECIMAL(5, 4) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    bounding_box JSONB, -- Store detection coordinates
    image_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    detected_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- System notifications and alerts
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES public.infrastructure_issues(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- 'info', 'warning', 'error', 'success'
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_department ON public.user_profiles(department);
CREATE INDEX idx_video_feeds_location ON public.video_feeds(latitude, longitude);
CREATE INDEX idx_video_feeds_active ON public.video_feeds(is_active);
CREATE INDEX idx_infrastructure_issues_status ON public.infrastructure_issues(status);
CREATE INDEX idx_infrastructure_issues_priority ON public.infrastructure_issues(priority);
CREATE INDEX idx_infrastructure_issues_type ON public.infrastructure_issues(issue_type);
CREATE INDEX idx_infrastructure_issues_location ON public.infrastructure_issues(latitude, longitude);
CREATE INDEX idx_infrastructure_issues_department ON public.infrastructure_issues(department);
CREATE INDEX idx_infrastructure_issues_detected_at ON public.infrastructure_issues(detected_at);
CREATE INDEX idx_issue_media_issue_id ON public.issue_media(issue_id);
CREATE INDEX idx_work_orders_issue_id ON public.work_orders(issue_id);
CREATE INDEX idx_work_orders_assigned_to ON public.work_orders(assigned_to);
CREATE INDEX idx_work_orders_department ON public.work_orders(department);
CREATE INDEX idx_ai_detections_video_feed_id ON public.ai_detections(video_feed_id);
CREATE INDEX idx_ai_detections_detected_at ON public.ai_detections(detected_at);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(is_read);

-- 4. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infrastructure_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 5. Helper Functions for RLS
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = required_role
)
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_official()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role IN ('admin', 'city_official', 'department_head')
)
$$;

CREATE OR REPLACE FUNCTION public.can_manage_issue(issue_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.infrastructure_issues ii
    JOIN public.user_profiles up ON up.id = auth.uid()
    WHERE ii.id = issue_uuid
    AND (
        up.role IN ('admin', 'city_official') OR
        (up.role = 'department_head' AND ii.department = up.department) OR
        ii.assigned_to = auth.uid() OR
        ii.reported_by = auth.uid()
    )
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_video_feed(feed_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.video_feeds vf
    JOIN public.user_profiles up ON up.id = auth.uid()
    WHERE vf.id = feed_uuid
    AND (
        up.role IN ('admin', 'city_official') OR
        (up.role = 'department_head' AND vf.department = up.department)
    )
)
$$;

-- 6. RLS Policies
-- User profiles
CREATE POLICY "users_manage_own_profile"
ON public.user_profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "admins_view_all_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (public.has_role('admin'));

-- Video feeds
CREATE POLICY "authorized_video_feed_access"
ON public.video_feeds
FOR SELECT
TO authenticated
USING (public.can_access_video_feed(id) OR public.has_role('admin'));

CREATE POLICY "admins_manage_video_feeds"
ON public.video_feeds
FOR ALL
TO authenticated
USING (public.has_role('admin'))
WITH CHECK (public.has_role('admin'));

-- Infrastructure issues (public read, authorized write)
CREATE POLICY "public_read_issues"
ON public.infrastructure_issues
FOR SELECT
TO public
USING (true);

CREATE POLICY "authenticated_create_issues"
ON public.infrastructure_issues
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reported_by OR public.is_admin_or_official());

CREATE POLICY "authorized_manage_issues"
ON public.infrastructure_issues
FOR UPDATE
TO authenticated
USING (public.can_manage_issue(id))
WITH CHECK (public.can_manage_issue(id));

-- Issue media
CREATE POLICY "issue_media_access"
ON public.issue_media
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.infrastructure_issues ii
        WHERE ii.id = issue_id AND public.can_manage_issue(ii.id)
    )
);

-- Work orders
CREATE POLICY "authorized_work_order_access"
ON public.work_orders
FOR ALL
TO authenticated
USING (
    public.is_admin_or_official() OR
    assigned_to = auth.uid() OR
    created_by = auth.uid()
);

-- AI detections
CREATE POLICY "authorized_ai_detection_access"
ON public.ai_detections
FOR SELECT
TO authenticated
USING (public.is_admin_or_official());

CREATE POLICY "system_create_ai_detections"
ON public.ai_detections
FOR INSERT
TO authenticated
WITH CHECK (public.has_role('admin'));

-- Notifications
CREATE POLICY "users_own_notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 7. Triggers for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'citizen'::public.user_role)
  );  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Updated timestamp triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_video_feeds_updated_at BEFORE UPDATE ON public.video_feeds
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_infrastructure_issues_updated_at BEFORE UPDATE ON public.infrastructure_issues
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON public.work_orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Mock Data for Testing
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    official_uuid UUID := gen_random_uuid();
    maintenance_uuid UUID := gen_random_uuid();
    citizen_uuid UUID := gen_random_uuid();
    feed1_uuid UUID := gen_random_uuid();
    feed2_uuid UUID := gen_random_uuid();
    issue1_uuid UUID := gen_random_uuid();
    issue2_uuid UUID := gen_random_uuid();
    issue3_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@infrasight.gov', crypt('Admin123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Johnson", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (official_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'official@infrasight.gov', crypt('Official123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Michael Chen", "role": "city_official"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (maintenance_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'maintenance@infrasight.gov', crypt('Maintenance123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "David Rodriguez", "role": "maintenance_crew"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (citizen_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'citizen@example.com', crypt('Citizen123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Emily Davis", "role": "citizen"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create video feeds
    INSERT INTO public.video_feeds (id, name, location_name, latitude, longitude, stream_url, department) VALUES
        (feed1_uuid, 'Main Street Camera 1', 'Main St & 1st Ave', 40.7128, -74.0060, 'rtmp://stream1.infrasight.gov/live', 'public_works'::public.department_type),
        (feed2_uuid, 'Downtown Intersection', 'Broadway & Central', 40.7580, -73.9855, 'rtmp://stream2.infrasight.gov/live', 'transportation'::public.department_type);

    -- Create infrastructure issues
    INSERT INTO public.infrastructure_issues (id, title, description, issue_type, status, priority, latitude, longitude, address, detection_source, video_feed_id, reported_by, department) VALUES
        (issue1_uuid, 'Large Pothole on Main Street', 'Deep pothole causing vehicle damage near intersection', 'pothole'::public.issue_type, 'verified'::public.issue_status, 'high'::public.issue_priority, 40.7128, -74.0060, '123 Main St', 'ai_camera'::public.detection_source, feed1_uuid, citizen_uuid, 'public_works'::public.department_type),
        (issue2_uuid, 'Streetlight Outage', 'Multiple streetlights not functioning', 'streetlight_fault'::public.issue_type, 'in_progress'::public.issue_status, 'medium'::public.issue_priority, 40.7580, -73.9855, '456 Broadway', 'citizen_report'::public.detection_source, null, citizen_uuid, 'utilities'::public.department_type),
        (issue3_uuid, 'Water Leak Detection', 'Possible water main leak detected by AI', 'water_leak'::public.issue_type, 'detected'::public.issue_status, 'critical'::public.issue_priority, 40.7485, -73.9857, '789 Central Ave', 'ai_camera'::public.detection_source, feed2_uuid, null, 'utilities'::public.department_type);

    -- Create work orders
    INSERT INTO public.work_orders (issue_id, title, description, assigned_to, created_by, department, estimated_hours, scheduled_date) VALUES
        (issue1_uuid, 'Pothole Repair - Main Street', 'Emergency pothole repair with hot asphalt', maintenance_uuid, official_uuid, 'public_works'::public.department_type, 4.0, CURRENT_DATE + INTERVAL '1 day'),
        (issue2_uuid, 'Replace Streetlight Bulbs', 'Replace LED bulbs in malfunctioning streetlights', maintenance_uuid, official_uuid, 'utilities'::public.department_type, 2.5, CURRENT_DATE + INTERVAL '2 days');

    -- Create AI detections
    INSERT INTO public.ai_detections (video_feed_id, issue_id, detection_type, confidence_score, bounding_box, is_verified, verified_by) VALUES
        (feed1_uuid, issue1_uuid, 'pothole'::public.issue_type, 0.89, '{"x": 125, "y": 200, "width": 80, "height": 60}'::jsonb, true, admin_uuid),
        (feed2_uuid, issue3_uuid, 'water_leak'::public.issue_type, 0.76, '{"x": 300, "y": 150, "width": 120, "height": 90}'::jsonb, false, null);

    -- Create notifications
    INSERT INTO public.notifications (user_id, issue_id, title, message, type) VALUES
        (admin_uuid, issue3_uuid, 'Critical Water Leak Detected', 'AI has detected a potential water main leak requiring immediate attention', 'error'),
        (official_uuid, issue1_uuid, 'Pothole Repair Scheduled', 'Work order has been created for pothole repair on Main Street', 'info'),
        (maintenance_uuid, issue1_uuid, 'New Work Assignment', 'You have been assigned to repair pothole on Main Street', 'info');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;