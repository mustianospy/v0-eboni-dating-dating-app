import { createClient } from "@/lib/supabase/server"

async function testAuthFlow() {
  console.log("🧪 Testing EboniDating Authentication Flow...\n")

  try {
    // Test 1: Server client creation
    console.log("1. Testing server client creation...")
    const supabase = await createClient()
    console.log("✅ Server client created successfully\n")

    // Test 2: Check database connection
    console.log("2. Testing database connection...")
    const { data: profiles, error: profilesError } = await supabase.from("profiles").select("count").limit(1)

    if (profilesError) {
      console.log("❌ Database connection failed:", profilesError.message)
    } else {
      console.log("✅ Database connection successful\n")
    }

    // Test 3: Check auth status
    console.log("3. Testing auth status...")
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.log("⚠️  No authenticated user (expected for server-side test)")
    } else if (user) {
      console.log("✅ User authenticated:", user.email)
    } else {
      console.log("ℹ️  No user session (normal for server-side test)")
    }
    console.log()

    // Test 4: Check RLS policies
    console.log("4. Testing RLS policies...")
    const { data: testProfiles, error: rlsError } = await supabase.from("profiles").select("*").limit(1)

    if (rlsError && rlsError.message.includes("RLS")) {
      console.log("✅ RLS policies are active (blocking unauthorized access)")
    } else if (testProfiles) {
      console.log("ℹ️  RLS policies allow this query")
    }
    console.log()

    // Test 5: Environment variables
    console.log("5. Checking environment variables...")
    const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]

    let envVarsOk = true
    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        console.log(`✅ ${envVar} is set`)
      } else {
        console.log(`❌ ${envVar} is missing`)
        envVarsOk = false
      }
    }

    if (envVarsOk) {
      console.log("✅ All required environment variables are set\n")
    } else {
      console.log("❌ Some environment variables are missing\n")
    }

    console.log("🎉 Authentication flow test completed!")
    console.log("\n📋 Next steps:")
    console.log("1. Run the database setup script: scripts/001_setup_auth_profiles.sql")
    console.log("2. Test signup flow in the browser")
    console.log("3. Test signin flow in the browser")
    console.log("4. Verify profile creation after signup")
  } catch (error) {
    console.error("❌ Test failed:", error)
  }
}

// Run the test
testAuthFlow()
