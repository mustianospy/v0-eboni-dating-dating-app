import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignupAndLogin() {
  const testEmail = `testuser${Date.now()}@example.com`;
  const testPassword = "Test1234!";

  console.log(`📝 Testing signup with email: ${testEmail}`);

  // Sign up
  const { data: signupData, error: signupError } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true, // auto-confirm for testing
  });

  if (signupError) {
    console.error("❌ Signup error:", signupError.message);
    return;
  }

  console.log("✅ Signup successful:", signupData.user?.id);

  // Login
  console.log(`📝 Testing login for email: ${testEmail}`);
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (loginError) {
    console.error("❌ Login error:", loginError.message);
    return;
  }

  console.log("✅ Login successful! Access token:", loginData.session?.access_token);
}

testSignupAndLogin();
