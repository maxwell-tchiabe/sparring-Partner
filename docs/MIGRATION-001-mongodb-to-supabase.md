# Migration Ticket: MongoDB to Supabase Migration

## Title

Migrate Database from MongoDB to Supabase

## Description

Migrate the chat application's database from MongoDB to Supabase while maintaining existing functionality and data structure.

## Supabase Configuration

- Project URL: https://qvrpwrulltvpbwqbztol.supabase.co
- Project Reference ID: qvrpwrulltvpbwqbztol

## Database Schema

### Table: chat_sessions

```sql
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    user_id TEXT NOT NULL
);

-- Add index for user_id queries
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
-- Add index for created_at for sorting
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
```

### Table: messages

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
    content JSONB NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    audio TEXT,
    image TEXT,
    pdf TEXT
);

-- Add index for session_id and timestamp queries
CREATE INDEX idx_messages_session_timestamp ON messages(session_id, timestamp);
```

## Environment Variables Updates

### Backend (.env)

```bash
# Remove
- MONGO_URI

# Add
+ SUPABASE_URL=https://qvrpwrulltvpbwqbztol.supabase.co
+ SUPABASE_KEY=<service_role_key>  # Get from Supabase Dashboard
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_SUPABASE_URL=https://qvrpwrulltvpbwqbztol.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>  # Already configured
```

## Code Changes Required

1. Database Manager:

   - ✅ Create new `supabase.py` replacing `mongodb.py`
   - ✅ Update database operations to use Supabase client
   - ✅ Remove MongoDB-specific code and dependencies

2. Models:

   - ✅ Update Message and ChatSession models
   - ✅ Replace MongoDB ObjectId with UUID
   - ✅ Update model configurations for Supabase compatibility

3. Dependencies:
   - Remove:
     ```
     motor
     pymongo
     ```
   - Add:
     ```
     supabase
     ```

## Data Migration Steps

1. Create Supabase Tables:

   ```bash
   # Run the SQL scripts above in Supabase SQL editor
   ```

2. Export Data from MongoDB:

   ```bash
   mongoexport --uri="$MONGO_URI" --collection=chat_sessions --out=chat_sessions.json
   mongoexport --uri="$MONGO_URI" --collection=messages --out=messages.json
   ```

3. Transform Data Script:

   ```python
   # Create a script to:
   # 1. Convert MongoDB ObjectIds to UUIDs
   # 2. Format timestamps for Supabase
   # 3. Ensure referential integrity
   ```

4. Import Data to Supabase:
   ```bash
   # Use Supabase dashboard or API to import the transformed data
   ```

## Testing Checklist

- [ ] Chat session creation
- [ ] Message sending and receiving
- [ ] File attachments (audio, image, PDF)
- [ ] Session listing and filtering
- [ ] Message history loading
- [ ] Real-time updates
- [ ] Error handling
- [ ] Data consistency

## Rollback Plan

1. Keep MongoDB running in parallel during migration
2. Maintain backup of MongoDB data
3. Keep old MongoDB code in a separate branch
4. Document steps to revert environment variables

## Acceptance Criteria

1. All existing functionality works with Supabase
2. No data loss during migration
3. Performance metrics meet or exceed MongoDB implementation
4. All tests passing
5. Zero downtime during migration

## Timeline Estimate

- Database Schema Setup: 1 hour
- Code Migration: 2-3 hours
- Data Migration: 2-3 hours
- Testing: 2-3 hours
- Deployment: 1 hour

Total: 8-11 hours

## Notes

- Ensure proper handling of concurrent operations during migration
- Monitor Supabase quotas and limits
- Update documentation to reflect new database structure
- Consider implementing database monitoring and backup strategies
