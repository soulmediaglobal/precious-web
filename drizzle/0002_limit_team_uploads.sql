UPDATE storage.buckets
SET file_size_limit = 1048576,
	allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']
WHERE id = 'team';
